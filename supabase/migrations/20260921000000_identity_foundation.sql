-- ============================================================================
-- Phase 2R — Identity Foundation
-- Migration: 20260921000000_identity_foundation
-- Created: 2026-09-21
--
-- Purpose:
--   Introduce the platform-identity foundation before the revised
--   authentication phase.
--
--   - Add identity_platform enum.
--   - Add user_identities linking platform identities to auth.users.
--   - Add phone_verified_at to profiles.
--   - Prevent client-side users from modifying phone verification state.
--   - Enforce strict RLS on user_identities.
--
-- Safety:
--   - Additive only.
--   - Does NOT modify or replace Phase 2 migration.
--   - Designed to run after 20260920000000_init_profiles_rls.sql.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. Enum: identity_platform
-- ----------------------------------------------------------------------------

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'identity_platform'
  ) then
    create type public.identity_platform
      as enum ('web', 'telegram', 'bale', 'eitaa');
  end if;
end
$$;


-- ----------------------------------------------------------------------------
-- 2. Add phone verification state to profiles
-- ----------------------------------------------------------------------------

alter table public.profiles
  add column if not exists phone_verified_at timestamptz;

comment on column public.profiles.phone_verified_at is
  'Set only by a trusted verification flow after successful phone verification.';


-- ----------------------------------------------------------------------------
-- 3. Protect phone_verified_at from normal client updates
--
-- The existing Phase 2 RLS allows authenticated users to update their own
-- profile. Therefore we explicitly prevent non-admin callers from changing
-- phone_verified_at.
--
-- Admins may change it at this stage; the future trusted verification flow
-- will use a backend-controlled path.
-- ----------------------------------------------------------------------------

create or replace function public.prevent_phone_verification_tampering()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.phone_verified_at is distinct from old.phone_verified_at then
    if not exists (
      select 1
      from public.profiles
      where id = (select auth.uid())
        and role = 'admin'::public.user_role
    ) then
      raise exception 'Only trusted verification flows or admins can change phone verification state'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_phone_verification_tampering
  on public.profiles;

create trigger profiles_prevent_phone_verification_tampering
  before update on public.profiles
  for each row
  execute function public.prevent_phone_verification_tampering();


-- ----------------------------------------------------------------------------
-- 4. Permissions for the new trigger function
-- ----------------------------------------------------------------------------

revoke execute on function public.prevent_phone_verification_tampering()
  from public;

revoke execute on function public.prevent_phone_verification_tampering()
  from anon;


-- ----------------------------------------------------------------------------
-- 5. Table: public.user_identities
-- ----------------------------------------------------------------------------

create table if not exists public.user_identities (
  id uuid not null default gen_random_uuid(),
  user_id uuid not null,
  platform public.identity_platform not null,
  platform_user_id text not null,
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  constraint user_identities_pkey
    primary key (id),

  constraint user_identities_user_id_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade,

  constraint user_identities_platform_platform_user_id_key
    unique (platform, platform_user_id)
);

comment on table public.user_identities is
  'Links a platform identity to a central auth.users row. Writable only by trusted backend flows.';

comment on column public.user_identities.platform_user_id is
  'The platform-specific user identifier. Unique within each platform.';


-- ----------------------------------------------------------------------------
-- 6. Indexes
-- ----------------------------------------------------------------------------

create index if not exists user_identities_user_id_idx
  on public.user_identities (user_id);

create index if not exists user_identities_platform_idx
  on public.user_identities (platform);


-- ----------------------------------------------------------------------------
-- 7. Row Level Security
-- ----------------------------------------------------------------------------

alter table public.user_identities
  enable row level security;


-- Users may see only their own platform identities.
drop policy if exists user_identities_select_own
  on public.user_identities;

create policy user_identities_select_own
  on public.user_identities
  for select
  to authenticated
  using ((select auth.uid()) = user_id);


-- Admins may see all platform identities.
drop policy if exists user_identities_select_admin
  on public.user_identities;

create policy user_identities_select_admin
  on public.user_identities
  for select
  to authenticated
  using (public.is_admin());


-- ----------------------------------------------------------------------------
-- 8. Client permissions
--
-- No INSERT / UPDATE / DELETE policies are intentionally created.
-- Platform identity creation/linking will later happen through a trusted
-- backend / Edge Function after platform verification.
-- ----------------------------------------------------------------------------

revoke all on public.user_identities from public;
revoke all on public.user_identities from anon;
revoke all on public.user_identities from authenticated;

grant select on public.user_identities to authenticated;


-- ----------------------------------------------------------------------------
-- End of Phase 2R
-- ============================================================================