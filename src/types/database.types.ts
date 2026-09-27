export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_user_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          new_data: Json | null
          old_data: Json | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          actor_user_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_user_id_fkey"
            columns: ["actor_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      building_documents: {
        Row: {
          completion_certificate_date: string | null
          completion_certificate_number: string | null
          created_at: string
          description: string | null
          id: string
          permit_date: string | null
          permit_number: string | null
          property_id: string
          separate_deed_date: string | null
          separate_deed_number: string | null
          subdivision_plan_date: string | null
          subdivision_plan_number: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          completion_certificate_date?: string | null
          completion_certificate_number?: string | null
          created_at?: string
          description?: string | null
          id?: string
          permit_date?: string | null
          permit_number?: string | null
          property_id: string
          separate_deed_date?: string | null
          separate_deed_number?: string | null
          subdivision_plan_date?: string | null
          subdivision_plan_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          completion_certificate_date?: string | null
          completion_certificate_number?: string | null
          created_at?: string
          description?: string | null
          id?: string
          permit_date?: string | null
          permit_number?: string | null
          property_id?: string
          separate_deed_date?: string | null
          separate_deed_number?: string | null
          subdivision_plan_date?: string | null
          subdivision_plan_number?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "building_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      buildings: {
        Row: {
          created_at: string
          description: string | null
          floors: number | null
          id: string
          name: string | null
          property_id: string
          units_count: number | null
          updated_at: string
          year_built: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          name?: string | null
          property_id: string
          units_count?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          name?: string | null
          property_id?: string
          units_count?: number | null
          updated_at?: string
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buildings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          province_id: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          province_id: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          province_id?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      construction_partnerships: {
        Row: {
          agreement_date: string | null
          created_at: string
          description: string | null
          id: string
          project_id: string | null
          status: Database["public"]["Enums"]["partnership_status"]
          updated_at: string
        }
        Insert: {
          agreement_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["partnership_status"]
          updated_at?: string
        }
        Update: {
          agreement_date?: string | null
          created_at?: string
          description?: string | null
          id?: string
          project_id?: string | null
          status?: Database["public"]["Enums"]["partnership_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "construction_partnerships_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_requests: {
        Row: {
          advertiser_user_id: string | null
          created_at: string
          id: string
          listing_id: string
          message: string | null
          method: Database["public"]["Enums"]["contact_method"]
          requester_user_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["contact_request_status"]
          updated_at: string
        }
        Insert: {
          advertiser_user_id?: string | null
          created_at?: string
          id?: string
          listing_id: string
          message?: string | null
          method: Database["public"]["Enums"]["contact_method"]
          requester_user_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["contact_request_status"]
          updated_at?: string
        }
        Update: {
          advertiser_user_id?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          message?: string | null
          method?: Database["public"]["Enums"]["contact_method"]
          requester_user_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["contact_request_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_advertiser_user_id_fkey"
            columns: ["advertiser_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_requester_user_id_fkey"
            columns: ["requester_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      districts: {
        Row: {
          city_id: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_definitions: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_active: boolean
          is_filterable: boolean
          is_searchable: boolean
          key: string
          label: string
          sort_order: number
          updated_at: string
          value_type: Database["public"]["Enums"]["feature_value_type"]
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_filterable?: boolean
          is_searchable?: boolean
          key: string
          label: string
          sort_order?: number
          updated_at?: string
          value_type: Database["public"]["Enums"]["feature_value_type"]
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          is_filterable?: boolean
          is_searchable?: boolean
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
          value_type?: Database["public"]["Enums"]["feature_value_type"]
        }
        Relationships: [
          {
            foreignKeyName: "feature_definitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_options: {
        Row: {
          created_at: string
          feature_id: string
          id: string
          is_active: boolean
          label: string
          sort_order: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          feature_id: string
          id?: string
          is_active?: boolean
          label: string
          sort_order?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          feature_id?: string
          id?: string
          is_active?: boolean
          label?: string
          sort_order?: number
          updated_at?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_options_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      land_parcels: {
        Row: {
          access_description: string | null
          area: number
          buildable: boolean | null
          created_at: string
          current_use: Database["public"]["Enums"]["land_current_use"]
          id: string
          land_id: string
          legal_use: Database["public"]["Enums"]["land_legal_use"]
          notes: string | null
          updated_at: string
          utilities_description: string | null
        }
        Insert: {
          access_description?: string | null
          area: number
          buildable?: boolean | null
          created_at?: string
          current_use?: Database["public"]["Enums"]["land_current_use"]
          id?: string
          land_id: string
          legal_use?: Database["public"]["Enums"]["land_legal_use"]
          notes?: string | null
          updated_at?: string
          utilities_description?: string | null
        }
        Update: {
          access_description?: string | null
          area?: number
          buildable?: boolean | null
          created_at?: string
          current_use?: Database["public"]["Enums"]["land_current_use"]
          id?: string
          land_id?: string
          legal_use?: Database["public"]["Enums"]["land_legal_use"]
          notes?: string | null
          updated_at?: string
          utilities_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "land_parcels_land_id_fkey"
            columns: ["land_id"]
            isOneToOne: false
            referencedRelation: "lands"
            referencedColumns: ["id"]
          },
        ]
      }
      lands: {
        Row: {
          access_description: string | null
          buildable: boolean | null
          created_at: string
          current_use: Database["public"]["Enums"]["land_current_use"]
          flexible_attributes: Json
          id: string
          legal_use: Database["public"]["Enums"]["land_legal_use"]
          property_id: string
          total_area: number
          updated_at: string
        }
        Insert: {
          access_description?: string | null
          buildable?: boolean | null
          created_at?: string
          current_use?: Database["public"]["Enums"]["land_current_use"]
          flexible_attributes?: Json
          id?: string
          legal_use?: Database["public"]["Enums"]["land_legal_use"]
          property_id: string
          total_area: number
          updated_at?: string
        }
        Update: {
          access_description?: string | null
          buildable?: boolean | null
          created_at?: string
          current_use?: Database["public"]["Enums"]["land_current_use"]
          flexible_attributes?: Json
          id?: string
          legal_use?: Database["public"]["Enums"]["land_legal_use"]
          property_id?: string
          total_area?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lands_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_media: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          listing_id: string
          media_type: Database["public"]["Enums"]["listing_media_type"]
          public_url: string | null
          sort_order: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id: string
          media_type: Database["public"]["Enums"]["listing_media_type"]
          public_url?: string | null
          sort_order?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          listing_id?: string
          media_type?: Database["public"]["Enums"]["listing_media_type"]
          public_url?: string | null
          sort_order?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_media_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_prices: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          deposit: number | null
          id: string
          listing_id: string
          monthly_rent: number | null
          negotiable: boolean
          price_per_area: number | null
          total_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          deposit?: number | null
          id?: string
          listing_id: string
          monthly_rent?: number | null
          negotiable?: boolean
          price_per_area?: number | null
          total_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          deposit?: number | null
          id?: string
          listing_id?: string
          monthly_rent?: number | null
          negotiable?: boolean
          price_per_area?: number | null
          total_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_prices_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_reports: {
        Row: {
          created_at: string
          description: string | null
          id: string
          listing_id: string
          reason: Database["public"]["Enums"]["listing_report_reason"]
          reporter_user_id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["listing_report_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          listing_id: string
          reason: Database["public"]["Enums"]["listing_report_reason"]
          reporter_user_id: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["listing_report_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          listing_id?: string
          reason?: Database["public"]["Enums"]["listing_report_reason"]
          reporter_user_id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["listing_report_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_reports_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_reports_reporter_user_id_fkey"
            columns: ["reporter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_reports_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_representations: {
        Row: {
          authority_type: Database["public"]["Enums"]["authority_type"]
          created_at: string
          evidence_storage_path: string | null
          expires_at: string | null
          id: string
          listing_id: string
          property_owner_id: string | null
          rejection_reason: string | null
          representative_user_id: string
          status: Database["public"]["Enums"]["authority_status"]
          updated_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          authority_type: Database["public"]["Enums"]["authority_type"]
          created_at?: string
          evidence_storage_path?: string | null
          expires_at?: string | null
          id?: string
          listing_id: string
          property_owner_id?: string | null
          rejection_reason?: string | null
          representative_user_id: string
          status?: Database["public"]["Enums"]["authority_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          authority_type?: Database["public"]["Enums"]["authority_type"]
          created_at?: string
          evidence_storage_path?: string | null
          expires_at?: string | null
          id?: string
          listing_id?: string
          property_owner_id?: string | null
          rejection_reason?: string | null
          representative_user_id?: string
          status?: Database["public"]["Enums"]["authority_status"]
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_representations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_representations_property_owner_id_fkey"
            columns: ["property_owner_id"]
            isOneToOne: false
            referencedRelation: "property_owners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_representations_representative_user_id_fkey"
            columns: ["representative_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_representations_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["listing_status"] | null
          id: string
          listing_id: string
          reason: string | null
          to_status: Database["public"]["Enums"]["listing_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["listing_status"] | null
          id?: string
          listing_id: string
          reason?: string | null
          to_status: Database["public"]["Enums"]["listing_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["listing_status"] | null
          id?: string
          listing_id?: string
          reason?: string | null
          to_status?: Database["public"]["Enums"]["listing_status"]
        }
        Relationships: [
          {
            foreignKeyName: "listing_status_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_status_history_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          advertiser_type: Database["public"]["Enums"]["advertiser_type"]
          advertiser_user_id: string | null
          created_at: string
          created_by: string
          description: string | null
          flexible_attributes: Json
          hidden_at: string | null
          hidden_by: string | null
          hidden_reason: string | null
          id: string
          listing_kind: Database["public"]["Enums"]["listing_kind"]
          project_id: string | null
          project_unit_id: string | null
          property_id: string
          published_at: string | null
          rejected_reason: string | null
          result: Database["public"]["Enums"]["listing_result"]
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
          visibility: Database["public"]["Enums"]["listing_visibility"]
        }
        Insert: {
          advertiser_type: Database["public"]["Enums"]["advertiser_type"]
          advertiser_user_id?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          flexible_attributes?: Json
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          listing_kind?: Database["public"]["Enums"]["listing_kind"]
          project_id?: string | null
          project_unit_id?: string | null
          property_id: string
          published_at?: string | null
          rejected_reason?: string | null
          result?: Database["public"]["Enums"]["listing_result"]
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["listing_visibility"]
        }
        Update: {
          advertiser_type?: Database["public"]["Enums"]["advertiser_type"]
          advertiser_user_id?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          flexible_attributes?: Json
          hidden_at?: string | null
          hidden_by?: string | null
          hidden_reason?: string | null
          id?: string
          listing_kind?: Database["public"]["Enums"]["listing_kind"]
          project_id?: string | null
          project_unit_id?: string | null
          property_id?: string
          published_at?: string | null
          rejected_reason?: string | null
          result?: Database["public"]["Enums"]["listing_result"]
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
          visibility?: Database["public"]["Enums"]["listing_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "listings_advertiser_user_id_fkey"
            columns: ["advertiser_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_hidden_by_fkey"
            columns: ["hidden_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_project_unit_id_fkey"
            columns: ["project_unit_id"]
            isOneToOne: false
            referencedRelation: "project_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      neighborhoods: {
        Row: {
          created_at: string
          district_id: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_id: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_id?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "neighborhoods_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_allocations: {
        Row: {
          allocation_type: Database["public"]["Enums"]["partnership_allocation_type"]
          created_at: string
          description: string | null
          id: string
          partnership_id: string
          party_id: string
          percentage: number | null
          quantity: number | null
          updated_at: string
        }
        Insert: {
          allocation_type: Database["public"]["Enums"]["partnership_allocation_type"]
          created_at?: string
          description?: string | null
          id?: string
          partnership_id: string
          party_id: string
          percentage?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          allocation_type?: Database["public"]["Enums"]["partnership_allocation_type"]
          created_at?: string
          description?: string | null
          id?: string
          partnership_id?: string
          party_id?: string
          percentage?: number | null
          quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_allocations_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "construction_partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_allocations_party_id_fkey"
            columns: ["party_id"]
            isOneToOne: false
            referencedRelation: "partnership_parties"
            referencedColumns: ["id"]
          },
        ]
      }
      partnership_parties: {
        Row: {
          created_at: string
          description: string | null
          display_name: string
          id: string
          partnership_id: string
          party_role: Database["public"]["Enums"]["partnership_party_role"]
          party_type: Database["public"]["Enums"]["construction_partnership_party_type"]
          phone: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name: string
          id?: string
          partnership_id: string
          party_role: Database["public"]["Enums"]["partnership_party_role"]
          party_type: Database["public"]["Enums"]["construction_partnership_party_type"]
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string
          id?: string
          partnership_id?: string
          party_role?: Database["public"]["Enums"]["partnership_party_role"]
          party_type?: Database["public"]["Enums"]["construction_partnership_party_type"]
          phone?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partnership_parties_partnership_id_fkey"
            columns: ["partnership_id"]
            isOneToOne: false
            referencedRelation: "construction_partnerships"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_parties_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_schedule_items: {
        Row: {
          amount: number | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          milestone: Database["public"]["Enums"]["construction_stage"] | null
          project_unit_id: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone?: Database["public"]["Enums"]["construction_stage"] | null
          project_unit_id: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          milestone?: Database["public"]["Enums"]["construction_stage"] | null
          project_unit_id?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_schedule_items_project_unit_id_fkey"
            columns: ["project_unit_id"]
            isOneToOne: false
            referencedRelation: "project_units"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_legal_documents: {
        Row: {
          content: string
          created_at: string
          document_type: Database["public"]["Enums"]["platform_legal_document_type"]
          id: string
          is_active: boolean
          published_at: string | null
          requires_reacceptance: boolean
          version: string
        }
        Insert: {
          content: string
          created_at?: string
          document_type: Database["public"]["Enums"]["platform_legal_document_type"]
          id?: string
          is_active?: boolean
          published_at?: string | null
          requires_reacceptance?: boolean
          version: string
        }
        Update: {
          content?: string
          created_at?: string
          document_type?: Database["public"]["Enums"]["platform_legal_document_type"]
          id?: string
          is_active?: boolean
          published_at?: string | null
          requires_reacceptance?: boolean
          version?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          phone: string | null
          phone_verified_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          phone?: string | null
          phone_verified_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          phone?: string | null
          phone_verified_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_blocks: {
        Row: {
          created_at: string
          description: string | null
          floors: number | null
          id: string
          name: string
          project_id: string
          units_count: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          name: string
          project_id: string
          units_count?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          floors?: number | null
          id?: string
          name?: string
          project_id?: string
          units_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_blocks_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_documents: {
        Row: {
          created_at: string
          description: string | null
          document_type: string | null
          id: string
          project_id: string
          storage_path: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          id?: string
          project_id: string
          storage_path?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_type?: string | null
          id?: string
          project_id?: string
          storage_path?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_progress: {
        Row: {
          created_at: string
          description: string | null
          id: string
          percentage: number | null
          progress_date: string
          project_id: string
          stage: Database["public"]["Enums"]["construction_stage"]
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          percentage?: number | null
          progress_date?: string
          project_id: string
          stage: Database["public"]["Enums"]["construction_stage"]
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          percentage?: number | null
          progress_date?: string
          project_id?: string
          stage?: Database["public"]["Enums"]["construction_stage"]
        }
        Relationships: [
          {
            foreignKeyName: "project_progress_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_unit_pricing: {
        Row: {
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          effective_from: string
          effective_to: string | null
          id: string
          initial_payment: number | null
          price_per_area: number | null
          project_unit_id: string
          total_price: number | null
        }
        Insert: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          effective_from?: string
          effective_to?: string | null
          id?: string
          initial_payment?: number | null
          price_per_area?: number | null
          project_unit_id: string
          total_price?: number | null
        }
        Update: {
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          effective_from?: string
          effective_to?: string | null
          id?: string
          initial_payment?: number | null
          price_per_area?: number | null
          project_unit_id?: string
          total_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "project_unit_pricing_project_unit_id_fkey"
            columns: ["project_unit_id"]
            isOneToOne: false
            referencedRelation: "project_units"
            referencedColumns: ["id"]
          },
        ]
      }
      project_units: {
        Row: {
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          block_id: string | null
          created_at: string
          delivery_date: string | null
          description: string | null
          floor: number | null
          id: string
          parking_count: number | null
          project_id: string
          status: Database["public"]["Enums"]["unit_status"]
          storage_count: number | null
          unit_number: string | null
          updated_at: string
        }
        Insert: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          block_id?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          floor?: number | null
          id?: string
          parking_count?: number | null
          project_id: string
          status?: Database["public"]["Enums"]["unit_status"]
          storage_count?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Update: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          block_id?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          floor?: number | null
          id?: string
          parking_count?: number | null
          project_id?: string
          status?: Database["public"]["Enums"]["unit_status"]
          storage_count?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_units_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "project_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_units_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          developer_user_id: string | null
          expected_delivery_date: string | null
          id: string
          name: string
          property_id: string
          status: Database["public"]["Enums"]["project_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          developer_user_id?: string | null
          expected_delivery_date?: string | null
          id?: string
          name: string
          property_id: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          developer_user_id?: string | null
          expected_delivery_date?: string | null
          id?: string
          name?: string
          property_id?: string
          status?: Database["public"]["Enums"]["project_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_developer_user_id_fkey"
            columns: ["developer_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string | null
          archived_at: string | null
          availability: Database["public"]["Enums"]["property_availability"]
          building_area: number | null
          category_id: string
          city_id: string
          condition: Database["public"]["Enums"]["property_condition"]
          created_at: string
          created_by: string
          description: string | null
          district_id: string | null
          flexible_attributes: Json
          id: string
          land_area: number | null
          latitude: number | null
          longitude: number | null
          neighborhood_id: string | null
          province_id: string
          title: string
          updated_at: string
          utilities: Json
          year_built: number | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          availability?: Database["public"]["Enums"]["property_availability"]
          building_area?: number | null
          category_id: string
          city_id: string
          condition?: Database["public"]["Enums"]["property_condition"]
          created_at?: string
          created_by: string
          description?: string | null
          district_id?: string | null
          flexible_attributes?: Json
          id?: string
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood_id?: string | null
          province_id: string
          title: string
          updated_at?: string
          utilities?: Json
          year_built?: number | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          availability?: Database["public"]["Enums"]["property_availability"]
          building_area?: number | null
          category_id?: string
          city_id?: string
          condition?: Database["public"]["Enums"]["property_condition"]
          created_at?: string
          created_by?: string
          description?: string | null
          district_id?: string | null
          flexible_attributes?: Json
          id?: string
          land_area?: number | null
          latitude?: number | null
          longitude?: number | null
          neighborhood_id?: string | null
          province_id?: string
          title?: string
          updated_at?: string
          utilities?: Json
          year_built?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "properties_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_neighborhood_id_fkey"
            columns: ["neighborhood_id"]
            isOneToOne: false
            referencedRelation: "neighborhoods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["id"]
          },
        ]
      }
      property_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "property_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      property_feature_values: {
        Row: {
          boolean_value: boolean | null
          created_at: string
          feature_id: string
          id: string
          number_value: number | null
          property_id: string
          selected_values: Json | null
          text_value: string | null
          updated_at: string
        }
        Insert: {
          boolean_value?: boolean | null
          created_at?: string
          feature_id: string
          id?: string
          number_value?: number | null
          property_id: string
          selected_values?: Json | null
          text_value?: string | null
          updated_at?: string
        }
        Update: {
          boolean_value?: boolean | null
          created_at?: string
          feature_id?: string
          id?: string
          number_value?: number | null
          property_id?: string
          selected_values?: Json | null
          text_value?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_feature_values_feature_id_fkey"
            columns: ["feature_id"]
            isOneToOne: false
            referencedRelation: "feature_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_feature_values_property_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_legal_documents: {
        Row: {
          created_at: string
          description: string | null
          document_color: Database["public"]["Enums"]["document_color"] | null
          document_storage_path: string | null
          id: string
          issue_date: string | null
          official_document_type:
            | Database["public"]["Enums"]["official_document_type"]
            | null
          ownership_evidence_type: Database["public"]["Enums"]["ownership_evidence_type"]
          property_id: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_color?: Database["public"]["Enums"]["document_color"] | null
          document_storage_path?: string | null
          id?: string
          issue_date?: string | null
          official_document_type?:
            | Database["public"]["Enums"]["official_document_type"]
            | null
          ownership_evidence_type: Database["public"]["Enums"]["ownership_evidence_type"]
          property_id: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          document_color?: Database["public"]["Enums"]["document_color"] | null
          document_storage_path?: string | null
          id?: string
          issue_date?: string | null
          official_document_type?:
            | Database["public"]["Enums"]["official_document_type"]
            | null
          ownership_evidence_type?: Database["public"]["Enums"]["ownership_evidence_type"]
          property_id?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_legal_documents_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_legal_status: {
        Row: {
          created_at: string
          description: string | null
          id: string
          property_id: string
          status: Database["public"]["Enums"]["legal_status_type"]
          updated_at: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          property_id: string
          status: Database["public"]["Enums"]["legal_status_type"]
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          property_id?: string
          status?: Database["public"]["Enums"]["legal_status_type"]
          updated_at?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_legal_status_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_owners: {
        Row: {
          created_at: string
          display_name: string
          id: string
          owner_type: Database["public"]["Enums"]["owner_type"]
          ownership_share: number | null
          ownership_type: Database["public"]["Enums"]["ownership_type"] | null
          property_id: string
          updated_at: string
          user_id: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          id?: string
          owner_type: Database["public"]["Enums"]["owner_type"]
          ownership_share?: number | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"] | null
          property_id: string
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          id?: string
          owner_type?: Database["public"]["Enums"]["owner_type"]
          ownership_share?: number | null
          ownership_type?: Database["public"]["Enums"]["ownership_type"] | null
          property_id?: string
          updated_at?: string
          user_id?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "property_owners_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_owners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_registration: {
        Row: {
          created_at: string
          id: string
          main_parcel: string | null
          parcel: string | null
          property_id: string
          section: string | null
          sub_parcel: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          main_parcel?: string | null
          parcel?: string | null
          property_id: string
          section?: string | null
          sub_parcel?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          main_parcel?: string | null
          parcel?: string | null
          property_id?: string
          section?: string | null
          sub_parcel?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_registration_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: true
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      property_units: {
        Row: {
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          building_id: string
          condition: Database["public"]["Enums"]["property_condition"]
          created_at: string
          description: string | null
          floor: number | null
          id: string
          parking_count: number | null
          storage_count: number | null
          unit_number: string | null
          updated_at: string
        }
        Insert: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_id: string
          condition?: Database["public"]["Enums"]["property_condition"]
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: string
          parking_count?: number | null
          storage_count?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Update: {
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          building_id?: string
          condition?: Database["public"]["Enums"]["property_condition"]
          created_at?: string
          description?: string | null
          floor?: number | null
          id?: string
          parking_count?: number | null
          storage_count?: number | null
          unit_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_units_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      provinces: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      short_term_details: {
        Row: {
          amenities: Json
          bathrooms: number | null
          beds: number | null
          capacity: number | null
          check_in_time: string | null
          check_out_time: string | null
          created_at: string
          house_rules: Json
          id: string
          listing_id: string
          max_nights: number | null
          min_nights: number | null
          price_per_month: number | null
          price_per_night: number | null
          price_per_week: number | null
          property_type: Database["public"]["Enums"]["short_term_property_type"]
          rooms: number | null
          updated_at: string
        }
        Insert: {
          amenities?: Json
          bathrooms?: number | null
          beds?: number | null
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          house_rules?: Json
          id?: string
          listing_id: string
          max_nights?: number | null
          min_nights?: number | null
          price_per_month?: number | null
          price_per_night?: number | null
          price_per_week?: number | null
          property_type: Database["public"]["Enums"]["short_term_property_type"]
          rooms?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: Json
          bathrooms?: number | null
          beds?: number | null
          capacity?: number | null
          check_in_time?: string | null
          check_out_time?: string | null
          created_at?: string
          house_rules?: Json
          id?: string
          listing_id?: string
          max_nights?: number | null
          min_nights?: number | null
          price_per_month?: number | null
          price_per_night?: number | null
          price_per_week?: number | null
          property_type?: Database["public"]["Enums"]["short_term_property_type"]
          rooms?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "short_term_details_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      terms_acceptances: {
        Row: {
          acceptance_context: Database["public"]["Enums"]["acceptance_context"]
          accepted_at: string
          id: string
          platform_legal_document_id: string
          user_id: string
        }
        Insert: {
          acceptance_context: Database["public"]["Enums"]["acceptance_context"]
          accepted_at?: string
          id?: string
          platform_legal_document_id: string
          user_id: string
        }
        Update: {
          acceptance_context?: Database["public"]["Enums"]["acceptance_context"]
          accepted_at?: string
          id?: string
          platform_legal_document_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "terms_acceptances_platform_legal_document_id_fkey"
            columns: ["platform_legal_document_id"]
            isOneToOne: false
            referencedRelation: "platform_legal_documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "terms_acceptances_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_identities: {
        Row: {
          created_at: string
          id: string
          last_seen_at: string
          platform: Database["public"]["Enums"]["identity_platform"]
          platform_user_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_seen_at?: string
          platform: Database["public"]["Enums"]["identity_platform"]
          platform_user_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_seen_at?: string
          platform?: Database["public"]["Enums"]["identity_platform"]
          platform_user_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      acceptance_context: "web" | "telegram" | "bale" | "eitaa"
      advertiser_type: "owner" | "agent" | "authorized_representative"
      audit_action:
        | "create"
        | "update"
        | "delete"
        | "publish"
        | "reject"
        | "archive"
        | "login"
        | "logout"
        | "verify"
        | "other"
      authority_status: "pending" | "verified" | "rejected" | "expired"
      authority_type:
        | "owner_authorization"
        | "power_of_attorney"
        | "guardianship"
        | "family_representation"
        | "agent_authorization"
        | "other"
      construction_partnership_party_type: "registered_user" | "non_member"
      construction_stage:
        | "land"
        | "permits"
        | "excavation"
        | "foundation"
        | "structure"
        | "roof"
        | "walls"
        | "mep"
        | "facade"
        | "finishing"
        | "final_work"
        | "ready"
      contact_method: "phone" | "message" | "platform"
      contact_request_status: "pending" | "responded" | "closed" | "cancelled"
      currency_code: "irr"
      document_color: "green" | "other" | "unknown"
      feature_value_type:
        | "boolean"
        | "number"
        | "text"
        | "select"
        | "multi_select"
      identity_platform: "web" | "telegram" | "bale" | "eitaa"
      land_current_use:
        | "vacant"
        | "agricultural"
        | "garden"
        | "residential"
        | "commercial"
        | "industrial"
        | "mixed_use"
        | "other"
        | "unknown"
      land_legal_use:
        | "residential"
        | "agricultural"
        | "commercial"
        | "industrial"
        | "mixed_use"
        | "tourism"
        | "garden"
        | "other"
        | "unclassified"
      legal_status_type:
        | "waqf"
        | "inherited"
        | "mortgaged"
        | "seized"
        | "transfer_restricted"
        | "contested"
        | "legal_dispute"
        | "other"
      listing_kind: "standard" | "short_term"
      listing_media_type: "image" | "video"
      listing_report_reason:
        | "incorrect_information"
        | "duplicate"
        | "fraud"
        | "unavailable_property"
        | "inappropriate_content"
        | "other"
      listing_report_status: "pending" | "reviewing" | "resolved" | "rejected"
      listing_result:
        | "active"
        | "under_negotiation"
        | "under_contract"
        | "sold"
        | "rented"
        | "expired"
        | "cancelled"
      listing_status:
        | "draft"
        | "pending_review"
        | "published"
        | "rejected"
        | "archived"
      listing_visibility: "public" | "hidden"
      official_document_type: "single_page" | "cadastral" | "booklet" | "other"
      owner_type: "person" | "legal_entity"
      ownership_evidence_type:
        | "official_deed"
        | "ordinary_deed"
        | "sale_agreement"
        | "purchase_agreement"
        | "nasq"
        | "power_of_attorney"
        | "other"
      ownership_type:
        | "six_dang"
        | "shared"
        | "land_only"
        | "building_only"
        | "land_and_building"
      partnership_allocation_type:
        | "percentage"
        | "unit_count"
        | "floor"
        | "parking"
        | "storage"
      partnership_party_role: "land_owner" | "developer" | "builder" | "other"
      partnership_status: "draft" | "active" | "completed" | "cancelled"
      platform_legal_document_type:
        | "terms"
        | "privacy"
        | "disclaimer"
        | "listing_rules"
        | "other"
      project_status:
        | "planning"
        | "permitted"
        | "under_construction"
        | "near_completion"
        | "completed"
        | "cancelled"
      property_availability: "available" | "unavailable" | "unknown"
      property_condition:
        | "new"
        | "good"
        | "needs_renovation"
        | "renovated"
        | "under_construction"
        | "other"
      short_term_property_type:
        | "apartment"
        | "suite"
        | "villa"
        | "garden_villa"
        | "rural_house"
        | "cabin"
        | "room"
        | "ecotourism"
        | "traditional_lodging"
        | "guesthouse"
        | "coastal_lodging"
        | "forest_lodging"
        | "other"
      transaction_type:
        | "sale"
        | "rent"
        | "mortgage_rent"
        | "presale"
        | "exchange"
      unit_status:
        | "available"
        | "reserved"
        | "sold"
        | "transferred"
        | "cancelled"
      user_role: "user" | "agent" | "admin" | "super_admin"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      acceptance_context: ["web", "telegram", "bale", "eitaa"],
      advertiser_type: ["owner", "agent", "authorized_representative"],
      audit_action: [
        "create",
        "update",
        "delete",
        "publish",
        "reject",
        "archive",
        "login",
        "logout",
        "verify",
        "other",
      ],
      authority_status: ["pending", "verified", "rejected", "expired"],
      authority_type: [
        "owner_authorization",
        "power_of_attorney",
        "guardianship",
        "family_representation",
        "agent_authorization",
        "other",
      ],
      construction_partnership_party_type: ["registered_user", "non_member"],
      construction_stage: [
        "land",
        "permits",
        "excavation",
        "foundation",
        "structure",
        "roof",
        "walls",
        "mep",
        "facade",
        "finishing",
        "final_work",
        "ready",
      ],
      contact_method: ["phone", "message", "platform"],
      contact_request_status: ["pending", "responded", "closed", "cancelled"],
      currency_code: ["irr"],
      document_color: ["green", "other", "unknown"],
      feature_value_type: [
        "boolean",
        "number",
        "text",
        "select",
        "multi_select",
      ],
      identity_platform: ["web", "telegram", "bale", "eitaa"],
      land_current_use: [
        "vacant",
        "agricultural",
        "garden",
        "residential",
        "commercial",
        "industrial",
        "mixed_use",
        "other",
        "unknown",
      ],
      land_legal_use: [
        "residential",
        "agricultural",
        "commercial",
        "industrial",
        "mixed_use",
        "tourism",
        "garden",
        "other",
        "unclassified",
      ],
      legal_status_type: [
        "waqf",
        "inherited",
        "mortgaged",
        "seized",
        "transfer_restricted",
        "contested",
        "legal_dispute",
        "other",
      ],
      listing_kind: ["standard", "short_term"],
      listing_media_type: ["image", "video"],
      listing_report_reason: [
        "incorrect_information",
        "duplicate",
        "fraud",
        "unavailable_property",
        "inappropriate_content",
        "other",
      ],
      listing_report_status: ["pending", "reviewing", "resolved", "rejected"],
      listing_result: [
        "active",
        "under_negotiation",
        "under_contract",
        "sold",
        "rented",
        "expired",
        "cancelled",
      ],
      listing_status: [
        "draft",
        "pending_review",
        "published",
        "rejected",
        "archived",
      ],
      listing_visibility: ["public", "hidden"],
      official_document_type: ["single_page", "cadastral", "booklet", "other"],
      owner_type: ["person", "legal_entity"],
      ownership_evidence_type: [
        "official_deed",
        "ordinary_deed",
        "sale_agreement",
        "purchase_agreement",
        "nasq",
        "power_of_attorney",
        "other",
      ],
      ownership_type: [
        "six_dang",
        "shared",
        "land_only",
        "building_only",
        "land_and_building",
      ],
      partnership_allocation_type: [
        "percentage",
        "unit_count",
        "floor",
        "parking",
        "storage",
      ],
      partnership_party_role: ["land_owner", "developer", "builder", "other"],
      partnership_status: ["draft", "active", "completed", "cancelled"],
      platform_legal_document_type: [
        "terms",
        "privacy",
        "disclaimer",
        "listing_rules",
        "other",
      ],
      project_status: [
        "planning",
        "permitted",
        "under_construction",
        "near_completion",
        "completed",
        "cancelled",
      ],
      property_availability: ["available", "unavailable", "unknown"],
      property_condition: [
        "new",
        "good",
        "needs_renovation",
        "renovated",
        "under_construction",
        "other",
      ],
      short_term_property_type: [
        "apartment",
        "suite",
        "villa",
        "garden_villa",
        "rural_house",
        "cabin",
        "room",
        "ecotourism",
        "traditional_lodging",
        "guesthouse",
        "coastal_lodging",
        "forest_lodging",
        "other",
      ],
      transaction_type: [
        "sale",
        "rent",
        "mortgage_rent",
        "presale",
        "exchange",
      ],
      unit_status: [
        "available",
        "reserved",
        "sold",
        "transferred",
        "cancelled",
      ],
      user_role: ["user", "agent", "admin", "super_admin"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
} as const
