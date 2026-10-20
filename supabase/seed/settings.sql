-- The single settings row. Safe to re-run (keeps existing values).
-- whatsapp_number is a PLACEHOLDER: change it in admin (Phase 4) or with
--   update public.settings set whatsapp_number = '233XXXXXXXXX' where id = 1;

insert into public.settings (id, store_name, whatsapp_number, tagline, social_links)
values (1, 'Tlip Ventures', '233200000000', 'Judges 6:24', '{}'::jsonb)
on conflict (id) do nothing;
