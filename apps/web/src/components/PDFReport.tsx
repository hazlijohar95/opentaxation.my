import {
      Document,
      Page,
      Text,
      View,
      StyleSheet,
    } from '@react-pdf/renderer';
import type { TaxCalculationInputs, ComparisonResult, WaterfallStep, TaxBracketBreakdown } from '@tax-engine/core';

interface PDFReportProps {
  inputs: TaxCalculationInputs;
  comparison: ComparisonResult;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0ea5e9',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 3,
  },
  label: {
    color: '#6b7280',
  },
  value: {
    fontWeight: 'bold',
    color: '#111827',
  },
  table: {
    marginTop: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 8,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: '1px solid #e5e7eb',
  },
  tableCell: {
    flex: 1,
  },
  recommendation: {
    backgroundColor: '#f0f9ff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0369a1',
    marginBottom: 5,
  },
  warning: {
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
    borderLeft: '3px solid #f59e0b',
  },
  warningText: {
    fontSize: 9,
    color: '#92400e',
  },
  nonTaxTable: {
    marginTop: 10,
  },
  nonTaxHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    padding: 6,
    fontWeight: 'bold',
    fontSize: 9,
  },
  nonTaxRow: {
    flexDirection: 'row',
    padding: 6,
    borderBottom: '1px solid #e5e7eb',
    fontSize: 9,
  },
  nonTaxCellFactor: {
    flex: 1,
    fontWeight: 'bold',
  },
  nonTaxCellValue: {
    flex: 1.5,
  },
  footer: {
    marginTop: 30,
    paddingTop: 10,
    borderTop: '1px solid #e5e7eb',
    fontSize: 8,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  waterfallSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  waterfallTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#4b5563',
    textTransform: 'uppercase',
  },
  waterfallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  waterfallRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 4,
    marginLeft: 12,
  },
  waterfallRowEquals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderTop: '1px solid #e5e7eb',
    marginTop: 2,
  },
  waterfallRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderTop: '2px solid #d1d5db',
    marginTop: 4,
    backgroundColor: '#f9fafb',
  },
  waterfallLabel: {
    fontSize: 9,
    color: '#6b7280',
  },
  waterfallLabelBold: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
  },
  waterfallValueAdd: {
    fontSize: 9,
    color: '#059669',
  },
  waterfallValueSubtract: {
    fontSize: 9,
    color: '#dc2626',
  },
  waterfallValueNeutral: {
    fontSize: 9,
    color: '#6b7280',
  },
  waterfallValueTotal: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827',
  },
  insightBox: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
  },
  insightTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 8,
    color: '#78350f',
    marginBottom: 2,
  },
  // Tax bracket breakdown styles
  bracketSection: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
  },
  bracketTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  bracketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    borderBottom: '0.5px solid #e5e7eb',
  },
  bracketRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  bracketLabel: {
    fontSize: 8,
    color: '#6b7280',
    flex: 2,
  },
  bracketRate: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
    width: 40,
  },
  bracketRateZero: {
    fontSize: 8,
    color: '#059669',
    textAlign: 'center',
    width: 40,
  },
  bracketAmount: {
    fontSize: 8,
    color: '#111827',
    textAlign: 'right',
    width: 70,
  },
  bracketAmountZero: {
    fontSize: 8,
    color: '#059669',
    textAlign: 'right',
    width: 70,
  },
  bracketTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginTop: 4,
    borderTop: '1px solid #d1d5db',
  },
  bracketTotalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
  },
  bracketTotalAmount: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    width: 70,
  },
  bracketNote: {
    fontSize: 7,
    color: '#9ca3af',
    marginTop: 6,
    fontStyle: 'italic',
  },
});

// Helper component for waterfall rows
function WaterfallRow({ step }: { step: WaterfallStep }) {
  const formatAmount = (amount: number) => {
    return `RM${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getPrefix = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add': return '+ ';
      case 'subtract': return '- ';
      default: return '';
    }
  };

  const getRowStyle = (step: WaterfallStep) => {
    if (step.type === 'total') return styles.waterfallRowTotal;
    if (step.type === 'equals') return styles.waterfallRowEquals;
    if (step.indent) return styles.waterfallRowIndent;
    return styles.waterfallRow;
  };

  const getValueStyle = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add': return styles.waterfallValueAdd;
      case 'subtract': return styles.waterfallValueSubtract;
      case 'total': return styles.waterfallValueTotal;
      default: return styles.waterfallValueNeutral;
    }
  };

  return (
    <View style={getRowStyle(step)}>
      <Text style={step.highlight ? styles.waterfallLabelBold : styles.waterfallLabel}>
        {step.label}
      </Text>
      <Text style={getValueStyle(step.type)}>
        {getPrefix(step.type)}{formatAmount(step.amount)}
      </Text>
    </View>
  );
}

// Helper component for tax bracket breakdown
function TaxBracketSection({
  breakdown,
  title,
  taxableAmount,
  isCorporate = false,
}: {
  breakdown: TaxBracketBreakdown[];
  title: string;
  taxableAmount?: number;
  isCorporate?: boolean;
}) {
  if (!breakdown || breakdown.length === 0) {
    return null;
  }

  const formatAmount = (amount: number) => {
    return `RM${amount.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBracketLabel = (min: number, max: number | null, isFirst: boolean): string => {
    if (isFirst && min === 0) {
      if (max !== null) {
        return `First RM${max.toLocaleString('en-MY')}`;
      }
      return 'All income';
    }

    if (max === null) {
      return `Above RM${min.toLocaleString('en-MY')}`;
    }

    const bracketSize = max - min;
    return `Next RM${bracketSize.toLocaleString('en-MY')}`;
  };

  const totalTax = breakdown.reduce((sum, b) => sum + b.taxForBracket, 0);

  return (
    <View style={styles.bracketSection}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={styles.bracketTitle}>{title}</Text>
        {taxableAmount !== undefined && (
          <Text style={{ fontSize: 8, color: '#6b7280' }}>
            Taxable: {formatAmount(taxableAmount)}
          </Text>
        )}
      </View>

      {breakdown.map((bracket, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === breakdown.length - 1;
        const label = formatBracketLabel(bracket.bracketMin, bracket.bracketMax, isFirst);
        const ratePercent = (bracket.rate * 100).toFixed(0);
        const isZeroRate = bracket.rate === 0;

        return (
          <View key={idx} style={isLast ? styles.bracketRowLast : styles.bracketRow}>
            <Text style={styles.bracketLabel}>{label}</Text>
            <Text style={isZeroRate ? styles.bracketRateZero : styles.bracketRate}>
              × {ratePercent}%
            </Text>
            <Text style={isZeroRate ? styles.bracketAmountZero : styles.bracketAmount}>
              = {formatAmount(bracket.taxForBracket)}
            </Text>
          </View>
        );
      })}

      <View style={styles.bracketTotalRow}>
        <Text style={styles.bracketTotalLabel}>
          Total {isCorporate ? 'Corporate' : 'Personal'} Tax
        </Text>
        <Text style={styles.bracketTotalAmount}>{formatAmount(totalTax)}</Text>
      </View>

      <Text style={styles.bracketNote}>
        {isCorporate
          ? 'SME rates apply to companies with ≤RM50M revenue and no foreign ownership ≥20%.'
          : 'Progressive tax: only income within each bracket is taxed at that rate.'}
      </Text>
    </View>
  );
}

export default function PDFReport({ inputs, comparison }: PDFReportProps) {
  const { solePropResult, sdnBhdResult } = comparison;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Malaysia Tax Decision Engine</Text>
        <Text style={{ marginBottom: 20, color: '#6b7280' }}>
          Enterprise vs Sdn Bhd Comparison Report
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Inputs</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Business Profit:</Text>
            <Text style={styles.value}>
              RM{inputs.businessProfit.toLocaleString('en-MY')}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Other Income:</Text>
            <Text style={styles.value}>
              RM{(inputs.otherIncome || 0).toLocaleString('en-MY')}
            </Text>
          </View>
          {inputs.monthlySalary && (
            <View style={styles.row}>
              <Text style={styles.label}>Monthly Salary (Sdn Bhd):</Text>
              <Text style={styles.value}>
                RM{inputs.monthlySalary.toLocaleString('en-MY')}/month
              </Text>
            </View>
          )}
          {inputs.complianceCosts && (
            <View style={styles.row}>
              <Text style={styles.label}>Compliance Costs:</Text>
              <Text style={styles.value}>
                RM{inputs.complianceCosts.toLocaleString('en-MY')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enterprise (Sole Prop) Results</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Personal Tax:</Text>
            <Text style={styles.value}>
              RM{solePropResult.personalTax.toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Net Cash:</Text>
            <Text style={styles.value}>
              RM{solePropResult.netCash.toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Effective Tax Rate:</Text>
            <Text style={styles.value}>
              {(solePropResult.effectiveTaxRate * 100).toFixed(2)}%
            </Text>
          </View>

          {/* Enterprise Waterfall Breakdown */}
          {solePropResult.waterfall && (
            <View style={styles.waterfallSection}>
              <Text style={styles.waterfallTitle}>Calculation Breakdown</Text>
              {solePropResult.waterfall.map((step, index) => (
                <WaterfallRow key={index} step={step} />
              ))}
            </View>
          )}

          {/* Enterprise Tax Bracket Breakdown */}
          {solePropResult.taxBracketBreakdown && solePropResult.taxBracketBreakdown.length > 0 && (
            <TaxBracketSection
              breakdown={solePropResult.taxBracketBreakdown}
              title="How Your Tax is Calculated"
              taxableAmount={solePropResult.breakdown.taxableIncome}
            />
          )}

          {/* Enterprise Insights */}
          {solePropResult.insights && solePropResult.insights.length > 0 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightTitle}>Key Insights</Text>
              {solePropResult.insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>• {insight}</Text>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sdn Bhd Results</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Total Tax (Corporate + Personal):</Text>
            <Text style={styles.value}>
              RM{(sdnBhdResult.corporateTax + sdnBhdResult.personalTax + sdnBhdResult.breakdown.dividendTax).toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Net Cash:</Text>
            <Text style={styles.value}>
              RM{sdnBhdResult.netCash.toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>EPF Savings (Forced Retirement):</Text>
            <Text style={styles.value}>
              RM{sdnBhdResult.epfSavings.toLocaleString('en-MY', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Company Level Waterfall */}
          {sdnBhdResult.companyWaterfall && (
            <View style={styles.waterfallSection}>
              <Text style={styles.waterfallTitle}>Company Level Breakdown</Text>
              {sdnBhdResult.companyWaterfall.map((step, index) => (
                <WaterfallRow key={index} step={step} />
              ))}
            </View>
          )}

          {/* Personal Level Waterfall */}
          {sdnBhdResult.personalWaterfall && (
            <View style={styles.waterfallSection}>
              <Text style={styles.waterfallTitle}>Personal Level Breakdown</Text>
              {sdnBhdResult.personalWaterfall.map((step, index) => (
                <WaterfallRow key={index} step={step} />
              ))}
            </View>
          )}

          {/* Corporate Tax Bracket Breakdown */}
          {sdnBhdResult.corporateTaxBracketBreakdown && sdnBhdResult.corporateTaxBracketBreakdown.length > 0 && (
            <TaxBracketSection
              breakdown={sdnBhdResult.corporateTaxBracketBreakdown}
              title="Corporate Tax Calculation"
              taxableAmount={sdnBhdResult.breakdown.companyTaxableProfit}
              isCorporate
            />
          )}

          {/* Personal Tax Bracket Breakdown */}
          {sdnBhdResult.personalTaxBracketBreakdown && sdnBhdResult.personalTaxBracketBreakdown.length > 0 && (
            <TaxBracketSection
              breakdown={sdnBhdResult.personalTaxBracketBreakdown}
              title="Your Personal Tax Calculation"
              taxableAmount={sdnBhdResult.breakdown.annualSalary}
            />
          )}

          {/* Sdn Bhd Insights */}
          {sdnBhdResult.insights && sdnBhdResult.insights.length > 0 && (
            <View style={styles.insightBox}>
              <Text style={styles.insightTitle}>Key Insights</Text>
              {sdnBhdResult.insights.map((insight, index) => (
                <Text key={index} style={styles.insightText}>• {insight}</Text>
              ))}
            </View>
          )}
        </View>

        {/* Warnings */}
        {comparison.warnings.length > 0 && (
          <View style={styles.warning}>
            <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#92400e', marginBottom: 5 }}>
              Important Notices
            </Text>
            {comparison.warnings.map((warning, index) => (
              <Text key={index} style={styles.warningText}>
                • {warning}
              </Text>
            ))}
          </View>
        )}

        {/* Non-Tax Factors Comparison */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Non-Tax Factors to Consider</Text>
          <View style={styles.nonTaxTable}>
            <View style={styles.nonTaxHeader}>
              <Text style={styles.nonTaxCellFactor}>Factor</Text>
              <Text style={styles.nonTaxCellValue}>Enterprise</Text>
              <Text style={styles.nonTaxCellValue}>Sdn Bhd</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Liability</Text>
              <Text style={styles.nonTaxCellValue}>Unlimited personal liability</Text>
              <Text style={styles.nonTaxCellValue}>Limited to capital invested</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Banking</Text>
              <Text style={styles.nonTaxCellValue}>Harder to get business loans</Text>
              <Text style={styles.nonTaxCellValue}>Banks prefer companies</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Credibility</Text>
              <Text style={styles.nonTaxCellValue}>Less professional perception</Text>
              <Text style={styles.nonTaxCellValue}>More trust from clients</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Funding</Text>
              <Text style={styles.nonTaxCellValue}>Cannot issue shares</Text>
              <Text style={styles.nonTaxCellValue}>Can raise investor capital</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Continuity</Text>
              <Text style={styles.nonTaxCellValue}>Dies with owner</Text>
              <Text style={styles.nonTaxCellValue}>Perpetual existence</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Compliance</Text>
              <Text style={styles.nonTaxCellValue}>Minimal (~RM60/year)</Text>
              <Text style={styles.nonTaxCellValue}>Higher (audit, secretary)</Text>
            </View>
            <View style={styles.nonTaxRow}>
              <Text style={styles.nonTaxCellFactor}>Setup Cost</Text>
              <Text style={styles.nonTaxCellValue}>~RM60</Text>
              <Text style={styles.nonTaxCellValue}>~RM1,000+</Text>
            </View>
          </View>
        </View>

        <View style={styles.recommendation}>
          <Text style={styles.recommendationText}>Final Recommendation</Text>
          <Text style={{ fontSize: 10, color: '#111827' }}>
            {comparison.recommendation}
          </Text>
          <Text style={{ fontSize: 9, marginTop: 5, color: '#6b7280' }}>
            Difference: RM{Math.abs(comparison.difference).toLocaleString('en-MY', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            per year
          </Text>
        </View>

        <View style={styles.footer}>
          <Text>
            This report is generated for informational purposes only. Tax rates
            are based on Malaysia YA 2024/2025. Always consult with a qualified
            tax advisor for your specific situation.
          </Text>
          <Text style={{ marginTop: 5 }}>
            Generated on:{' '}
            {new Date().toLocaleDateString('en-MY', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

