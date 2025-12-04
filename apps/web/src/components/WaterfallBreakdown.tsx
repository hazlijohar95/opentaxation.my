import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatRM } from '@/lib/formatters';
import type { WaterfallStep } from '@tax-engine/core';

interface WaterfallBreakdownProps {
  steps: WaterfallStep[];
  title?: string;
  className?: string;
}

export default function WaterfallBreakdown({ steps, title, className }: WaterfallBreakdownProps) {
  const getPrefix = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add':
        return '+';
      case 'subtract':
        return '-';
      case 'equals':
        return '=';
      case 'total':
        return '';
      default:
        return '';
    }
  };

  const getTextColor = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'subtract':
        return 'text-red-600 dark:text-red-400';
      case 'equals':
        return 'text-muted-foreground';
      case 'total':
        return 'text-foreground font-bold';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={cn('space-y-1', className)}>
      {title && (
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          {title}
        </p>
      )}
      {steps.map((step, index) => (
        <motion.div
          key={`${step.label}-${index}`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.03, duration: 0.2 }}
          className={cn(
            'flex justify-between items-center py-2.5 px-3 rounded-md transition-colors duration-150 min-h-[44px]',
            step.indent && 'ml-4',
            step.highlight && 'bg-foreground/5 border border-foreground/10',
            step.type === 'equals' && 'border-t border-border/50 pt-2 mt-1',
            step.type === 'total' && 'border-t-2 border-foreground/20 pt-2 mt-2'
          )}
        >
          <span
            className={cn(
              'text-xs truncate pr-2',
              step.highlight ? 'font-semibold text-foreground' : 'text-muted-foreground',
              step.indent && 'text-muted-foreground/70'
            )}
          >
            {step.label}
          </span>
          <span
            className={cn(
              'text-xs font-medium text-right font-numbers flex-shrink-0',
              getTextColor(step.type)
            )}
          >
            {step.type !== 'total' && step.type !== 'equals' && (
              <span className="mr-1">{getPrefix(step.type)}</span>
            )}
            {formatRM(Math.abs(step.amount))}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
