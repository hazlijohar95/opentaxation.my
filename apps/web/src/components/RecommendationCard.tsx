import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { ComparisonResult } from '@tax-engine/core';
import { ArrowRight, ArrowLeft, Minus, Sparkle, Warning } from 'phosphor-react';
import { motion } from 'framer-motion';

interface RecommendationCardProps {
  comparison: ComparisonResult;
}

export default function RecommendationCard({ comparison }: RecommendationCardProps) {
  const { whichIsBetter, savingsIfSwitch, recommendation, hasAffordabilityIssue, hasSmeQualificationIssue, warnings } = comparison;

  const isSdnBhdBetter = whichIsBetter === 'sdnBhd';
  const isSolePropBetter = whichIsBetter === 'soleProp';
  const isSimilar = whichIsBetter === 'similar';
  const hasWarnings = warnings.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`border-2 shadow-lg transition-all duration-300 active:scale-[0.99] ${
        hasWarnings ? 'border-amber-500/50 bg-amber-500/5' :
        isSdnBhdBetter ? 'border-foreground/20 bg-foreground/5' :
        isSolePropBetter ? 'border-foreground/20 bg-foreground/5' :
        'border-border/50 bg-muted/20'
      }`}>
        {/* Warnings Banner */}
        {hasWarnings && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 px-5 py-3 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Warning weight="duotone" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {hasAffordabilityIssue
                    ? 'Salary Exceeds Company Capacity'
                    : hasSmeQualificationIssue
                    ? 'SME Tax Rates May Not Apply'
                    : 'Important Notice'}
                </p>
                {warnings.map((warning, index) => (
                  <p key={`warning-${warning.slice(0, 20).replace(/\s+/g, '-')}-${index}`} className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1 leading-relaxed">
                    {warning}
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        <CardContent className="flex flex-col items-center justify-center p-5 sm:p-6 lg:p-8 text-center space-y-4">
          <div className="flex items-center gap-3 mb-2">
            {isSdnBhdBetter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <ArrowRight weight="duotone" className="h-5 w-5 text-foreground" />
                </div>
              </motion.div>
            )}
            {isSolePropBetter && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <div className="w-10 h-10 rounded-full bg-foreground/10 flex items-center justify-center">
                  <ArrowLeft weight="duotone" className="h-5 w-5 text-foreground" />
                </div>
              </motion.div>
            )}
            {isSimilar && (
              <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                <Minus weight="duotone" className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </div>

          <Badge
            className={`text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 ${
              isSdnBhdBetter ? 'bg-[var(--blue)] text-[hsl(var(--blue-foreground))] shadow-md' :
              isSolePropBetter ? 'bg-[var(--blue)] text-[hsl(var(--blue-foreground))] shadow-md' :
              'bg-muted text-muted-foreground'
            }`}
          >
            {isSdnBhdBetter && 'Switch to Sdn Bhd'}
            {isSolePropBetter && 'Stay as Enterprise'}
            {isSimilar && 'Both structures similar'}
          </Badge>

          <div className="space-y-2">
            {isSimilar ? (
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Too close to call
              </h2>
            ) : (
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Save{' '}
                <span className="font-numbers text-foreground">
                  RM{savingsIfSwitch.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-muted-foreground text-xl sm:text-2xl font-normal"> per year</span>
              </h2>
            )}
          </div>

          <Separator className="w-16 bg-border/50" />

          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            {recommendation}
          </p>

          {!isSimilar && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 pt-2"
            >
              <Sparkle weight="duotone" className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Based on your current inputs
              </span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
