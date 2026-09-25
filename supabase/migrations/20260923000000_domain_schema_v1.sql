-- ============================================================
-- Phase 5 — Domain Schema v1
-- Migration: 20260923000000_domain_schema_v1.sql
-- ============================================================

BEGIN;

-- ============================================================
-- 1. USER ROLE — add SUPER_ADMIN
-- ============================================================

ALTER TYPE public.user_role
ADD VALUE IF NOT EXISTS 'super_admin';

-- ============================================================
-- 2. DOMAIN ENUMS
-- ============================================================

CREATE TYPE public.property_condition AS ENUM (
  'new',
  'good',
  'needs_renovation',
  'renovated',
  'under_construction',
  'other'
);

CREATE TYPE public.property_availability AS ENUM (
  'available',
  'unavailable',
  'unknown'
);

CREATE TYPE public.land_legal_use AS ENUM (
  'residential',
  'agricultural',
  'commercial',
  'industrial',
  'mixed_use',
  'tourism',
  'garden',
  'other',
  'unclassified'
);

CREATE TYPE public.land_current_use AS ENUM (
  'vacant',
  'agricultural',
  'garden',
  'residential',
  'commercial',
  'industrial',
  'mixed_use',
  'other',
  'unknown'
);

CREATE TYPE public.ownership_evidence_type AS ENUM (
  'official_deed',
  'ordinary_deed',
  'sale_agreement',
  'purchase_agreement',
  'nasq',
  'power_of_attorney',
  'other'
);

CREATE TYPE public.official_document_type AS ENUM (
  'single_page',
  'cadastral',
  'booklet',
  'other'
);

CREATE TYPE public.document_color AS ENUM (
  'green',
  'other',
  'unknown'
);

CREATE TYPE public.ownership_type AS ENUM (
  'six_dang',
  'shared',
  'land_only',
  'building_only',
  'land_and_building'
);

CREATE TYPE public.legal_status_type AS ENUM (
  'waqf',
  'inherited',
  'mortgaged',
  'seized',
  'transfer_restricted',
  'contested',
  'legal_dispute',
  'other'
);

CREATE TYPE public.owner_type AS ENUM (
  'person',
  'legal_entity'
);

CREATE TYPE public.verification_status AS ENUM (
  'unverified',
  'pending',
  'verified',
  'rejected'
);

CREATE TYPE public.transaction_type AS ENUM (
  'sale',
  'rent',
  'mortgage_rent',
  'presale',
  'exchange'
);

CREATE TYPE public.advertiser_type AS ENUM (
  'owner',
  'agent',
  'authorized_representative'
);

CREATE TYPE public.listing_status AS ENUM (
  'draft',
  'pending_review',
  'published',
  'rejected',
  'archived'
);

CREATE TYPE public.listing_result AS ENUM (
  'active',
  'under_negotiation',
  'under_contract',
  'sold',
  'rented',
  'expired',
  'cancelled'
);

CREATE TYPE public.listing_visibility AS ENUM (
  'public',
  'hidden'
);

CREATE TYPE public.listing_media_type AS ENUM (
  'image',
  'video'
);

CREATE TYPE public.currency_code AS ENUM (
  'irr'
);

CREATE TYPE public.short_term_property_type AS ENUM (
  'apartment',
  'suite',
  'villa',
  'garden_villa',
  'rural_house',
  'cabin',
  'room',
  'ecotourism',
  'traditional_lodging',
  'guesthouse',
  'coastal_lodging',
  'forest_lodging',
  'other'
);

CREATE TYPE public.project_status AS ENUM (
  'planning',
  'permitted',
  'under_construction',
  'near_completion',
  'completed',
  'cancelled'
);

CREATE TYPE public.construction_stage AS ENUM (
  'land',
  'permits',
  'excavation',
  'foundation',
  'structure',
  'roof',
  'walls',
  'mep',
  'facade',
  'finishing',
  'final_work',
  'ready'
);

CREATE TYPE public.unit_status AS ENUM (
  'available',
  'reserved',
  'sold',
  'transferred',
  'cancelled'
);

CREATE TYPE public.partnership_status AS ENUM (
  'draft',
  'active',
  'completed',
  'cancelled'
);

CREATE TYPE public.partnership_party_role AS ENUM (
  'land_owner',
  'developer',
  'builder',
  'other'
);

CREATE TYPE public.partnership_allocation_type AS ENUM (
  'percentage',
  'unit_count',
  'floor',
  'parking',
  'storage'
);

CREATE TYPE public.contact_method AS ENUM (
  'phone',
  'message',
  'platform'
);

CREATE TYPE public.contact_request_status AS ENUM (
  'pending',
  'responded',
  'closed',
  'cancelled'
);

CREATE TYPE public.listing_report_reason AS ENUM (
  'incorrect_information',
  'duplicate',
  'fraud',
  'unavailable_property',
  'inappropriate_content',
  'other'
);

CREATE TYPE public.listing_report_status AS ENUM (
  'pending',
  'reviewing',
  'resolved',
  'rejected'
);

CREATE TYPE public.audit_action AS ENUM (
  'create',
  'update',
  'delete',
  'publish',
  'reject',
  'archive',
  'login',
  'logout',
  'verify',
  'other'
);

CREATE TYPE public.feature_value_type AS ENUM (
  'boolean',
  'number',
  'text',
  'select',
  'multi_select'
);

CREATE TYPE public.construction_partnership_party_type AS ENUM (
  'registered_user',
  'non_member'
);

CREATE TYPE public.authority_type AS ENUM (
  'owner_authorization',
  'power_of_attorney',
  'guardianship',
  'family_representation',
  'agent_authorization',
  'other'
);

CREATE TYPE public.authority_status AS ENUM (
  'pending',
  'verified',
  'rejected',
  'expired'
);

CREATE TYPE public.platform_legal_document_type AS ENUM (
  'terms',
  'privacy',
  'disclaimer',
  'listing_rules',
  'other'
);

CREATE TYPE public.acceptance_context AS ENUM (
  'web',
  'telegram',
  'bale',
  'eitaa'
);

-- ============================================================
-- 3. HELPER: updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

COMMIT;