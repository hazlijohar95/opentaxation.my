import { useState, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Warning, CaretDown, CaretUp, Lightbulb } from 'phosphor-react';
import WaterfallBreakdown from './WaterfallBreakdown';
import TaxBracketBreakdownComponent from './TaxBracketBreakdown';
import { formatCurrency } from '@/lib/utils';
import type { WaterfallStep, TaxBracketBreakdown } from '@tax-engine/core';

interface TaxCardProps {
  title: string;
  tax: number;
  netCash: number;
  effectiveTaxRate: number;
  breakdown?: {
    [key: string]: number | string;
  };
  waterfall?: WaterfallStep[];
  companyWaterfall?: WaterfallStep[];
  personalWaterfall?: WaterfallStep[];
  insights?: string[];
  className?: string;
  hasWarning?: boolean;
  warningText?: string;
  // Tax bracket breakdown props
  taxBracketBreakdown?: TaxBracketBreakdown[];
  taxableIncome?: number;
  // For Sdn Bhd with separate corporate and personal tax breakdowns
  corporateTaxBracketBreakdown?: TaxBracketBreakdown[];
  personalTaxBracketBreakdown?: TaxBracketBreakdown[];
  companyTaxableProfit?: number;
  personalTaxableIncome?: number;
}

function TaxCard({
  title,
  tax,
  netCash,
  effectiveTaxRate,
  breakdown,
  waterfall,
  companyWaterfall,
  personalWaterfall,
  insights,
  className,
  hasWarning,
  warningText,
  taxBracketBreakdown,
  taxableIncome,
  corporateTaxBracketBreakdown,
  personalTaxBracketBreakdown,
  companyTaxableProfit,
  personalTaxableIncome,
}: TaxCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Safeguard against NaN/undefined values
  const safeTax = isNaN(tax) || !isFinite(tax) ? 0 : tax;
  const safeNetCash = isNaN(netCash) || !isFinite(netCash) ? 0 : netCash;
  const safeEffectiveRate = isNaN(effectiveTaxRate) || !isFinite(effectiveTaxRate) ? 0 : effectiveTaxRate;

  // Check if we have waterfall data to display
  const hasWaterfall = waterfall || companyWaterfall || personalWaterfall;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={`h-full border-border/50 shadow-sm hover:shadow-md transition-all duration-200 hover:border-border active:scale-[0.99] ${hasWarning ? 'border-amber-500/50' : ''} ${className}`}>
        {hasWarning && warningText && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2">
            <div className="flex items-center gap-2">
              <Warning weight="duotone" className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              <p className="text-xs text-amber-700/90 dark:text-amber-400/90">{warningText}</p>
            </div>
          </div>
        )}
        <CardHeader className="pb-4 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <Badge variant="secondary" className="text-xs font-medium bg-muted/50">
              {title === 'Enterprise' ? 'Sole Prop' : 'Company'}
            </Badge>
          </div>
          <CardDescription className="text-xs mt-1">Tax breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-5 pb-5">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 gap-2">
              <span className="text-xs text-muted-foreground font-medium flex-shrink-0">Total Tax Paid</span>
              <span className={`font-numbers font-semibold text-foreground truncate ${safeTax >= 10_000_000 ? 'text-base' : 'text-lg'}`}>
                {formatCurrency(safeTax)}
              </span>
            </div>

            <Separator className="bg-border/50" />

            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-baseline gap-2">
                <span className="text-xs text-muted-foreground font-medium flex-shrink-0">Net Cash to You</span>
                <span className={`font-numbers font-bold text-foreground tracking-tight truncate ${
                  safeNetCash >= 100_000_000 ? 'text-xl' : safeNetCash >= 10_000_000 ? 'text-2xl' : 'text-3xl'
                }`}>
                  {formatCurrency(safeNetCash)}
                </span>
              </div>
              <div className="flex justify-end">
                <Badge variant="secondary" className="text-xs font-normal bg-muted/50 text-muted-foreground px-2 py-0.5">
                  {(safeEffectiveRate * 100).toFixed(2)}% effective rate
                </Badge>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            {hasWaterfall && (
              <>
                <Separator className="my-4 bg-border/50" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground min-h-[44px]"
                >
                  {isExpanded ? (
                    <>
                      <CaretUp weight="bold" className="h-3.5 w-3.5" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <CaretDown weight="bold" className="h-3.5 w-3.5" />
                      Show Breakdown
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Expanded Waterfall Breakdown */}
            <AnimatePresence>
              {isExpanded && hasWaterfall && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden min-w-0"
                >
                  <Separator className="my-4 bg-border/50" />

                  {/* Single waterfall (Enterprise) */}
                  {waterfall && (
                    <WaterfallBreakdown steps={waterfall} />
                  )}

                  {/* Two-level waterfall (Sdn Bhd) */}
                  {companyWaterfall && (
                    <WaterfallBreakdown
                      steps={companyWaterfall}
                      title="Company Level"
                      className="mb-4"
                    />
                  )}

                  {personalWaterfall && (
                    <WaterfallBreakdown
                      steps={personalWaterfall}
                      title="Your Personal Level"
                    />
                  )}

                  {/* Tax Bracket Breakdown - Enterprise (single personal tax) */}
                  {taxBracketBreakdown && taxBracketBreakdown.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 min-w-0">
                      <TaxBracketBreakdownComponent
                        breakdown={taxBracketBreakdown}
                        title="How Your Tax is Calculated"
                        taxableIncome={taxableIncome}
                      />
                    </div>
                  )}

                  {/* Tax Bracket Breakdown - Sdn Bhd (corporate + personal) */}
                  {corporateTaxBracketBreakdown && corporateTaxBracketBreakdown.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 min-w-0">
                      <TaxBracketBreakdownComponent
                        breakdown={corporateTaxBracketBreakdown}
                        title="Corporate Tax Calculation"
                        taxableIncome={companyTaxableProfit}
                        isCorporate
                      />
                    </div>
                  )}

                  {personalTaxBracketBreakdown && personalTaxBracketBreakdown.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50 min-w-0">
                      <TaxBracketBreakdownComponent
                        breakdown={personalTaxBracketBreakdown}
                        title="Your Personal Tax Calculation"
                        taxableIncome={personalTaxableIncome}
                      />
                    </div>
                  )}

                  {/* Insights */}
                  {insights && insights.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Lightbulb weight="duotone" className="h-3.5 w-3.5 text-amber-500" />
                        <p className="text-xs font-semibold text-muted-foreground">Key Insights</p>
                      </div>
                      <div className="space-y-1.5">
                        {insights.map((insight, idx) => (
                          <motion.p
                            key={`insight-${insight.slice(0, 20).replace(/\s+/g, '-')}-${idx}`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05, duration: 0.2 }}
                            className="text-xs text-muted-foreground leading-relaxed pl-5"
                          >
                            {insight}
                          </motion.p>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Legacy breakdown (fallback if no waterfall) */}
            {!hasWaterfall && breakdown && Object.keys(breakdown).length > 0 && (
              <>
                <Separator className="my-4 bg-border/50" />
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">Breakdown</p>
                  {Object.entries(breakdown).map(([key, value], idx) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className="flex justify-between items-center py-1.5 px-2.5 rounded-md hover:bg-muted/40 transition-colors duration-150"
                    >
                      <span className="text-xs text-muted-foreground capitalize truncate pr-2">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-xs font-medium text-foreground text-right truncate max-w-[120px]">
                      {typeof value === 'number' ? (
                        <span className="font-numbers">
                          {formatCurrency(isNaN(value) || !isFinite(value) ? 0 : value)}
                        </span>
                      ) : (
                        value
                      )}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default memo(TaxCard);
