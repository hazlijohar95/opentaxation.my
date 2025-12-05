import { useState, useEffect, useCallback, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Question } from 'phosphor-react';
import { cn } from '@/lib/utils';

// Maximum allowed value to prevent UI overflow (10 billion RM - way beyond any realistic business)
const MAX_SAFE_INPUT = 10_000_000_000;

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  tooltip?: string;
  prefix?: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  helperText?: string;
}

/**
 * Format a number with thousand separators
 */
function formatNumber(num: number): string {
  if (num === 0) return '';
  return num.toLocaleString('en-MY');
}

/**
 * Parse a formatted string back to a number
 */
function parseFormattedNumber(str: string): number {
  // Remove all non-numeric characters except decimal point
  const cleaned = str.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  tooltip,
  prefix = 'RM',
  min = 0,
  max,
  step: _step = 1000,
  className,
  helperText,
}: InputFieldProps) {
  // _step is available for future use (e.g., keyboard increment/decrement)
  void _step;
  const fieldId = label.replace(/\s+/g, '-').toLowerCase();
  const tooltipId = `${fieldId}-tooltip`;
  const helperId = `${fieldId}-helper`;
  const ariaDescribedBy = [tooltip && tooltipId, helperText && helperId].filter(Boolean).join(' ') || undefined;

  // Local state for the displayed value (formatted with commas)
  const [displayValue, setDisplayValue] = useState(formatNumber(value));
  const [isFocused, setIsFocused] = useState(false);

  // Sync display value with prop when not focused
  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatNumber(value));
    }
  }, [value, isFocused]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    const numValue = parseFormattedNumber(rawValue);
    // Apply both custom max and global safety max
    const effectiveMax = max !== undefined ? Math.min(max, MAX_SAFE_INPUT) : MAX_SAFE_INPUT;
    const clampedValue = Math.max(min, Math.min(numValue, effectiveMax));
    onChange(clampedValue);
  }, [min, max, onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    // Show raw number without formatting when focused for easier editing
    if (value > 0) {
      setDisplayValue(value.toString());
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    // Format the number when focus leaves
    setDisplayValue(formatNumber(value));
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {label}
        </Label>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-target"
                aria-label={`Help for ${label}`}
                aria-describedby={tooltipId}
                id={tooltipId}
              >
                <Question weight="duotone" className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-xs" side="top" id={tooltipId}>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none" aria-hidden="true">
            {prefix}
          </span>
        )}
        <Input
          id={fieldId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          aria-describedby={ariaDescribedBy}
          aria-label={prefix ? `${label} in ${prefix}` : label}
          className={cn(
            prefix && "pl-10",
            "h-12 sm:h-11 text-base sm:text-sm touch-target",
            "focus:ring-2 focus:ring-offset-0",
            "transition-all duration-200",
            "active:scale-[0.98]",
            "font-numbers tabular-nums"
          )}
        />
      </div>
      {helperText && (
        <p id={helperId} className="text-xs text-muted-foreground px-1" role="note">
          {helperText}
        </p>
      )}
    </div>
  );
}

export default memo(InputField);
