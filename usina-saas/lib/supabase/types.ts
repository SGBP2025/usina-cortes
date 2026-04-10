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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      generated_clips: {
        Row: {
          created_at: string
          duration: number | null
          end_time: number | null
          id: string
          instagram_description: string | null
          job_id: string
          start_time: number | null
          storage_path: string
          tiktok_description: string | null
          video_file_id: string | null
          youtube_title: string | null
        }
        Insert: {
          created_at?: string
          duration?: number | null
          end_time?: number | null
          id?: string
          instagram_description?: string | null
          job_id: string
          start_time?: number | null
          storage_path: string
          tiktok_description?: string | null
          video_file_id?: string | null
          youtube_title?: string | null
        }
        Update: {
          created_at?: string
          duration?: number | null
          end_time?: number | null
          id?: string
          instagram_description?: string | null
          job_id?: string
          start_time?: number | null
          storage_path?: string
          tiktok_description?: string | null
          video_file_id?: string | null
          youtube_title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_clips_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "processing_jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "generated_clips_video_file_id_fkey"
            columns: ["video_file_id"]
            isOneToOne: false
            referencedRelation: "video_files"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_brl: number
          created_at: string
          id: string
          status: string
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_brl: number
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_brl?: number
          created_at?: string
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          concurrent_jobs: number
          created_at: string
          id: string
          included_minutes: number
          name: string
          price_per_minute: number
        }
        Insert: {
          concurrent_jobs?: number
          created_at?: string
          id: string
          included_minutes?: number
          name: string
          price_per_minute: number
        }
        Update: {
          concurrent_jobs?: number
          created_at?: string
          id?: string
          included_minutes?: number
          name?: string
          price_per_minute?: number
        }
        Relationships: []
      }
      processing_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          credits_consumed: number | null
          error_message: string | null
          id: string
          started_at: string | null
          status: Database["public"]["Enums"]["job_status"]
          user_id: string
          video_file_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          credits_consumed?: number | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          user_id: string
          video_file_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          credits_consumed?: number | null
          error_message?: string | null
          id?: string
          started_at?: string | null
          status?: Database["public"]["Enums"]["job_status"]
          user_id?: string
          video_file_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processing_jobs_video_file_id_fkey"
            columns: ["video_file_id"]
            isOneToOne: false
            referencedRelation: "video_files"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_metrics: {
        Row: {
          cost_usd: number | null
          created_at: string
          duration_seconds: number | null
          id: string
          job_id: string | null
          service: Database["public"]["Enums"]["ai_service"]
          user_id: string
        }
        Insert: {
          cost_usd?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          job_id?: string | null
          service: Database["public"]["Enums"]["ai_service"]
          user_id: string
        }
        Update: {
          cost_usd?: number | null
          created_at?: string
          duration_seconds?: number | null
          id?: string
          job_id?: string | null
          service?: Database["public"]["Enums"]["ai_service"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "processing_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credits: {
        Row: {
          balance_minutes: number
          id: string
          plan_id: string
          total_consumed: number
          total_purchased: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance_minutes?: number
          id?: string
          plan_id: string
          total_consumed?: number
          total_purchased?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance_minutes?: number
          id?: string
          plan_id?: string
          total_consumed?: number
          total_purchased?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_credits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      video_files: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: string
          original_name: string
          size_bytes: number | null
          storage_path: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          original_name: string
          size_bytes?: number | null
          storage_path: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: string
          original_name?: string
          size_bytes?: number | null
          storage_path?: string
          user_id?: string
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
      ai_service: "whisper" | "claude" | "ffmpeg"
      job_status: "pending" | "processing" | "completed" | "error" | "cancelled"
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
      ai_service: ["whisper", "claude", "ffmpeg"],
      job_status: ["pending", "processing", "completed", "error", "cancelled"],
    },
  },
} as const
