import { Label } from '@/components/ui/label';
import { Slider as SliderPrimitive } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Question } from 'phosphor-react';
import { cn, formatCurrency } from '@/lib/utils';

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  tooltip?: string;
  prefix?: string;
  formatValue?: (value: number) => string;
  className?: string;
  subtitle?: string;
}

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 100,
  tooltip,
  prefix = 'RM',
  formatValue,
  className,
  subtitle,
}: SliderProps) {
  const sliderId = label.replace(/\s+/g, '-').toLowerCase();
  const tooltipId = `${sliderId}-tooltip`;
  const displayValue = formatValue
    ? formatValue(value)
    : formatCurrency(value, { prefix, minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <Label htmlFor={sliderId} className="text-sm font-medium truncate">
              {label}
            </Label>
            {tooltip && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors touch-target flex-shrink-0"
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
          {subtitle && (
            <p className="text-xs text-muted-foreground" id={`${sliderId}-subtitle`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="px-3 py-1.5 rounded-md bg-foreground/5 border border-foreground/10 flex-shrink-0 max-w-[120px]" aria-live="polite" aria-atomic="true">
          <span className="font-numbers text-xs sm:text-sm font-semibold text-foreground truncate block">
            {displayValue}
          </span>
        </div>
      </div>
      <div className="px-1 py-2">
        <SliderPrimitive
          id={sliderId}
          value={[value]}
          onValueChange={([val]) => onChange(val)}
          min={min}
          max={max}
          step={step}
          className="w-full touch-target"
          aria-label={label}
          aria-describedby={[tooltip && tooltipId, subtitle && `${sliderId}-subtitle`].filter(Boolean).join(' ') || undefined}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-1" aria-hidden="true">
        <span className="truncate">{formatCurrency(min, { prefix, minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
        <span className="truncate">{formatCurrency(max, { prefix, minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
      </div>
    </div>
  );
}
