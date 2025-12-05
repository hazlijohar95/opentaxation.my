import type { PersonalReliefs } from '@tax-engine/config';
import type { TaxCalculationInputs, InputMode, ZakatInput } from '@tax-engine/core';

/** Callback functions for InputsSection */
export interface InputCallbacks {
  onBusinessProfitChange: (value: number) => void;
  onOtherIncomeChange: (value: number) => void;
  onMonthlySalaryChange: (value: number) => void;
  onComplianceCostsChange: (value: number) => void;
  onAuditRevenueChange: (value: number) => void;
  onAuditAssetsChange: (value: number) => void;
  onAuditEmployeesChange: (value: number) => void;
  onAuditCostChange: (value: number) => void;
  onReliefsChange: (reliefs: PersonalReliefs) => void;
  onApplyYa2025DividendSurchargeChange: (value: boolean) => void;
  onDividendDistributionPercentChange: (value: number) => void;
  onForeignOwnershipChange: (value: boolean) => void;
  onClearInputs?: () => void;
  onInputModeChange?: (mode: InputMode) => void;
  onTargetNetIncomeChange?: (value: number) => void;
  onZakatChange?: (zakat: ZakatInput) => void;
}

/** Props for InputsSection */
export interface InputsSectionProps {
  inputs: TaxCalculationInputs;
  auditRequired: boolean;
  callbacks: InputCallbacks;
  calculatedProfit?: number;
  /** Hide header for mobile tab layout (header is in MobileHeader instead) */
  hideHeader?: boolean;
}

/** Props for ProfitInputSection */
export interface ProfitInputSectionProps {
  inputs: TaxCalculationInputs;
  callbacks: Pick<InputCallbacks, 'onBusinessProfitChange' | 'onOtherIncomeChange' | 'onInputModeChange' | 'onTargetNetIncomeChange'>;
  calculatedProfit?: number;
}

/** Props for SdnBhdSettingsSection */
export interface SdnBhdSettingsSectionProps {
  inputs: TaxCalculationInputs;
  callbacks: Pick<
    InputCallbacks,
    | 'onMonthlySalaryChange'
    | 'onComplianceCostsChange'
    | 'onDividendDistributionPercentChange'
    | 'onApplyYa2025DividendSurchargeChange'
    | 'onForeignOwnershipChange'
  >;
}

/** Props for AuditSection */
export interface AuditSectionProps {
  inputs: TaxCalculationInputs;
  auditRequired: boolean;
  callbacks: Pick<
    InputCallbacks,
    'onAuditRevenueChange' | 'onAuditAssetsChange' | 'onAuditEmployeesChange' | 'onAuditCostChange'
  >;
}

/** Props for ZakatSection */
export interface ZakatSectionProps {
  inputs: TaxCalculationInputs;
  onZakatChange: (zakat: ZakatInput) => void;
}
