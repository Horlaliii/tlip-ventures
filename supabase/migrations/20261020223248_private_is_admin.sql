-- Move is_admin() out of the API-exposed public schema so it can't be called
-- as /rest/v1/rpc/is_admin. RLS policies reference the function itself, not
-- its name, so they keep working after the move.

create schema if not exists private;
revoke all on schema private from public;
-- Policies run as the caller, so the caller needs to reach the function.
grant usage on schema private to anon, authenticated, service_role;

alter function public.is_admin() set schema private;
