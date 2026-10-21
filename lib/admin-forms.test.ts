import { describe, expect, it } from "vitest";
import { categorySchema, firstErrors, settingsSchema, socialLinksJson } from "./admin-forms";

const settings = {
  storeName: " Tlip Ventures ",
  whatsappNumber: "024 123 4567",
  tagline: "Judges 6:24",
  shopAddress: "",
  openingHours: "Mon–Sat 8am–6pm",
  announcement: "  ",
  social: { facebook: "https://facebook.com/tlip", instagram: "", tiktok: "", youtube: "", x: "" },
};

describe("settingsSchema", () => {
  it("normalises the WhatsApp number and empties blank fields", () => {
    expect(settingsSchema.parse(settings)).toMatchObject({
      storeName: "Tlip Ventures",
      whatsappNumber: "233241234567",
      shopAddress: null,
      announcement: null,
      social: { facebook: "https://facebook.com/tlip", instagram: null },
    });
  });

  it("rejects a bad number and non-https links", () => {
    const result = settingsSchema.safeParse({
      ...settings,
      whatsappNumber: "+44 7700 900000",
      social: { ...settings.social, instagram: "javascript:alert(1)", tiktok: "http://tiktok.com/@tlip" },
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(Object.keys(firstErrors(result.error)).sort()).toEqual(["social.instagram", "social.tiktok", "whatsappNumber"]);
  });

  it("stores only filled-in social links", () => {
    expect(socialLinksJson({ facebook: "https://facebook.com/tlip", instagram: null, tiktok: null, youtube: null, x: null })).toEqual({
      facebook: "https://facebook.com/tlip",
    });
  });
});

describe("categorySchema", () => {
  it("reads a new subcategory", () => {
    expect(
      categorySchema.parse({ id: null, name: " Mugs ", slug: "mugs", parentId: "0b6f8f1e-6a7f-4f7e-9a51-6f3e2a1c9d01", sortOrder: "40" }),
    ).toEqual({ id: null, name: "Mugs", slug: "mugs", parentId: "0b6f8f1e-6a7f-4f7e-9a51-6f3e2a1c9d01", sortOrder: 40 });
  });

  it("treats an empty parent as a main category and checks the slug", () => {
    expect(categorySchema.parse({ id: null, name: "Bathroom", slug: "bathroom", parentId: "", sortOrder: "0" }).parentId).toBeNull();
    expect(categorySchema.safeParse({ id: null, name: "x", slug: "Not OK", parentId: "", sortOrder: "0" }).success).toBe(false);
  });
});
