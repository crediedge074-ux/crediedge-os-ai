export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

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
          last_login?: string | null;
          is_active?: boolean;
        };
        Update: {
          first_name?: string | null;
          last_name?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          job_title?: string | null;
          last_login?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
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
          vat_number?: string | null;
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
        Relationships: [];
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
        Relationships: [];
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
          compact_mode?: boolean;
          ai_provider?: string;
          ai_model?: string;
          ai_creativity?: number;
          business_context?: string | null;
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
        Relationships: [];
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
        Relationships: [];
      };
      jobs: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          customer_id: string | null;
          job_number: string;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          estimated_amount: number;
          target_start_date: string | null;
          target_completion_date: string | null;
          completed_at: string | null;
          assigned_to: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_number: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          estimated_amount?: number;
          target_start_date?: string | null;
          target_completion_date?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_number?: string;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          estimated_amount?: number;
          target_start_date?: string | null;
          target_completion_date?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          title: string;
          description: string | null;
          status: string;
          priority: string;
          due_date: string | null;
          completed_at: string | null;
          assigned_to: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          title?: string;
          description?: string | null;
          status?: string;
          priority?: string;
          due_date?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      calendar_events: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          task_id: string | null;
          title: string;
          description: string | null;
          event_type: string;
          start_time: string;
          end_time: string;
          is_all_day: boolean;
          location: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          task_id?: string | null;
          title: string;
          description?: string | null;
          event_type?: string;
          start_time: string;
          end_time: string;
          is_all_day?: boolean;
          location?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          task_id?: string | null;
          title?: string;
          description?: string | null;
          event_type?: string;
          start_time?: string;
          end_time?: string;
          is_all_day?: boolean;
          location?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      invoices: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          invoice_number: string;
          status: string;
          issue_date: string;
          due_date: string;
          subtotal: number;
          tax_amount: number;
          discount_amount: number;
          total_amount: number;
          amount_paid: number;
          notes: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          invoice_number: string;
          status?: string;
          issue_date?: string;
          due_date: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          amount_paid?: number;
          notes?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          invoice_number?: string;
          status?: string;
          issue_date?: string;
          due_date?: string;
          subtotal?: number;
          tax_amount?: number;
          discount_amount?: number;
          total_amount?: number;
          amount_paid?: number;
          notes?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          invoice_id: string | null;
          type: string;
          amount: number;
          payment_method: string | null;
          payment_date: string;
          reference: string | null;
          description: string | null;
          category: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          invoice_id?: string | null;
          type?: string;
          amount?: number;
          payment_method?: string | null;
          payment_date?: string;
          reference?: string | null;
          description?: string | null;
          category?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          invoice_id?: string | null;
          type?: string;
          amount?: number;
          payment_method?: string | null;
          payment_date?: string;
          reference?: string | null;
          description?: string | null;
          category?: string | null;
        };
        Relationships: [];
      };
      communications: {
        Row: {
          id: string;
          created_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          channel: string;
          direction: string;
          subject: string | null;
          body: string;
          sentiment: string | null;
          read_at: string | null;
          created_by: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          channel?: string;
          direction?: string;
          subject?: string | null;
          body: string;
          sentiment?: string | null;
          read_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          channel?: string;
          direction?: string;
          subject?: string | null;
          body?: string;
          sentiment?: string | null;
          read_at?: string | null;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          rating: number | null;
          feedback: string | null;
          source: string | null;
          status: string;
          requested_at: string | null;
          submitted_at: string | null;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          rating?: number | null;
          feedback?: string | null;
          source?: string | null;
          status?: string;
          requested_at?: string | null;
          submitted_at?: string | null;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          rating?: number | null;
          feedback?: string | null;
          source?: string | null;
          status?: string;
          requested_at?: string | null;
          submitted_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          created_at: string;
          business_id: string;
          user_id: string | null;
          type: string;
          title: string;
          message: string;
          action_url: string | null;
          is_read: boolean;
        };
        Insert: {
          business_id: string;
          user_id?: string | null;
          type?: string;
          title: string;
          message: string;
          action_url?: string | null;
          is_read?: boolean;
        };
        Update: {
          user_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          action_url?: string | null;
          is_read?: boolean;
        };
        Relationships: [];
      };
      activity_logs: {
        Row: {
          id: string;
          created_at: string;
          business_id: string;
          customer_id: string | null;
          job_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action: string;
          description: string;
          actor_id: string | null;
          metadata: Json;
        };
        Insert: {
          business_id: string;
          customer_id?: string | null;
          job_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action: string;
          description: string;
          actor_id?: string | null;
          metadata?: Json;
        };
        Update: {
          customer_id?: string | null;
          job_id?: string | null;
          entity_type?: string;
          entity_id?: string | null;
          action?: string;
          description?: string;
          actor_id?: string | null;
          metadata?: Json;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
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

export type Job = Database["public"]["Tables"]["jobs"]["Row"];
export type JobInsert = Database["public"]["Tables"]["jobs"]["Insert"];
export type JobUpdate = Database["public"]["Tables"]["jobs"]["Update"];

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskInsert = Database["public"]["Tables"]["tasks"]["Insert"];
export type TaskUpdate = Database["public"]["Tables"]["tasks"]["Update"];

export type CalendarEvent = Database["public"]["Tables"]["calendar_events"]["Row"];
export type CalendarEventInsert = Database["public"]["Tables"]["calendar_events"]["Insert"];
export type CalendarEventUpdate = Database["public"]["Tables"]["calendar_events"]["Update"];

export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceInsert = Database["public"]["Tables"]["invoices"]["Insert"];
export type InvoiceUpdate = Database["public"]["Tables"]["invoices"]["Update"];

export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type PaymentInsert = Database["public"]["Tables"]["payments"]["Insert"];

export type Communication = Database["public"]["Tables"]["communications"]["Row"];
export type CommunicationInsert = Database["public"]["Tables"]["communications"]["Insert"];

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export type AppNotification = Database["public"]["Tables"]["notifications"]["Row"];
export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"];
