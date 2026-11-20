-- Recovered from the production migration history.
create function public.is_staff()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_staff();
$$;

revoke execute on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;
