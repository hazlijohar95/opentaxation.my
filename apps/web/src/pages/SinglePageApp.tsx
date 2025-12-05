import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { isAuditExempt, getDefaultReliefs, calculateRequiredIncomeForNetCash, calculateTotalReliefs, type PersonalReliefs } from '@tax-engine/config';
import { type TaxCalculationInputs, type InputMode, type ZakatInput } from '@tax-engine/core';
import { useTaxCalculation } from '../hooks/useTaxCalculation';
import { useErrorToast } from '../hooks/useErrorToast';
import { useTaxInputsStorage, type StoredInputs } from '../hooks/useLocalStorage';
import { useShareableLink } from '../hooks/useShareableLink';
import { useIsMobile } from '../hooks/useMediaQuery';
import LandingSection from '../components/sections/LandingSection';
import InputsSection, { type InputCallbacks } from '../components/sections/InputsSection';
import ResultsSection from '../components/sections/ResultsSection';
import ShareModal from '../components/ShareModal';
import { MobileTabLayout, type TabType } from '../components/mobile';
import LegalFooter from '../components/pages/LegalFooter';

// Default values for tax inputs
const DEFAULT_INPUTS: StoredInputs = {
  businessProfit: 0,
  otherIncome: 0,
  monthlySalary: 0,
  complianceCosts: 5000,
  auditRevenue: 100000,
  auditAssets: 300000,
  auditEmployees: 5,
  auditCost: 5000,
  applyYa2025DividendSurcharge: false,
  dividendDistributionPercent: 100,
  hasForeignOwnership: false,
  inputMode: 'profit',
  targetNetIncome: 10000, // Monthly target take-home
};

export default function SinglePageApp() {
  const { user } = useAuth();
  const [showApp, setShowApp] = useState(false);
  const isSignedIn = !!user;

  // Mobile layout state
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<TabType>('inputs');

  // Use localStorage persistence for all inputs
  const { inputs: storedInputs, updateInput, updateAllInputs, clearInputs } = useTaxInputsStorage(DEFAULT_INPUTS);

  // Relief state kept separate since it has a different structure
  const [reliefs, setReliefs] = useState<PersonalReliefs>(getDefaultReliefs());

  // Handler for loading shared inputs from URL
  const handleLoadSharedInputs = useCallback((sharedInputs: Partial<StoredInputs>) => {
    // Update all inputs with shared values (preserving any missing as current values)
    updateAllInputs({
      ...storedInputs,
      ...sharedInputs,
    });
    // Auto-show app when loading from shared link
    setShowApp(true);
  }, [updateAllInputs, storedInputs]);

  // Shareable link functionality
  const { generateShareableLink } = useShareableLink(storedInputs, handleLoadSharedInputs);

  // Share modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Create wrapper setters that update localStorage
  const setBusinessProfit = useCallback((value: number) => updateInput('businessProfit', value), [updateInput]);
  const setOtherIncome = useCallback((value: number) => updateInput('otherIncome', value), [updateInput]);
  const setMonthlySalary = useCallback((value: number) => updateInput('monthlySalary', value), [updateInput]);
  const setComplianceCosts = useCallback((value: number) => updateInput('complianceCosts', value), [updateInput]);
  const setAuditRevenue = useCallback((value: number) => updateInput('auditRevenue', value), [updateInput]);
  const setAuditAssets = useCallback((value: number) => updateInput('auditAssets', value), [updateInput]);
  const setAuditEmployees = useCallback((value: number) => updateInput('auditEmployees', value), [updateInput]);
  const setAuditCost = useCallback((value: number) => updateInput('auditCost', value), [updateInput]);
  const setApplyYa2025DividendSurcharge = useCallback((value: boolean) => updateInput('applyYa2025DividendSurcharge', value), [updateInput]);
  const setDividendDistributionPercent = useCallback((value: number) => updateInput('dividendDistributionPercent', value), [updateInput]);
  const setHasForeignOwnership = useCallback((value: boolean) => updateInput('hasForeignOwnership', value), [updateInput]);
  const setInputMode = useCallback((value: InputMode) => updateInput('inputMode', value), [updateInput]);
  const setTargetNetIncome = useCallback((value: number) => updateInput('targetNetIncome', value), [updateInput]);
  const setZakat = useCallback((value: ZakatInput) => updateInput('zakat', value), [updateInput]);

  // Handler to reset all inputs to defaults
  const handleClearInputs = useCallback(() => {
    clearInputs();
    setReliefs(getDefaultReliefs());
  }, [clearInputs]);

  // Create callbacks object for InputsSection (Callback Object Pattern)
  // This reduces prop drilling from 20+ individual props to a single callbacks object
  const inputCallbacks: InputCallbacks = useMemo(() => ({
    onBusinessProfitChange: setBusinessProfit,
    onOtherIncomeChange: setOtherIncome,
    onMonthlySalaryChange: setMonthlySalary,
    onComplianceCostsChange: setComplianceCosts,
    onAuditRevenueChange: setAuditRevenue,
    onAuditAssetsChange: setAuditAssets,
    onAuditEmployeesChange: setAuditEmployees,
    onAuditCostChange: setAuditCost,
    onReliefsChange: setReliefs,
    onApplyYa2025DividendSurchargeChange: setApplyYa2025DividendSurcharge,
    onDividendDistributionPercentChange: setDividendDistributionPercent,
    onForeignOwnershipChange: setHasForeignOwnership,
    onClearInputs: handleClearInputs,
    onInputModeChange: setInputMode,
    onTargetNetIncomeChange: setTargetNetIncome,
    onZakatChange: setZakat,
  }), [
    setBusinessProfit, setOtherIncome, setMonthlySalary, setComplianceCosts,
    setAuditRevenue, setAuditAssets, setAuditEmployees, setAuditCost,
    setReliefs, setApplyYa2025DividendSurcharge, setDividendDistributionPercent,
    setHasForeignOwnership, handleClearInputs, setInputMode, setTargetNetIncome, setZakat,
  ]);

  // Calculate derived state during render (not in Effects)
  // Per React best practices: https://react.dev/learn/you-might-not-need-an-effect
  const auditRequired = !isAuditExempt({
    revenue: storedInputs.auditRevenue,
    totalAssets: storedInputs.auditAssets,
    employees: storedInputs.auditEmployees,
  });

  // Calculate total reliefs for reverse calculation
  const totalReliefs = calculateTotalReliefs(reliefs);

  // Calculate required income for target mode
  // Target is monthly, so multiply by 12 for annual
  const annualTargetNetIncome = (storedInputs.targetNetIncome || 10000) * 12;
  const requiredGrossIncome = storedInputs.inputMode === 'target'
    ? calculateRequiredIncomeForNetCash(annualTargetNetIncome, totalReliefs)
    : 0;

  // Calculate effective business profit based on input mode
  // In target mode: required gross income - other income = required business profit
  const effectiveBusinessProfit = storedInputs.inputMode === 'target'
    ? Math.max(0, requiredGrossIncome - storedInputs.otherIncome)
    : storedInputs.businessProfit;

  // Create inputs object during render - this is fine since it's used immediately
  // The useTaxCalculation hook will properly memoize based on primitive values
  const inputs: TaxCalculationInputs = {
    businessProfit: effectiveBusinessProfit,
    otherIncome: storedInputs.otherIncome,
    monthlySalary: storedInputs.monthlySalary,
    complianceCosts: storedInputs.complianceCosts,
    auditCost: auditRequired ? storedInputs.auditCost : 0,
    auditCriteria: {
      revenue: storedInputs.auditRevenue,
      totalAssets: storedInputs.auditAssets,
      employees: storedInputs.auditEmployees,
    },
    reliefs,
    applyYa2025DividendSurcharge: storedInputs.applyYa2025DividendSurcharge,
    dividendDistributionPercent: storedInputs.dividendDistributionPercent,
    hasForeignOwnership: storedInputs.hasForeignOwnership,
    inputMode: storedInputs.inputMode,
    targetNetIncome: storedInputs.targetNetIncome,
    zakat: storedInputs.zakat,
  };

  const comparison = useTaxCalculation(inputs);
  const { ErrorToastContainer } = useErrorToast();

  // Automatically show app when user signs in
  useEffect(() => {
    if (isSignedIn && !showApp) {
      setShowApp(true);
    }
  }, [isSignedIn, showApp]);

  if (!showApp) {
    return (
      <>
        <ErrorToastContainer />
        <LandingSection onStart={() => setShowApp(true)} />
      </>
    );
  }

  // App Page - Single viewport, left to right, no scrolling
  return (
    <>
      <ErrorToastContainer />
      <a
        href="#inputs-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to inputs
      </a>
      <a
        href="#results-heading"
        className="sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to results
      </a>
      <AnimatePresence mode="wait">
        {isMobile ? (
          // Mobile: Tab-based layout with full-height content
          <motion.div
            key="app-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="safe-area-insets"
          >
            <MobileTabLayout
              activeTab={activeTab}
              onTabChange={setActiveTab}
              hasResults={!!comparison}
              onClearInputs={handleClearInputs}
              inputsContent={
                <InputsSection
                  inputs={inputs}
                  auditRequired={auditRequired}
                  callbacks={inputCallbacks}
                  calculatedProfit={effectiveBusinessProfit}
                  hideHeader
                />
              }
              resultsContent={
                <ResultsSection
                  comparison={comparison}
                  inputs={inputs}
                  onShareClick={() => setIsShareModalOpen(true)}
                  hideHeader
                  isSignedIn={isSignedIn}
                />
              }
            />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              inputs={inputs}
              comparison={comparison}
              generateShareableLink={generateShareableLink}
            />
          </motion.div>
        ) : (
          // Desktop: Side-by-side layout
          <motion.div
            key="app-desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-screen w-full overflow-hidden bg-background flex flex-row safe-area-insets"
          >
            <InputsSection
              inputs={inputs}
              auditRequired={auditRequired}
              callbacks={inputCallbacks}
              calculatedProfit={effectiveBusinessProfit}
            />
            <ResultsSection
              comparison={comparison}
              inputs={inputs}
              onShareClick={() => setIsShareModalOpen(true)}
              isSignedIn={isSignedIn}
            />
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              inputs={inputs}
              comparison={comparison}
              generateShareableLink={generateShareableLink}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {showApp && <LegalFooter />}
    </>
  );
}
