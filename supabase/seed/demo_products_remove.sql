-- Removes the demo products from demo_products.sql (variants, images and
-- category links are deleted with them). Run before loading real stock.
delete from public.products
where slug in (
  'blender-1-5l', 'juice-extractor-800w', 'food-processor-3-in-1',
  'hand-mixer-5-speed', 'electric-kettle-1-8l', 'water-dispenser-hot-cold',
  'gas-burner-2-burners', 'electric-oven-30l', 'coal-pot',
  'foldable-storage-stool', 'packing-cubes-set-of-6', 'kitchen-rack-3-tier',
  'steam-iron', 'mop-bucket-set', 'kitchen-utensil-set-6'
);
