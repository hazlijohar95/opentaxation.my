/**
 * Supabase Database Types
 *
 * These types should match your Supabase schema.
 * You can generate these automatically using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

// JSON type for Supabase JSONB columns
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Blog types
export type PostStatus = 'draft' | 'published' | 'scheduled' | 'archived';
export type Locale = 'en' | 'ms';

export interface Database {
  public: {
    Tables: {
      saved_calculations: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          inputs: Json;
          results: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          inputs: Json;
          results: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          inputs?: Json;
          results?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      leads: {
        Row: {
          id: string;
          email: string;
          lead_type: 'incorporation' | 'newsletter' | 'partner_inquiry';
          source: string;
          metadata: Json;
          user_id: string | null;
          created_at: string;
          contacted_at: string | null;
          status: 'new' | 'contacted' | 'converted' | 'unsubscribed';
        };
        Insert: {
          id?: string;
          email: string;
          lead_type: 'incorporation' | 'newsletter' | 'partner_inquiry';
          source?: string;
          metadata?: Json;
          user_id?: string | null;
          created_at?: string;
          contacted_at?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'unsubscribed';
        };
        Update: {
          id?: string;
          email?: string;
          lead_type?: 'incorporation' | 'newsletter' | 'partner_inquiry';
          source?: string;
          metadata?: Json;
          user_id?: string | null;
          contacted_at?: string | null;
          status?: 'new' | 'contacted' | 'converted' | 'unsubscribed';
        };
        Relationships: [];
      };
      // Blog tables
      blog_authors: {
        Row: {
          id: string;
          email: string;
          user_id: string | null;
          slug: string;
          name: string;
          bio_en: string | null;
          bio_ms: string | null;
          avatar_url: string | null;
          twitter: string | null;
          linkedin: string | null;
          website: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          user_id?: string | null;
          slug: string;
          name: string;
          bio_en?: string | null;
          bio_ms?: string | null;
          avatar_url?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          website?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          user_id?: string | null;
          slug?: string;
          name?: string;
          bio_en?: string | null;
          bio_ms?: string | null;
          avatar_url?: string | null;
          twitter?: string | null;
          linkedin?: string | null;
          website?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_categories: {
        Row: {
          id: string;
          slug: string;
          name_en: string;
          name_ms: string;
          description_en: string | null;
          description_ms: string | null;
          color: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name_en: string;
          name_ms: string;
          description_en?: string | null;
          description_ms?: string | null;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name_en?: string;
          name_ms?: string;
          description_en?: string | null;
          description_ms?: string | null;
          color?: string;
          icon?: string | null;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_tags: {
        Row: {
          id: string;
          slug: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          slug: string;
          locale: Locale;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image_url: string | null;
          cover_image_alt: string | null;
          author_id: string | null;
          category_id: string | null;
          status: PostStatus;
          published_at: string | null;
          scheduled_for: string | null;
          meta_title: string | null;
          meta_description: string | null;
          og_image_url: string | null;
          view_count: number;
          reading_time_minutes: number;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          locale?: Locale;
          title: string;
          excerpt?: string | null;
          content: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          status?: PostStatus;
          published_at?: string | null;
          scheduled_for?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          view_count?: number;
          reading_time_minutes?: number;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          locale?: Locale;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_image_url?: string | null;
          cover_image_alt?: string | null;
          author_id?: string | null;
          category_id?: string | null;
          status?: PostStatus;
          published_at?: string | null;
          scheduled_for?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          og_image_url?: string | null;
          view_count?: number;
          reading_time_minutes?: number;
          is_featured?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_posts_author_id_fkey';
            columns: ['author_id'];
            referencedRelation: 'blog_authors';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_posts_category_id_fkey';
            columns: ['category_id'];
            referencedRelation: 'blog_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      blog_post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_post_tags_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'blog_posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_post_tags_tag_id_fkey';
            columns: ['tag_id'];
            referencedRelation: 'blog_tags';
            referencedColumns: ['id'];
          }
        ];
      };
      blog_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          user_name: string;
          user_avatar: string | null;
          content: string;
          parent_id: string | null;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          user_name: string;
          user_avatar?: string | null;
          content: string;
          parent_id?: string | null;
          is_approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          user_name?: string;
          user_avatar?: string | null;
          content?: string;
          parent_id?: string | null;
          is_approved?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_comments_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'blog_posts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blog_comments_parent_id_fkey';
            columns: ['parent_id'];
            referencedRelation: 'blog_comments';
            referencedColumns: ['id'];
          }
        ];
      };
      blog_bookmarks: {
        Row: {
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          post_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'blog_bookmarks_post_id_fkey';
            columns: ['post_id'];
            referencedRelation: 'blog_posts';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      increment_post_view: {
        Args: { post_slug: string };
        Returns: void;
      };
    };
    Enums: {
      post_status: PostStatus;
      locale: Locale;
    };
    CompositeTypes: Record<string, never>;
  };
}

// Matches the TaxCalculationInputs from @tax-engine/core
export interface CalculationInputs {
  businessProfit: number;
  otherIncome: number;
  directorSalary: number;
  dividendPercentage: number;
  personalReliefs: number;
  complianceCosts: number;
  reliefBreakdown?: {
    individual: number;
    spouse: number;
    childBelow18: number;
    child18AndAboveEducation: number;
    childDisabled: number;
    medicalParents: number;
    medicalSelf: number;
    lifestyleEducation: number;
    lifestyleSports: number;
    sspnDeposit: number;
    domesticTravel: number;
    electricVehicle: number;
    lifeInsurance: number;
    epfContribution: number;
    prsAnnuity: number;
    socsoContribution: number;
    disabledIndividual: number;
    disabledSpouse: number;
    breastfeedingEquipment: number;
    childcareKindergarten: number;
  };
  applyYa2025DividendSurcharge?: boolean;
}

// Simplified results to store (we can recalculate full breakdown)
export interface CalculationResults {
  soleProp: {
    netCashFlow: number;
    totalTax: number;
    effectiveRate: number;
  };
  sdnBhd: {
    netCashFlow: number;
    totalTax: number;
    effectiveRate: number;
  };
  recommendation: 'sole-prop' | 'sdn-bhd' | 'neutral';
  taxSavings: number;
}

// Helper type for the saved calculation with full data
// We override the JSON types to use our strongly typed interfaces
export interface SavedCalculation {
  id: string;
  user_id: string;
  name: string;
  inputs: CalculationInputs;
  results: CalculationResults;
  created_at: string;
  updated_at: string;
}

export interface NewSavedCalculation {
  id?: string;
  user_id: string;
  name: string;
  inputs: CalculationInputs;
  results: CalculationResults;
  created_at?: string;
  updated_at?: string;
}

/**
 * Type guard to validate SavedCalculation structure from database
 */
export function isValidSavedCalculation(data: unknown): data is SavedCalculation {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;

  // Check required string fields
  if (typeof obj.id !== 'string') return false;
  if (typeof obj.user_id !== 'string') return false;
  if (typeof obj.name !== 'string') return false;
  if (typeof obj.created_at !== 'string') return false;
  if (typeof obj.updated_at !== 'string') return false;

  // Check inputs object
  if (!obj.inputs || typeof obj.inputs !== 'object') return false;
  const inputs = obj.inputs as Record<string, unknown>;
  if (typeof inputs.businessProfit !== 'number') return false;

  // Check results object
  if (!obj.results || typeof obj.results !== 'object') return false;
  const results = obj.results as Record<string, unknown>;
  if (!results.soleProp || !results.sdnBhd) return false;

  return true;
}

/**
 * Parse and validate an array of saved calculations
 */
export function parseSavedCalculations(data: unknown[]): SavedCalculation[] {
  return data.filter(isValidSavedCalculation);
}

/**
 * Parse a single saved calculation with fallback
 */
export function parseSavedCalculation(data: unknown): SavedCalculation | null {
  return isValidSavedCalculation(data) ? data : null;
}
