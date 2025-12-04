import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkle, Download, ShareNetwork } from 'phosphor-react';
import TaxCard from '../TaxCard';
import RecommendationCard from '../RecommendationCard';
import WhatsNextCTA from '../WhatsNextCTA';
import CrossoverChart from '../CrossoverChart';
import NonTaxFactorsCard from '../NonTaxFactorsCard';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFReport from '../PDFReport';
import type { ComparisonResult, TaxCalculationInputs } from '@tax-engine/core';

interface ResultsSectionProps {
  comparison: ComparisonResult | null;
  inputs: TaxCalculationInputs;
  onShareClick?: () => void;
  /** Hide header for mobile tab layout (header is in MobileHeader instead) */
  hideHeader?: boolean;
}

function ResultsSection({ comparison, inputs, onShareClick, hideHeader = false }: ResultsSectionProps) {

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 overflow-hidden bg-gradient-to-br from-muted/30 via-muted/20 to-background"
    >
      <div className="h-full flex flex-col">
        {/* Sticky header - iOS native style - hidden when using MobileTabLayout */}
        {!hideHeader && (
          <header className="sticky top-0 z-40 bg-gradient-to-br from-muted/80 via-muted/70 to-background/80 backdrop-blur-xl border-b border-border/30 supports-[backdrop-filter]:from-muted/60 supports-[backdrop-filter]:via-muted/50 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
            <div className="px-5 sm:px-5 lg:px-8 py-4 sm:py-4 lg:py-6">
              <h2 className="font-display text-lg sm:text-xl lg:text-3xl font-bold tracking-tight" id="results-heading">
                Your Results
              </h2>
              <p className="text-xs text-muted-foreground">Enterprise vs Sdn Bhd comparison</p>
            </div>
          </header>
        )}

        <AnimatePresence mode="wait">
          {comparison ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
              role="region"
              aria-labelledby="results-heading"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="px-5 sm:px-5 lg:px-8 py-5 sm:py-5 lg:py-6 space-y-4 pb-safe">
                {/* Comparison Cards - Stack on mobile, side by side on larger */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                  >
                    <TaxCard
                      title="Enterprise"
                      tax={comparison.solePropResult.personalTax}
                      netCash={comparison.solePropResult.netCash}
                      effectiveTaxRate={comparison.solePropResult.effectiveTaxRate}
                      waterfall={comparison.solePropResult.waterfall}
                      insights={comparison.solePropResult.insights}
                      taxBracketBreakdown={comparison.solePropResult.taxBracketBreakdown}
                      taxableIncome={comparison.solePropResult.breakdown.taxableIncome}
                      zakat={comparison.solePropResult.zakat}
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                  >
                    <TaxCard
                      title="Sdn Bhd"
                      tax={comparison.sdnBhdResult.corporateTax + comparison.sdnBhdResult.personalTax + comparison.sdnBhdResult.breakdown.dividendTax}
                      netCash={comparison.sdnBhdResult.netCash}
                      effectiveTaxRate={
                        inputs.businessProfit > 0
                          ? (comparison.sdnBhdResult.corporateTax + comparison.sdnBhdResult.personalTax + comparison.sdnBhdResult.breakdown.dividendTax) /
                            inputs.businessProfit
                          : 0
                      }
                      companyWaterfall={comparison.sdnBhdResult.companyWaterfall}
                      personalWaterfall={comparison.sdnBhdResult.personalWaterfall}
                      insights={comparison.sdnBhdResult.insights}
                      hasWarning={comparison.hasAffordabilityIssue}
                      warningText={comparison.hasAffordabilityIssue ? 'Salary exceeds company capacity' : undefined}
                      corporateTaxBracketBreakdown={comparison.sdnBhdResult.corporateTaxBracketBreakdown}
                      personalTaxBracketBreakdown={comparison.sdnBhdResult.personalTaxBracketBreakdown}
                      companyTaxableProfit={comparison.sdnBhdResult.breakdown.companyTaxableProfit}
                      personalTaxableIncome={comparison.sdnBhdResult.breakdown.annualSalary}
                      zakat={comparison.sdnBhdResult.zakat}
                    />
                  </motion.div>
                </div>

                {/* Recommendation */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                >
                  <RecommendationCard comparison={comparison} />
                </motion.div>

                {/* What's Next CTA - shows only when Sdn Bhd is recommended */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                >
                  <WhatsNextCTA comparison={comparison} />
                </motion.div>

                {/* Crossover Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                >
                  <CrossoverChart inputs={inputs} />
                </motion.div>

                {/* Non-Tax Factors */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                >
                  <NonTaxFactorsCard />
                </motion.div>

                {/* Action Buttons - Sticky at bottom on mobile */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.35 }}
                  className="flex justify-center gap-3 sm:gap-3 pt-4 pb-6"
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore - PDFDownloadLink children type definition doesn't properly support render props */}
                  <PDFDownloadLink
                    document={<PDFReport inputs={inputs} comparison={comparison} />}
                    fileName="tax-comparison.pdf"
                  >
                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                    {/* @ts-ignore */}
                    {({ loading }: { loading?: boolean }) => (
                      <button
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-background border border-border/60 text-xs sm:text-sm hover:bg-muted/50 active:scale-[0.98] transition-all duration-200 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm min-h-[48px]"
                      >
                        <Download weight="duotone" className="h-4 w-4" />
                        <span>{loading ? 'Generating...' : 'Download PDF'}</span>
                      </button>
                    )}
                  </PDFDownloadLink>
                  {onShareClick && (
                    <button
                      onClick={onShareClick}
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-5 h-12 sm:h-11 bg-background border border-border/60 text-xs sm:text-sm hover:bg-muted/50 active:scale-[0.98] transition-all duration-200 rounded-xl font-medium shadow-sm min-h-[48px]"
                    >
                      <ShareNetwork weight="duotone" className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8"
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center">
                  <Sparkle weight="duotone" className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm sm:text-base font-medium text-muted-foreground">Enter your numbers</p>
                  <p className="text-xs sm:text-sm text-muted-foreground/50">Results appear automatically</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default memo(ResultsSection);
