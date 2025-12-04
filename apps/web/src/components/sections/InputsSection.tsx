import { memo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { UserMenu } from '@/components/UserMenu';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  CheckCircle,
  ArrowCounterClockwise,
  Calculator,
  Target,
  Question,
  CaretDown,
  CaretUp,
  Info,
  Lightbulb,
  CalendarCheck,
  Heart,
} from 'phosphor-react';
import InputField from '../InputField';
import Slider from '../Slider';
import ReliefsSection from '../ReliefsSection';
import Logo from '../Logo';
import { getDefaultReliefs, ZAKAT_RATE, getCurrentNisab, type PersonalReliefs } from '@tax-engine/config';
import type { TaxCalculationInputs, InputMode, ZakatInput } from '@tax-engine/core';

interface InputsSectionProps {
  inputs: TaxCalculationInputs;
  auditRequired: boolean;
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
  calculatedProfit?: number;
  onZakatChange?: (zakat: ZakatInput) => void;
}

// Inline help component
function InlineHelp({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
      <Lightbulb weight="duotone" className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

// Section header with optional expandable info
function SectionHeader({
  title,
  subtitle,
  tip,
}: {
  title: string;
  subtitle: string;
  tip?: string;
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {tip && (
          <button
            type="button"
            onClick={() => setShowTip(!showTip)}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            aria-label={showTip ? 'Hide tip' : 'Show tip'}
          >
            <Question weight="bold" className="h-4 w-4" />
          </button>
        )}
      </div>
      <AnimatePresence>
        {showTip && tip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <InlineHelp>{tip}</InlineHelp>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Collapsible section
function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-2xl overflow-hidden bg-card">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
      >
        <span className="text-sm font-semibold">{title}</span>
        {isOpen ? (
          <CaretUp weight="bold" className="h-4 w-4 text-muted-foreground" />
        ) : (
          <CaretDown weight="bold" className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InputsSection({
  inputs,
  auditRequired,
  onBusinessProfitChange,
  onOtherIncomeChange,
  onMonthlySalaryChange,
  onComplianceCostsChange,
  onAuditRevenueChange,
  onAuditAssetsChange,
  onAuditEmployeesChange,
  onAuditCostChange,
  onReliefsChange,
  onApplyYa2025DividendSurchargeChange,
  onDividendDistributionPercentChange,
  onForeignOwnershipChange,
  onClearInputs,
  onInputModeChange,
  onTargetNetIncomeChange,
  calculatedProfit,
  onZakatChange,
}: InputsSectionProps) {
  const navigate = useNavigate();
  const inputMode = inputs.inputMode || 'profit';

  // Zakat helpers
  const zakatEnabled = inputs.zakat?.enabled || false;
  const zakatAutoCalculate = inputs.zakat?.autoCalculate !== false;
  const nisab = getCurrentNisab();
  const estimatedZakat = inputs.businessProfit * ZAKAT_RATE;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="flex-1 overflow-hidden lg:border-r border-border/40"
    >
      <div className="h-full flex flex-col">
        {/* Sticky header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60 lg:bg-transparent lg:backdrop-blur-none lg:border-0">
          <div className="px-4 sm:px-5 lg:px-8 py-3 sm:py-4 lg:py-6">
            <div className="flex items-center justify-between gap-3">
              <Logo size="sm" className="hidden lg:flex" />
              <div className="flex-1 lg:hidden min-w-0">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight" id="inputs-heading">
                  Your Numbers
                </h2>
                <p className="text-xs text-muted-foreground">Results update as you type</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge variant="secondary" className="hidden sm:flex items-center gap-1.5 text-xs h-7 px-2.5" aria-label="Live calculation enabled">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  Live
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="h-9 px-3 text-muted-foreground hover:text-foreground active:scale-95 gap-1.5"
                  title="Go to Dashboard"
                >
                  <CalendarCheck weight="duotone" className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">Dashboard</span>
                </Button>
                {onClearInputs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearInputs}
                    className="h-9 w-9 p-0 text-muted-foreground hover:text-foreground active:scale-95"
                    title="Reset all inputs to defaults"
                  >
                    <ArrowCounterClockwise weight="bold" className="h-4 w-4" />
                    <span className="sr-only">Reset inputs</span>
                  </Button>
                )}
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <div className="px-4 sm:px-5 lg:px-8 py-4 sm:py-5 lg:py-6 space-y-5 pb-safe">

            {/* Step 1: How do you want to calculate? */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.05, duration: 0.35 }}
            >
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <SectionHeader
                    title="How do you want to calculate?"
                    subtitle="Choose your starting point"
                    tip="'I know my profit' is best if you have financial records. 'Target take-home' helps if you want to work backwards from a goal."
                  />

                  {/* Input Mode Toggle */}
                  {onInputModeChange && (
                    <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl">
                      <button
                        type="button"
                        onClick={() => onInputModeChange('profit')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          inputMode === 'profit'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground active:scale-[0.98]'
                        }`}
                      >
                        <Calculator weight={inputMode === 'profit' ? 'fill' : 'regular'} className="h-4 w-4" />
                        <span>I know my profit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onInputModeChange('target')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          inputMode === 'target'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground active:scale-[0.98]'
                        }`}
                      >
                        <Target weight={inputMode === 'target' ? 'fill' : 'regular'} className="h-4 w-4" />
                        <span>Target take-home</span>
                      </button>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {inputMode === 'target' && onTargetNetIncomeChange ? (
                      <motion.div
                        key="target-mode"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <InputField
                          label="How much do you want to take home monthly?"
                          value={inputs.targetNetIncome || 10000}
                          onChange={onTargetNetIncomeChange}
                          placeholder="10,000"
                          helperText="After all taxes and deductions"
                          max={10_000_000}
                        />
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-xs text-muted-foreground flex-shrink-0">That's annually</span>
                            <span className="text-sm font-semibold font-numbers truncate">
                              {formatCurrency((inputs.targetNetIncome || 10000) * 12, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-3 border-t border-emerald-500/20 gap-2">
                            <span className="text-xs font-medium flex-shrink-0">You need to earn</span>
                            <span className="text-base font-bold font-numbers text-emerald-600 truncate">
                              {formatCurrency(calculatedProfit || 0, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year
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
                        <InputField
                          label="What's your annual business profit?"
                          value={inputs.businessProfit}
                          onChange={onBusinessProfitChange}
                          placeholder="150,000"
                          helperText="Revenue minus expenses, before paying yourself"
                          max={100_000_000}
                        />
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Info weight="bold" className="h-3.5 w-3.5" />
                          <span>Typical range: RM50k - RM500k for small businesses</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <InputField
                    label="Any other personal income?"
                    value={inputs.otherIncome}
                    onChange={onOtherIncomeChange}
                    placeholder="0"
                    helperText="Rental income, side jobs, dividends from other companies, etc."
                    max={50_000_000}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 2: If you go Sdn Bhd */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <SectionHeader
                    title="If you go Sdn Bhd..."
                    subtitle="These settings affect your Sdn Bhd calculation"
                    tip="As a Sdn Bhd director, you pay yourself a salary (which is tax-deductible for the company). The remaining profit can be taken as dividends."
                  />

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <Slider
                        label="How much salary would you pay yourself?"
                        value={inputs.monthlySalary || 5000}
                        onChange={onMonthlySalaryChange}
                        min={3000}
                        max={20000}
                        step={500}
                      />
                      <p className="text-xs text-muted-foreground pl-1">
                        Higher salary = more EPF savings but more personal tax
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        label="Expected compliance costs"
                        value={inputs.complianceCosts || 5000}
                        onChange={onComplianceCostsChange}
                        min={3000}
                        max={15000}
                        step={500}
                      />
                      <p className="text-xs text-muted-foreground pl-1">
                        Secretary fees, tax filing, bookkeeping. Typical: RM5k-10k/year
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Slider
                        label="How much profit to take as dividends?"
                        value={inputs.dividendDistributionPercent ?? 100}
                        onChange={onDividendDistributionPercentChange}
                        min={0}
                        max={100}
                        step={10}
                        prefix=""
                        formatValue={(v) => `${v}%`}
                      />
                      <p className="text-xs text-muted-foreground pl-1">
                        {inputs.dividendDistributionPercent === 100
                          ? 'Taking all profits out (most common)'
                          : inputs.dividendDistributionPercent === 0
                          ? 'Keeping all profits in the company for growth'
                          : `Taking ${inputs.dividendDistributionPercent}%, keeping ${100 - (inputs.dividendDistributionPercent ?? 100)}% for growth`}
                      </p>
                    </div>
                  </div>

                  {/* Advanced options */}
                  <CollapsibleSection title="Advanced options" defaultOpen={false}>
                    <div className="space-y-3">
                      <label className="flex items-start gap-3 cursor-pointer group py-1">
                        <input
                          type="checkbox"
                          checked={inputs.applyYa2025DividendSurcharge || false}
                          onChange={(e) => onApplyYa2025DividendSurchargeChange(e.target.checked)}
                          className="h-5 w-5 mt-0.5 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border rounded transition-colors flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                            Apply 2% dividend surcharge (YA 2025)
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Only applies if dividends exceed RM100k
                          </p>
                        </div>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer group py-1">
                        <input
                          type="checkbox"
                          checked={inputs.hasForeignOwnership || false}
                          onChange={(e) => onForeignOwnershipChange(e.target.checked)}
                          className="h-5 w-5 mt-0.5 text-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 border-border rounded transition-colors flex-shrink-0"
                        />
                        <div>
                          <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                            Company has foreign shareholders (≥20%)
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Disqualifies from SME tax rates
                          </p>
                        </div>
                      </label>
                    </div>
                  </CollapsibleSection>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 3: Audit check */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.35 }}
            >
              <Card className="border-border/50 shadow-sm overflow-hidden">
                <CardContent className="p-4 sm:p-5 space-y-4">
                  <SectionHeader
                    title="Do you need an audit?"
                    subtitle="Small companies can be exempt"
                    tip="You're exempt from audit if you meet ALL three criteria: Revenue ≤ RM100k, Assets ≤ RM300k, and Employees ≤ 5. This saves RM3-8k/year."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <InputField
                      label="Revenue"
                      value={inputs.auditCriteria?.revenue || 100000}
                      onChange={onAuditRevenueChange}
                      min={0}
                      max={100_000_000}
                      helperText="≤ RM100k to qualify"
                    />
                    <InputField
                      label="Total assets"
                      value={inputs.auditCriteria?.totalAssets || 300000}
                      onChange={onAuditAssetsChange}
                      min={0}
                      max={100_000_000}
                      helperText="≤ RM300k to qualify"
                    />
                    <InputField
                      label="Employees"
                      value={inputs.auditCriteria?.employees || 5}
                      onChange={onAuditEmployeesChange}
                      min={0}
                      max={10000}
                      step={1}
                      prefix=""
                      helperText="≤ 5 to qualify"
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
                          <AlertTitle className="text-xs font-semibold text-amber-700">Audit required</AlertTitle>
                          <AlertDescription className="text-xs mt-0.5 text-amber-600/80">
                            Your company exceeds exemption thresholds. Audit cost will be included.
                          </AlertDescription>
                        </Alert>
                        <Slider
                          label="Estimated audit cost"
                          value={inputs.auditCost || 5000}
                          onChange={onAuditCostChange}
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
                          <AlertTitle className="text-xs font-semibold text-emerald-700">Audit exempt!</AlertTitle>
                          <AlertDescription className="text-xs mt-0.5 text-emerald-600/80">
                            You qualify for audit exemption. Saving ~RM5,000/year.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Step 4: Tax reliefs */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.35 }}
            >
              <ReliefsSection reliefs={inputs.reliefs || getDefaultReliefs()} onChange={onReliefsChange} />
            </motion.div>

            {/* Step 5: Zakat */}
            {onZakatChange && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.35 }}
              >
                <Card className="border-border/50 shadow-sm overflow-hidden">
                  <CardContent className="p-4 sm:p-5 space-y-4">
                    <SectionHeader
                      title="Zakat"
                      subtitle="Islamic wealth tax for eligible Muslims"
                      tip="Zakat is 2.5% of your nisab-eligible income. For Enterprise, you get a 100% TAX REBATE (direct tax reduction). For Sdn Bhd, it's a 2.5% TAX DEDUCTION from aggregate income."
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
                              I pay zakat
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Enable to see how zakat affects your tax calculation
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
                            <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl">
                              <button
                                type="button"
                                onClick={() => onZakatChange({
                                  enabled: true,
                                  autoCalculate: true,
                                  amountPaid: undefined,
                                })}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  zakatAutoCalculate
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                Auto-calculate (2.5%)
                              </button>
                              <button
                                type="button"
                                onClick={() => onZakatChange({
                                  enabled: true,
                                  autoCalculate: false,
                                  amountPaid: inputs.zakat?.amountPaid || estimatedZakat,
                                })}
                                className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                  !zakatAutoCalculate
                                    ? 'bg-background text-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                              >
                                Enter amount
                              </button>
                            </div>

                            {zakatAutoCalculate ? (
                              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between items-center gap-2">
                                  <span className="text-xs text-muted-foreground">Zakat rate</span>
                                  <span className="text-sm font-medium">2.5%</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-emerald-500/20 gap-2">
                                  <span className="text-xs font-medium">Estimated annual zakat</span>
                                  <span className="text-base font-bold font-numbers text-emerald-600">
                                    {formatCurrency(estimatedZakat, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <InputField
                                label="Annual zakat amount paid"
                                value={inputs.zakat?.amountPaid || 0}
                                onChange={(value) => onZakatChange({
                                  enabled: true,
                                  autoCalculate: false,
                                  amountPaid: value,
                                })}
                                placeholder="0"
                                helperText="Amount paid to state zakat authority"
                                max={10_000_000}
                              />
                            )}

                            {/* Nisab info */}
                            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 border border-border/30">
                              <Info weight="bold" className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div className="text-xs text-muted-foreground leading-relaxed space-y-1">
                                <p>
                                  <strong>Nisab (2025):</strong> ~{formatCurrency(nisab, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (85g gold)
                                </p>
                                <p>
                                  <strong>Enterprise:</strong> 100% tax rebate (reduces tax directly)
                                </p>
                                <p>
                                  <strong>Sdn Bhd:</strong> 2.5% tax deduction (reduces taxable income)
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
            )}

          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(InputsSection);
