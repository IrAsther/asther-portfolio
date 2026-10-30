/**
 * Supabase Database TypeScript Definitions — Asther Irakaza Portfolio
 *
 * Generated directly from Supabase project: etjnlqhewraboapmnfdw
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProjectStatusType = "showcase" | "active" | "architecture" | "planned";
export type AppStatusType = "showcase" | "in-development" | "prototype" | "architecture" | "concept";

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string;
          id: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          id: string;
          role?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: string;
        };
        Relationships: [];
      };
      applications: {
        Row: {
          category: string;
          created_at: string;
          demo_url: string | null;
          description: string;
          direction: string | null;
          download_url: string | null;
          featured: boolean;
          github_url: string | null;
          highlights: string[];
          id: string;
          image: string | null;
          name: string;
          problem: string | null;
          published: boolean;
          secondary_image: string | null;
          slug: string;
          sort_order: number;
          status: string;
          status_type: string;
          technologies: string[];
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          demo_url?: string | null;
          description: string;
          direction?: string | null;
          download_url?: string | null;
          featured?: boolean;
          github_url?: string | null;
          highlights?: string[];
          id?: string;
          image?: string | null;
          name: string;
          problem?: string | null;
          published?: boolean;
          secondary_image?: string | null;
          slug: string;
          sort_order?: number;
          status: string;
          status_type?: string;
          technologies?: string[];
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          demo_url?: string | null;
          description?: string;
          direction?: string | null;
          download_url?: string | null;
          featured?: boolean;
          github_url?: string | null;
          highlights?: string[];
          id?: string;
          image?: string | null;
          name?: string;
          problem?: string | null;
          published?: boolean;
          secondary_image?: string | null;
          slug?: string;
          sort_order?: number;
          status?: string;
          status_type?: string;
          technologies?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action: string;
          created_at: string;
          details: Json | null;
          entity: string;
          entity_id: string | null;
          id: string;
          user_id: string | null;
        };
        Insert: {
          action: string;
          created_at?: string;
          details?: Json | null;
          entity: string;
          entity_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          action?: string;
          created_at?: string;
          details?: Json | null;
          entity?: string;
          entity_id?: string | null;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      education: {
        Row: {
          created_at: string;
          current: boolean;
          field: string;
          id: string;
          institution: string;
          note: string | null;
          sort_order: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current?: boolean;
          field: string;
          id?: string;
          institution: string;
          note?: string | null;
          sort_order?: number;
          status: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current?: boolean;
          field?: string;
          id?: string;
          institution?: string;
          note?: string | null;
          sort_order?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journey_milestones: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          institution: string;
          label: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          institution: string;
          label: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          institution?: string;
          label?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      media_assets: {
        Row: {
          alt_text: string | null;
          category: string;
          created_at: string;
          created_by: string | null;
          filename: string;
          id: string;
          mime_type: string;
          size_bytes: number;
          url: string;
        };
        Insert: {
          alt_text?: string | null;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          filename: string;
          id?: string;
          mime_type: string;
          size_bytes?: number;
          url: string;
        };
        Update: {
          alt_text?: string | null;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          filename?: string;
          id?: string;
          mime_type?: string;
          size_bytes?: number;
          url?: string;
        };
        Relationships: [];
      };
      page_content: {
        Row: {
          content: Json;
          created_at: string;
          id: string;
          page_slug: string;
          published: boolean;
          section_key: string;
          updated_at: string;
        };
        Insert: {
          content?: Json;
          created_at?: string;
          id?: string;
          page_slug: string;
          published?: boolean;
          section_key: string;
          updated_at?: string;
        };
        Update: {
          content?: Json;
          created_at?: string;
          id?: string;
          page_slug?: string;
          published?: boolean;
          section_key?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          category: string;
          created_at: string;
          direction: string | null;
          featured: boolean;
          href: string | null;
          id: string;
          image: string | null;
          is_placeholder: boolean;
          problem: string | null;
          published: boolean;
          secondary_image: string | null;
          slug: string;
          sort_order: number;
          status: string;
          status_type: string;
          summary: string;
          technologies: string[];
          title: string;
          updated_at: string;
        };
        Insert: {
          category: string;
          created_at?: string;
          direction?: string | null;
          featured?: boolean;
          href?: string | null;
          id?: string;
          image?: string | null;
          is_placeholder?: boolean;
          problem?: string | null;
          published?: boolean;
          secondary_image?: string | null;
          slug: string;
          sort_order?: number;
          status: string;
          status_type?: string;
          summary: string;
          technologies?: string[];
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string;
          created_at?: string;
          direction?: string | null;
          featured?: boolean;
          href?: string | null;
          id?: string;
          image?: string | null;
          is_placeholder?: boolean;
          problem?: string | null;
          published?: boolean;
          secondary_image?: string | null;
          slug?: string;
          sort_order?: number;
          status?: string;
          status_type?: string;
          summary?: string;
          technologies?: string[];
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          updated_at: string;
          updated_by: string | null;
          value: Json;
        };
        Insert: {
          id?: string;
          key: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Update: {
          id?: string;
          key?: string;
          updated_at?: string;
          updated_by?: string | null;
          value?: Json;
        };
        Relationships: [];
      };
      skill_categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          slug: string;
          sort_order: number;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          slug: string;
          sort_order?: number;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          slug?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: {
          category_id: string;
          created_at: string;
          id: string;
          name: string;
          sort_order: number;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          id?: string;
          name: string;
          sort_order?: number;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          id?: string;
          name?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "skill_categories";
            referencedColumns: ["id"];
          }
        ];
      };
      designs: {
        Row: {
          category: string;
          cover_image: string | null;
          created_at: string;
          description: string | null;
          external_url: string | null;
          featured: boolean;
          gallery: Json;
          id: string;
          project_date: string | null;
          published: boolean;
          slug: string;
          sort_order: number;
          title: string;
          tools: string[];
          updated_at: string;
        };
        Insert: {
          category?: string;
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          featured?: boolean;
          gallery?: Json;
          id?: string;
          project_date?: string | null;
          published?: boolean;
          slug: string;
          sort_order?: number;
          title: string;
          tools?: string[];
          updated_at?: string;
        };
        Update: {
          category?: string;
          cover_image?: string | null;
          created_at?: string;
          description?: string | null;
          external_url?: string | null;
          featured?: boolean;
          gallery?: Json;
          id?: string;
          project_date?: string | null;
          published?: boolean;
          slug?: string;
          sort_order?: number;
          title?: string;
          tools?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      contact_messages: {
        Row: {
          archived_at: string | null;
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          replied_at: string | null;
          sender_email: string;
          sender_name: string;
          status: string;
          subject: string;
          website: string | null;
        };
        Insert: {
          archived_at?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          replied_at?: string | null;
          sender_email: string;
          sender_name: string;
          status?: string;
          subject: string;
          website?: string | null;
        };
        Update: {
          archived_at?: string | null;
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message?: string;
          replied_at?: string | null;
          sender_email?: string;
          sender_name?: string;
          status?: string;
          subject?: string;
          website?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: never;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
