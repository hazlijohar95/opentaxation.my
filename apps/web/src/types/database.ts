/**
 * Supabase Database Types
 *
 * These types should match your Supabase schema.
 * You can generate these automatically using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
 */

// JSON type for Supabase JSONB columns
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

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
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
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
