import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Info } from 'phosphor-react';
import InputField from '@/components/InputField';
import { formatCurrency } from '@/lib/utils';
import { ZAKAT_RATE, getCurrentNisab } from '@tax-engine/config';
import { SectionHeader } from './shared';
import type { ZakatSectionProps } from './types';

export default function ZakatSection({
  inputs,
  onZakatChange,
}: ZakatSectionProps) {
  const { t } = useTranslation();

  const zakatEnabled = inputs.zakat?.enabled || false;
  const zakatAutoCalculate = inputs.zakat?.autoCalculate !== false;
  const nisab = getCurrentNisab();
  const estimatedZakat = inputs.businessProfit * ZAKAT_RATE;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.08, duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-5 space-y-4">
          <SectionHeader
            title={t('inputs.zakat.title')}
            subtitle={t('inputs.zakat.subtitle')}
            tip={t('inputs.zakat.tip')}
          />

          <div className="space-y-4">
            {/* Main toggle */}
            <label className="flex items-start gap-3 cursor-pointer group py-1">
              <input
                type="checkbox"
                checked={zakatEnabled}
                onChange={(e) => onZakatChange({
                  enabled: e.target.checked,
                  autoCalculate: zakatAutoCalculate,
                  amountPaid: inputs.zakat?.amountPaid,
                })}
                className="h-5 w-5 mt-0.5 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border rounded transition-colors flex-shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <Heart weight="duotone" className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                    {t('inputs.zakat.enable')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t('inputs.zakat.enableHelper')}
                </p>
              </div>
            </label>

            <AnimatePresence>
              {zakatEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Auto-calculate or manual entry */}
                  <div className="flex gap-2 p-1.5 bg-muted/50 rounded-xl">
                    <button
                      type="button"
                      onClick={() => onZakatChange({
                        enabled: true,
                        autoCalculate: true,
                        amountPaid: undefined,
                      })}
                      className={`flex-1 py-3.5 px-4 rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 min-h-[48px] ${
                        zakatAutoCalculate
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t('inputs.zakat.auto')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onZakatChange({
                        enabled: true,
                        autoCalculate: false,
                        amountPaid: inputs.zakat?.amountPaid || estimatedZakat,
                      })}
                      className={`flex-1 py-3.5 px-4 rounded-lg text-[13px] sm:text-sm font-medium transition-all duration-200 min-h-[48px] ${
                        !zakatAutoCalculate
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {t('inputs.zakat.manual')}
                    </button>
                  </div>

                  {zakatAutoCalculate ? (
                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs text-muted-foreground">{t('inputs.zakat.rate')}</span>
                        <span className="text-sm font-medium">2.5%</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20 gap-2">
                        <span className="text-xs font-medium">{t('inputs.zakat.estimated')}</span>
                        <span className="text-base font-bold font-numbers text-emerald-600">
                          {formatCurrency(estimatedZakat, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <InputField
                      label={t('inputs.zakat.amountLabel')}
                      value={inputs.zakat?.amountPaid || 0}
                      onChange={(value) => onZakatChange({
                        enabled: true,
                        autoCalculate: false,
                        amountPaid: value,
                      })}
                      placeholder="0"
                      helperText={t('inputs.zakat.amountHelper')}
                      max={10_000_000}
                    />
                  )}

                  {/* Nisab info */}
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                    <Info weight="bold" className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                      <p>
                        <strong>{t('inputs.zakat.nisab')}:</strong> ~{formatCurrency(nisab, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} {t('inputs.zakat.nisabGold')}
                      </p>
                      <p>
                        <strong>{t('inputs.zakat.enterprise')}:</strong> {t('inputs.zakat.enterpriseDesc')}
                      </p>
                      <p>
                        <strong>{t('inputs.zakat.sdnbhd')}:</strong> {t('inputs.zakat.sdnbhdDesc')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
