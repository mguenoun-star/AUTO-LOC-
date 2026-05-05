-- Convert profiles.role and profiles.status from free-text to Postgres enums.
-- Safe defaults are applied for existing/invalid data.

begin;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('admin', 'manager', 'support', 'user');
  end if;

  if not exists (select 1 from pg_type where typname = 'user_status') then
    create type public.user_status as enum ('active', 'suspended');
  end if;
end $$;

do $$
declare
  role_udt text;
  status_udt text;
  c record;
begin
  select c.udt_name into role_udt
  from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = 'profiles' and c.column_name = 'role';

  select c.udt_name into status_udt
  from information_schema.columns c
  where c.table_schema = 'public' and c.table_name = 'profiles' and c.column_name = 'status';

  -- Drop check constraints referencing role/status. These are common when columns were "enum-like"
  -- text columns, and they can block the type conversion due to enum-vs-text operators.
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'profiles'
      and con.contype = 'c'
      and (pg_get_constraintdef(con.oid) ilike '%role%' or pg_get_constraintdef(con.oid) ilike '%status%')
  loop
    execute format('alter table public.profiles drop constraint if exists %I', c.conname);
  end loop;

  -- ROLE: only normalize/cast if not already enum
  if role_udt is distinct from 'user_role' then
    update public.profiles
    set role = 'user'
    where role is null or role not in ('admin', 'manager', 'support', 'user');

    alter table public.profiles alter column role drop default;
    alter table public.profiles
      alter column role type public.user_role using role::public.user_role;
  end if;

  -- STATUS: only normalize/cast if not already enum
  if status_udt is distinct from 'user_status' then
    update public.profiles
    set status = 'active'
    where status is null or status not in ('active', 'suspended');

    alter table public.profiles alter column status drop default;
    alter table public.profiles
      alter column status type public.user_status using status::public.user_status;
  end if;

  -- Enforce defaults/not-null regardless (explicit casts avoid ambiguity)
  alter table public.profiles
    alter column role set default 'user'::public.user_role,
    alter column role set not null,
    alter column status set default 'active'::public.user_status,
    alter column status set not null;
end $$;

commit;
