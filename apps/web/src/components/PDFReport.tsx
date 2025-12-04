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

// Elegant color palette
const colors = {
  primary: '#0f172a',      // Slate 900
  secondary: '#475569',    // Slate 600
  muted: '#94a3b8',        // Slate 400
  accent: '#0ea5e9',       // Sky 500
  success: '#059669',      // Emerald 600
  warning: '#d97706',      // Amber 600
  danger: '#dc2626',       // Red 600
  background: '#f8fafc',   // Slate 50
  border: '#e2e8f0',       // Slate 200
  white: '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: colors.white,
  },
  // Header section
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 40,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  headerBadge: {
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  headerBadgeText: {
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  // Content wrapper
  content: {
    padding: 40,
  },
  // Summary cards section
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryCardHighlight: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 20,
  },
  summaryCardLabel: {
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryCardLabelLight: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  summaryCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primary,
  },
  summaryCardValueLight: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  summaryCardSubtext: {
    fontSize: 9,
    color: colors.secondary,
    marginTop: 4,
  },
  summaryCardSubtextLight: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: -0.3,
  },
  sectionBadge: {
    marginLeft: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionBadgeText: {
    fontSize: 8,
    color: colors.secondary,
  },
  // Input summary
  inputGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  inputItem: {
    width: '48%',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent,
  },
  inputLabel: {
    fontSize: 9,
    color: colors.muted,
    marginBottom: 4,
  },
  inputValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Comparison table
  comparisonTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 12,
  },
  comparisonHeaderCell: {
    flex: 1,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'center',
  },
  comparisonHeaderCellFirst: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.white,
    textAlign: 'left',
  },
  comparisonRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonRowAlt: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  comparisonRowHighlight: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f0f9ff',
  },
  comparisonCellLabel: {
    flex: 1.5,
    fontSize: 10,
    color: colors.secondary,
  },
  comparisonCellLabelBold: {
    flex: 1.5,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  comparisonCellValue: {
    flex: 1,
    fontSize: 10,
    color: colors.primary,
    textAlign: 'right',
  },
  comparisonCellValueBold: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'right',
  },
  comparisonCellValueSuccess: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.success,
    textAlign: 'right',
  },
  // Waterfall section
  waterfallSection: {
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  waterfallTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  waterfallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  waterfallRowIndent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingLeft: 16,
  },
  waterfallRowEquals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  waterfallRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    backgroundColor: colors.white,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    marginBottom: -16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  waterfallLabel: {
    fontSize: 9,
    color: colors.secondary,
  },
  waterfallLabelBold: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  waterfallValueAdd: {
    fontSize: 9,
    color: colors.success,
    fontWeight: 'bold',
  },
  waterfallValueSubtract: {
    fontSize: 9,
    color: colors.danger,
  },
  waterfallValueNeutral: {
    fontSize: 9,
    color: colors.secondary,
  },
  waterfallValueTotal: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Tax bracket styles
  bracketSection: {
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  bracketHeader: {
    backgroundColor: colors.background,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bracketTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bracketTaxable: {
    fontSize: 9,
    color: colors.secondary,
  },
  bracketBody: {
    padding: 12,
  },
  bracketRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bracketRowLast: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  bracketLabel: {
    flex: 2,
    fontSize: 9,
    color: colors.secondary,
  },
  bracketRate: {
    width: 50,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'center',
  },
  bracketRateZero: {
    width: 50,
    fontSize: 9,
    color: colors.success,
    textAlign: 'center',
  },
  bracketAmount: {
    width: 70,
    fontSize: 9,
    color: colors.primary,
    textAlign: 'right',
  },
  bracketAmountZero: {
    width: 70,
    fontSize: 9,
    color: colors.success,
    textAlign: 'right',
  },
  bracketFooter: {
    backgroundColor: colors.background,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bracketTotalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  bracketTotalAmount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  // Recommendation box
  recommendationBox: {
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
    marginBottom: 24,
  },
  recommendationLabel: {
    fontSize: 10,
    color: colors.success,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  recommendationSavings: {
    fontSize: 10,
    color: colors.secondary,
  },
  // Warning box
  warningBox: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    marginBottom: 16,
  },
  warningTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.warning,
    marginBottom: 6,
  },
  warningText: {
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
  // Insights
  insightsBox: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  insightsTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  insightItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  insightBullet: {
    fontSize: 8,
    color: colors.accent,
    marginRight: 6,
    marginTop: 1,
  },
  insightText: {
    fontSize: 9,
    color: colors.secondary,
    flex: 1,
    lineHeight: 1.4,
  },
  // Non-tax factors table
  nonTaxTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  nonTaxHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 10,
  },
  nonTaxHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  nonTaxHeaderCellFirst: {
    flex: 0.8,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.white,
  },
  nonTaxRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nonTaxRowAlt: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  nonTaxCellFactor: {
    flex: 0.8,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nonTaxCellValue: {
    flex: 1,
    fontSize: 8,
    color: colors.secondary,
    paddingHorizontal: 4,
  },
  // Footer
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  footerBrand: {
    fontSize: 9,
    color: colors.secondary,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: 'bold',
  },
  // Two columns for page 2
  twoColumns: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },
});

// Format currency
function formatCurrency(amount: number): string {
  return `RM ${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCurrencyPrecise(amount: number): string {
  return `RM ${Math.abs(amount).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Helper component for waterfall rows
function WaterfallRow({ step }: { step: WaterfallStep }) {
  const getPrefix = (type: WaterfallStep['type']) => {
    switch (type) {
      case 'add': return '+ ';
      case 'subtract': return '− ';
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
        {getPrefix(step.type)}{formatCurrencyPrecise(step.amount)}
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
      <View style={styles.bracketHeader}>
        <Text style={styles.bracketTitle}>{title}</Text>
        {taxableAmount !== undefined && (
          <Text style={styles.bracketTaxable}>
            Taxable: {formatCurrency(taxableAmount)}
          </Text>
        )}
      </View>

      <View style={styles.bracketBody}>
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
                = {formatCurrencyPrecise(bracket.taxForBracket)}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.bracketFooter}>
        <Text style={styles.bracketTotalLabel}>
          Total {isCorporate ? 'Corporate' : 'Personal'} Tax
        </Text>
        <Text style={styles.bracketTotalAmount}>{formatCurrencyPrecise(totalTax)}</Text>
      </View>
    </View>
  );
}

export default function PDFReport({ inputs, comparison }: PDFReportProps) {
  const { solePropResult, sdnBhdResult } = comparison;

  const enterpriseTax = solePropResult.personalTax;
  const sdnBhdTax = sdnBhdResult.corporateTax + sdnBhdResult.personalTax + sdnBhdResult.breakdown.dividendTax;
  const winner = comparison.difference > 0 ? 'Sdn Bhd' : 'Enterprise';
  const savings = Math.abs(comparison.difference);

  const nonTaxFactors = [
    { factor: 'Liability', enterprise: 'Unlimited personal', sdnBhd: 'Limited to capital' },
    { factor: 'Banking', enterprise: 'Harder to get loans', sdnBhd: 'Banks prefer companies' },
    { factor: 'Credibility', enterprise: 'Less professional', sdnBhd: 'More client trust' },
    { factor: 'Funding', enterprise: 'Cannot issue shares', sdnBhd: 'Can raise capital' },
    { factor: 'Continuity', enterprise: 'Dies with owner', sdnBhd: 'Perpetual existence' },
    { factor: 'Compliance', enterprise: '~RM60/year', sdnBhd: 'RM3,000-10,000/year' },
    { factor: 'Setup', enterprise: '~RM60', sdnBhd: '~RM1,000+' },
  ];

  return (
    <Document>
      {/* Page 1: Summary & Comparison */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tax Comparison Report</Text>
          <Text style={styles.headerSubtitle}>Enterprise vs Sdn Bhd Analysis</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              Generated {new Date().toLocaleDateString('en-MY', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Summary Cards */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardLabel}>Business Profit</Text>
              <Text style={styles.summaryCardValue}>{formatCurrency(inputs.businessProfit)}</Text>
              <Text style={styles.summaryCardSubtext}>Annual gross income</Text>
            </View>
            <View style={styles.summaryCardHighlight}>
              <Text style={styles.summaryCardLabelLight}>Recommended</Text>
              <Text style={styles.summaryCardValueLight}>{winner}</Text>
              <Text style={styles.summaryCardSubtextLight}>Saves {formatCurrency(savings)}/year</Text>
            </View>
          </View>

          {/* Quick Comparison Table */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Side-by-Side Comparison</Text>
            </View>

            <View style={styles.comparisonTable}>
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonHeaderCellFirst}>Metric</Text>
                <Text style={styles.comparisonHeaderCell}>Enterprise</Text>
                <Text style={styles.comparisonHeaderCell}>Sdn Bhd</Text>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonCellLabel}>Total Tax</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrencyPrecise(enterpriseTax)}</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrencyPrecise(sdnBhdTax)}</Text>
              </View>

              <View style={styles.comparisonRowAlt}>
                <Text style={styles.comparisonCellLabel}>Effective Tax Rate</Text>
                <Text style={styles.comparisonCellValue}>{(solePropResult.effectiveTaxRate * 100).toFixed(1)}%</Text>
                <Text style={styles.comparisonCellValue}>
                  {inputs.businessProfit > 0 ? ((sdnBhdTax / inputs.businessProfit) * 100).toFixed(1) : 0}%
                </Text>
              </View>

              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonCellLabel}>EPF Savings</Text>
                <Text style={styles.comparisonCellValue}>—</Text>
                <Text style={styles.comparisonCellValue}>{formatCurrency(sdnBhdResult.epfSavings)}</Text>
              </View>

              <View style={styles.comparisonRowHighlight}>
                <Text style={styles.comparisonCellLabelBold}>Net Cash to You</Text>
                <Text style={comparison.difference <= 0 ? styles.comparisonCellValueSuccess : styles.comparisonCellValueBold}>
                  {formatCurrencyPrecise(solePropResult.netCash)}
                </Text>
                <Text style={comparison.difference > 0 ? styles.comparisonCellValueSuccess : styles.comparisonCellValueBold}>
                  {formatCurrencyPrecise(sdnBhdResult.netCash)}
                </Text>
              </View>
            </View>
          </View>

          {/* Recommendation */}
          <View style={styles.recommendationBox}>
            <Text style={styles.recommendationLabel}>Recommendation</Text>
            <Text style={styles.recommendationText}>{comparison.recommendation}</Text>
            <Text style={styles.recommendationSavings}>
              Annual savings: {formatCurrencyPrecise(savings)} • Difference: {(Math.abs(comparison.difference) / inputs.businessProfit * 100).toFixed(1)}% of profit
            </Text>
          </View>

          {/* Warnings */}
          {comparison.warnings.length > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningTitle}>Important Considerations</Text>
              {comparison.warnings.map((warning, index) => (
                <Text key={index} style={styles.warningText}>• {warning}</Text>
              ))}
            </View>
          )}

          {/* Your Inputs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Inputs</Text>
            </View>
            <View style={styles.inputGrid}>
              <View style={styles.inputItem}>
                <Text style={styles.inputLabel}>Business Profit</Text>
                <Text style={styles.inputValue}>{formatCurrency(inputs.businessProfit)}</Text>
              </View>
              <View style={styles.inputItem}>
                <Text style={styles.inputLabel}>Other Income</Text>
                <Text style={styles.inputValue}>{formatCurrency(inputs.otherIncome || 0)}</Text>
              </View>
              {inputs.monthlySalary && (
                <View style={styles.inputItem}>
                  <Text style={styles.inputLabel}>Monthly Salary (Sdn Bhd)</Text>
                  <Text style={styles.inputValue}>{formatCurrency(inputs.monthlySalary)}/mo</Text>
                </View>
              )}
              {inputs.complianceCosts && (
                <View style={styles.inputItem}>
                  <Text style={styles.inputLabel}>Compliance Costs</Text>
                  <Text style={styles.inputValue}>{formatCurrency(inputs.complianceCosts)}/yr</Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This report is for informational purposes only. Tax rates based on Malaysia YA 2024/2025.
              Always consult a qualified tax advisor for your specific situation.
            </Text>
            <Text style={styles.footerBrand}>OpenTaxation.my</Text>
          </View>
        </View>
      </Page>

      {/* Page 2: Detailed Breakdowns */}
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, paddingTop: 30, paddingBottom: 20 }}>
          <Text style={{ ...styles.headerTitle, fontSize: 20 }}>Detailed Breakdown</Text>
          <Text style={styles.headerSubtitle}>Cash flow and tax calculation details</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.twoColumns}>
            {/* Enterprise Column */}
            <View style={styles.column}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Enterprise</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Sole Proprietorship</Text>
                  </View>
                </View>

                {/* Enterprise Waterfall */}
                {solePropResult.waterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Cash Flow</Text>
                    {solePropResult.waterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Enterprise Tax Brackets */}
                {solePropResult.taxBracketBreakdown && solePropResult.taxBracketBreakdown.length > 0 && (
                  <TaxBracketSection
                    breakdown={solePropResult.taxBracketBreakdown}
                    title="Tax Calculation"
                    taxableAmount={solePropResult.breakdown.taxableIncome}
                  />
                )}

                {/* Enterprise Insights */}
                {solePropResult.insights && solePropResult.insights.length > 0 && (
                  <View style={styles.insightsBox}>
                    <Text style={styles.insightsTitle}>Key Insights</Text>
                    {solePropResult.insights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <Text style={styles.insightBullet}>●</Text>
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* Sdn Bhd Column */}
            <View style={styles.column}>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Sdn Bhd</Text>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionBadgeText}>Private Limited</Text>
                  </View>
                </View>

                {/* Company Waterfall */}
                {sdnBhdResult.companyWaterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Company Level</Text>
                    {sdnBhdResult.companyWaterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Personal Waterfall */}
                {sdnBhdResult.personalWaterfall && (
                  <View style={styles.waterfallSection}>
                    <Text style={styles.waterfallTitle}>Personal Level</Text>
                    {sdnBhdResult.personalWaterfall.map((step, index) => (
                      <WaterfallRow key={index} step={step} />
                    ))}
                  </View>
                )}

                {/* Sdn Bhd Insights */}
                {sdnBhdResult.insights && sdnBhdResult.insights.length > 0 && (
                  <View style={styles.insightsBox}>
                    <Text style={styles.insightsTitle}>Key Insights</Text>
                    {sdnBhdResult.insights.map((insight, index) => (
                      <View key={index} style={styles.insightItem}>
                        <Text style={styles.insightBullet}>●</Text>
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Page>

      {/* Page 3: Tax Brackets & Non-Tax Factors */}
      <Page size="A4" style={styles.page}>
        <View style={{ ...styles.header, paddingTop: 30, paddingBottom: 20 }}>
          <Text style={{ ...styles.headerTitle, fontSize: 20 }}>Tax Brackets & Considerations</Text>
          <Text style={styles.headerSubtitle}>Detailed calculations and non-tax factors</Text>
        </View>

        <View style={styles.content}>
          {/* Sdn Bhd Tax Brackets */}
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              {sdnBhdResult.corporateTaxBracketBreakdown && sdnBhdResult.corporateTaxBracketBreakdown.length > 0 && (
                <TaxBracketSection
                  breakdown={sdnBhdResult.corporateTaxBracketBreakdown}
                  title="Corporate Tax"
                  taxableAmount={sdnBhdResult.breakdown.companyTaxableProfit}
                  isCorporate
                />
              )}
            </View>
            <View style={styles.column}>
              {sdnBhdResult.personalTaxBracketBreakdown && sdnBhdResult.personalTaxBracketBreakdown.length > 0 && (
                <TaxBracketSection
                  breakdown={sdnBhdResult.personalTaxBracketBreakdown}
                  title="Personal Tax (Director)"
                  taxableAmount={sdnBhdResult.breakdown.annualSalary}
                />
              )}
            </View>
          </View>

          {/* Non-Tax Factors */}
          <View style={{ ...styles.section, marginTop: 24 }}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Beyond Tax: Business Considerations</Text>
            </View>

            <View style={styles.nonTaxTable}>
              <View style={styles.nonTaxHeader}>
                <Text style={styles.nonTaxHeaderCellFirst}>Factor</Text>
                <Text style={styles.nonTaxHeaderCell}>Enterprise</Text>
                <Text style={styles.nonTaxHeaderCell}>Sdn Bhd</Text>
              </View>
              {nonTaxFactors.map((row, index) => (
                <View key={index} style={index % 2 === 0 ? styles.nonTaxRow : styles.nonTaxRowAlt}>
                  <Text style={styles.nonTaxCellFactor}>{row.factor}</Text>
                  <Text style={styles.nonTaxCellValue}>{row.enterprise}</Text>
                  <Text style={styles.nonTaxCellValue}>{row.sdnBhd}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={{ ...styles.footer, marginTop: 40 }}>
            <Text style={styles.footerText}>
              Tax decisions should consider both financial and non-financial factors.
              This analysis is based on standard rates and may vary based on your specific circumstances.
            </Text>
            <Text style={styles.footerBrand}>OpenTaxation.my • opentaxation.my</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
