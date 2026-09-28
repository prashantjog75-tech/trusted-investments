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
      data_providers: {
        Row: {
          code: string
          configured: boolean
          created_at: string
          enabled: boolean
          freshness_hours: number
          id: string
          last_successful_sync_at: string | null
          name: string
          next_scheduled_sync_at: string | null
          official_base_url: string | null
          provider_type: string
          schedule_cron: string | null
          status: string
          updated_at: string
        }
        Insert: {
          code: string
          configured?: boolean
          created_at?: string
          enabled?: boolean
          freshness_hours?: number
          id?: string
          last_successful_sync_at?: string | null
          name: string
          next_scheduled_sync_at?: string | null
          official_base_url?: string | null
          provider_type: string
          schedule_cron?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          code?: string
          configured?: boolean
          created_at?: string
          enabled?: boolean
          freshness_hours?: number
          id?: string
          last_successful_sync_at?: string | null
          name?: string
          next_scheduled_sync_at?: string | null
          official_base_url?: string | null
          provider_type?: string
          schedule_cron?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      fund_houses: {
        Row: {
          amfi_name: string | null
          created_at: string
          fetched_at: string | null
          id: string
          last_successful_fetched_at: string | null
          name: string
          official_website_url: string | null
          source_effective_date: string | null
          source_provider_id: string | null
          source_url: string | null
          status: string
          sync_run_id: string | null
          updated_at: string
        }
        Insert: {
          amfi_name?: string | null
          created_at?: string
          fetched_at?: string | null
          id?: string
          last_successful_fetched_at?: string | null
          name: string
          official_website_url?: string | null
          source_effective_date?: string | null
          source_provider_id?: string | null
          source_url?: string | null
          status?: string
          sync_run_id?: string | null
          updated_at?: string
        }
        Update: {
          amfi_name?: string | null
          created_at?: string
          fetched_at?: string | null
          id?: string
          last_successful_fetched_at?: string | null
          name?: string
          official_website_url?: string | null
          source_effective_date?: string | null
          source_provider_id?: string | null
          source_url?: string | null
          status?: string
          sync_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_houses_source_provider_id_fkey"
            columns: ["source_provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_houses_sync_run_fk"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      holdings: {
        Row: {
          allocation_percent: number | null
          checksum: string | null
          fetched_at: string
          id: string
          isin: string | null
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          sector: string | null
          security_name: string
          source_effective_date: string | null
          source_url: string
          status: string
          sync_run_id: string
        }
        Insert: {
          allocation_percent?: number | null
          checksum?: string | null
          fetched_at: string
          id?: string
          isin?: string | null
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          sector?: string | null
          security_name: string
          source_effective_date?: string | null
          source_url: string
          status?: string
          sync_run_id: string
        }
        Update: {
          allocation_percent?: number | null
          checksum?: string | null
          fetched_at?: string
          id?: string
          isin?: string | null
          last_successful_fetched_at?: string
          provider_id?: string
          scheme_id?: string
          sector?: string | null
          security_name?: string
          source_effective_date?: string | null
          source_url?: string
          status?: string
          sync_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "holdings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holdings_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "holdings_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      nav_history: {
        Row: {
          checksum: string | null
          fetched_at: string
          id: string
          nav: number
          nav_date: string
          provider_id: string
          scheme_id: string
          source_url: string
          sync_run_id: string
        }
        Insert: {
          checksum?: string | null
          fetched_at: string
          id?: string
          nav: number
          nav_date: string
          provider_id: string
          scheme_id: string
          source_url: string
          sync_run_id: string
        }
        Update: {
          checksum?: string | null
          fetched_at?: string
          id?: string
          nav?: number
          nav_date?: string
          provider_id?: string
          scheme_id?: string
          source_url?: string
          sync_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nav_history_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_history_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nav_history_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_allocations: {
        Row: {
          allocation_percent: number
          allocation_type: string
          checksum: string | null
          fetched_at: string
          id: string
          label: string
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          source_effective_date: string | null
          source_url: string
          status: string
          sync_run_id: string
        }
        Insert: {
          allocation_percent: number
          allocation_type: string
          checksum?: string | null
          fetched_at: string
          id?: string
          label: string
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          source_effective_date?: string | null
          source_url: string
          status?: string
          sync_run_id: string
        }
        Update: {
          allocation_percent?: number
          allocation_type?: string
          checksum?: string | null
          fetched_at?: string
          id?: string
          label?: string
          last_successful_fetched_at?: string
          provider_id?: string
          scheme_id?: string
          source_effective_date?: string | null
          source_url?: string
          status?: string
          sync_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_allocations_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_allocations_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_allocations_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_data_values: {
        Row: {
          checksum: string | null
          created_at: string
          display_value: string | null
          fetched_at: string
          field_name: string
          id: string
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          source_effective_date: string | null
          source_url: string
          status: string
          sync_run_id: string
          updated_at: string
          value_json: Json
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          display_value?: string | null
          fetched_at: string
          field_name: string
          id?: string
          last_successful_fetched_at: string
          provider_id: string
          scheme_id: string
          source_effective_date?: string | null
          source_url: string
          status?: string
          sync_run_id: string
          updated_at?: string
          value_json: Json
        }
        Update: {
          checksum?: string | null
          created_at?: string
          display_value?: string | null
          fetched_at?: string
          field_name?: string
          id?: string
          last_successful_fetched_at?: string
          provider_id?: string
          scheme_id?: string
          source_effective_date?: string | null
          source_url?: string
          status?: string
          sync_run_id?: string
          updated_at?: string
          value_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "scheme_data_values_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_data_values_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_data_values_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_documents: {
        Row: {
          checksum: string | null
          created_at: string
          disclosure_date: string | null
          document_type: string
          fetched_at: string | null
          fund_house_id: string | null
          id: string
          last_successful_fetched_at: string | null
          official_url: string | null
          provider_id: string
          scheme_id: string | null
          source_effective_date: string | null
          source_url: string | null
          status: string
          sync_run_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          checksum?: string | null
          created_at?: string
          disclosure_date?: string | null
          document_type: string
          fetched_at?: string | null
          fund_house_id?: string | null
          id?: string
          last_successful_fetched_at?: string | null
          official_url?: string | null
          provider_id: string
          scheme_id?: string | null
          source_effective_date?: string | null
          source_url?: string | null
          status?: string
          sync_run_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          checksum?: string | null
          created_at?: string
          disclosure_date?: string | null
          document_type?: string
          fetched_at?: string | null
          fund_house_id?: string | null
          id?: string
          last_successful_fetched_at?: string | null
          official_url?: string | null
          provider_id?: string
          scheme_id?: string | null
          source_effective_date?: string | null
          source_url?: string | null
          status?: string
          sync_run_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_documents_fund_house_id_fkey"
            columns: ["fund_house_id"]
            isOneToOne: false
            referencedRelation: "fund_houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_documents_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_documents_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheme_documents_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      schemes: {
        Row: {
          amfi_scheme_code: string | null
          benchmark: string | null
          category: string | null
          created_at: string
          exit_load: string | null
          fetched_at: string | null
          fund_house_id: string
          fund_manager: string | null
          id: string
          is_demonstration: boolean
          isin_payout_or_growth: string | null
          isin_reinvestment: string | null
          last_successful_fetched_at: string | null
          minimum_investment: number | null
          minimum_sip: number | null
          name: string
          option_name: string | null
          plan: string | null
          riskometer: string | null
          slug: string
          source_effective_date: string | null
          source_provider_id: string | null
          source_url: string | null
          status: string
          sub_category: string | null
          sync_run_id: string | null
          updated_at: string
        }
        Insert: {
          amfi_scheme_code?: string | null
          benchmark?: string | null
          category?: string | null
          created_at?: string
          exit_load?: string | null
          fetched_at?: string | null
          fund_house_id: string
          fund_manager?: string | null
          id?: string
          is_demonstration?: boolean
          isin_payout_or_growth?: string | null
          isin_reinvestment?: string | null
          last_successful_fetched_at?: string | null
          minimum_investment?: number | null
          minimum_sip?: number | null
          name: string
          option_name?: string | null
          plan?: string | null
          riskometer?: string | null
          slug: string
          source_effective_date?: string | null
          source_provider_id?: string | null
          source_url?: string | null
          status?: string
          sub_category?: string | null
          sync_run_id?: string | null
          updated_at?: string
        }
        Update: {
          amfi_scheme_code?: string | null
          benchmark?: string | null
          category?: string | null
          created_at?: string
          exit_load?: string | null
          fetched_at?: string | null
          fund_house_id?: string
          fund_manager?: string | null
          id?: string
          is_demonstration?: boolean
          isin_payout_or_growth?: string | null
          isin_reinvestment?: string | null
          last_successful_fetched_at?: string | null
          minimum_investment?: number | null
          minimum_sip?: number | null
          name?: string
          option_name?: string | null
          plan?: string | null
          riskometer?: string | null
          slug?: string
          source_effective_date?: string | null
          source_provider_id?: string | null
          source_url?: string | null
          status?: string
          sub_category?: string | null
          sync_run_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schemes_fund_house_id_fkey"
            columns: ["fund_house_id"]
            isOneToOne: false
            referencedRelation: "fund_houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schemes_source_provider_id_fkey"
            columns: ["source_provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schemes_sync_run_fk"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      source_snapshots: {
        Row: {
          checksum: string
          content_type: string | null
          fetched_at: string
          id: string
          metadata: Json
          provider_id: string
          record_count: number | null
          source_url: string
          sync_run_id: string
        }
        Insert: {
          checksum: string
          content_type?: string | null
          fetched_at: string
          id?: string
          metadata?: Json
          provider_id: string
          record_count?: number | null
          source_url: string
          sync_run_id: string
        }
        Update: {
          checksum?: string
          content_type?: string | null
          fetched_at?: string
          id?: string
          metadata?: Json
          provider_id?: string
          record_count?: number | null
          source_url?: string
          sync_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "source_snapshots_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "source_snapshots_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_failures: {
        Row: {
          affected_record_count: number
          affected_record_key: string | null
          error_category: string
          error_message: string
          id: string
          occurred_at: string
          provider_id: string
          retry_status: string
          source_url: string | null
          sync_run_id: string
        }
        Insert: {
          affected_record_count?: number
          affected_record_key?: string | null
          error_category: string
          error_message: string
          id?: string
          occurred_at?: string
          provider_id: string
          retry_status?: string
          source_url?: string | null
          sync_run_id: string
        }
        Update: {
          affected_record_count?: number
          affected_record_key?: string | null
          error_category?: string
          error_message?: string
          id?: string
          occurred_at?: string
          provider_id?: string
          retry_status?: string
          source_url?: string | null
          sync_run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_failures_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sync_failures_sync_run_id_fkey"
            columns: ["sync_run_id"]
            isOneToOne: false
            referencedRelation: "sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_runs: {
        Row: {
          created_at: string
          error_summary: string | null
          failed_source_count: number
          finished_at: string | null
          id: string
          provider_id: string
          records_created: number
          records_failed: number
          records_unchanged: number
          records_updated: number
          source_url: string | null
          started_at: string
          status: string
          trigger_type: string
        }
        Insert: {
          created_at?: string
          error_summary?: string | null
          failed_source_count?: number
          finished_at?: string | null
          id?: string
          provider_id: string
          records_created?: number
          records_failed?: number
          records_unchanged?: number
          records_updated?: number
          source_url?: string | null
          started_at?: string
          status?: string
          trigger_type?: string
        }
        Update: {
          created_at?: string
          error_summary?: string | null
          failed_source_count?: number
          finished_at?: string | null
          id?: string
          provider_id?: string
          records_created?: number
          records_failed?: number
          records_unchanged?: number
          records_updated?: number
          source_url?: string | null
          started_at?: string
          status?: string
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_runs_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "data_providers"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
