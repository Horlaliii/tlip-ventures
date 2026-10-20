Tlip Ventures — online shop
What this is
Mobile-first e-commerce site for Tlip Ventures, a home and kitchen goods shop in Ghana. Customers browse, add to cart, enter name and phone, and are handed off to the shop's WhatsApp with a pre-filled order message. The website takes NO payments and handles NO delivery: in the WhatsApp chat the owner confirms availability, agrees delivery and its fee, and shares a payment number or method. The owner manages products, stock and orders at /admin.
Stack

* Next.js, latest stable, App Router, TypeScript strict. Server Components by default, Server Actions for mutations.
* Tailwind CSS, latest. No UI framework; small hand-built components.
* Supabase: Postgres, Auth (admin only), row-level security. Use @supabase/ssr.
* Cloudinary for all product images, delivered via URL transforms (f_auto, q_auto, width) through a custom next/image loader.
* Hosting: Cloudflare Workers via the OpenNext Cloudflare adapter (@opennextjs/cloudflare). Follow its current docs.
* Zustand for the cart (persisted to localStorage). Zod for all input validation.
* Vitest for unit tests of pure functions. npm as package manager.

Commands
(Filled in during Phase 0: dev, build, preview on the Workers runtime, deploy, test, db migrations, type generation.)
Folder layout

* app/(shop)/ storefront routes; app/admin/ admin routes (protected); app/o/[token] order page
* components/ui, components/shop, components/admin
* lib/ supabase clients, cloudinary loader, money, phone, whatsapp message builder, zod schemas
* lib/server/ server-only code
* supabase/migrations/ SQL migrations; supabase/seed/ seed data; scripts/ CSV import etc.

Domain rules (do not break; ask before changing)

1. Money is integer pesewas everywhere (GHS 450.00 = 45000). Format only for display: "GH₵ 450", "GH₵ 1,250.50". Never use floats for money.
2. The database is the source of truth for prices. The checkout server action recalculates every line from the database and ignores prices sent by the browser.
3. Stock is set by hand by the owner. Each variant has in_stock (boolean) and an optional stock_qty for the owner's reference. Never change stock automatically. Out-of-stock variants cannot be added to the cart or ordered.
4. No delivery fields, fees, zones or options anywhere. No payment gateway. Order total = items total.
5. Checkout collects only: customer name, phone, optional note. Phone must be Ghanaian: accept 0XXXXXXXXX, +233XXXXXXXXX or 233XXXXXXXXX; store as 233XXXXXXXXX.
6. WhatsApp hand-off: save the order first, then open https://wa.me/<settings.whatsapp_number>?text=<encodeURIComponent(message)>. Number format 233XXXXXXXXX (no +, no leading 0). Always show a fallback with the number and a "Copy order" button for desktop users.
7. Order codes TV-1001, TV-1002... from a Postgres sequence. The public order page uses a random unguessable token (not the code) and shows items and total only, never name or phone.
8. Order lines copy product name, option values and unit price at checkout.
9. Orders still awaiting_whatsapp after 48 hours become not_sent (pg_cron job).
10. Secrets (Supabase secret/service-role key, Cloudinary API secret) are server-only. Never import them into client components or prefix them with NEXT_PUBLIC_.
11. RLS on every table. Public may read active products, their images and variants, categories and settings. Public may NOT read orders. Orders are inserted only by the checkout server action. Admin access is checked by an is_admin() SQL function backed by the admins table.

WhatsApp message format

```
Hi Tlip Ventures, I'd like to place this order.
Order: TV-1042
1 x Blender 1.5L (Black) - GH₵ 450
2 x Foldable storage stool - GH₵ 240
Items total: GH₵ 690
Name: Ama Mensah | Phone: 024 123 4567
Order link: https://<site>/o/<token>

```

Order statuses
awaiting_whatsapp -> confirmed -> paid -> dispatched -> delivered; also cancelled, not_sent. The owner changes status in admin.
Data model

* categories(id, name, slug, parent_id, image_url, sort_order)
* products(id, name, slug, brand, description, price, compare_at_price, option1_name, option2_name, is_active, is_featured, search_vector, created_at, updated_at)
* product_categories(product_id, category_id)
* product_images(id, product_id, url, public_id, alt, sort_order)
* product_variants(id, product_id, option1_value, option2_value, sku, in_stock, stock_qty, price_override)
* orders(id, order_code, public_token, customer_name, phone, notes, items_total, status, created_at, updated_at)
* order_items(id, order_id, variant_id, product_name, option_values, unit_price, qty, line_total)
* settings(id = 1, store_name, whatsapp_number, shop_address, opening_hours, announcement, social_links jsonb, tagline)
* admins(user_id, role) A product with no options has exactly one variant with null option values.

Catalogue

* Kitchen Appliances: Blenders, Juicers, Food Processors, Stand & Hand Mixers, Kettles, Dispensers
* Cooking & Baking: Ovens, Gas Burners, Coal Pots
* Kitchen Storage & Utensils: Utensils, Food Racks, Storage Organizers & Racks
* Home Organization: Storage Organizers & Racks, Foldable & Storage Stools, Packing Cubes
* Laundry & Cleaning: Washing Machines, Irons & Garment Steamers, Cleaning Items & Tools
* Bathroom: subcategories to be confirmed
* Kids & Baby: subcategories to be confirmed A product can sit in several subcategories. Expect thousands of products: paginate (24 per page) and index slugs, category joins and the search vector.

Brand and design

* Name: Tlip Ventures. Logo tagline: Judges 6:24.
* Tailwind theme colours:
   * brand-orange #E8641E: primary buttons, "Order on WhatsApp", sale badges
   * brand-orange-dark #B84A14: orange text and links on white
   * brand-green #0F6B43: header, footer, menus, headings
   * brand-gold #F2B705: small accents only
   * ink #111111: body text, logo badge background
   * white page and product-card backgrounds
* White text on brand-orange only at 16px bold or larger. Meet WCAG AA contrast elsewhere.
* Fonts via next/font: a slab serif for headings (Zilla Slab or Roboto Slab, echoing the logo lettering), Inter for body.
* An orange/green block band (from the shopfront) may decorate the header or footer.
* Logo: placeholder at public/brand/logo.svg until the real file arrives.
* Mobile-first, designed at 360px wide first. Most customers are on phones and mobile data: keep client JS small, lazy-load images, no heavy libraries or carousels.

Conventions

* Validate every form and server action input with Zod.
* Accessible: labelled inputs, alt text, visible focus, 44px tap targets.
* Unit tests for lib/money, lib/phone and lib/whatsapp.
* Before calling a task done: typecheck, lint, tests and build all pass.
* Explain any new dependency before adding it.
* Commit only when asked, with the message "Phase N: <summary>".

Build phases
0 Setup · 1 Database · 2 Storefront · 3 Cart + WhatsApp checkout · 4 Admin · 5 SEO + polish · 6 Content + testing · 7 Launch. Work one phase per session. Do not start work from a later phase unless asked.
