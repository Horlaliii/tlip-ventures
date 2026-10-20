-- Tlip Ventures: row-level security (CLAUDE.md domain rule 11).
-- Public: read active products (+ their images, variants, category links),
-- categories and settings. Public can NEVER read orders or admins.
-- Orders are inserted only by the checkout server action using the secret
-- (service-role) key, which bypasses RLS; no role gets an INSERT policy.

-- True when the signed-in user is in public.admins.
-- SECURITY DEFINER so it can read admins regardless of the caller's RLS.
create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Table privileges (defence in depth, on top of RLS)
-- ---------------------------------------------------------------------------

revoke all on
  public.categories, public.products, public.product_categories,
  public.product_images, public.product_variants, public.orders,
  public.order_items, public.settings, public.admins
from anon, authenticated;

revoke all on sequence public.order_code_seq from anon, authenticated;

grant select on
  public.categories, public.products, public.product_categories,
  public.product_images, public.product_variants, public.settings
to anon, authenticated;

-- Admins sign in as `authenticated`; the policies below restrict writes to is_admin().
grant insert, update, delete on
  public.categories, public.products, public.product_categories,
  public.product_images, public.product_variants
to authenticated;
grant update on public.settings to authenticated;
grant select, update on public.orders to authenticated;
grant select on public.order_items, public.admins to authenticated;

-- ---------------------------------------------------------------------------
-- Enable RLS everywhere
-- ---------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.settings enable row level security;
alter table public.admins enable row level security;

-- ---------------------------------------------------------------------------
-- Catalogue
-- ---------------------------------------------------------------------------

create policy "Anyone can read categories"
  on public.categories for select to anon, authenticated
  using (true);
create policy "Admins can add categories"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can edit categories"
  on public.categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete categories"
  on public.categories for delete to authenticated
  using ((select public.is_admin()));

create policy "Anyone can read active products; admins read all"
  on public.products for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "Admins can add products"
  on public.products for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can edit products"
  on public.products for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete products"
  on public.products for delete to authenticated
  using ((select public.is_admin()));

-- Child rows are visible when their product is visible. The subquery on
-- products is itself filtered by the products policy above.
create policy "Read category links of visible products"
  on public.product_categories for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));
create policy "Admins can add category links"
  on public.product_categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can edit category links"
  on public.product_categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete category links"
  on public.product_categories for delete to authenticated
  using ((select public.is_admin()));

create policy "Read images of visible products"
  on public.product_images for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));
create policy "Admins can add images"
  on public.product_images for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can edit images"
  on public.product_images for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete images"
  on public.product_images for delete to authenticated
  using ((select public.is_admin()));

create policy "Read variants of visible products"
  on public.product_variants for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id));
create policy "Admins can add variants"
  on public.product_variants for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can edit variants"
  on public.product_variants for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete variants"
  on public.product_variants for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------

create policy "Anyone can read settings"
  on public.settings for select to anon, authenticated
  using (true);
create policy "Admins can edit settings"
  on public.settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Orders: admins only. No insert policy: checkout uses the secret key.
-- ---------------------------------------------------------------------------

create policy "Admins can read orders"
  on public.orders for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update orders"
  on public.orders for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins can read order lines"
  on public.order_items for select to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Admins: managed with SQL only. Signed-in users can see their own row.
-- ---------------------------------------------------------------------------

create policy "Users can see their own admin row; admins see all"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));
