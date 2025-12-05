import {
  calculateEmployerEPF,
  calculateEmployeeEPF,
  calculateEmployerSOCSO,
  calculateEmployeeSOCSO,
  calculateMaxAffordableSalary,
  isAuditExempt,
  calculateDividendTax,
  RELIEF_LIMITS,
  getPersonalTaxBracketBreakdown,
  getCorporateTaxBracketBreakdown,
  calculateBusinessZakatDeduction,
  meetsNisabThreshold,
  ZAKAT_RATE,
  type PersonalReliefs,
} from '@tax-engine/config';
import { calculateCorporateTax } from './calculateCorporateTax';
import { calculatePersonalTax } from './calculatePersonalTax';
import type { TaxCalculationInputs, SdnBhdScenarioResult, WaterfallStep, TaxBracketBreakdown, ZakatResult } from '../types';

/**
 * Calculate Sdn Bhd (Private Limited Company) scenario
 *
 * ## Cash Flow Formula
 *
 * **Company Side:**
 * ```
 * Taxable Profit = Business Profit - Salary - Employer EPF - Employer SOCSO - Zakat Deduction
 * Corporate Tax = Progressive rate on Taxable Profit (15% up to RM150k, 17% RM150k-600k, 24% above)
 * Post-Tax Profit = Taxable Profit - Corporate Tax
 * Dividends = Post-Tax Profit × Distribution %
 * ```
 *
 * **Personal Side:**
 * ```
 * Take-Home Salary = Gross Salary - Employee EPF (11%) - Employee SOCSO
 * Personal Tax = Progressive rate on (Salary + Other Income - Reliefs)
 * Net Cash = Take-Home Salary + Other Income - Personal Tax + Dividends - Dividend Tax - Compliance - Zakat
 * ```
 *
 * ## Key Features
 * - EPF relief auto-calculated from actual contributions (capped at RM7,000)
 * - Supports partial dividend distribution (retaining earnings)
 * - Checks salary affordability against company profit
 * - Allows negative net cash to show loss scenarios
 *
 * ## Zakat Treatment (Sdn Bhd/Company)
 * - Zakat is a TAX DEDUCTION from aggregate income (NOT rebate)
 * - Maximum deduction: 2.5% of aggregate income
 * - Reference: Section 44(11A) Income Tax Act 1967
 *
 * @param inputs - Calculation inputs including profit, salary, compliance costs
 * @returns Complete Sdn Bhd scenario results with waterfall breakdowns
 */
export function calculateSdnBhdScenario(
  inputs: Required<Pick<TaxCalculationInputs, 'businessProfit' | 'monthlySalary' | 'otherIncome' | 'complianceCosts'>> &
    Pick<TaxCalculationInputs, 'auditCost' | 'auditCriteria' | 'reliefs' | 'applyYa2025DividendSurcharge' | 'dividendDistributionPercent' | 'zakat'>
): SdnBhdScenarioResult {
  const {
    businessProfit,
    monthlySalary,
    otherIncome,
    complianceCosts,
    auditCost = 0,
    auditCriteria,
    reliefs,
    applyYa2025DividendSurcharge = false,
    dividendDistributionPercent = 100, // Default to 100% distribution
    zakat,
  } = inputs;

  // Input validation and sanitization
  if (!isFinite(businessProfit) || businessProfit < 0) {
    throw new Error('Business profit must be a valid non-negative number');
  }
  if (!isFinite(monthlySalary) || monthlySalary < 0) {
    throw new Error('Monthly salary must be a valid non-negative number');
  }
  if (!isFinite(otherIncome) || otherIncome < 0) {
    throw new Error('Other income must be a valid non-negative number');
  }
  if (!isFinite(complianceCosts) || complianceCosts < 0) {
    throw new Error('Compliance costs must be a valid non-negative number');
  }

  // Validate dividend distribution percentage
  const distributionPercent = Math.max(0, Math.min(100, dividendDistributionPercent));

  // Company side calculations
  const annualSalary = monthlySalary * 12;
  const employerEPF = calculateEmployerEPF(annualSalary);

  // SOCSO calculations (mandatory for salary ≤ RM5,000/month)
  const employerSOCSO = calculateEmployerSOCSO(monthlySalary) * 12;
  const employeeSOCSO = calculateEmployeeSOCSO(monthlySalary) * 12;

  // Company taxable profit includes SOCSO as a deductible expense
  const companyTaxableProfitBeforeZakat = businessProfit - annualSalary - employerEPF - employerSOCSO;

  // Calculate zakat deduction for company if enabled
  // For Sdn Bhd, zakat is a deduction from aggregate income (max 2.5% of aggregate income)
  let zakatResult: ZakatResult | undefined;
  let zakatDeduction = 0;
  let zakatAmount = 0;
  let excessZakat = 0;
  const aggregateIncome = Math.max(0, companyTaxableProfitBeforeZakat);

  if (zakat?.enabled) {
    // Determine zakat amount: use provided amount or auto-calculate
    if (zakat.autoCalculate !== false && zakat.amountPaid === undefined) {
      // Auto-calculate zakat at 2.5% of aggregate income
      zakatAmount = Math.round(aggregateIncome * ZAKAT_RATE * 100) / 100;
    } else {
      zakatAmount = zakat.amountPaid ?? 0;
    }

    // Calculate the deduction (max 2.5% of aggregate income)
    const deductionResult = calculateBusinessZakatDeduction(zakatAmount, aggregateIncome);
    zakatDeduction = deductionResult.deduction;
    excessZakat = deductionResult.excessZakat;

    zakatResult = {
      enabled: true,
      zakatAmount: Math.round(zakatAmount * 100) / 100,
      meetsNisab: meetsNisabThreshold(aggregateIncome),
      taxBenefit: Math.round(zakatDeduction * 100) / 100, // The deduction value
      excessZakat: Math.round(excessZakat * 100) / 100,
    };
  }

  // Company taxable profit after zakat deduction
  const companyTaxableProfit = Math.max(0, companyTaxableProfitBeforeZakat - zakatDeduction);

  // Calculate salary affordability
  // This checks if the company can actually pay the proposed salary
  const maxAffordableSalary = calculateMaxAffordableSalary(businessProfit);
  const totalSalaryCost = annualSalary + employerEPF + employerSOCSO;
  const isAffordable = totalSalaryCost <= businessProfit;
  const shortfall = isAffordable ? 0 : totalSalaryCost - businessProfit;
  const companyWouldBeInsolvent = !isAffordable;

  // Calculate corporate tax on profit after zakat deduction
  const corporateTaxResult = calculateCorporateTax(companyTaxableProfit);
  const corporateTax = corporateTaxResult.tax;

  // Calculate what corporate tax would have been without zakat deduction (for display)
  const corporateTaxBeforeZakat = zakat?.enabled
    ? calculateCorporateTax(Math.max(0, companyTaxableProfitBeforeZakat)).tax
    : undefined;

  // Post-tax profit
  const postTaxProfit = Math.max(0, companyTaxableProfit - corporateTax);

  // Dividends - support partial distribution
  // Note: Starting YA 2025, dividends > RM100k are subject to 2% tax
  const dividends = Math.max(0, postTaxProfit * (distributionPercent / 100));
  const retainedEarnings = postTaxProfit - dividends;
  const dividendTax = applyYa2025DividendSurcharge && dividends > 0
    ? calculateDividendTax(dividends)
    : 0;

  // Owner side calculations
  const employeeEPF = calculateEmployeeEPF(annualSalary);
  // Salary after deducting employee EPF and SOCSO contributions
  const salaryAfterEPF = annualSalary - employeeEPF - employeeSOCSO;

  // Auto-calculate EPF relief from actual employee EPF contributions
  // EPF relief is capped at RM7,000 per Malaysian tax law
  const actualEpfRelief = Math.min(employeeEPF, RELIEF_LIMITS.epfAndLifeInsurance);

  // Merge user-provided reliefs with calculated EPF relief
  // The calculated EPF relief replaces the default/user-provided value for accuracy
  const effectiveReliefs: PersonalReliefs = reliefs
    ? { ...reliefs, epfAndLifeInsurance: actualEpfRelief }
    : { basic: RELIEF_LIMITS.basic, epfAndLifeInsurance: actualEpfRelief, medical: RELIEF_LIMITS.medical };

  // Personal tax on salary + other income
  // In Malaysia, personal tax is calculated on gross income, with EPF claimed as relief
  const totalPersonalIncome = annualSalary + otherIncome;
  const personalTaxResult = calculatePersonalTax(totalPersonalIncome, effectiveReliefs);
  const personalTax = personalTaxResult.tax;

  // Total cash from salary and other income after EPF and tax
  // EPF is deducted from gross salary, then tax is paid from remaining income
  // Formula: (Gross Salary - Employee EPF) + Other Income - Personal Tax
  const totalCashFromIncome = salaryAfterEPF + otherIncome - personalTax;

  // Compliance costs
  let totalComplianceCost = complianceCosts;
  if (auditCriteria) {
    const auditRequired = !isAuditExempt(auditCriteria);
    if (auditRequired) {
      totalComplianceCost += auditCost;
    }
  }

  // Net cash = (salary + other income after EPF and tax) + dividends - dividend tax - compliance costs - zakat paid
  // Note: We allow negative values to show when a scenario results in loss
  // Zakat paid by the company reduces what's available for distribution/owner
  const netCash = totalCashFromIncome + dividends - dividendTax - totalComplianceCost - zakatAmount;

  // Total EPF savings (forced retirement savings)
  const epfSavings = employerEPF + employeeEPF;

  // Generate company-level waterfall steps
  const companyWaterfall: WaterfallStep[] = [
    { label: 'Business Profit', amount: businessProfit, type: 'add' },
    { label: 'Director Salary', amount: annualSalary, type: 'subtract' },
    { label: 'Employer EPF (13%)', amount: employerEPF, type: 'subtract', indent: true },
    { label: 'Employer SOCSO', amount: employerSOCSO, type: 'subtract', indent: true },
  ];

  // Show zakat in company waterfall if enabled
  if (zakat?.enabled && zakatAmount > 0) {
    companyWaterfall.push(
      { label: 'Aggregate Income', amount: aggregateIncome, type: 'equals' },
      { label: 'Zakat Deduction (max 2.5%)', amount: zakatDeduction, type: 'subtract' },
      { label: 'Taxable Profit After Zakat', amount: companyTaxableProfit, type: 'equals' },
    );
  } else {
    companyWaterfall.push(
      { label: 'Company Taxable Profit', amount: companyTaxableProfit, type: 'equals' },
    );
  }

  companyWaterfall.push(
    { label: 'Corporate Tax', amount: corporateTax, type: 'subtract' },
    { label: 'Post-Tax Profit', amount: postTaxProfit, type: 'equals' },
  );

  // Add dividend distribution if applicable
  if (distributionPercent > 0 && postTaxProfit > 0) {
    companyWaterfall.push(
      { label: `Dividends (${distributionPercent}%)`, amount: dividends, type: 'subtract' }
    );
    if (dividendTax > 0) {
      companyWaterfall.push(
        { label: 'Dividend Tax (2%)', amount: dividendTax, type: 'subtract', indent: true }
      );
    }
  }

  if (retainedEarnings > 0) {
    companyWaterfall.push(
      { label: 'Retained in Company', amount: retainedEarnings, type: 'equals' }
    );
  }

  // Generate personal-level waterfall steps
  const personalWaterfall: WaterfallStep[] = [
    { label: 'Salary (gross)', amount: annualSalary, type: 'add' },
    { label: 'Employee EPF (11%)', amount: employeeEPF, type: 'subtract', indent: true },
    { label: 'Employee SOCSO', amount: employeeSOCSO, type: 'subtract', indent: true },
    { label: 'Salary Take-Home', amount: salaryAfterEPF, type: 'equals' },
  ];

  if (otherIncome > 0) {
    personalWaterfall.push({ label: 'Other Income', amount: otherIncome, type: 'add' });
  }

  personalWaterfall.push(
    { label: 'Personal Tax', amount: personalTax, type: 'subtract' }
  );

  if (dividends > 0) {
    personalWaterfall.push({ label: 'Dividends Received', amount: dividends - dividendTax, type: 'add' });
  }

  personalWaterfall.push(
    { label: 'Compliance Costs', amount: totalComplianceCost, type: 'subtract' },
  );

  // Show zakat paid in personal waterfall if enabled
  if (zakat?.enabled && zakatAmount > 0) {
    personalWaterfall.push(
      { label: 'Business Zakat Paid', amount: zakatAmount, type: 'subtract' },
    );
  }

  personalWaterfall.push(
    { label: 'Net Cash to You', amount: netCash, type: 'total', highlight: true }
  );

  // Generate insights specific to Sdn Bhd
  const insights: string[] = [];

  // Add zakat insight if enabled
  if (zakat?.enabled && zakatAmount > 0) {
    const taxSavings = (corporateTaxBeforeZakat ?? 0) - corporateTax;
    if (taxSavings > 0) {
      insights.push(`Zakat deduction saves ~RM${Math.round(taxSavings).toLocaleString('en-MY')} in corporate tax`);
    }
    if (excessZakat > 0) {
      insights.push(`RM${Math.round(excessZakat).toLocaleString('en-MY')} zakat exceeds max deduction (2.5% of income)`);
    }
  }

  if (epfSavings > 0) {
    insights.push(`RM${Math.round(epfSavings).toLocaleString('en-MY')}/year going to EPF (forced retirement savings)`);
  }

  if (retainedEarnings > 0) {
    insights.push(`RM${Math.round(retainedEarnings).toLocaleString('en-MY')} retained in company (available for reinvestment)`);
  }

  insights.push('Limited liability - personal assets protected');
  insights.push(`Higher compliance burden (~RM${Math.round(totalComplianceCost).toLocaleString('en-MY')}/year)`);

  // Get corporate tax bracket breakdown for company taxable profit
  const corporateBracketRaw = getCorporateTaxBracketBreakdown(Math.max(0, companyTaxableProfit));
  const corporateTaxBracketBreakdown: TaxBracketBreakdown[] = corporateBracketRaw.map(b => ({
    bracketMin: b.bracketMin,
    bracketMax: b.bracketMax,
    rate: b.rate,
    incomeInBracket: b.profitInBracket,
    taxForBracket: b.taxForBracket,
  }));

  // Get personal tax bracket breakdown for director's income
  const personalBracketRaw = getPersonalTaxBracketBreakdown(personalTaxResult.taxableIncome);
  const personalTaxBracketBreakdown: TaxBracketBreakdown[] = personalBracketRaw.map(b => ({
    bracketMin: b.bracketMin,
    bracketMax: b.bracketMax,
    rate: b.rate,
    incomeInBracket: b.incomeInBracket,
    taxForBracket: b.taxForBracket,
  }));

  return {
    corporateTax: Math.round(corporateTax * 100) / 100,
    personalTax: Math.round(personalTax * 100) / 100,
    employerEPF: Math.round(employerEPF * 100) / 100,
    employeeEPF: Math.round(employeeEPF * 100) / 100,
    employerSOCSO: Math.round(employerSOCSO * 100) / 100,
    employeeSOCSO: Math.round(employeeSOCSO * 100) / 100,
    totalComplianceCost: Math.round(totalComplianceCost * 100) / 100,
    netCash: Math.round(netCash * 100) / 100,
    salaryAffordability: {
      maxAffordableSalary: Math.round(maxAffordableSalary * 100) / 100,
      isAffordable,
      shortfall: Math.round(shortfall * 100) / 100,
      companyWouldBeInsolvent,
    },
    breakdown: {
      annualSalary: Math.round(annualSalary * 100) / 100,
      companyTaxableProfit: Math.round(companyTaxableProfit * 100) / 100,
      postTaxProfit: Math.round(postTaxProfit * 100) / 100,
      dividends: Math.round(dividends * 100) / 100,
      dividendTax: Math.round(dividendTax * 100) / 100,
      retainedEarnings: Math.round(retainedEarnings * 100) / 100,
      salaryAfterEPF: Math.round(salaryAfterEPF * 100) / 100,
      salaryAfterTax: Math.round(Math.max(0, totalCashFromIncome - otherIncome) * 100) / 100,
      otherIncome: Math.round(otherIncome * 100) / 100,
      businessProfit: Math.round(businessProfit * 100) / 100,
    },
    companyWaterfall,
    personalWaterfall,
    insights,
    epfSavings: Math.round(epfSavings * 100) / 100,
    corporateTaxBracketBreakdown,
    personalTaxBracketBreakdown,
    zakat: zakatResult,
    corporateTaxBeforeZakat: corporateTaxBeforeZakat !== undefined
      ? Math.round(corporateTaxBeforeZakat * 100) / 100
      : undefined,
  };
}

