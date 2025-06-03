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
      ai_suggestions: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          is_applied: boolean | null
          original_text: string | null
          resume_id: string | null
          section: string | null
          suggested_text: string | null
          suggestion_type: string
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          is_applied?: boolean | null
          original_text?: string | null
          resume_id?: string | null
          section?: string | null
          suggested_text?: string | null
          suggestion_type: string
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          is_applied?: boolean | null
          original_text?: string | null
          resume_id?: string | null
          section?: string | null
          suggested_text?: string | null
          suggestion_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_suggestions_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      cover_letters: {
        Row: {
          company_name: string | null
          content: string
          created_at: string
          id: string
          position_title: string | null
          resume_id: string | null
          template_id: number | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          content: string
          created_at?: string
          id?: string
          position_title?: string | null
          resume_id?: string | null
          template_id?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          content?: string
          created_at?: string
          id?: string
          position_title?: string | null
          resume_id?: string | null
          template_id?: number | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cover_letters_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_templates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          template_data: Json
          updated_at: string
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          template_data: Json
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          template_data?: Json
          updated_at?: string
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      cv_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          resume_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          resume_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          resume_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_analytics_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          application_date: string
          company_name: string
          created_at: string
          id: string
          job_url: string | null
          notes: string | null
          position_title: string
          resume_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_date?: string
          company_name: string
          created_at?: string
          id?: string
          job_url?: string | null
          notes?: string | null
          position_title: string
          resume_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_date?: string
          company_name?: string
          created_at?: string
          id?: string
          job_url?: string | null
          notes?: string | null
          position_title?: string
          resume_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      resumes: {
        Row: {
          certifications: Json
          created_at: string | null
          education: Json
          experience: Json
          id: string
          interests: Json | null
          is_public: boolean | null
          languages: Json | null
          personal_info: Json
          projects: Json | null
          skills: Json
          template_id: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certifications?: Json
          created_at?: string | null
          education?: Json
          experience?: Json
          id?: string
          interests?: Json | null
          is_public?: boolean | null
          languages?: Json | null
          personal_info?: Json
          projects?: Json | null
          skills?: Json
          template_id?: number
          title?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certifications?: Json
          created_at?: string | null
          education?: Json
          experience?: Json
          id?: string
          interests?: Json | null
          is_public?: boolean | null
          languages?: Json | null
          personal_info?: Json
          projects?: Json | null
          skills?: Json
          template_id?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      skill_market_data: {
        Row: {
          demand_score: number | null
          growth_trend: string | null
          id: string
          industry_relevance: Json | null
          last_updated: string
          salary_range: Json | null
          skill_name: string
        }
        Insert: {
          demand_score?: number | null
          growth_trend?: string | null
          id?: string
          industry_relevance?: Json | null
          last_updated?: string
          salary_range?: Json | null
          skill_name: string
        }
        Update: {
          demand_score?: number | null
          growth_trend?: string | null
          id?: string
          industry_relevance?: Json | null
          last_updated?: string
          salary_range?: Json | null
          skill_name?: string
        }
        Relationships: []
      }
      template_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          level: string
          name: string
          template_data: Json
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          name: string
          template_data: Json
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          name?: string
          template_data?: Json
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          ai_suggestions_enabled: boolean | null
          auto_formatting_enabled: boolean | null
          brand_colors: Json | null
          created_at: string
          default_font: string | null
          id: string
          social_links: Json | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_suggestions_enabled?: boolean | null
          auto_formatting_enabled?: boolean | null
          brand_colors?: Json | null
          created_at?: string
          default_font?: string | null
          id?: string
          social_links?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_suggestions_enabled?: boolean | null
          auto_formatting_enabled?: boolean | null
          brand_colors?: Json | null
          created_at?: string
          default_font?: string | null
          id?: string
          social_links?: Json | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
