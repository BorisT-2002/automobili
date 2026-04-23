export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          id: number
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      listing_images: {
        Row: {
          created_at: string
          display_order: number
          id: string
          image_url: string
          listing_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          id?: string
          image_url: string
          listing_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          id?: string
          image_url?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_images_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "seo_listing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_promotions: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          is_active: boolean
          listing_id: string
          package_id: number
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          is_active?: boolean
          listing_id: string
          package_id: number
          starts_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          is_active?: boolean
          listing_id?: string
          package_id?: number
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_promotions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "seo_listing_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_promotions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "promotion_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          average_rating: number
          category_id: number
          city: string
          contact_phone: string
          created_at: string
          description: string
          emergency_service: boolean
          featured: boolean
          id: string
          mobile_service: boolean
          price: number | null
          price_on_request: boolean
          provider_id: string
          review_count: number
          search_vector: unknown
          slug: string | null
          status: string
          title: string
          updated_at: string
          vehicle_brand: string | null
          whatsapp_viber: string | null
          working_hours: string | null
        }
        Insert: {
          average_rating?: number
          category_id: number
          city: string
          contact_phone: string
          created_at?: string
          description: string
          emergency_service?: boolean
          featured?: boolean
          id?: string
          mobile_service?: boolean
          price?: number | null
          price_on_request?: boolean
          provider_id: string
          review_count?: number
          search_vector?: unknown
          slug?: string | null
          status?: string
          title: string
          updated_at?: string
          vehicle_brand?: string | null
          whatsapp_viber?: string | null
          working_hours?: string | null
        }
        Update: {
          average_rating?: number
          category_id?: number
          city?: string
          contact_phone?: string
          created_at?: string
          description?: string
          emergency_service?: boolean
          featured?: boolean
          id?: string
          mobile_service?: boolean
          price?: number | null
          price_on_request?: boolean
          provider_id?: string
          review_count?: number
          search_vector?: unknown
          slug?: string | null
          status?: string
          title?: string
          updated_at?: string
          vehicle_brand?: string | null
          whatsapp_viber?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["reporter_id"]
          },
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["review_author_id"]
          },
          {
            foreignKeyName: "listings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_premium: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          is_active: boolean
          profile_id: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          is_active?: boolean
          profile_id: string
          starts_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          is_active?: boolean
          profile_id?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_premium_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "profile_premium_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["reporter_id"]
          },
          {
            foreignKeyName: "profile_premium_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["review_author_id"]
          },
          {
            foreignKeyName: "profile_premium_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      promotion_packages: {
        Row: {
          code: string
          created_at: string
          duration_days: number
          id: number
          name: string
          price_rsd: number
        }
        Insert: {
          code: string
          created_at?: string
          duration_days: number
          id?: number
          name: string
          price_rsd: number
        }
        Update: {
          code?: string
          created_at?: string
          duration_days?: number
          id?: number
          name?: string
          price_rsd?: number
        }
        Relationships: []
      }
      review_reports: {
        Row: {
          created_at: string
          id: string
          reason: string
          reporter_id: string
          review_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          reporter_id: string
          review_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          reporter_id?: string
          review_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "review_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["reporter_id"]
          },
          {
            foreignKeyName: "review_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["review_author_id"]
          },
          {
            foreignKeyName: "review_reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["review_id"]
          },
          {
            foreignKeyName: "review_reports_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          listing_id: string
          rating: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id: string
          rating: number
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string
          rating?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["listing_id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "seo_listing_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_listing_cards"
            referencedColumns: ["provider_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["reporter_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_reported_reviews"
            referencedColumns: ["review_author_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_listing_cards: {
        Row: {
          average_rating: number | null
          category_name: string | null
          category_slug: string | null
          city: string | null
          created_at: string | null
          emergency_service: boolean | null
          featured: boolean | null
          id: string | null
          mobile_service: boolean | null
          price: number | null
          price_on_request: boolean | null
          primary_image: string | null
          provider_id: string | null
          provider_name: string | null
          provider_verified: boolean | null
          review_count: number | null
          slug: string | null
          title: string | null
          vehicle_brand: string | null
        }
        Relationships: []
      }
      admin_reported_reviews: {
        Row: {
          comment: string | null
          listing_id: string | null
          listing_slug: string | null
          listing_title: string | null
          rating: number | null
          reason: string | null
          report_id: string | null
          reported_at: string | null
          reporter_id: string | null
          reporter_name: string | null
          review_author_id: string | null
          review_author_name: string | null
          review_id: string | null
          review_status: string | null
        }
        Relationships: []
      }
      seo_listing_pages: {
        Row: {
          category_name: string | null
          city: string | null
          id: string | null
          path: string | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      listing_filter_options: { Args: never; Returns: Json }
      refresh_listing_featured: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
      refresh_listing_rating: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
      search_listings: {
        Args: {
          p_category_slug?: string
          p_city?: string
          p_emergency?: boolean
          p_featured_only?: boolean
          p_limit?: number
          p_min_rating?: number
          p_mobile?: boolean
          p_offset?: number
          p_sort?: string
          p_vehicle_brand?: string
          query_text?: string
        }
        Returns: {
          average_rating: number
          category_name: string
          category_slug: string
          city: string
          featured: boolean
          id: string
          price: number
          price_on_request: boolean
          primary_image: string
          provider_name: string
          provider_verified: boolean
          rank: number
          review_count: number
          slug: string
          title: string
        }[]
      }
      slugify: { Args: { input: string }; Returns: string }
      unaccent: { Args: { "": string }; Returns: string }
    }
    Enums: {
      app_role: "customer" | "provider" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["customer", "provider", "admin"],
    },
  },
} as const
