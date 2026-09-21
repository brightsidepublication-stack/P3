export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: Database['public']['Enums']['user_role'];
          email: string | null;
          phone: string | null;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };

        Insert: {
          id: string;
          role?: Database['public']['Enums']['user_role'];
          email?: string | null;
          phone?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Update: {
          id?: string;
          role?: Database['public']['Enums']['user_role'];
          email?: string | null;
          phone?: string | null;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };

        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };

      current_role: {
        Args: Record<PropertyKey, never>;
        Returns:
          | Database['public']['Enums']['user_role']
          | null;
      };
    };

    Enums: {
      user_role: 'user' | 'agent' | 'admin';
    };

    CompositeTypes: {};
  };
};

export type ProfileRow =
  Database['public']['Tables']['profiles']['Row'];

export type ProfileInsert =
  Database['public']['Tables']['profiles']['Insert'];

export type ProfileUpdate =
  Database['public']['Tables']['profiles']['Update'];

export type UserRoleEnum =
  Database['public']['Enums']['user_role'];
