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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      blogs: {
        Row: {
          author_name: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string
          title: string
          updated_at: string
          user_id: string
          views: number | null
        }
        Insert: {
          author_name?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug: string
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
        }
        Update: {
          author_name?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          buyer_id: string
          created_at: string
          id: string
          plot_id: string
          seller_id: string
          updated_at: string
        }
        Insert: {
          buyer_id: string
          created_at?: string
          id?: string
          plot_id: string
          seller_id: string
          updated_at?: string
        }
        Update: {
          buyer_id?: string
          created_at?: string
          id?: string
          plot_id?: string
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      plot_views: {
        Row: {
          id: string
          plot_id: string
          session_id: string | null
          viewed_at: string
          viewer_id: string | null
        }
        Insert: {
          id?: string
          plot_id: string
          session_id?: string | null
          viewed_at?: string
          viewer_id?: string | null
        }
        Update: {
          id?: string
          plot_id?: string
          session_id?: string | null
          viewed_at?: string
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plot_views_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      plots: {
        Row: {
          amenities: string[] | null
          area: string
          availability_status: string | null
          bathrooms: number | null
          bedrooms: number | null
          booking_amount: number | null
          boost_expires_at: string | null
          city: string | null
          created_at: string
          description: string | null
          dimensions: string | null
          doc_7_12: string | null
          doc_layout_map: string | null
          doc_noc: string | null
          doc_rera: string | null
          doc_sale_deed: string | null
          doc_tax_receipt: string | null
          doc_title_deed: string | null
          drone_view_url: string | null
          encumbrance_status: string | null
          exact_address: string | null
          gated_project_name: string | null
          google_map_pin: string | null
          gst_applicable: boolean | null
          has_cctv: boolean | null
          has_clubhouse: boolean | null
          has_compound_wall: boolean | null
          has_drainage: boolean | null
          has_electricity: boolean | null
          has_fencing: boolean | null
          has_garden: boolean | null
          has_internal_roads: boolean | null
          has_parking: boolean | null
          has_rainwater_harvesting: boolean | null
          has_security_gate: boolean | null
          has_street_lights: boolean | null
          has_water_supply: boolean | null
          id: string
          image_url: string | null
          images: string[] | null
          inquiries_count: number | null
          is_boosted: boolean | null
          is_gated: boolean | null
          is_negotiable: boolean | null
          is_premium_listing: boolean | null
          is_urgent_sale: boolean | null
          is_verified: boolean | null
          is_verified_owner: boolean | null
          kyc_aadhaar_back: string | null
          kyc_aadhaar_front: string | null
          kyc_gst: string | null
          kyc_pan: string | null
          land_classification: string | null
          layout_plan_url: string | null
          listing_score: number | null
          listing_status: string | null
          loan_available: boolean | null
          loan_banks: string | null
          locality: string | null
          location: string
          nearby_landmark: string | null
          ownership_type: string | null
          phone_primary: string | null
          phone_secondary: string | null
          plot_area_unit: string | null
          plot_area_value: number | null
          plot_facing: string | null
          plot_length: string | null
          plot_shape: string | null
          plot_type: string
          plot_width: string | null
          possession_timeline: string | null
          price: number
          price_per_unit: number | null
          property_status: string | null
          reason_for_selling: string | null
          road_access: boolean | null
          road_width: string | null
          saves_count: number | null
          seller_email: string | null
          seller_name: string | null
          seller_profile_photo: string | null
          seller_type: string | null
          state: string | null
          status: string | null
          taluka: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string | null
          views_count: number | null
          virtual_tour_360_url: string | null
          virtual_tour_url: string | null
          walkthrough_video_url: string | null
          year_built: number | null
          zone_type: string | null
        }
        Insert: {
          amenities?: string[] | null
          area: string
          availability_status?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_amount?: number | null
          boost_expires_at?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          doc_7_12?: string | null
          doc_layout_map?: string | null
          doc_noc?: string | null
          doc_rera?: string | null
          doc_sale_deed?: string | null
          doc_tax_receipt?: string | null
          doc_title_deed?: string | null
          drone_view_url?: string | null
          encumbrance_status?: string | null
          exact_address?: string | null
          gated_project_name?: string | null
          google_map_pin?: string | null
          gst_applicable?: boolean | null
          has_cctv?: boolean | null
          has_clubhouse?: boolean | null
          has_compound_wall?: boolean | null
          has_drainage?: boolean | null
          has_electricity?: boolean | null
          has_fencing?: boolean | null
          has_garden?: boolean | null
          has_internal_roads?: boolean | null
          has_parking?: boolean | null
          has_rainwater_harvesting?: boolean | null
          has_security_gate?: boolean | null
          has_street_lights?: boolean | null
          has_water_supply?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inquiries_count?: number | null
          is_boosted?: boolean | null
          is_gated?: boolean | null
          is_negotiable?: boolean | null
          is_premium_listing?: boolean | null
          is_urgent_sale?: boolean | null
          is_verified?: boolean | null
          is_verified_owner?: boolean | null
          kyc_aadhaar_back?: string | null
          kyc_aadhaar_front?: string | null
          kyc_gst?: string | null
          kyc_pan?: string | null
          land_classification?: string | null
          layout_plan_url?: string | null
          listing_score?: number | null
          listing_status?: string | null
          loan_available?: boolean | null
          loan_banks?: string | null
          locality?: string | null
          location: string
          nearby_landmark?: string | null
          ownership_type?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          plot_area_unit?: string | null
          plot_area_value?: number | null
          plot_facing?: string | null
          plot_length?: string | null
          plot_shape?: string | null
          plot_type: string
          plot_width?: string | null
          possession_timeline?: string | null
          price: number
          price_per_unit?: number | null
          property_status?: string | null
          reason_for_selling?: string | null
          road_access?: boolean | null
          road_width?: string | null
          saves_count?: number | null
          seller_email?: string | null
          seller_name?: string | null
          seller_profile_photo?: string | null
          seller_type?: string | null
          state?: string | null
          status?: string | null
          taluka?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url?: string | null
          views_count?: number | null
          virtual_tour_360_url?: string | null
          virtual_tour_url?: string | null
          walkthrough_video_url?: string | null
          year_built?: number | null
          zone_type?: string | null
        }
        Update: {
          amenities?: string[] | null
          area?: string
          availability_status?: string | null
          bathrooms?: number | null
          bedrooms?: number | null
          booking_amount?: number | null
          boost_expires_at?: string | null
          city?: string | null
          created_at?: string
          description?: string | null
          dimensions?: string | null
          doc_7_12?: string | null
          doc_layout_map?: string | null
          doc_noc?: string | null
          doc_rera?: string | null
          doc_sale_deed?: string | null
          doc_tax_receipt?: string | null
          doc_title_deed?: string | null
          drone_view_url?: string | null
          encumbrance_status?: string | null
          exact_address?: string | null
          gated_project_name?: string | null
          google_map_pin?: string | null
          gst_applicable?: boolean | null
          has_cctv?: boolean | null
          has_clubhouse?: boolean | null
          has_compound_wall?: boolean | null
          has_drainage?: boolean | null
          has_electricity?: boolean | null
          has_fencing?: boolean | null
          has_garden?: boolean | null
          has_internal_roads?: boolean | null
          has_parking?: boolean | null
          has_rainwater_harvesting?: boolean | null
          has_security_gate?: boolean | null
          has_street_lights?: boolean | null
          has_water_supply?: boolean | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          inquiries_count?: number | null
          is_boosted?: boolean | null
          is_gated?: boolean | null
          is_negotiable?: boolean | null
          is_premium_listing?: boolean | null
          is_urgent_sale?: boolean | null
          is_verified?: boolean | null
          is_verified_owner?: boolean | null
          kyc_aadhaar_back?: string | null
          kyc_aadhaar_front?: string | null
          kyc_gst?: string | null
          kyc_pan?: string | null
          land_classification?: string | null
          layout_plan_url?: string | null
          listing_score?: number | null
          listing_status?: string | null
          loan_available?: boolean | null
          loan_banks?: string | null
          locality?: string | null
          location?: string
          nearby_landmark?: string | null
          ownership_type?: string | null
          phone_primary?: string | null
          phone_secondary?: string | null
          plot_area_unit?: string | null
          plot_area_value?: number | null
          plot_facing?: string | null
          plot_length?: string | null
          plot_shape?: string | null
          plot_type?: string
          plot_width?: string | null
          possession_timeline?: string | null
          price?: number
          price_per_unit?: number | null
          property_status?: string | null
          reason_for_selling?: string | null
          road_access?: boolean | null
          road_width?: string | null
          saves_count?: number | null
          seller_email?: string | null
          seller_name?: string | null
          seller_profile_photo?: string | null
          seller_type?: string | null
          state?: string | null
          status?: string | null
          taluka?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string | null
          views_count?: number | null
          virtual_tour_360_url?: string | null
          virtual_tour_url?: string | null
          walkthrough_video_url?: string | null
          year_built?: number | null
          zone_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_plots: {
        Row: {
          id: string
          plot_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          id?: string
          plot_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          id?: string
          plot_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_plots_plot_id_fkey"
            columns: ["plot_id"]
            isOneToOne: false
            referencedRelation: "plots"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
