-- ============================================================================
-- Phase 5 — RLS + Security Hardening
-- Migration: 20260929000000_phase5_rls_hardening
--
-- Purpose:
--   Add RLS and security hardening for the Phase 5 property domain.
--
-- Important:
--   - Domain tables already exist.
--   - properties.created_by already exists and is NOT NULL.
--   - This migration only adds security controls.
--   - Public listing access will be handled later by the Listing phase.
-- ============================================================================


-- ============================================================================
-- 1. Role helpers
-- ============================================================================

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'super_admin'::public.user_role
  );
$$;


create or replace function public.is_admin_or_super_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in (
        'admin'::public.user_role,
        'super_admin'::public.user_role
      )
  );
$$;


revoke execute on function public.is_super_admin()
  from public;

revoke execute on function public.is_super_admin()
  from anon;

grant execute on function public.is_super_admin()
  to authenticated;


revoke execute on function public.is_admin_or_super_admin()
  from public;

revoke execute on function public.is_admin_or_super_admin()
  from anon;

grant execute on function public.is_admin_or_super_admin()
  to authenticated;


-- ============================================================================
-- 2. Property management helper
-- ============================================================================

create or replace function public.can_manage_property(
  p_property_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    public.is_admin_or_super_admin()
    or exists (
      select 1
      from public.properties
      where id = p_property_id
        and created_by = (select auth.uid())
    );
$$;


revoke execute on function public.can_manage_property(uuid)
  from public;

revoke execute on function public.can_manage_property(uuid)
  from anon;

grant execute on function public.can_manage_property(uuid)
  to authenticated;


-- ============================================================================
-- 3. Protect immutable property creator
-- ============================================================================

create or replace function public.prevent_property_creator_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.created_by is distinct from old.created_by then
    raise exception 'Property creator cannot be changed'
      using errcode = '42501';
  end if;

  return new;
end;
$$;


revoke execute on function public.prevent_property_creator_change()
  from public;

revoke execute on function public.prevent_property_creator_change()
  from anon;


drop trigger if exists properties_prevent_creator_change
  on public.properties;

create trigger properties_prevent_creator_change
before update on public.properties
for each row
execute function public.prevent_property_creator_change();


-- ============================================================================
-- 4. Enable RLS
-- ============================================================================

alter table public.properties enable row level security;
alter table public.lands enable row level security;
alter table public.land_parcels enable row level security;
alter table public.buildings enable row level security;
alter table public.property_units enable row level security;
alter table public.property_feature_values enable row level security;
alter table public.property_owners enable row level security;
alter table public.property_legal_documents enable row level security;
alter table public.property_registration enable row level security;
alter table public.building_documents enable row level security;
alter table public.property_legal_status enable row level security;


-- ============================================================================
-- 5. Properties
-- ============================================================================

drop policy if exists properties_select_manage
  on public.properties;

create policy properties_select_manage
on public.properties
for select
to authenticated
using (
  created_by = (select auth.uid())
  or public.is_admin_or_super_admin()
);


drop policy if exists properties_insert_own
  on public.properties;

create policy properties_insert_own
on public.properties
for insert
to authenticated
with check (
  created_by = (select auth.uid())
);


drop policy if exists properties_update_own
  on public.properties;

create policy properties_update_own
on public.properties
for update
to authenticated
using (
  created_by = (select auth.uid())
  or public.is_admin_or_super_admin()
)
with check (
  created_by = (select auth.uid())
  or public.is_admin_or_super_admin()
);


drop policy if exists properties_delete_admin
  on public.properties;

create policy properties_delete_admin
on public.properties
for delete
to authenticated
using (
  public.is_admin_or_super_admin()
);


-- ============================================================================
-- 6. Lands
-- ============================================================================

drop policy if exists lands_manage
  on public.lands;

create policy lands_manage
on public.lands
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 7. Land parcels
-- ============================================================================

drop policy if exists land_parcels_manage
  on public.land_parcels;

create policy land_parcels_manage
on public.land_parcels
for all
to authenticated
using (
  exists (
    select 1
    from public.lands
    where lands.id = land_parcels.land_id
      and public.can_manage_property(lands.property_id)
  )
)
with check (
  exists (
    select 1
    from public.lands
    where lands.id = land_parcels.land_id
      and public.can_manage_property(lands.property_id)
  )
);


-- ============================================================================
-- 8. Buildings
-- ============================================================================

drop policy if exists buildings_manage
  on public.buildings;

create policy buildings_manage
on public.buildings
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 9. Property units
-- ============================================================================

drop policy if exists property_units_manage
  on public.property_units;

create policy property_units_manage
on public.property_units
for all
to authenticated
using (
  exists (
    select 1
    from public.buildings
    where buildings.id = property_units.building_id
      and public.can_manage_property(buildings.property_id)
  )
)
with check (
  exists (
    select 1
    from public.buildings
    where buildings.id = property_units.building_id
      and public.can_manage_property(buildings.property_id)
  )
);


-- ============================================================================
-- 10. Property feature values
-- ============================================================================

drop policy if exists property_feature_values_manage
  on public.property_feature_values;

create policy property_feature_values_manage
on public.property_feature_values
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 11. Property owners
-- ============================================================================

drop policy if exists property_owners_select_manage
  on public.property_owners;

create policy property_owners_select_manage
on public.property_owners
for select
to authenticated
using (
  public.can_manage_property(property_id)
);


drop policy if exists property_owners_insert_manage
  on public.property_owners;

create policy property_owners_insert_manage
on public.property_owners
for insert
to authenticated
with check (
  public.can_manage_property(property_id)
);


drop policy if exists property_owners_update_manage
  on public.property_owners;

create policy property_owners_update_manage
on public.property_owners
for update
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


drop policy if exists property_owners_delete_admin
  on public.property_owners;

create policy property_owners_delete_admin
on public.property_owners
for delete
to authenticated
using (
  public.is_admin_or_super_admin()
);


-- ============================================================================
-- 12. Protect ownership verification
-- ============================================================================

create or replace function public.prevent_property_owner_verification_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (
    new.verification_status is distinct from old.verification_status
    or new.verified_at is distinct from old.verified_at
  ) then

    if not public.is_admin_or_super_admin() then
      raise exception
        'Only trusted verification flows or administrators can change ownership verification state'
        using errcode = '42501';
    end if;

  end if;

  return new;
end;
$$;


revoke execute on function public.prevent_property_owner_verification_change()
  from public;

revoke execute on function public.prevent_property_owner_verification_change()
  from anon;


drop trigger if exists property_owners_prevent_verification_change
  on public.property_owners;

create trigger property_owners_prevent_verification_change
before update on public.property_owners
for each row
execute function public.prevent_property_owner_verification_change();


-- ============================================================================
-- 13. Prevent untrusted verification during INSERT
-- ============================================================================

create or replace function public.prevent_untrusted_property_owner_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin_or_super_admin() then
    new.verification_status :=
      'unverified'::public.verification_status;

    new.verified_at := null;
  end if;

  return new;
end;
$$;


revoke execute on function public.prevent_untrusted_property_owner_insert()
  from public;

revoke execute on function public.prevent_untrusted_property_owner_insert()
  from anon;


drop trigger if exists property_owners_prevent_untrusted_insert
  on public.property_owners;

create trigger property_owners_prevent_untrusted_insert
before insert on public.property_owners
for each row
execute function public.prevent_untrusted_property_owner_insert();


-- ============================================================================
-- 14. Property legal documents
-- ============================================================================

drop policy if exists property_legal_documents_manage
  on public.property_legal_documents;

create policy property_legal_documents_manage
on public.property_legal_documents
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 15. Property registration
-- ============================================================================

drop policy if exists property_registration_manage
  on public.property_registration;

create policy property_registration_manage
on public.property_registration
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 16. Building documents
-- ============================================================================

drop policy if exists building_documents_manage
  on public.building_documents;

create policy building_documents_manage
on public.building_documents
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 17. Property legal status
-- ============================================================================

drop policy if exists property_legal_status_manage
  on public.property_legal_status;

create policy property_legal_status_manage
on public.property_legal_status
for all
to authenticated
using (
  public.can_manage_property(property_id)
)
with check (
  public.can_manage_property(property_id)
);


-- ============================================================================
-- 18. Table privileges
-- ============================================================================

grant select, insert, update, delete
on public.properties,
   public.lands,
   public.land_parcels,
   public.buildings,
   public.property_units,
   public.property_feature_values,
   public.property_owners,
   public.property_legal_documents,
   public.property_registration,
   public.building_documents,
   public.property_legal_status
to authenticated;


revoke all
on public.properties,
   public.lands,
   public.land_parcels,
   public.buildings,
   public.property_units,
   public.property_feature_values,
   public.property_owners,
   public.property_legal_documents,
   public.property_registration,
   public.building_documents,
   public.property_legal_status
from anon;


-- ============================================================================
-- End of Phase 5 RLS + Security Hardening
-- ============================================================================