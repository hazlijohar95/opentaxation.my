import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTaxCalculation } from '../hooks/useTaxCalculation';
import TaxCard from '../components/TaxCard';
import RecommendationCard from '../components/RecommendationCard';
import CrossoverChart from '../components/CrossoverChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TaxCalculationInputs } from '@tax-engine/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFReport from '../components/PDFReport';
import { DownloadSimple, PencilSimple } from 'phosphor-react';
import Footer from '../components/Footer';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const inputs = location.state as TaxCalculationInputs | null;

  // Call hook unconditionally with safe fallback inputs
  const safeInputs: TaxCalculationInputs = inputs && inputs.businessProfit ? inputs : {
    businessProfit: 0,
    otherIncome: 0,
    monthlySalary: 0,
    complianceCosts: 0,
    auditCost: 0,
    auditCriteria: { revenue: 0, totalAssets: 0, employees: 0 },
    reliefs: { basic: 9000, epfAndLifeInsurance: 7000, medical: 8000 },
    applyYa2025DividendSurcharge: false,
    dividendDistributionPercent: 100,
    hasForeignOwnership: false,
    inputMode: 'profit',
    targetNetIncome: 10000,
  };
  const comparison = useTaxCalculation(safeInputs);

  if (!inputs || !inputs.businessProfit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border">
          <CardHeader>
            <CardTitle>No data found</CardTitle>
            <CardDescription>Start a new calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full h-12 touch-target">
              Start New Calculation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="max-w-md w-full border">
          <CardHeader>
            <CardTitle>Unable to calculate</CardTitle>
            <CardDescription>Check your inputs</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/input')} className="w-full h-12 touch-target">
              Edit Inputs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { solePropResult, sdnBhdResult } = comparison;

  return (
    <div className="min-h-screen bg-background py-6 sm:py-12 px-4 sm:px-6">
      <div className="container max-w-6xl mx-auto space-y-6 sm:space-y-10">
        {/* Minimal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:backdrop-blur-none">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Your Results</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Enterprise vs Sdn Bhd comparison</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/input')}
            className="h-10 touch-target self-start sm:self-auto"
          >
            <PencilSimple weight="duotone" className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>

        {/* Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <TaxCard
            title="Enterprise"
            tax={solePropResult.personalTax}
            netCash={solePropResult.netCash}
            effectiveTaxRate={solePropResult.effectiveTaxRate}
            breakdown={{
              'Total Income': solePropResult.breakdown.totalIncome,
              'Reliefs': solePropResult.breakdown.totalReliefs,
              'Taxable Income': solePropResult.breakdown.taxableIncome,
            }}
          />

          <TaxCard
            title="Sdn Bhd"
            tax={sdnBhdResult.corporateTax + sdnBhdResult.personalTax + sdnBhdResult.breakdown.dividendTax}
            netCash={sdnBhdResult.netCash}
            effectiveTaxRate={
              (sdnBhdResult.corporateTax + sdnBhdResult.personalTax + sdnBhdResult.breakdown.dividendTax) /
              inputs.businessProfit
            }
            breakdown={{
              'Company Tax': sdnBhdResult.corporateTax,
              'Personal Tax': sdnBhdResult.personalTax,
              'Dividend Tax': sdnBhdResult.breakdown.dividendTax,
              'Employer EPF': sdnBhdResult.employerEPF,
              'Employee EPF': sdnBhdResult.employeeEPF,
              'Compliance Cost': sdnBhdResult.totalComplianceCost,
              'Salary After Tax': sdnBhdResult.breakdown.salaryAfterTax,
              'Dividends': sdnBhdResult.breakdown.dividends,
            }}
          />
        </div>

        {/* Recommendation */}
        <RecommendationCard comparison={comparison} />

        {/* Chart */}
        <div className="overflow-hidden">
          <CrossoverChart inputs={inputs} />
        </div>

        {/* Explanation */}
        <Card className="border">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Why This Result?</CardTitle>
            <CardDescription className="text-xs sm:text-sm">What drives the difference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 pb-4 sm:pb-6">
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {comparison.whichIsBetter === 'similar'
                ? 'Both structures are neck-and-neck at your profit level. The difference is minimal—either works.'
                : comparison.whichIsBetter === 'sdnBhd'
                ? `Sdn Bhd wins because lower corporate tax (15-24%) plus tax-free dividends beats the compliance costs. You save by avoiding the higher personal tax rates (up to 30%).`
                : `Enterprise wins. The personal tax you pay is less than corporate tax + compliance costs combined. Simpler = cheaper at your level.`}
            </p>
            <div className="space-y-2 sm:space-y-3 pt-2">
              <p className="text-xs sm:text-sm font-semibold">Key factors:</p>
              <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-foreground">Salary:</strong> Higher = more personal tax, less corporate tax</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-foreground">EPF:</strong> Employer (12-13%) reduces profit; employee (11%) reduces take-home</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-foreground">Compliance:</strong> RM{inputs.complianceCosts?.toLocaleString('en-MY') || 0} annually
                  {inputs.auditCost && inputs.auditCost > 0 && ` + RM${inputs.auditCost.toLocaleString('en-MY')} audit`}</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground mt-0.5 flex-shrink-0">•</span>
                  <span><strong className="text-foreground">Other income:</strong> Increases personal tax burden</span>
                </li>
              </ul>
            </div>
            <div className="pt-3 sm:pt-4 border-t space-y-2">
              <div className="text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Important Notes:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Tax rates based on <strong>YA 2024/2025</strong> (Year of Assessment)</li>
                  <li>Dividends &gt; RM100k subject to 2% tax (YA 2025)</li>
                  <li>Assumes full dividend distribution</li>
                  <li>Uses default tax reliefs (RM24,000 total)</li>
                  <li>Does not include SOCSO contributions</li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground italic mt-2">
                This is an estimate. Actual tax liability may vary. Always consult a qualified tax advisor for your specific situation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Download */}
        <div className="flex justify-center pt-2 sm:pt-4 pb-4 sm:pb-0">
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore - PDFDownloadLink children type definition doesn't properly support render props */}
          <PDFDownloadLink
            document={<PDFReport inputs={inputs} comparison={comparison} />}
            fileName="tax-comparison.pdf"
          >
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {({ loading }: { loading?: boolean }) => (
              <Button variant="outline" size="lg" disabled={loading} className="h-12 sm:h-11 border-foreground/20 touch-target w-full sm:w-auto">
                <DownloadSimple weight="duotone" className="mr-2 h-4 w-4" />
                {loading ? 'Generating...' : 'Download PDF'}
              </Button>
            )}
          </PDFDownloadLink>
        </div>

        <Footer />
      </div>
    </div>
  );
}
