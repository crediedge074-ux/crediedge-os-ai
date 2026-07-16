// This file is a schema snapshot retained until the Supabase CLI can be run against the configured project.
// Replace its contents with: npm run types:generate
// Do not add application-specific aliases here; keep those in database.types.ts.

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          job_title: string | null;
          last_login: string | null;
          is_active: boolean;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          job_title?: string | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          job_title?: string | null;
          updated_at?: string;
        };
      };
      businesses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          slug: string | null;
          logo_url: string | null;
          industry: string | null;
          business_size: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          address_line_1: string | null;
          address_line_2: string | null;
          city: string | null;
          county: string | null;
          postcode: string | null;
          country: string | null;
          timezone: string | null;
          currency: string | null;
          status: string;
          subscription_plan: string | null;
          subscription_status: string | null;
          trial_ends_at: string | null;
          is_active: boolean;
          vat_number: string | null;
        };
        Insert: {
          name: string;
          industry?: string | null;
          timezone?: string | null;
          currency?: string | null;
          subscription_plan?: string | null;
        };
        Update: {
          name?: string;
          industry?: string | null;
          website?: string | null;
          email?: string | null;
          phone?: string | null;
          address_line_1?: string | null;
          city?: string | null;
          county?: string | null;
          postcode?: string | null;
          country?: string | null;
          timezone?: string | null;
          currency?: string | null;
          vat_number?: string | null;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          user_id: string;
          role: string;
          status: string;
          joined_at: string;
          invited_by: string | null;
        };
        Insert: {
          business_id: string;
          user_id: string;
          role?: string;
          status?: string;
        };
        Update: {
          role?: string;
          status?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          theme: string;
          language: string;
          timezone: string | null;
          currency: string | null;
          date_format: string;
          time_format: string;
          week_start: number;
          ai_enabled: boolean;
          email_notifications: boolean;
          push_notifications: boolean;
          sms_notifications: boolean;
          daily_briefing: boolean;
          weekly_report: boolean;
          marketing_emails: boolean;
          logo_url: string | null;
          brand_colour: string | null;
          accent_colour: string | null;
          compact_mode: boolean;
          ai_provider: string;
          ai_model: string;
          ai_creativity: number;
          business_context: string | null;
        };
        Insert: {
          business_id: string;
          theme?: string;
          ai_enabled?: boolean;
          email_notifications?: boolean;
          push_notifications?: boolean;
          sms_notifications?: boolean;
          daily_briefing?: boolean;
          weekly_report?: boolean;
          accent_colour?: string | null;
        };
        Update: {
          theme?: string;
          ai_enabled?: boolean;
          email_notifications?: boolean;
          push_notifications?: boolean;
          sms_notifications?: boolean;
          daily_briefing?: boolean;
          weekly_report?: boolean;
          marketing_emails?: boolean;
          accent_colour?: string | null;
          compact_mode?: boolean;
          ai_provider?: string;
          ai_model?: string;
          ai_creativity?: number;
          business_context?: string | null;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          first_name: string | null;
          last_name: string | null;
          full_name: string | null;
          company_name: string | null;
          email: string | null;
          phone: string | null;
          secondary_phone: string | null;
          address: string | null;
          city: string | null;
          county: string | null;
          postcode: string | null;
          country: string | null;
          date_of_birth: string | null;
          customer_type: string;
          status: string;
          source: string | null;
          notes: string | null;
          tags: string[];
          preferred_contact_method: string | null;
          marketing_consent: boolean;
          gdpr_consent: boolean;
          lifetime_value: number;
          last_contacted_at: string | null;
          last_booking_at: string | null;
          customer_since: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          business_id: string;
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          company_name?: string | null;
          email?: string | null;
          phone?: string | null;
          secondary_phone?: string | null;
          address?: string | null;
          city?: string | null;
          county?: string | null;
          postcode?: string | null;
          country?: string | null;
          date_of_birth?: string | null;
          customer_type?: string;
          status?: string;
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          preferred_contact_method?: string | null;
          marketing_consent?: boolean;
          gdpr_consent?: boolean;
          lifetime_value?: number;
          last_contacted_at?: string | null;
          last_booking_at?: string | null;
          customer_since?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          company_name?: string | null;
          email?: string | null;
          phone?: string | null;
          secondary_phone?: string | null;
          address?: string | null;
          city?: string | null;
          county?: string | null;
          postcode?: string | null;
          country?: string | null;
          date_of_birth?: string | null;
          customer_type?: string;
          status?: string;
          source?: string | null;
          notes?: string | null;
          tags?: string[];
          preferred_contact_method?: string | null;
          marketing_consent?: boolean;
          gdpr_consent?: boolean;
          lifetime_value?: number;
          last_contacted_at?: string | null;
          last_booking_at?: string | null;
          customer_since?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          updated_by?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];
export type Business = Database["public"]["Tables"]["businesses"]["Row"];
export type BusinessUpdate = Database["public"]["Tables"]["businesses"]["Update"];
export type Membership = Database["public"]["Tables"]["memberships"]["Row"];
export type BusinessSettings = Database["public"]["Tables"]["settings"]["Row"];
export type BusinessSettingsUpdate = Database["public"]["Tables"]["settings"]["Update"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type CustomerUpdate = Database["public"]["Tables"]["customers"]["Update"];
