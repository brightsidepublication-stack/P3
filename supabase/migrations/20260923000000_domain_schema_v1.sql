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


-- ============================================================
-- 4. GEOGRAPHY
-- Province → City → District → Neighborhood
-- ============================================================

CREATE TABLE public.provinces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  province_id uuid NOT NULL
    REFERENCES public.provinces(id)
    ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT cities_province_slug_unique
    UNIQUE (province_id, slug)
);

CREATE TABLE public.districts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL
    REFERENCES public.cities(id)
    ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT districts_city_slug_unique
    UNIQUE (city_id, slug)
);

CREATE TABLE public.neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id uuid NOT NULL
    REFERENCES public.districts(id)
    ON DELETE RESTRICT,
  name text NOT NULL,
  slug text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT neighborhoods_district_slug_unique
    UNIQUE (district_id, slug)
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_provinces_updated_at
BEFORE UPDATE ON public.provinces
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_cities_updated_at
BEFORE UPDATE ON public.cities
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_districts_updated_at
BEFORE UPDATE ON public.districts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_neighborhoods_updated_at
BEFORE UPDATE ON public.neighborhoods
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 5. PROPERTY CATEGORIES
-- Dynamic taxonomy — no giant property-type enum
-- ============================================================

CREATE TABLE public.property_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  parent_id uuid
    REFERENCES public.property_categories(id)
    ON DELETE RESTRICT,

  name text NOT NULL,
  slug text NOT NULL,
  description text,

  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT property_categories_slug_unique
    UNIQUE (slug),

  CONSTRAINT property_categories_sort_order_check
    CHECK (sort_order >= 0)
);

-- ============================================================
-- Updated-at trigger
-- ============================================================

CREATE TRIGGER set_property_categories_updated_at
BEFORE UPDATE ON public.property_categories
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_property_categories_parent_id
  ON public.property_categories(parent_id);

CREATE INDEX idx_property_categories_active_sort
  ON public.property_categories(is_active, sort_order);

-- ============================================================
-- 6. FEATURE SYSTEM
-- Definitions → Options → Property Values
-- ============================================================

CREATE TABLE public.feature_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  category_id uuid
    REFERENCES public.property_categories(id)
    ON DELETE SET NULL,

  key text NOT NULL,
  label text NOT NULL,

  value_type public.feature_value_type NOT NULL,

  is_searchable boolean NOT NULL DEFAULT false,
  is_filterable boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,

  sort_order integer NOT NULL DEFAULT 0,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT feature_definitions_key_unique
    UNIQUE (key),

  CONSTRAINT feature_definitions_sort_order_check
    CHECK (sort_order >= 0)
);

CREATE TABLE public.feature_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  feature_id uuid NOT NULL
    REFERENCES public.feature_definitions(id)
    ON DELETE CASCADE,

  value text NOT NULL,
  label text NOT NULL,

  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT feature_options_feature_value_unique
    UNIQUE (feature_id, value),

  CONSTRAINT feature_options_sort_order_check
    CHECK (sort_order >= 0)
);

CREATE TABLE public.property_feature_values (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL,

  feature_id uuid NOT NULL
    REFERENCES public.feature_definitions(id)
    ON DELETE CASCADE,

  boolean_value boolean,
  number_value numeric,
  text_value text,
  selected_values jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT property_feature_values_property_feature_unique
    UNIQUE (property_id, feature_id),

  CONSTRAINT property_feature_values_has_value
    CHECK (
      boolean_value IS NOT NULL
      OR number_value IS NOT NULL
      OR text_value IS NOT NULL
      OR selected_values IS NOT NULL
    )
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_feature_definitions_updated_at
BEFORE UPDATE ON public.feature_definitions
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_feature_options_updated_at
BEFORE UPDATE ON public.feature_options
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_property_feature_values_updated_at
BEFORE UPDATE ON public.property_feature_values
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_feature_definitions_category_id
  ON public.feature_definitions(category_id);

CREATE INDEX idx_feature_definitions_searchable
  ON public.feature_definitions(is_searchable)
  WHERE is_searchable = true;

CREATE INDEX idx_feature_definitions_filterable
  ON public.feature_definitions(is_filterable)
  WHERE is_filterable = true;

CREATE INDEX idx_feature_definitions_active_sort
  ON public.feature_definitions(is_active, sort_order);

CREATE INDEX idx_feature_options_feature_id
  ON public.feature_options(feature_id);

CREATE INDEX idx_property_feature_values_property_id
  ON public.property_feature_values(property_id);

CREATE INDEX idx_property_feature_values_feature_id
  ON public.property_feature_values(feature_id);

-- ============================================================
-- 7. PROPERTY CORE
-- Property = the actual real-world property
-- Listing = the advertisement for that property
-- ============================================================

CREATE TABLE public.properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  category_id uuid NOT NULL
    REFERENCES public.property_categories(id)
    ON DELETE RESTRICT,

  title text NOT NULL,
  description text,

  -- Geography
  province_id uuid NOT NULL
    REFERENCES public.provinces(id)
    ON DELETE RESTRICT,

  city_id uuid NOT NULL
    REFERENCES public.cities(id)
    ON DELETE RESTRICT,

  district_id uuid
    REFERENCES public.districts(id)
    ON DELETE RESTRICT,

  neighborhood_id uuid
    REFERENCES public.neighborhoods(id)
    ON DELETE RESTRICT,

  address text,

  latitude numeric(9,6),
  longitude numeric(9,6),

  -- Physical information
  land_area numeric(14,2),
  building_area numeric(14,2),
  year_built integer,

  condition public.property_condition
    NOT NULL DEFAULT 'other',

  availability public.property_availability
    NOT NULL DEFAULT 'unknown',

  -- Core utilities and extensible property attributes
  utilities jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  flexible_attributes jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  archived_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- ==========================================================
  -- Validation
  -- ==========================================================

  CONSTRAINT properties_title_not_blank
    CHECK (length(trim(title)) > 0),

  CONSTRAINT properties_land_area_check
    CHECK (
      land_area IS NULL
      OR land_area >= 0
    ),

  CONSTRAINT properties_building_area_check
    CHECK (
      building_area IS NULL
      OR building_area >= 0
    ),

  CONSTRAINT properties_year_built_check
    CHECK (
      year_built IS NULL
      OR year_built BETWEEN 1000 AND 2500
    ),

  CONSTRAINT properties_latitude_check
    CHECK (
      latitude IS NULL
      OR latitude BETWEEN -90 AND 90
    ),

  CONSTRAINT properties_longitude_check
    CHECK (
      longitude IS NULL
      OR longitude BETWEEN -180 AND 180
    )
);

-- ============================================================
-- Updated-at trigger
-- ============================================================

CREATE TRIGGER set_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Property indexes
-- ============================================================

CREATE INDEX idx_properties_category_id
  ON public.properties(category_id);

CREATE INDEX idx_properties_province_id
  ON public.properties(province_id);

CREATE INDEX idx_properties_city_id
  ON public.properties(city_id);

CREATE INDEX idx_properties_district_id
  ON public.properties(district_id);

CREATE INDEX idx_properties_neighborhood_id
  ON public.properties(neighborhood_id);

CREATE INDEX idx_properties_availability
  ON public.properties(availability);

CREATE INDEX idx_properties_condition
  ON public.properties(condition);

CREATE INDEX idx_properties_archived_at
  ON public.properties(archived_at);

CREATE INDEX idx_properties_location
  ON public.properties(latitude, longitude);

-- ============================================================
-- Connect feature values to properties
-- ============================================================

ALTER TABLE public.property_feature_values
  ADD CONSTRAINT property_feature_values_property_fk
  FOREIGN KEY (property_id)
  REFERENCES public.properties(id)
  ON DELETE CASCADE;