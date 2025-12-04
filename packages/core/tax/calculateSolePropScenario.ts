import { calculatePersonalTax } from './calculatePersonalTax';
import {
  getPersonalTaxBracketBreakdown,
  calculateZakatGrossIncome,
  calculateIndividualZakatRebate,
  meetsNisabThreshold,
} from '@tax-engine/config';
import type { TaxCalculationInputs, SolePropScenarioResult, WaterfallStep, TaxBracketBreakdown, ZakatResult } from '../types';

/**
 * Calculate Sole Proprietorship / Enterprise scenario
 *
 * Net cash now includes ALL income (business + other) minus tax,
 * for fair comparison with Sdn Bhd scenario.
 *
 * Zakat Treatment (Enterprise/Individual):
 * - Zakat is a 100% TAX REBATE (direct reduction from tax payable)
 * - Capped at the tax amount itself (cannot create negative tax)
 * - Reference: Section 6A(3) Income Tax Act 1967
 */
export function calculateSolePropScenario(
  inputs: Pick<TaxCalculationInputs, 'businessProfit' | 'otherIncome' | 'reliefs' | 'zakat'>
): SolePropScenarioResult {
  const { businessProfit, otherIncome = 0, reliefs, zakat } = inputs;

  // Input validation and sanitization
  if (!isFinite(businessProfit) || businessProfit < 0) {
    throw new Error('Business profit must be a valid non-negative number');
  }
  if (!isFinite(otherIncome) || otherIncome < 0) {
    throw new Error('Other income must be a valid non-negative number');
  }

  // Total income = business profit + other income
  const totalIncome = businessProfit + otherIncome;

  // Calculate personal tax on total income
  const personalTaxResult = calculatePersonalTax(totalIncome, reliefs);

  // Store the tax before any zakat rebate
  const taxBeforeZakat = personalTaxResult.tax;

  // Calculate zakat if enabled
  let zakatResult: ZakatResult | undefined;
  let zakatRebate = 0;
  let excessZakat = 0;
  let zakatAmount = 0;

  if (zakat?.enabled) {
    // Determine zakat amount: use provided amount or auto-calculate
    if (zakat.autoCalculate !== false && zakat.amountPaid === undefined) {
      // Auto-calculate zakat at 2.5% of gross income
      zakatAmount = calculateZakatGrossIncome(totalIncome);
    } else {
      zakatAmount = zakat.amountPaid ?? 0;
    }

    // Calculate the rebate (100% of zakat, capped at tax payable)
    const rebateResult = calculateIndividualZakatRebate(zakatAmount, taxBeforeZakat);
    zakatRebate = rebateResult.rebate;
    excessZakat = rebateResult.excessZakat;

    zakatResult = {
      enabled: true,
      zakatAmount: Math.round(zakatAmount * 100) / 100,
      meetsNisab: meetsNisabThreshold(totalIncome),
      taxBenefit: Math.round(zakatRebate * 100) / 100,
      excessZakat: Math.round(excessZakat * 100) / 100,
    };
  }

  // Final personal tax after zakat rebate
  const finalPersonalTax = Math.max(0, taxBeforeZakat - zakatRebate);

  // Net cash = total income - final tax - zakat paid
  // Note: Zakat is paid out of income, but rebate reduces tax
  const netCash = totalIncome - finalPersonalTax - zakatAmount;

  // Generate waterfall steps for clear visualization
  const waterfall: WaterfallStep[] = [
    { label: 'Business Profit', amount: businessProfit, type: 'add' },
  ];

  if (otherIncome > 0) {
    waterfall.push({ label: 'Other Income', amount: otherIncome, type: 'add' });
  }

  waterfall.push(
    { label: 'Gross Income', amount: totalIncome, type: 'equals' },
    { label: 'Personal Reliefs', amount: personalTaxResult.totalReliefs, type: 'subtract' },
    { label: 'Taxable Income', amount: personalTaxResult.taxableIncome, type: 'equals' },
  );

  // Show zakat in waterfall if enabled
  if (zakat?.enabled && zakatAmount > 0) {
    waterfall.push(
      { label: 'Income Tax (before zakat)', amount: taxBeforeZakat, type: 'subtract' },
      { label: 'Zakat Rebate (100%)', amount: zakatRebate, type: 'add', indent: true },
      { label: 'Net Tax After Zakat', amount: finalPersonalTax, type: 'equals' },
      { label: 'Zakat Paid', amount: zakatAmount, type: 'subtract' },
    );
  } else {
    waterfall.push(
      { label: 'Personal Tax', amount: finalPersonalTax, type: 'subtract' },
    );
  }

  waterfall.push(
    { label: 'Net Cash to You', amount: netCash, type: 'total', highlight: true }
  );

  // Generate insights specific to Enterprise
  const insights: string[] = [
    'No liability protection - personal assets at risk',
    'No forced savings (EPF) - you manage your own retirement',
    'Minimal compliance costs (~RM60/year)',
  ];

  // Add zakat insight if enabled
  if (zakat?.enabled && zakatAmount > 0) {
    if (zakatRebate > 0) {
      insights.unshift(`Zakat rebate saves you RM${Math.round(zakatRebate).toLocaleString('en-MY')} in tax`);
    }
    if (excessZakat > 0) {
      insights.unshift(`RM${Math.round(excessZakat).toLocaleString('en-MY')} zakat exceeds tax (spiritual benefit only)`);
    }
  }

  // Get progressive tax bracket breakdown to show how tax is calculated tier by tier
  const bracketBreakdownRaw = getPersonalTaxBracketBreakdown(personalTaxResult.taxableIncome);
  const taxBracketBreakdown: TaxBracketBreakdown[] = bracketBreakdownRaw.map(b => ({
    bracketMin: b.bracketMin,
    bracketMax: b.bracketMax,
    rate: b.rate,
    incomeInBracket: b.incomeInBracket,
    taxForBracket: b.taxForBracket,
  }));

  // Recalculate effective rate based on final tax
  const effectiveTaxRate = totalIncome > 0 ? finalPersonalTax / totalIncome : 0;

  return {
    personalTax: Math.round(finalPersonalTax * 100) / 100,
    netCash: Math.round(netCash * 100) / 100,
    effectiveTaxRate: Math.round(effectiveTaxRate * 10000) / 10000,
    breakdown: {
      businessProfit: Math.round(businessProfit * 100) / 100,
      otherIncome: Math.round(otherIncome * 100) / 100,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalReliefs: personalTaxResult.totalReliefs,
      taxableIncome: personalTaxResult.taxableIncome,
    },
    waterfall,
    insights,
    taxBracketBreakdown,
    zakat: zakatResult,
    taxBeforeZakatRebate: zakat?.enabled ? Math.round(taxBeforeZakat * 100) / 100 : undefined,
  };
}

