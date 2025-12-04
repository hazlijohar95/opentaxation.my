import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with RM prefix and thousand separators
 * For very large numbers, uses compact notation (e.g., 1.5M, 2.3B)
 */
export function formatCurrency(
  value: number,
  options: {
    compact?: boolean;
    prefix?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    compact = false,
    prefix = 'RM',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  // Safeguard against NaN/Infinity
  if (!isFinite(value)) {
    return `${prefix}0.00`;
  }

  const absValue = Math.abs(value);

  // Use compact notation for large numbers
  if (compact || absValue >= 10_000_000) {
    if (absValue >= 1_000_000_000) {
      return `${prefix}${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (absValue >= 1_000_000) {
      return `${prefix}${(value / 1_000_000).toFixed(2)}M`;
    }
    if (absValue >= 100_000) {
      return `${prefix}${(value / 1_000).toFixed(0)}K`;
    }
  }

  return `${prefix}${value.toLocaleString('en-MY', {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
}

