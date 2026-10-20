-- Category tree from CLAUDE.md "Catalogue". Safe to re-run.
-- "Storage Organizers & Racks" exists twice on purpose (one per parent), with different slugs.

insert into public.categories (name, slug, sort_order) values
  ('Kitchen Appliances', 'kitchen-appliances', 10),
  ('Cooking & Baking', 'cooking-baking', 20),
  ('Kitchen Storage & Utensils', 'kitchen-storage-utensils', 30),
  ('Home Organization', 'home-organization', 40),
  ('Laundry & Cleaning', 'laundry-cleaning', 50),
  ('Bathroom', 'bathroom', 60),
  ('Kids & Baby', 'kids-baby', 70)
on conflict (slug) do nothing;

insert into public.categories (name, slug, parent_id, sort_order)
select c.name, c.slug, p.id, c.sort_order
from (values
  ('kitchen-appliances', 'Blenders', 'blenders', 10),
  ('kitchen-appliances', 'Juicers', 'juicers', 20),
  ('kitchen-appliances', 'Food Processors', 'food-processors', 30),
  ('kitchen-appliances', 'Stand & Hand Mixers', 'stand-hand-mixers', 40),
  ('kitchen-appliances', 'Kettles', 'kettles', 50),
  ('kitchen-appliances', 'Dispensers', 'dispensers', 60),
  ('cooking-baking', 'Ovens', 'ovens', 10),
  ('cooking-baking', 'Gas Burners', 'gas-burners', 20),
  ('cooking-baking', 'Coal Pots', 'coal-pots', 30),
  ('kitchen-storage-utensils', 'Utensils', 'utensils', 10),
  ('kitchen-storage-utensils', 'Food Racks', 'food-racks', 20),
  ('kitchen-storage-utensils', 'Storage Organizers & Racks', 'kitchen-storage-organizers-racks', 30),
  ('home-organization', 'Storage Organizers & Racks', 'home-storage-organizers-racks', 10),
  ('home-organization', 'Foldable & Storage Stools', 'foldable-storage-stools', 20),
  ('home-organization', 'Packing Cubes', 'packing-cubes', 30),
  ('laundry-cleaning', 'Washing Machines', 'washing-machines', 10),
  ('laundry-cleaning', 'Irons & Garment Steamers', 'irons-garment-steamers', 20),
  ('laundry-cleaning', 'Cleaning Items & Tools', 'cleaning-items-tools', 30)
) as c (parent_slug, name, slug, sort_order)
join public.categories p on p.slug = c.parent_slug
on conflict (slug) do nothing;
