import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowCounterClockwise, CalendarCheck } from 'phosphor-react';
import Logo from '@/components/Logo';
import ReliefsSection from '@/components/ReliefsSection';
import { getDefaultReliefs } from '@tax-engine/config';

import ProfitInputSection from './ProfitInputSection';
import SdnBhdSettingsSection from './SdnBhdSettingsSection';
import AuditSection from './AuditSection';
import ZakatSection from './ZakatSection';
import EducationalNotes from './EducationalNotes';
import type { InputsSectionProps } from './types';

// Re-export types for external use
export type { InputsSectionProps, InputCallbacks } from './types';

function InputsSection({
  inputs,
  auditRequired,
  callbacks,
  calculatedProfit,
  hideHeader = false,
}: InputsSectionProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isSignedIn = !!user;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 overflow-hidden lg:border-r border-border/40"
    >
      <div className="h-full flex flex-col">
        {/* Sticky header - hidden when using MobileTabLayout */}
        {!hideHeader && (
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/30 supports-[backdrop-filter]:bg-background/80 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
            <div className="px-4 sm:px-5 lg:px-8 py-3 sm:py-4 lg:py-6">
              <div className="flex items-center justify-between gap-3">
                <Logo size="sm" className="hidden lg:flex" />
                <div className="flex-1 lg:hidden min-w-0">
                  <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight" id="inputs-heading">
                    {t('inputs.header.title')}
                  </h2>
                  <p className="text-xs text-muted-foreground">{t('inputs.header.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge variant="success" className="hidden sm:flex items-center gap-1.5 text-xs h-7 px-2.5" aria-label="Live calculation enabled">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    {t('inputs.badge.live')}
                  </Badge>
                  {isSignedIn && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/dashboard')}
                      className="h-9 px-3 text-muted-foreground hover:text-primary active:scale-[0.98] gap-1.5"
                      title={t('inputs.button.dashboard')}
                    >
                      <CalendarCheck weight="duotone" className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">{t('inputs.button.dashboard')}</span>
                    </Button>
                  )}
                  {callbacks.onClearInputs && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={callbacks.onClearInputs}
                      className="h-9 px-3 text-muted-foreground hover:text-primary active:scale-[0.98] gap-1.5"
                      title={t('inputs.button.reset')}
                    >
                      <ArrowCounterClockwise weight="bold" className="h-4 w-4" />
                      <span className="hidden sm:inline text-xs">{t('inputs.button.reset')}</span>
                    </Button>
                  )}
                  <UserMenu />
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="px-5 sm:px-5 lg:px-8 py-5 sm:py-5 lg:py-6 space-y-5 pb-safe">
            {/* Step 1: Profit inputs */}
            <ProfitInputSection
              inputs={inputs}
              callbacks={{
                onBusinessProfitChange: callbacks.onBusinessProfitChange,
                onOtherIncomeChange: callbacks.onOtherIncomeChange,
                onInputModeChange: callbacks.onInputModeChange,
                onTargetNetIncomeChange: callbacks.onTargetNetIncomeChange,
              }}
              calculatedProfit={calculatedProfit}
            />

            {/* Step 2: Sdn Bhd settings */}
            <SdnBhdSettingsSection
              inputs={inputs}
              callbacks={{
                onMonthlySalaryChange: callbacks.onMonthlySalaryChange,
                onComplianceCostsChange: callbacks.onComplianceCostsChange,
                onDividendDistributionPercentChange: callbacks.onDividendDistributionPercentChange,
                onApplyYa2025DividendSurchargeChange: callbacks.onApplyYa2025DividendSurchargeChange,
                onForeignOwnershipChange: callbacks.onForeignOwnershipChange,
              }}
            />

            {/* Step 3: Audit check */}
            <AuditSection
              inputs={inputs}
              auditRequired={auditRequired}
              callbacks={{
                onAuditRevenueChange: callbacks.onAuditRevenueChange,
                onAuditAssetsChange: callbacks.onAuditAssetsChange,
                onAuditEmployeesChange: callbacks.onAuditEmployeesChange,
                onAuditCostChange: callbacks.onAuditCostChange,
              }}
            />

            {/* Step 4: Tax reliefs */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <ReliefsSection
                reliefs={inputs.reliefs || getDefaultReliefs()}
                onChange={callbacks.onReliefsChange}
              />
            </motion.div>

            {/* Step 5: Zakat */}
            {callbacks.onZakatChange && (
              <ZakatSection
                inputs={inputs}
                onZakatChange={callbacks.onZakatChange}
              />
            )}
          </div>

          {/* Educational Notes Section */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.12, duration: 0.3 }}
            className="px-5 sm:px-5 lg:px-8 py-6 pb-safe"
          >
            <EducationalNotes />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(InputsSection);
