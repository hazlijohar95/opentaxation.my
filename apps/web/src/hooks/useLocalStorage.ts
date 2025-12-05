import { useState, useEffect, useCallback, useRef } from 'react';
import type { InputMode, ZakatInput } from '@tax-engine/core';

/**
 * Hook to persist state to localStorage with automatic serialization/deserialization
 *
 * @param key - localStorage key
 * @param initialValue - default value if no stored value exists
 * @returns [storedValue, setValue, clearValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Use ref to store initialValue to avoid dependency issues with objects
  const initialValueRef = useRef(initialValue);

  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Persist to localStorage whenever value changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Clear stored value - use ref to avoid dependency on initialValue object
  const clearValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValueRef.current);
    } catch (error) {
      console.warn(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setStoredValue, clearValue];
}

/**
 * Combined storage interface for all inputs
 */
export interface StoredInputs {
  businessProfit: number;
  otherIncome: number;
  monthlySalary: number;
  complianceCosts: number;
  auditRevenue: number;
  auditAssets: number;
  auditEmployees: number;
  auditCost: number;
  applyYa2025DividendSurcharge: boolean;
  dividendDistributionPercent: number;
  hasForeignOwnership: boolean;
  // Input mode fields
  inputMode: InputMode;
  targetNetIncome: number; // Monthly target take-home
  // Zakat settings
  zakat?: ZakatInput;
}

const COMBINED_STORAGE_KEY = 'taxCalc_allInputs';

/**
 * Hook to persist all tax calculator inputs as a single object
 * More efficient than individual keys for related data
 */
export function useTaxInputsStorage(defaultInputs: StoredInputs): {
  inputs: StoredInputs;
  updateInput: <K extends keyof StoredInputs>(key: K, value: StoredInputs[K]) => void;
  updateAllInputs: (inputs: StoredInputs) => void;
  clearInputs: () => void;
  hasStoredInputs: boolean;
} {
  const [inputs, setInputs, clearInputs] = useLocalStorage<StoredInputs>(
    COMBINED_STORAGE_KEY,
    defaultInputs
  );

  // Check if there are stored inputs (different from defaults)
  const hasStoredInputs = typeof window !== 'undefined' &&
    window.localStorage.getItem(COMBINED_STORAGE_KEY) !== null;

  // Update a single input field
  const updateInput = useCallback(<K extends keyof StoredInputs>(
    key: K,
    value: StoredInputs[K]
  ) => {
    setInputs(prev => ({
      ...prev,
      [key]: value,
    }));
  }, [setInputs]);

  // Update all inputs at once
  const updateAllInputs = useCallback((newInputs: StoredInputs) => {
    setInputs(newInputs);
  }, [setInputs]);

  return {
    inputs,
    updateInput,
    updateAllInputs,
    clearInputs,
    hasStoredInputs,
  };
}
