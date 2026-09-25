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

-- ============================================================
-- 8. LAND
-- Property → Land → Land Parcels
-- ============================================================

CREATE TABLE public.lands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL UNIQUE
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  total_area numeric(14,2) NOT NULL,

  legal_use public.land_legal_use
    NOT NULL DEFAULT 'unclassified',

  current_use public.land_current_use
    NOT NULL DEFAULT 'unknown',

  buildable boolean,

  access_description text,

  flexible_attributes jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT lands_total_area_check
    CHECK (total_area > 0)
);

CREATE TABLE public.land_parcels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  land_id uuid NOT NULL
    REFERENCES public.lands(id)
    ON DELETE CASCADE,

  area numeric(14,2) NOT NULL,

  legal_use public.land_legal_use
    NOT NULL DEFAULT 'unclassified',

  current_use public.land_current_use
    NOT NULL DEFAULT 'unknown',

  buildable boolean,

  access_description text,

  utilities_description text,

  notes text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT land_parcels_area_check
    CHECK (area > 0)
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_lands_updated_at
BEFORE UPDATE ON public.lands
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_land_parcels_updated_at
BEFORE UPDATE ON public.land_parcels
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_land_parcels_land_id
  ON public.land_parcels(land_id);

CREATE INDEX idx_lands_legal_use
  ON public.lands(legal_use);

CREATE INDEX idx_lands_current_use
  ON public.lands(current_use);

CREATE INDEX idx_land_parcels_legal_use
  ON public.land_parcels(legal_use);

CREATE INDEX idx_land_parcels_current_use
  ON public.land_parcels(current_use);

-- ============================================================
-- 9. BUILDINGS & PROPERTY UNITS
-- Property → Buildings → Units
-- ============================================================

CREATE TABLE public.buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  name text,

  floors integer,
  units_count integer,

  year_built integer,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT buildings_floors_check
    CHECK (
      floors IS NULL
      OR floors >= 0
    ),

  CONSTRAINT buildings_units_count_check
    CHECK (
      units_count IS NULL
      OR units_count >= 0
    ),

  CONSTRAINT buildings_year_built_check
    CHECK (
      year_built IS NULL
      OR year_built BETWEEN 1000 AND 2500
    )
);

CREATE TABLE public.property_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  building_id uuid NOT NULL
    REFERENCES public.buildings(id)
    ON DELETE CASCADE,

  unit_number text,

  floor integer,

  area numeric(14,2),

  bedrooms integer,
  bathrooms integer,
  parking_count integer,
  storage_count integer,

  condition public.property_condition
    NOT NULL DEFAULT 'other',

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT property_units_area_check
    CHECK (
      area IS NULL
      OR area > 0
    ),

  CONSTRAINT property_units_bedrooms_check
    CHECK (
      bedrooms IS NULL
      OR bedrooms >= 0
    ),

  CONSTRAINT property_units_bathrooms_check
    CHECK (
      bathrooms IS NULL
      OR bathrooms >= 0
    ),

  CONSTRAINT property_units_parking_check
    CHECK (
      parking_count IS NULL
      OR parking_count >= 0
    ),

  CONSTRAINT property_units_storage_check
    CHECK (
      storage_count IS NULL
      OR storage_count >= 0
    )
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_buildings_updated_at
BEFORE UPDATE ON public.buildings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_property_units_updated_at
BEFORE UPDATE ON public.property_units
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_buildings_property_id
  ON public.buildings(property_id);

CREATE INDEX idx_property_units_building_id
  ON public.property_units(building_id);

CREATE INDEX idx_property_units_floor
  ON public.property_units(floor);

CREATE INDEX idx_property_units_bedrooms
  ON public.property_units(bedrooms);

-- ============================================================
-- 10. PROPERTY OWNERSHIP & LEGAL DOCUMENTS
-- ============================================================

CREATE TABLE public.property_owners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  user_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  owner_type public.owner_type NOT NULL,

  display_name text NOT NULL,

  ownership_type public.ownership_type,

  ownership_share numeric(7,4),

  verification_status public.verification_status
    NOT NULL DEFAULT 'unverified',

  verified_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT property_owners_display_name_not_blank
    CHECK (length(trim(display_name)) > 0),

  CONSTRAINT property_owners_share_check
    CHECK (
      ownership_share IS NULL
      OR (
        ownership_share >= 0
        AND ownership_share <= 100
      )
    )
);

-- ============================================================
-- Property legal documents
-- ============================================================

CREATE TABLE public.property_legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  ownership_evidence_type public.ownership_evidence_type NOT NULL,

  official_document_type public.official_document_type,

  document_color public.document_color,

  issue_date date,

  verification_status public.verification_status
    NOT NULL DEFAULT 'unverified',

  verified_at timestamptz,

  document_storage_path text,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Property registration
-- ============================================================

CREATE TABLE public.property_registration (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL UNIQUE
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  main_parcel text,
  sub_parcel text,
  section text,
  parcel text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Building documents
-- ============================================================

CREATE TABLE public.building_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  permit_number text,
  permit_date date,

  completion_certificate_number text,
  completion_certificate_date date,

  subdivision_plan_number text,
  subdivision_plan_date date,

  separate_deed_number text,
  separate_deed_date date,

  verification_status public.verification_status
    NOT NULL DEFAULT 'unverified',

  verified_at timestamptz,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Property legal status
-- ============================================================

CREATE TABLE public.property_legal_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  status public.legal_status_type NOT NULL,

  description text,

  verified boolean NOT NULL DEFAULT false,

  verified_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT property_legal_status_unique
    UNIQUE (property_id, status)
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_property_owners_updated_at
BEFORE UPDATE ON public.property_owners
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_property_legal_documents_updated_at
BEFORE UPDATE ON public.property_legal_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_property_registration_updated_at
BEFORE UPDATE ON public.property_registration
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_building_documents_updated_at
BEFORE UPDATE ON public.building_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_property_legal_status_updated_at
BEFORE UPDATE ON public.property_legal_status
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_property_owners_property_id
  ON public.property_owners(property_id);

CREATE INDEX idx_property_owners_user_id
  ON public.property_owners(user_id);

CREATE INDEX idx_property_owners_verification_status
  ON public.property_owners(verification_status);

CREATE INDEX idx_property_legal_documents_property_id
  ON public.property_legal_documents(property_id);

CREATE INDEX idx_property_legal_documents_verification_status
  ON public.property_legal_documents(verification_status);

CREATE INDEX idx_property_registration_property_id
  ON public.property_registration(property_id);

CREATE INDEX idx_building_documents_property_id
  ON public.building_documents(property_id);

CREATE INDEX idx_building_documents_verification_status
  ON public.building_documents(verification_status);

CREATE INDEX idx_property_legal_status_property_id
  ON public.property_legal_status(property_id);

CREATE INDEX idx_property_legal_status_status
  ON public.property_legal_status(status);

-- ============================================================
-- 11. PROJECTS / PRE-SALE
-- ============================================================

CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  developer_user_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  name text NOT NULL,
  description text,

  status public.project_status
    NOT NULL DEFAULT 'planning',

  expected_delivery_date date,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT projects_name_not_blank
    CHECK (length(trim(name)) > 0)
);

-- ============================================================
-- Project blocks
-- ============================================================

CREATE TABLE public.project_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id uuid NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  name text NOT NULL,

  description text,

  floors integer,

  units_count integer,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_blocks_name_not_blank
    CHECK (length(trim(name)) > 0),

  CONSTRAINT project_blocks_floors_check
    CHECK (
      floors IS NULL
      OR floors >= 0
    ),

  CONSTRAINT project_blocks_units_count_check
    CHECK (
      units_count IS NULL
      OR units_count >= 0
    )
);

-- ============================================================
-- Project units
-- ============================================================

CREATE TABLE public.project_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id uuid NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  block_id uuid
    REFERENCES public.project_blocks(id)
    ON DELETE SET NULL,

  unit_number text,

  floor integer,

  area numeric(14,2),

  bedrooms integer,
  bathrooms integer,

  parking_count integer,
  storage_count integer,

  status public.unit_status
    NOT NULL DEFAULT 'available',

  delivery_date date,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_units_area_check
    CHECK (
      area IS NULL
      OR area > 0
    ),

  CONSTRAINT project_units_bedrooms_check
    CHECK (
      bedrooms IS NULL
      OR bedrooms >= 0
    ),

  CONSTRAINT project_units_bathrooms_check
    CHECK (
      bathrooms IS NULL
      OR bathrooms >= 0
    ),

  CONSTRAINT project_units_parking_check
    CHECK (
      parking_count IS NULL
      OR parking_count >= 0
    ),

  CONSTRAINT project_units_storage_check
    CHECK (
      storage_count IS NULL
      OR storage_count >= 0
    )
);

-- ============================================================
-- Project unit pricing
-- Multiple rows allow price history
-- ============================================================

CREATE TABLE public.project_unit_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_unit_id uuid NOT NULL
    REFERENCES public.project_units(id)
    ON DELETE CASCADE,

  total_price numeric(18,2),

  price_per_area numeric(18,2),

  initial_payment numeric(18,2),

  currency public.currency_code
    NOT NULL DEFAULT 'irr',

  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_unit_pricing_total_check
    CHECK (
      total_price IS NULL
      OR total_price >= 0
    ),

  CONSTRAINT project_unit_pricing_area_price_check
    CHECK (
      price_per_area IS NULL
      OR price_per_area >= 0
    ),

  CONSTRAINT project_unit_pricing_initial_payment_check
    CHECK (
      initial_payment IS NULL
      OR initial_payment >= 0
    ),

  CONSTRAINT project_unit_pricing_dates_check
    CHECK (
      effective_to IS NULL
      OR effective_to > effective_from
    )
);

-- ============================================================
-- Payment schedule
-- ============================================================

CREATE TABLE public.payment_schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_unit_id uuid NOT NULL
    REFERENCES public.project_units(id)
    ON DELETE CASCADE,

  title text NOT NULL,

  amount numeric(18,2),

  due_date date,

  milestone public.construction_stage,

  sort_order integer NOT NULL DEFAULT 0,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT payment_schedule_items_title_not_blank
    CHECK (length(trim(title)) > 0),

  CONSTRAINT payment_schedule_items_amount_check
    CHECK (
      amount IS NULL
      OR amount >= 0
    ),

  CONSTRAINT payment_schedule_items_sort_order_check
    CHECK (sort_order >= 0)
);

-- ============================================================
-- Project construction progress
-- ============================================================

CREATE TABLE public.project_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id uuid NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  stage public.construction_stage NOT NULL,

  percentage numeric(5,2),

  progress_date date NOT NULL DEFAULT CURRENT_DATE,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_progress_percentage_check
    CHECK (
      percentage IS NULL
      OR (
        percentage >= 0
        AND percentage <= 100
      )
    )
);

-- ============================================================
-- Project documents
-- ============================================================

CREATE TABLE public.project_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id uuid NOT NULL
    REFERENCES public.projects(id)
    ON DELETE CASCADE,

  title text NOT NULL,

  document_type text,

  storage_path text,

  description text,

  verification_status public.verification_status
    NOT NULL DEFAULT 'unverified',

  verified_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT project_documents_title_not_blank
    CHECK (length(trim(title)) > 0)
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_project_blocks_updated_at
BEFORE UPDATE ON public.project_blocks
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_project_units_updated_at
BEFORE UPDATE ON public.project_units
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_payment_schedule_items_updated_at
BEFORE UPDATE ON public.payment_schedule_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_project_documents_updated_at
BEFORE UPDATE ON public.project_documents
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_projects_property_id
  ON public.projects(property_id);

CREATE INDEX idx_projects_developer_user_id
  ON public.projects(developer_user_id);

CREATE INDEX idx_projects_status
  ON public.projects(status);

CREATE INDEX idx_project_blocks_project_id
  ON public.project_blocks(project_id);

CREATE INDEX idx_project_units_project_id
  ON public.project_units(project_id);

CREATE INDEX idx_project_units_block_id
  ON public.project_units(block_id);

CREATE INDEX idx_project_units_status
  ON public.project_units(status);

CREATE INDEX idx_project_unit_pricing_unit_id
  ON public.project_unit_pricing(project_unit_id);

CREATE INDEX idx_payment_schedule_items_unit_id
  ON public.payment_schedule_items(project_unit_id);

CREATE INDEX idx_project_progress_project_id
  ON public.project_progress(project_id);

CREATE INDEX idx_project_progress_stage
  ON public.project_progress(stage);

CREATE INDEX idx_project_documents_project_id
  ON public.project_documents(project_id);

CREATE INDEX idx_project_documents_verification_status
  ON public.project_documents(verification_status);

-- ============================================================
-- 12. CONSTRUCTION PARTNERSHIPS
-- Land Owner(s) ↔ Developer / Builder
-- ============================================================

CREATE TABLE public.construction_partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  project_id uuid
    REFERENCES public.projects(id)
    ON DELETE SET NULL,

  agreement_date date,

  description text,

  status public.partnership_status
    NOT NULL DEFAULT 'draft',

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Partnership parties
-- A party may be a registered user or a non-member.
-- ============================================================

CREATE TABLE public.partnership_parties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  partnership_id uuid NOT NULL
    REFERENCES public.construction_partnerships(id)
    ON DELETE CASCADE,

  party_type public.construction_partnership_party_type
    NOT NULL,

  user_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  party_role public.partnership_party_role
    NOT NULL,

  display_name text NOT NULL,

  phone text,

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT partnership_parties_display_name_not_blank
    CHECK (length(trim(display_name)) > 0),

  CONSTRAINT partnership_parties_type_user_consistency
    CHECK (
      (party_type = 'registered_user' AND user_id IS NOT NULL)
      OR
      (party_type = 'non_member' AND user_id IS NULL)
    )
);

-- ============================================================
-- Partnership allocations
-- Allocation belongs to a party, not directly to a user.
-- ============================================================

CREATE TABLE public.partnership_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  partnership_id uuid NOT NULL
    REFERENCES public.construction_partnerships(id)
    ON DELETE CASCADE,

  party_id uuid NOT NULL
    REFERENCES public.partnership_parties(id)
    ON DELETE CASCADE,

  allocation_type public.partnership_allocation_type
    NOT NULL,

  percentage numeric(7,4),

  quantity numeric(14,2),

  description text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT partnership_allocations_percentage_check
    CHECK (
      percentage IS NULL
      OR (
        percentage >= 0
        AND percentage <= 100
      )
    ),

  CONSTRAINT partnership_allocations_quantity_check
    CHECK (
      quantity IS NULL
      OR quantity >= 0
    ),

  CONSTRAINT partnership_allocations_value_check
    CHECK (
      percentage IS NOT NULL
      OR quantity IS NOT NULL
      OR description IS NOT NULL
    )
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_construction_partnerships_updated_at
BEFORE UPDATE ON public.construction_partnerships
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_partnership_parties_updated_at
BEFORE UPDATE ON public.partnership_parties
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_partnership_allocations_updated_at
BEFORE UPDATE ON public.partnership_allocations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_construction_partnerships_project_id
  ON public.construction_partnerships(project_id);

CREATE INDEX idx_construction_partnerships_status
  ON public.construction_partnerships(status);

CREATE INDEX idx_partnership_parties_partnership_id
  ON public.partnership_parties(partnership_id);

CREATE INDEX idx_partnership_parties_user_id
  ON public.partnership_parties(user_id);

CREATE INDEX idx_partnership_parties_role
  ON public.partnership_parties(party_role);

CREATE INDEX idx_partnership_allocations_partnership_id
  ON public.partnership_allocations(partnership_id);

CREATE INDEX idx_partnership_allocations_party_id
  ON public.partnership_allocations(party_id);

CREATE INDEX idx_partnership_allocations_type
  ON public.partnership_allocations(allocation_type);

-- ============================================================
-- 13. LISTINGS
-- Property Listing / Advertisement Layer
-- ============================================================

CREATE TYPE public.listing_kind AS ENUM (
  'standard',
  'short_term'
);

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  property_id uuid NOT NULL
    REFERENCES public.properties(id)
    ON DELETE CASCADE,

  created_by uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT,

  advertiser_user_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  advertiser_type public.advertiser_type
    NOT NULL,

  project_id uuid
    REFERENCES public.projects(id)
    ON DELETE SET NULL,

  project_unit_id uuid
    REFERENCES public.project_units(id)
    ON DELETE SET NULL,

  listing_kind public.listing_kind
    NOT NULL DEFAULT 'standard',

  transaction_type public.transaction_type
    NOT NULL,

  title text NOT NULL,

  description text,

  status public.listing_status
    NOT NULL DEFAULT 'draft',

  result public.listing_result
    NOT NULL DEFAULT 'active',

  visibility public.listing_visibility
    NOT NULL DEFAULT 'hidden',

  published_at timestamptz,

  rejected_reason text,

  hidden_by uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  hidden_at timestamptz,

  hidden_reason text,

  flexible_attributes jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz
    NOT NULL DEFAULT now(),

  updated_at timestamptz
    NOT NULL DEFAULT now(),

  CONSTRAINT listings_title_not_blank
    CHECK (length(trim(title)) > 0),

  CONSTRAINT listings_hidden_consistency
    CHECK (
      (visibility = 'hidden')
      OR
      (visibility = 'public' AND hidden_at IS NULL)
    ),

  CONSTRAINT listings_hidden_by_consistency
    CHECK (
      hidden_at IS NULL
      OR hidden_by IS NOT NULL
    )
);

-- ============================================================
-- Listing representation / authority
-- Used when a member advertises property on behalf of an owner.
-- ============================================================

CREATE TABLE public.listing_representations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  property_owner_id uuid
    REFERENCES public.property_owners(id)
    ON DELETE SET NULL,

  representative_user_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE RESTRICT,

  authority_type public.authority_type
    NOT NULL,

  status public.authority_status
    NOT NULL DEFAULT 'pending',

  evidence_storage_path text,

  verified_by uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  verified_at timestamptz,

  expires_at timestamptz,

  rejection_reason text,

  created_at timestamptz
    NOT NULL DEFAULT now(),

  updated_at timestamptz
    NOT NULL DEFAULT now()
);

-- ============================================================
-- Listing prices
-- Current price information for a listing.
-- ============================================================

CREATE TABLE public.listing_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL UNIQUE
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  total_price numeric(18,2),

  price_per_area numeric(18,2),

  deposit numeric(18,2),

  monthly_rent numeric(18,2),

  negotiable boolean
    NOT NULL DEFAULT false,

  currency public.currency_code
    NOT NULL DEFAULT 'irr',

  created_at timestamptz
    NOT NULL DEFAULT now(),

  updated_at timestamptz
    NOT NULL DEFAULT now(),

  CONSTRAINT listing_prices_total_check
    CHECK (total_price IS NULL OR total_price >= 0),

  CONSTRAINT listing_prices_price_per_area_check
    CHECK (price_per_area IS NULL OR price_per_area >= 0),

  CONSTRAINT listing_prices_deposit_check
    CHECK (deposit IS NULL OR deposit >= 0),

  CONSTRAINT listing_prices_monthly_rent_check
    CHECK (monthly_rent IS NULL OR monthly_rent >= 0)
);

-- ============================================================
-- Listing media
-- storage_path is the source of truth.
-- public_url is optional/cacheable and is NOT authoritative.
-- ============================================================

CREATE TABLE public.listing_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  storage_path text NOT NULL,

  public_url text,

  media_type public.listing_media_type
    NOT NULL,

  sort_order integer
    NOT NULL DEFAULT 0,

  is_primary boolean
    NOT NULL DEFAULT false,

  created_at timestamptz
    NOT NULL DEFAULT now(),

  CONSTRAINT listing_media_storage_path_not_blank
    CHECK (length(trim(storage_path)) > 0),

  CONSTRAINT listing_media_sort_order_check
    CHECK (sort_order >= 0)
);

-- ============================================================
-- Listing status history
-- Keeps lifecycle history separate from generic audit logs.
-- ============================================================

CREATE TABLE public.listing_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  from_status public.listing_status,

  to_status public.listing_status
    NOT NULL,

  changed_by uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  reason text,

  created_at timestamptz
    NOT NULL DEFAULT now()
);

-- ============================================================
-- Short-term rental / accommodation details
-- This is a separate business flow from ordinary RENT.
-- ============================================================

CREATE TABLE public.short_term_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL UNIQUE
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  property_type public.short_term_property_type
    NOT NULL,

  capacity integer,

  beds integer,

  rooms integer,

  bathrooms integer,

  price_per_night numeric(18,2),

  price_per_week numeric(18,2),

  price_per_month numeric(18,2),

  min_nights integer,

  max_nights integer,

  check_in_time time,

  check_out_time time,

  amenities jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  house_rules jsonb
    NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz
    NOT NULL DEFAULT now(),

  updated_at timestamptz
    NOT NULL DEFAULT now(),

  CONSTRAINT short_term_capacity_check
    CHECK (capacity IS NULL OR capacity >= 0),

  CONSTRAINT short_term_beds_check
    CHECK (beds IS NULL OR beds >= 0),

  CONSTRAINT short_term_rooms_check
    CHECK (rooms IS NULL OR rooms >= 0),

  CONSTRAINT short_term_bathrooms_check
    CHECK (bathrooms IS NULL OR bathrooms >= 0),

  CONSTRAINT short_term_nightly_price_check
    CHECK (price_per_night IS NULL OR price_per_night >= 0),

  CONSTRAINT short_term_weekly_price_check
    CHECK (price_per_week IS NULL OR price_per_week >= 0),

  CONSTRAINT short_term_monthly_price_check
    CHECK (price_per_month IS NULL OR price_per_month >= 0),

  CONSTRAINT short_term_min_nights_check
    CHECK (min_nights IS NULL OR min_nights > 0),

  CONSTRAINT short_term_max_nights_check
    CHECK (max_nights IS NULL OR max_nights > 0),

  CONSTRAINT short_term_nights_range_check
    CHECK (
      min_nights IS NULL
      OR max_nights IS NULL
      OR max_nights >= min_nights
    )
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_listings_updated_at
BEFORE UPDATE ON public.listings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_listing_representations_updated_at
BEFORE UPDATE ON public.listing_representations
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_listing_prices_updated_at
BEFORE UPDATE ON public.listing_prices
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_listing_media_updated_at
BEFORE UPDATE ON public.listing_media
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_short_term_details_updated_at
BEFORE UPDATE ON public.short_term_details
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_listings_property_id
  ON public.listings(property_id);

CREATE INDEX idx_listings_created_by
  ON public.listings(created_by);

CREATE INDEX idx_listings_advertiser_user_id
  ON public.listings(advertiser_user_id);

CREATE INDEX idx_listings_project_id
  ON public.listings(project_id);

CREATE INDEX idx_listings_project_unit_id
  ON public.listings(project_unit_id);

CREATE INDEX idx_listings_kind
  ON public.listings(listing_kind);

CREATE INDEX idx_listings_transaction_type
  ON public.listings(transaction_type);

CREATE INDEX idx_listings_status
  ON public.listings(status);

CREATE INDEX idx_listings_result
  ON public.listings(result);

CREATE INDEX idx_listings_visibility
  ON public.listings(visibility);

CREATE INDEX idx_listing_representations_listing_id
  ON public.listing_representations(listing_id);

CREATE INDEX idx_listing_representations_owner_id
  ON public.listing_representations(property_owner_id);

CREATE INDEX idx_listing_representations_representative_id
  ON public.listing_representations(representative_user_id);

CREATE INDEX idx_listing_representations_status
  ON public.listing_representations(status);

CREATE INDEX idx_listing_media_listing_id
  ON public.listing_media(listing_id);

CREATE INDEX idx_listing_media_sort_order
  ON public.listing_media(listing_id, sort_order);

CREATE INDEX idx_listing_status_history_listing_id
  ON public.listing_status_history(listing_id);

CREATE INDEX idx_listing_status_history_created_at
  ON public.listing_status_history(created_at);

CREATE INDEX idx_short_term_details_listing_id
  ON public.short_term_details(listing_id);

-- ============================================================
-- 14. USER OPERATIONS
-- Favorites / Contact Requests / Listing Reports
-- ============================================================

-- ============================================================
-- Favorites
-- ============================================================

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  created_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT favorites_user_listing_unique
    UNIQUE (user_id, listing_id)
);

-- ============================================================
-- Contact requests
-- ============================================================

CREATE TABLE public.contact_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  requester_user_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  advertiser_user_id uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  method public.contact_method
    NOT NULL,

  message text,

  status public.contact_request_status
    NOT NULL DEFAULT 'pending',

  responded_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),

  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Listing reports
-- ============================================================

CREATE TABLE public.listing_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  listing_id uuid NOT NULL
    REFERENCES public.listings(id)
    ON DELETE CASCADE,

  reporter_user_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  reason public.listing_report_reason
    NOT NULL,

  description text,

  status public.listing_report_status
    NOT NULL DEFAULT 'pending',

  reviewed_by uuid
    REFERENCES public.profiles(id)
    ON DELETE SET NULL,

  reviewed_at timestamptz,

  created_at timestamptz NOT NULL DEFAULT now(),

  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Updated-at triggers
-- ============================================================

CREATE TRIGGER set_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_listing_reports_updated_at
BEFORE UPDATE ON public.listing_reports
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_favorites_user_id
  ON public.favorites(user_id);

CREATE INDEX idx_favorites_listing_id
  ON public.favorites(listing_id);

CREATE INDEX idx_favorites_created_at
  ON public.favorites(created_at);

CREATE INDEX idx_contact_requests_listing_id
  ON public.contact_requests(listing_id);

CREATE INDEX idx_contact_requests_requester_user_id
  ON public.contact_requests(requester_user_id);

CREATE INDEX idx_contact_requests_advertiser_user_id
  ON public.contact_requests(advertiser_user_id);

CREATE INDEX idx_contact_requests_status
  ON public.contact_requests(status);

CREATE INDEX idx_contact_requests_created_at
  ON public.contact_requests(created_at);

CREATE INDEX idx_listing_reports_listing_id
  ON public.listing_reports(listing_id);

CREATE INDEX idx_listing_reports_reporter_user_id
  ON public.listing_reports(reporter_user_id);

CREATE INDEX idx_listing_reports_status
  ON public.listing_reports(status);

CREATE INDEX idx_listing_reports_created_at
  ON public.listing_reports(created_at);

-- ============================================================
-- 15. PLATFORM LEGAL DOCUMENTS & ACCEPTANCES
-- ============================================================

CREATE TABLE public.platform_legal_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  document_type public.platform_legal_document_type
    NOT NULL,

  version text NOT NULL,

  content text NOT NULL,

  is_active boolean
    NOT NULL DEFAULT false,

  requires_reacceptance boolean
    NOT NULL DEFAULT true,

  published_at timestamptz,

  created_at timestamptz
    NOT NULL DEFAULT now(),

  CONSTRAINT platform_legal_documents_version_not_blank
    CHECK (length(trim(version)) > 0),

  CONSTRAINT platform_legal_documents_content_not_blank
    CHECK (length(trim(content)) > 0),

  CONSTRAINT platform_legal_documents_type_version_unique
    UNIQUE (document_type, version)
);

-- ============================================================
-- User acceptance history
-- Each acceptance points to the exact legal-document version.
-- Previous acceptances are preserved.
-- ============================================================

CREATE TABLE public.terms_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  user_id uuid NOT NULL
    REFERENCES public.profiles(id)
    ON DELETE CASCADE,

  platform_legal_document_id uuid NOT NULL
    REFERENCES public.platform_legal_documents(id)
    ON DELETE RESTRICT,

  acceptance_context public.acceptance_context
    NOT NULL,

  accepted_at timestamptz
    NOT NULL DEFAULT now()
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_platform_legal_documents_type
  ON public.platform_legal_documents(document_type);

CREATE INDEX idx_platform_legal_documents_active
  ON public.platform_legal_documents(is_active);

CREATE INDEX idx_platform_legal_documents_published_at
  ON public.platform_legal_documents(published_at);

CREATE INDEX idx_terms_acceptances_user_id
  ON public.terms_acceptances(user_id);

CREATE INDEX idx_terms_acceptances_document_id
  ON public.terms_acceptances(platform_legal_document_id);

CREATE INDEX idx_terms_acceptances_accepted_at
  ON public.terms_acceptances(accepted_at);

CREATE INDEX idx_terms_acceptances_context
  ON public.terms_acceptances(acceptance_context);