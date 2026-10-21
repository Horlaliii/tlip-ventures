"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { formErrors, productFormSchema, type ProductFormInput } from "@/lib/admin-product";
import { cloudinarySignature } from "@/lib/cloudinary-sign";
import { publicEnv } from "@/lib/env";
import { requireAdmin } from "@/lib/server/admin";
import { getServerEnv } from "@/lib/server/env";

export type SaveProductResult =
  | { ok: true; id: string }
  | { ok: false; message: string; errors?: Record<string, string> };

type PostgrestError = { code?: string; message: string };

/** Turns unique-constraint errors into messages next to the right field. */
function constraintError(error: PostgrestError): SaveProductResult {
  if (error.code === "23505" && error.message.includes("slug")) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: { slug: "Another product already uses this web address." } };
  }
  if (error.code === "23505" && error.message.includes("sku")) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: { variants: "A SKU here is already used by another product." } };
  }
  if (error.code === "23505" && error.message.includes("unique_options")) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: { variants: "Two options have the same values." } };
  }
  return { ok: false, message: `Could not save: ${error.message}` };
}

/**
 * Creates or updates a product with its options, stock, categories and photos.
 * Runs as the signed-in admin, so RLS checks every write too.
 */
export async function saveProduct(input: ProductFormInput): Promise<SaveProductResult> {
  const { supabase } = await requireAdmin();
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: formErrors(parsed.error) };
  }
  const p = parsed.data;

  const row = {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    description: p.description,
    price: p.price,
    compare_at_price: p.compareAtPrice,
    option1_name: p.option1Name,
    option2_name: p.option2Name,
    is_active: p.isActive,
    is_featured: p.isFeatured,
  };

  let productId: string;
  const isNew = p.id === null;
  if (p.id) {
    const { data, error } = await supabase.from("products").update(row).eq("id", p.id).select("id");
    if (error) return constraintError(error);
    if (!data.length) return { ok: false, message: "This product no longer exists, or you are not allowed to edit it." };
    productId = p.id;
  } else {
    const { data, error } = await supabase.from("products").insert(row).select("id").single();
    if (error) return constraintError(error);
    productId = data.id;
  }

  const result = await saveChildren(supabase, productId, p);
  if (!result.ok && isNew) {
    // Don't leave a half-made product behind (child rows cascade).
    await supabase.from("products").delete().eq("id", productId);
  }
  if (!result.ok) return result;

  revalidatePath("/admin/products");
  return { ok: true, id: productId };
}

type Supabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];
type ParsedProduct = z.output<typeof productFormSchema>;

async function saveChildren(supabase: Supabase, productId: string, p: ParsedProduct): Promise<SaveProductResult> {
  // Variants: delete removed ones first (frees their option values), then update, then add.
  const { data: existing, error: readError } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", productId);
  if (readError) return { ok: false, message: `Could not save options: ${readError.message}` };
  const existingIds = new Set(existing.map((v) => v.id));
  const kept = p.variants.filter((v) => v.id && existingIds.has(v.id));
  const removed = [...existingIds].filter((id) => !kept.some((v) => v.id === id));
  const added = p.variants.filter((v) => !v.id || !existingIds.has(v.id));
  const variantRow = (v: ParsedProduct["variants"][number]) => ({
    product_id: productId,
    option1_value: v.option1Value,
    option2_value: v.option2Value,
    sku: v.sku,
    in_stock: v.inStock,
    stock_qty: v.stockQty,
    price_override: v.priceOverride,
  });

  if (removed.length) {
    const { error } = await supabase.from("product_variants").delete().in("id", removed);
    if (error) return { ok: false, message: `Could not remove options: ${error.message}` };
  }
  for (const v of kept) {
    const { error } = await supabase.from("product_variants").update(variantRow(v)).eq("id", v.id!);
    if (error) return constraintError(error);
  }
  if (added.length) {
    const { error } = await supabase.from("product_variants").insert(added.map(variantRow));
    if (error) return constraintError(error);
  }

  // Categories and photos: replace the lists.
  const links = await supabase.from("product_categories").delete().eq("product_id", productId);
  if (links.error) return { ok: false, message: `Could not save categories: ${links.error.message}` };
  if (p.categoryIds.length) {
    const { error } = await supabase
      .from("product_categories")
      .insert([...new Set(p.categoryIds)].map((category_id) => ({ product_id: productId, category_id })));
    if (error) return { ok: false, message: `Could not save categories: ${error.message}` };
  }

  const images = await supabase.from("product_images").delete().eq("product_id", productId);
  if (images.error) return { ok: false, message: `Could not save photos: ${images.error.message}` };
  if (p.images.length) {
    const { error } = await supabase.from("product_images").insert(
      p.images.map((img, i) => ({
        product_id: productId,
        url: img.url,
        public_id: img.publicId,
        alt: img.alt ?? "",
        sort_order: i,
      })),
    );
    if (error) return { ok: false, message: `Could not save photos: ${error.message}` };
  }
  return { ok: true, id: productId };
}

export async function deleteProduct(productId: string): Promise<{ ok: boolean; message?: string }> {
  const { supabase } = await requireAdmin();
  const id = z.uuid().safeParse(productId);
  if (!id.success) return { ok: false, message: "Unknown product." };
  // Past orders keep their copied names and prices (order_items.variant_id becomes null).
  const { data, error } = await supabase.from("products").delete().eq("id", id.data).select("id");
  if (error) return { ok: false, message: `Could not delete: ${error.message}` };
  if (!data.length) return { ok: false, message: "This product no longer exists, or you are not allowed to delete it." };
  revalidatePath("/admin/products");
  return { ok: true };
}

/** Quick stock switch from the product list. Stock only ever changes by hand (domain rule 3). */
export async function setVariantStock(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = z
    .object({ variantId: z.uuid(), inStock: z.enum(["true", "false"]) })
    .safeParse({ variantId: formData.get("variantId"), inStock: formData.get("inStock") });
  if (!parsed.success) throw new Error("Invalid stock update.");
  const { data, error } = await supabase
    .from("product_variants")
    .update({ in_stock: parsed.data.inStock === "true" })
    .eq("id", parsed.data.variantId)
    .select("id");
  if (error || !data.length) throw new Error(`Could not update stock${error ? `: ${error.message}` : "."}`);
  revalidatePath("/admin/products");
}

export type UploadSignature =
  | { ok: true; cloudName: string; apiKey: string; timestamp: number; folder: string; signature: string }
  | { ok: false; message: string };

const UPLOAD_FOLDER = "tlip/products";

/**
 * Lets the admin's browser upload one photo straight to Cloudinary. The API
 * secret stays on the server; only a short-lived signature is sent.
 */
export async function getUploadSignature(): Promise<UploadSignature> {
  await requireAdmin();
  const cloudName = publicEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const { CLOUDINARY_API_KEY: apiKey, CLOUDINARY_API_SECRET: apiSecret } = getServerEnv();
  if (!cloudName || !apiKey || !apiSecret) {
    return { ok: false, message: "Photo uploads need the Cloudinary settings (see .env.example)." };
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = await cloudinarySignature({ folder: UPLOAD_FOLDER, timestamp }, apiSecret);
  return { ok: true, cloudName, apiKey, timestamp, folder: UPLOAD_FOLDER, signature };
}
