-- Tlip Ventures: core schema.
-- Money is integer pesewas everywhere (GH₵ 1 = 100). See CLAUDE.md "Domain rules".

create type public.order_status as enum (
  'awaiting_whatsapp',
  'confirmed',
  'paid',
  'dispatched',
  'delivered',
  'cancelled',
  'not_sent'
);

-- Keeps updated_at current on every UPDATE.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  parent_id uuid references public.categories (id) on delete restrict,
  image_url text,
  sort_order integer not null default 0,
  constraint categories_not_own_parent check (parent_id is distinct from id)
);

create index categories_parent_sort_idx on public.categories (parent_id, sort_order);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  brand text,
  description text,
  price integer not null check (price >= 0),
  compare_at_price integer check (compare_at_price is null or compare_at_price > price),
  option1_name text,
  option2_name text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(name, '')), 'A')
    || setweight(to_tsvector('english', coalesce(brand, '')), 'B')
    || setweight(to_tsvector('english', coalesce(description, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_option2_needs_option1 check (option2_name is null or option1_name is not null)
);

create index products_search_idx on public.products using gin (search_vector);
create index products_active_created_idx on public.products (created_at desc) where is_active;
create index products_featured_idx on public.products (created_at desc) where is_active and is_featured;

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_categories (
  product_id uuid not null references public.products (id) on delete cascade,
  category_id uuid not null references public.categories (id) on delete cascade,
  primary key (product_id, category_id)
);

-- Category pages: "all products in category X".
create index product_categories_category_idx on public.product_categories (category_id, product_id);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  url text not null,
  public_id text,
  alt text not null default '',
  sort_order integer not null default 0
);

create index product_images_product_sort_idx on public.product_images (product_id, sort_order);

-- A product with no options has exactly one variant with null option values.
-- NULLS NOT DISTINCT stops a product having two variants with the same options
-- (including two "no option" variants).
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  option1_value text,
  option2_value text,
  sku text unique,
  in_stock boolean not null default true,
  stock_qty integer check (stock_qty is null or stock_qty >= 0),
  price_override integer check (price_override is null or price_override >= 0),
  constraint product_variants_option2_needs_option1 check (option2_value is null or option1_value is not null),
  constraint product_variants_unique_options unique nulls not distinct (product_id, option1_value, option2_value)
);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------

create sequence public.order_code_seq start with 1001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code text not null unique default ('TV-' || nextval('public.order_code_seq')),
  -- 144 random bits, URL-safe. Used by the public order page /o/<token>.
  public_token text not null unique
    default translate(encode(extensions.gen_random_bytes(18), 'base64'), '+/', '-_'),
  customer_name text not null check (char_length(btrim(customer_name)) between 1 and 100),
  phone text not null check (phone ~ '^233[235][0-9]{8}$'),
  notes text check (notes is null or char_length(notes) <= 500),
  items_total integer not null check (items_total >= 0),
  status public.order_status not null default 'awaiting_whatsapp',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter sequence public.order_code_seq owned by public.orders.order_code;

create index orders_status_created_idx on public.orders (status, created_at desc);
create index orders_created_idx on public.orders (created_at desc);

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- Lines copy name, options and unit price at checkout, so later catalogue
-- edits never change past orders.
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid references public.product_variants (id) on delete set null,
  product_name text not null,
  option_values text,
  unit_price integer not null check (unit_price >= 0),
  qty integer not null check (qty between 1 and 999),
  line_total integer not null,
  constraint order_items_line_total check (line_total = unit_price * qty)
);

create index order_items_order_idx on public.order_items (order_id);
create index order_items_variant_idx on public.order_items (variant_id);

-- ---------------------------------------------------------------------------
-- Settings and admins
-- ---------------------------------------------------------------------------

create table public.settings (
  id smallint primary key default 1 check (id = 1),
  store_name text not null default 'Tlip Ventures',
  whatsapp_number text not null check (whatsapp_number ~ '^233[235][0-9]{8}$'),
  shop_address text,
  opening_hours text,
  announcement text,
  social_links jsonb not null default '{}'::jsonb check (jsonb_typeof(social_links) = 'object'),
  tagline text
);

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'owner' check (role in ('owner', 'staff'))
);
