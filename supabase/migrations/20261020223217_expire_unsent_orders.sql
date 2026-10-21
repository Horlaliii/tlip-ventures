-- Tlip Ventures: orders still awaiting_whatsapp after 48 hours become not_sent
-- (CLAUDE.md domain rule 9). Runs every 15 minutes with pg_cron.

create extension if not exists pg_cron;

create function public.expire_unsent_orders()
returns integer
language sql
security definer
set search_path = ''
as $$
  with expired as (
    update public.orders
    set status = 'not_sent'
    where status = 'awaiting_whatsapp'
      and created_at < now() - interval '48 hours'
    returning 1
  )
  select count(*)::integer from expired;
$$;

-- Only the scheduler (postgres) and trusted server code may run it.
revoke execute on function public.expire_unsent_orders() from public, anon, authenticated;

-- cron.schedule with an existing job name replaces that job, so this is safe to re-run.
select cron.schedule(
  'expire-unsent-orders',
  '*/15 * * * *',
  'select public.expire_unsent_orders()'
);
