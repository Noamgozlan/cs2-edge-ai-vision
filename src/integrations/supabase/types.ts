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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      cs2_matches: {
        Row: {
          created_at: string
          id: string
          is_stale: boolean
          last_updated_utc: string
          map: string | null
          match_format: string
          score: string | null
          source: string
          source_match_id: string | null
          start_time_utc: string | null
          status: string
          team1_id: string | null
          team1_logo: string | null
          team1_name: string
          team1_rank: number | null
          team2_id: string | null
          team2_logo: string | null
          team2_name: string
          team2_rank: number | null
          tournament_id: string | null
          tournament_name: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_stale?: boolean
          last_updated_utc?: string
          map?: string | null
          match_format?: string
          score?: string | null
          source?: string
          source_match_id?: string | null
          start_time_utc?: string | null
          status?: string
          team1_id?: string | null
          team1_logo?: string | null
          team1_name: string
          team1_rank?: number | null
          team2_id?: string | null
          team2_logo?: string | null
          team2_name: string
          team2_rank?: number | null
          tournament_id?: string | null
          tournament_name?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_stale?: boolean
          last_updated_utc?: string
          map?: string | null
          match_format?: string
          score?: string | null
          source?: string
          source_match_id?: string | null
          start_time_utc?: string | null
          status?: string
          team1_id?: string | null
          team1_logo?: string | null
          team1_name?: string
          team1_rank?: number | null
          team2_id?: string | null
          team2_logo?: string | null
          team2_name?: string
          team2_rank?: number | null
          tournament_id?: string | null
          tournament_name?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cs2_matches_team1_id_fkey"
            columns: ["team1_id"]
            isOneToOne: false
            referencedRelation: "cs2_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cs2_matches_team2_id_fkey"
            columns: ["team2_id"]
            isOneToOne: false
            referencedRelation: "cs2_teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cs2_matches_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "cs2_tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      cs2_teams: {
        Row: {
          country: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          ranking: number | null
          short_name: string | null
          updated_at: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          ranking?: number | null
          short_name?: string | null
          updated_at?: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          ranking?: number | null
          short_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cs2_tournaments: {
        Row: {
          created_at: string
          end_date: string | null
          id: string
          logo_url: string | null
          name: string
          start_date: string | null
          tier: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          end_date?: string | null
          id?: string
          logo_url?: string | null
          name: string
          start_date?: string | null
          tier?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          end_date?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          start_date?: string | null
          tier?: string | null
          url?: string | null
        }
        Relationships: []
      }
      demo_bets: {
        Row: {
          created_at: string
          event: string
          id: string
          match_id: string
          odds_at_bet: number
          payout: number
          result: string
          stake: number
          team_picked: string
          team1: string
          team2: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event?: string
          id?: string
          match_id: string
          odds_at_bet?: number
          payout?: number
          result?: string
          stake?: number
          team_picked: string
          team1: string
          team2: string
          user_id: string
        }
        Update: {
          created_at?: string
          event?: string
          id?: string
          match_id?: string
          odds_at_bet?: number
          payout?: number
          result?: string
          stake?: number
          team_picked?: string
          team1?: string
          team2?: string
          user_id?: string
        }
        Relationships: []
      }
      prediction_tracking: {
        Row: {
          actual_result: string | null
          ai_pick: string
          bet_type: string
          confidence: number
          created_at: string
          data_source: string
          event: string
          id: string
          match_id: string
          odds_at_prediction: number
          payout: number
          recommended_bet: string
          stake: number
          team1: string
          team2: string
          user_id: string
        }
        Insert: {
          actual_result?: string | null
          ai_pick: string
          bet_type?: string
          confidence?: number
          created_at?: string
          data_source?: string
          event?: string
          id?: string
          match_id: string
          odds_at_prediction?: number
          payout?: number
          recommended_bet: string
          stake?: number
          team1: string
          team2: string
          user_id: string
        }
        Update: {
          actual_result?: string | null
          ai_pick?: string
          bet_type?: string
          confidence?: number
          created_at?: string
          data_source?: string
          event?: string
          id?: string
          match_id?: string
          odds_at_prediction?: number
          payout?: number
          recommended_bet?: string
          stake?: number
          team1?: string
          team2?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          username?: string | null
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
    Enums: {},
  },
} as const
