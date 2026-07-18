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
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          logo_url: string | null;
          website: string | null;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          logo_url?: string | null;
          website?: string | null;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      organization_members: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'organizer' | 'staff';
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'organizer' | 'staff';
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          user_id?: string;
          role?: 'owner' | 'admin' | 'organizer' | 'staff';
          joined_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'organization_members_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'organization_members_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      events: {
        Row: {
          id: string;
          organization_id: string;
          created_by: string;
          title: string;
          slug: string;
          description: string | null;
          event_type:
            | 'conference'
            | 'workshop'
            | 'seminar'
            | 'webinar'
            | 'exhibition'
            | 'meetup'
            | 'corporate'
            | 'government'
            | 'academic'
            | 'other';
          status: 'draft' | 'published' | 'cancelled' | 'completed';
          venue_name: string | null;
          venue_address: string | null;
          timezone: string;
          starts_at: string;
          ends_at: string;
          registration_opens_at: string | null;
          registration_closes_at: string | null;
          max_attendees: number | null;
          settings: Json;
          landing_page_config: Json | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          created_by: string;
          title: string;
          slug: string;
          description?: string | null;
          event_type:
            | 'conference'
            | 'workshop'
            | 'seminar'
            | 'webinar'
            | 'exhibition'
            | 'meetup'
            | 'corporate'
            | 'government'
            | 'academic'
            | 'other';
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          venue_name?: string | null;
          venue_address?: string | null;
          timezone?: string;
          starts_at: string;
          ends_at: string;
          registration_opens_at?: string | null;
          registration_closes_at?: string | null;
          max_attendees?: number | null;
          settings?: Json;
          landing_page_config?: Json | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          created_by?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          event_type?:
            | 'conference'
            | 'workshop'
            | 'seminar'
            | 'webinar'
            | 'exhibition'
            | 'meetup'
            | 'corporate'
            | 'government'
            | 'academic'
            | 'other';
          status?: 'draft' | 'published' | 'cancelled' | 'completed';
          venue_name?: string | null;
          venue_address?: string | null;
          timezone?: string;
          starts_at?: string;
          ends_at?: string;
          registration_opens_at?: string | null;
          registration_closes_at?: string | null;
          max_attendees?: number | null;
          settings?: Json;
          landing_page_config?: Json | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'events_created_by_fkey';
            columns: ['created_by'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'events_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      registration_forms: {
        Row: {
          id: string;
          event_id: string;
          organization_id: string;
          title: string;
          description: string | null;
          is_active: boolean;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          organization_id: string;
          title: string;
          description?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          organization_id?: string;
          title?: string;
          description?: string | null;
          is_active?: boolean;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'registration_forms_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registration_forms_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      form_fields: {
        Row: {
          id: string;
          form_id: string;
          field_type:
            | 'text'
            | 'email'
            | 'phone'
            | 'textarea'
            | 'select'
            | 'multi_select'
            | 'checkbox'
            | 'radio'
            | 'date'
            | 'number'
            | 'url'
            | 'file';
          label: string;
          placeholder: string | null;
          is_required: boolean;
          options: Json;
          validation_rules: Json;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          form_id: string;
          field_type:
            | 'text'
            | 'email'
            | 'phone'
            | 'textarea'
            | 'select'
            | 'multi_select'
            | 'checkbox'
            | 'radio'
            | 'date'
            | 'number'
            | 'url'
            | 'file';
          label: string;
          placeholder?: string | null;
          is_required?: boolean;
          options?: Json;
          validation_rules?: Json;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          form_id?: string;
          field_type?:
            | 'text'
            | 'email'
            | 'phone'
            | 'textarea'
            | 'select'
            | 'multi_select'
            | 'checkbox'
            | 'radio'
            | 'date'
            | 'number'
            | 'url'
            | 'file';
          label?: string;
          placeholder?: string | null;
          is_required?: boolean;
          options?: Json;
          validation_rules?: Json;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'form_fields_form_id_fkey';
            columns: ['form_id'];
            referencedRelation: 'registration_forms';
            referencedColumns: ['id'];
          },
        ];
      };
      registrations: {
        Row: {
          id: string;
          event_id: string;
          organization_id: string;
          form_id: string;
          confirmation_number: string;
          email: string;
          full_name: string;
          status:
            | 'pending'
            | 'confirmed'
            | 'cancelled'
            | 'waitlisted'
            | 'checked_in';
          metadata: Json;
          registered_at: string;
          cancelled_at: string | null;
          checked_in_at: string | null;
        };
        Insert: {
          id?: string;
          event_id: string;
          organization_id: string;
          form_id: string;
          confirmation_number: string;
          email: string;
          full_name: string;
          status?:
            | 'pending'
            | 'confirmed'
            | 'cancelled'
            | 'waitlisted'
            | 'checked_in';
          metadata?: Json;
          registered_at?: string;
          cancelled_at?: string | null;
          checked_in_at?: string | null;
        };
        Update: {
          id?: string;
          event_id?: string;
          organization_id?: string;
          form_id?: string;
          confirmation_number?: string;
          email?: string;
          full_name?: string;
          status?:
            | 'pending'
            | 'confirmed'
            | 'cancelled'
            | 'waitlisted'
            | 'checked_in';
          metadata?: Json;
          registered_at?: string;
          cancelled_at?: string | null;
          checked_in_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'registrations_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registrations_form_id_fkey';
            columns: ['form_id'];
            referencedRelation: 'registration_forms';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registrations_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
        ];
      };
      registration_responses: {
        Row: {
          id: string;
          registration_id: string;
          field_id: string;
          value: string | null;
        };
        Insert: {
          id?: string;
          registration_id: string;
          field_id: string;
          value?: string | null;
        };
        Update: {
          id?: string;
          registration_id?: string;
          field_id?: string;
          value?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'registration_responses_field_id_fkey';
            columns: ['field_id'];
            referencedRelation: 'form_fields';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'registration_responses_registration_id_fkey';
            columns: ['registration_id'];
            referencedRelation: 'registrations';
            referencedColumns: ['id'];
          },
        ];
      };
      qr_codes: {
        Row: {
          id: string;
          registration_id: string;
          event_id: string;
          organization_id: string;
          code: string;
          qr_image_url: string | null;
          is_used: boolean;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          event_id: string;
          organization_id: string;
          code: string;
          qr_image_url?: string | null;
          is_used?: boolean;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          registration_id?: string;
          event_id?: string;
          organization_id?: string;
          code?: string;
          qr_image_url?: string | null;
          is_used?: boolean;
          used_at?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'qr_codes_event_id_fkey';
            columns: ['event_id'];
            referencedRelation: 'events';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'qr_codes_organization_id_fkey';
            columns: ['organization_id'];
            referencedRelation: 'organizations';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'qr_codes_registration_id_fkey';
            columns: ['registration_id'];
            referencedRelation: 'registrations';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      can_admin_event: {
        Args: { target_event_id: string };
        Returns: boolean;
      };
      can_admin_registration: {
        Args: { target_registration_id: string };
        Returns: boolean;
      };
      can_manage_event: {
        Args: { target_event_id: string };
        Returns: boolean;
      };
      can_submit_registration_response: {
        Args: {
          target_registration_id: string;
          target_field_id: string;
        };
        Returns: boolean;
      };
      has_org_role: {
        Args: {
          target_organization_id: string;
          allowed_roles: string[];
        };
        Returns: boolean;
      };
      is_event_org_member: {
        Args: { target_event_id: string };
        Returns: boolean;
      };
      is_org_member: {
        Args: { target_organization_id: string };
        Returns: boolean;
      };
      is_registration_org_member: {
        Args: { target_registration_id: string };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

