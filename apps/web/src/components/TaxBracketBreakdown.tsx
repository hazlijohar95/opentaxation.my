import { motion } from 'framer-motion';
import type { TaxBracketBreakdown } from '@tax-engine/core';
import { formatRM, formatBracketLabel, formatPercent } from '@/lib/formatters';

interface TaxBracketBreakdownProps {
  breakdown: TaxBracketBreakdown[];
  title?: string;
  taxableIncome?: number;
  className?: string;
  isCorporate?: boolean;
}

/**
 * Displays the progressive tax bracket breakdown showing how income/profit
 * flows through each tier with the rate and tax amount for each.
 */
export default function TaxBracketBreakdownComponent({
  breakdown,
  title = 'Tax Bracket Breakdown',
  taxableIncome,
  className = '',
  isCorporate = false,
}: TaxBracketBreakdownProps) {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  // Calculate total tax from the breakdown
  const totalTax = breakdown.reduce((sum, b) => sum + b.taxForBracket, 0);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-muted-foreground">{title}</p>
        {taxableIncome !== undefined && (
          <span className="text-xs text-muted-foreground">
            Taxable: {formatRM(taxableIncome)}
          </span>
        )}
      </div>

      <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
        {breakdown.map((bracket, idx) => {
          const isFirst = idx === 0;
          const isLast = idx === breakdown.length - 1;
          const label = formatBracketLabel(bracket.bracketMin, bracket.bracketMax, isFirst);

          return (
            <motion.div
              key={`${bracket.bracketMin}-${bracket.bracketMax}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              className="text-xs py-1"
            >
              {/* Desktop: Single row layout */}
              <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-x-2 min-w-0">
                {/* Tree connector */}
                <span className="text-muted-foreground/50 font-mono flex-shrink-0">
                  {isLast ? '└─' : '├─'}
                </span>

                {/* Bracket label */}
                <span className="text-muted-foreground truncate">
                  {label}
                </span>

                {/* Rate */}
                <span className="text-muted-foreground/70 flex-shrink-0">×</span>
                <span className={`font-medium text-right flex-shrink-0 ${
                  bracket.rate === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                }`}>
                  {formatPercent(bracket.rate)}=
                </span>

                {/* Tax amount */}
                <span className={`font-numbers font-medium text-right flex-shrink-0 ${
                  bracket.taxForBracket === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                }`}>
                  {formatRM(bracket.taxForBracket)}
                </span>
              </div>

              {/* Mobile: Stacked layout */}
              <div className="sm:hidden space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground/50 font-mono flex-shrink-0 text-[10px]">
                    {isLast ? '└' : '├'}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    {label}
                  </span>
                </div>
                <div className="flex items-center justify-between pl-4">
                  <span className={`font-medium ${
                    bracket.rate === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                  }`}>
                    @ {formatPercent(bracket.rate)}
                  </span>
                  <span className={`font-numbers font-medium ${
                    bracket.taxForBracket === 0 ? 'text-green-600 dark:text-green-400' : 'text-foreground'
                  }`}>
                    {formatRM(bracket.taxForBracket)}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Total row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: breakdown.length * 0.03 + 0.1, duration: 0.2 }}
          className="flex items-center justify-between text-xs pt-2 mt-2 border-t border-border/50"
        >
          <span className="font-semibold text-foreground">
            Total {isCorporate ? 'Corporate' : 'Personal'} Tax
          </span>
          <span className="font-numbers font-bold text-foreground">
            {formatRM(totalTax)}
          </span>
        </motion.div>
      </div>

      {/* Educational note */}
      <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
        {isCorporate
          ? 'SME tax rates apply to companies with ≤RM50M revenue and no foreign ownership ≥20%.'
          : 'Malaysian progressive tax means only the income within each bracket is taxed at that rate.'}
      </p>
    </div>
  );
}
