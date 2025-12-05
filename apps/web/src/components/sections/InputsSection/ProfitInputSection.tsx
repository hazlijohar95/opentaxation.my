import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Target, Info } from 'phosphor-react';
import InputField from '@/components/InputField';
import { formatCurrency } from '@/lib/utils';
import { SectionHeader } from './shared';
import type { ProfitInputSectionProps } from './types';

export default function ProfitInputSection({
  inputs,
  callbacks,
  calculatedProfit,
}: ProfitInputSectionProps) {
  const { t } = useTranslation();
  const inputMode = inputs.inputMode || 'profit';

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.02, duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-5 space-y-4">
          <SectionHeader
            title={t('inputs.profit.title')}
            subtitle={t('inputs.profit.subtitle')}
            tip={t('inputs.profit.tip')}
          />

          {/* Input Mode Toggle */}
          {callbacks.onInputModeChange && (
            <div className="flex gap-2 p-1.5 bg-muted/50 rounded-xl">
              <button
                type="button"
                onClick={() => callbacks.onInputModeChange?.('profit')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 min-h-[48px] ${
                  inputMode === 'profit'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground active:scale-[0.98]'
                }`}
              >
                <Calculator weight={inputMode === 'profit' ? 'fill' : 'regular'} className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('inputs.profit.mode.profit')}</span>
              </button>
              <button
                type="button"
                onClick={() => callbacks.onInputModeChange?.('target')}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 min-h-[48px] ${
                  inputMode === 'target'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground active:scale-[0.98]'
                }`}
              >
                <Target weight={inputMode === 'target' ? 'fill' : 'regular'} className="h-4 w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">{t('inputs.profit.mode.target')}</span>
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {inputMode === 'target' && callbacks.onTargetNetIncomeChange ? (
              <motion.div
                key="target-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <InputField
                  label={t('inputs.target.label')}
                  value={inputs.targetNetIncome || 10000}
                  onChange={callbacks.onTargetNetIncomeChange}
                  placeholder="10,000"
                  helperText={t('inputs.target.helper')}
                  max={10_000_000}
                />
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs text-muted-foreground flex-shrink-0">{t('inputs.target.annually')}</span>
                    <span className="text-sm font-semibold font-numbers truncate">
                      {formatCurrency((inputs.targetNetIncome || 10000) * 12, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{t('inputs.target.perYear')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-emerald-500/20 gap-2">
                    <span className="text-xs font-medium flex-shrink-0">{t('inputs.target.needToEarn')}</span>
                    <span className="text-base font-bold font-numbers text-emerald-600 truncate">
                      {formatCurrency(calculatedProfit || 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}{t('inputs.target.perYear')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="profit-mode"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                {inputs.businessProfit === 0 && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-sm text-foreground">
                    <span className="font-medium">{t('inputs.profit.startHere')}</span> {t('inputs.profit.startHereText')}
                  </div>
                )}
                <InputField
                  label={t('inputs.profit.label')}
                  value={inputs.businessProfit}
                  onChange={callbacks.onBusinessProfitChange}
                  placeholder={t('inputs.profit.placeholder')}
                  helperText={t('inputs.profit.helper')}
                  max={100_000_000}
                />
                <div className="p-3 rounded-lg bg-muted/30 border border-border/30 space-y-1.5">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Info weight="bold" className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    <span>{t('inputs.profit.bothStructures')} <strong className="text-foreground">{t('inputs.profit.both')}</strong> {t('inputs.profit.sideBySide')}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">{t('inputs.profit.typicalRange')}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <InputField
            label={t('inputs.otherIncome.label')}
            value={inputs.otherIncome}
            onChange={callbacks.onOtherIncomeChange}
            placeholder="0"
            helperText={t('inputs.otherIncome.helper')}
            max={50_000_000}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
