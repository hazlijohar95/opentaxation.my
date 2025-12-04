import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSupabase } from './useSupabase';
import type { SavedCalculation, CalculationInputs, CalculationResults, Json } from '@/types/database';
import { parseSavedCalculations, parseSavedCalculation } from '@/types/database';

export function useSavedCalculations() {
  const { user } = useAuth();
  const { supabase, isConfigured, isAuthenticated } = useSupabase();
  const [calculations, setCalculations] = useState<SavedCalculation[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all calculations for the current user
  const fetchCalculations = useCallback(async () => {
    if (!supabase || !user) {
      setCalculations(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('saved_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      // Validate and parse the data with type guards
      setCalculations(parseSavedCalculations(data ?? []));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch calculations'));
      setCalculations(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, user]);

  // Initial fetch
  useEffect(() => {
    if (isConfigured && isAuthenticated) {
      fetchCalculations();
    } else {
      setIsLoading(false);
    }
  }, [isConfigured, isAuthenticated, fetchCalculations]);

  // Save a new calculation
  const saveCalculation = useCallback(
    async (name: string, inputs: CalculationInputs, results: CalculationResults) => {
      if (!supabase || !user) {
        throw new Error('Not authenticated or Supabase not configured');
      }

      const newCalc = {
        user_id: user.id,
        name,
        inputs: inputs as unknown as Json,
        results: results as unknown as Json,
      };

      const { data, error: saveError } = await supabase
        .from('saved_calculations')
        .insert(newCalc)
        .select()
        .single();

      if (saveError) throw saveError;

      const typedData = parseSavedCalculation(data);
      if (!typedData) throw new Error('Invalid data returned from save operation');

      // Update local state
      setCalculations((prev) => (prev ? [typedData, ...prev] : [typedData]));

      return typedData;
    },
    [supabase, user],
  );

  // Delete a calculation
  const deleteCalculation = useCallback(
    async (id: string) => {
      if (!supabase || !user) {
        throw new Error('Not authenticated or Supabase not configured');
      }

      const { error: deleteError } = await supabase
        .from('saved_calculations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Update local state
      setCalculations((prev) => prev?.filter((calc) => calc.id !== id) ?? null);
    },
    [supabase, user],
  );

  // Get a single calculation by ID
  const getCalculation = useCallback(
    async (id: string): Promise<SavedCalculation | null> => {
      if (!supabase || !user) return null;

      const { data, error: fetchError } = await supabase
        .from('saved_calculations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching calculation:', fetchError);
        return null;
      }

      return parseSavedCalculation(data);
    },
    [supabase, user],
  );

  // Update a calculation
  const updateCalculation = useCallback(
    async (id: string, updates: { name?: string; inputs?: CalculationInputs; results?: CalculationResults }) => {
      if (!supabase || !user) {
        throw new Error('Not authenticated or Supabase not configured');
      }

      const updateData: { updated_at: string; name?: string; inputs?: Json; results?: Json } = {
        updated_at: new Date().toISOString(),
      };
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.inputs !== undefined) updateData.inputs = updates.inputs as unknown as Json;
      if (updates.results !== undefined) updateData.results = updates.results as unknown as Json;

      const { data, error: updateError } = await supabase
        .from('saved_calculations')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const typedData = parseSavedCalculation(data);
      if (!typedData) throw new Error('Invalid data returned from update operation');

      // Update local state
      setCalculations((prev) =>
        prev?.map((calc) => (calc.id === id ? typedData : calc)) ?? null,
      );

      return typedData;
    },
    [supabase, user],
  );

  return {
    calculations,
    isLoading,
    error,
    isConfigured,
    isAuthenticated,
    saveCalculation,
    deleteCalculation,
    getCalculation,
    updateCalculation,
    refetch: fetchCalculations,
  };
}
