import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info } from 'phosphor-react';
import InputField from '@/components/InputField';
import Slider from '@/components/Slider';
import { SectionHeader } from './shared';
import type { AuditSectionProps } from './types';

export default function AuditSection({
  inputs,
  auditRequired,
  callbacks,
}: AuditSectionProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.06, duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-5 sm:p-5 space-y-4">
          <SectionHeader
            title={t('inputs.audit.title')}
            subtitle={t('inputs.audit.subtitle')}
            tip={t('inputs.audit.tip')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InputField
              label={t('inputs.audit.revenue')}
              value={inputs.auditCriteria?.revenue || 100000}
              onChange={callbacks.onAuditRevenueChange}
              min={0}
              max={100_000_000}
              helperText={t('inputs.audit.revenueHelper')}
            />
            <InputField
              label={t('inputs.audit.assets')}
              value={inputs.auditCriteria?.totalAssets || 300000}
              onChange={callbacks.onAuditAssetsChange}
              min={0}
              max={100_000_000}
              helperText={t('inputs.audit.assetsHelper')}
            />
            <InputField
              label={t('inputs.audit.employees')}
              value={inputs.auditCriteria?.employees || 5}
              onChange={callbacks.onAuditEmployeesChange}
              min={0}
              max={10000}
              step={1}
              prefix=""
              helperText={t('inputs.audit.employeesHelper')}
            />
          </div>

          <AnimatePresence mode="wait">
            {auditRequired ? (
              <motion.div
                key="required"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <Alert className="border-amber-500/30 bg-amber-500/5 rounded-xl">
                  <Info weight="fill" className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-xs font-semibold text-amber-700">{t('inputs.audit.required')}</AlertTitle>
                  <AlertDescription className="text-xs mt-0.5 text-amber-600/80">
                    {t('inputs.audit.requiredDesc')}
                  </AlertDescription>
                </Alert>
                <Slider
                  label={t('inputs.audit.costLabel')}
                  value={inputs.auditCost || 3000}
                  onChange={callbacks.onAuditCostChange}
                  min={3000}
                  max={8000}
                  step={500}
                />
              </motion.div>
            ) : (
              <motion.div
                key="exempt"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Alert className="border-emerald-500/30 bg-emerald-500/5 rounded-xl">
                  <CheckCircle weight="fill" className="h-4 w-4 text-emerald-600" />
                  <AlertTitle className="text-xs font-semibold text-emerald-700">{t('inputs.audit.exempt')}</AlertTitle>
                  <AlertDescription className="text-xs mt-0.5 text-emerald-600/80">
                    {t('inputs.audit.exemptDesc')}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
