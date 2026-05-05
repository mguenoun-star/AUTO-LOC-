-- Convert vehicles.type/fuel/transmission from free-text to Postgres enums.
-- Includes helper RPCs to discover enum values from the app.

begin;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'vehicle_type') then
    create type public.vehicle_type as enum (
      'Sedan',
      'SUV',
      'Coupe',
      'Hatchback',
      'Convertible',
      'Wagon',
      'Van',
      'Pickup',
      'Sports Car',
      'Luxury',
      'Electric',
      'Hybrid'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'fuel_type') then
    create type public.fuel_type as enum ('Petrol', 'Diesel', 'Electric', 'Hybrid');
  end if;

  if not exists (select 1 from pg_type where typname = 'transmission_type') then
    create type public.transmission_type as enum ('Auto', 'Manual');
  end if;
end $$;

-- Drop check constraints referencing these columns (common when previously validated as text)
do $$
declare
  c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = rel.relnamespace
    where nsp.nspname = 'public'
      and rel.relname = 'vehicles'
      and con.contype = 'c'
      and (
        pg_get_constraintdef(con.oid) ilike '%fuel%'
        or pg_get_constraintdef(con.oid) ilike '%transmission%'
        or pg_get_constraintdef(con.oid) ilike '%type%'
      )
  loop
    execute format('alter table public.vehicles drop constraint if exists %I', c.conname);
  end loop;
end $$;

-- Normalize existing values to valid enums before casting
update public.vehicles
set type = 'Sedan'
where type is null or type not in (
  'Sedan','SUV','Coupe','Hatchback','Convertible','Wagon','Van','Pickup','Sports Car','Luxury','Electric','Hybrid'
);

update public.vehicles
set fuel = 'Petrol'
where fuel is null or fuel not in ('Petrol', 'Diesel', 'Electric', 'Hybrid');

update public.vehicles
set transmission = 'Auto'
where transmission is null or transmission not in ('Auto', 'Manual');

-- Drop defaults first to avoid cast issues on conversion
alter table public.vehicles
  alter column type drop default,
  alter column fuel drop default,
  alter column transmission drop default;

-- Cast columns to enums
alter table public.vehicles
  alter column type type public.vehicle_type using type::public.vehicle_type,
  alter column fuel type public.fuel_type using fuel::public.fuel_type,
  alter column transmission type public.transmission_type using transmission::public.transmission_type;

-- Enforce defaults (optional) and not-null
alter table public.vehicles
  alter column type set default 'Sedan'::public.vehicle_type,
  alter column type set not null,
  alter column fuel set default 'Petrol'::public.fuel_type,
  alter column fuel set not null,
  alter column transmission set default 'Auto'::public.transmission_type,
  alter column transmission set not null;

-- Helper: list enum values by name
create or replace function public.enum_values(enum_name text)
returns text[]
language sql
stable
as $$
  select coalesce(array_agg(e.enumlabel order by e.enumsortorder), array[]::text[])
  from pg_type t
  join pg_enum e on e.enumtypid = t.oid
  join pg_namespace n on n.oid = t.typnamespace
  where n.nspname = 'public' and t.typname = enum_name;
$$;

-- Helper: vehicle meta in one call
create or replace function public.vehicle_meta()
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'vehicleTypes', public.enum_values('vehicle_type'),
    'fuelTypes', public.enum_values('fuel_type'),
    'transmissions', public.enum_values('transmission_type')
  );
$$;

commit;
