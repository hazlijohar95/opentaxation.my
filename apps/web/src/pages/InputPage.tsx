import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import InputField from '../components/InputField';
import Slider from '../components/Slider';
import ReliefsSection from '../components/ReliefsSection';
import { isAuditExempt, getDefaultReliefs } from '@tax-engine/config';
import { validateInputs, sanitizeInputs } from '@tax-engine/core';
import { ArrowLeft, ArrowRight, WarningCircle, CheckCircle } from 'phosphor-react';
import type { PersonalReliefs } from '@tax-engine/config';

export default function InputPage() {
  const navigate = useNavigate();

  const [businessProfit, setBusinessProfit] = useState(150000);
  const [otherIncome, setOtherIncome] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(5000);
  const [complianceCosts, setComplianceCosts] = useState(5000);
  const [auditRevenue, setAuditRevenue] = useState(100000);
  const [auditAssets, setAuditAssets] = useState(300000);
  const [auditEmployees, setAuditEmployees] = useState(5);
  const [auditCost, setAuditCost] = useState(5000);
  const [reliefs, setReliefs] = useState<PersonalReliefs>(getDefaultReliefs());

  const auditRequired = !isAuditExempt({
    revenue: auditRevenue,
    totalAssets: auditAssets,
    employees: auditEmployees,
  });

  const handleCalculate = () => {
    const inputs = sanitizeInputs({
      businessProfit,
      otherIncome,
      monthlySalary,
      complianceCosts,
      auditCost: auditRequired ? auditCost : 0,
      auditCriteria: {
        revenue: auditRevenue,
        totalAssets: auditAssets,
        employees: auditEmployees,
      },
      reliefs,
    });

    const errors = validateInputs(inputs);
    if (errors.length > 0) {
      alert(errors.map((e) => e.message).join('\n'));
      return;
    }

    navigate('/results', { state: inputs });
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-12 px-4 sm:px-6">
      <div className="container max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {/* Minimal Header */}
        <div className="space-y-2 sm:space-y-3 sticky top-0 bg-background/80 backdrop-blur-sm z-10 py-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:backdrop-blur-none">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="-ml-2 text-muted-foreground hover:text-foreground touch-target h-10 sm:h-9"
            size="sm"
          >
            <ArrowLeft weight="duotone" className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-1 sm:mb-2">
              Your Numbers
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Quick questions, instant answers
            </p>
          </div>
        </div>

        {/* Business Income */}
        <Card className="border">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Business Income</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your annual profit and other income</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <InputField
              label="Annual business profit"
              value={businessProfit}
              onChange={setBusinessProfit}
              placeholder="150000"
              tooltip="Your annual business profit before paying yourself a salary"
            />

            <InputField
              label="Other income"
              value={otherIncome}
              onChange={setOtherIncome}
              placeholder="0"
              tooltip="Any other personal income (salary, rental, etc.)"
              helperText="Leave as 0 if none"
            />
          </CardContent>
        </Card>

        {/* Sdn Bhd Setup */}
        <Card className="border">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold">If Sdn Bhd</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Your planned setup</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8 px-4 sm:px-6 pb-4 sm:pb-6">
            <Slider
              label="Monthly salary"
              value={monthlySalary}
              onChange={setMonthlySalary}
              min={3000}
              max={20000}
              step={500}
              tooltip="Monthly salary you'd pay yourself"
              formatValue={(val) => `RM${val.toLocaleString('en-MY')}/mo`}
            />

            <Slider
              label="Annual compliance cost"
              value={complianceCosts}
              onChange={setComplianceCosts}
              min={3000}
              max={15000}
              step={500}
              tooltip="CoSec, SSM, tax agent, bookkeeping"
            />
          </CardContent>
        </Card>

        {/* Tax Reliefs (Optional) */}
        <ReliefsSection reliefs={reliefs} onChange={setReliefs} />

        {/* Audit Check */}
        <Card className="border">
          <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
            <CardTitle className="text-base sm:text-lg font-semibold">Audit Exemption</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Check if you qualify</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg border border-border">
              <p className="text-xs font-medium mb-2 text-muted-foreground">Exempt if ALL met:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Revenue ≤ RM100k</li>
                <li>• Assets ≤ RM300k</li>
                <li>• ≤ 5 employees</li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField
                label="Revenue"
                value={auditRevenue}
                onChange={setAuditRevenue}
                prefix="RM"
                className="sm:col-span-1"
              />
              <InputField
                label="Assets"
                value={auditAssets}
                onChange={setAuditAssets}
                prefix="RM"
                className="sm:col-span-1"
              />
              <InputField
                label="Employees"
                value={auditEmployees}
                onChange={setAuditEmployees}
                prefix=""
                min={0}
                step={1}
                className="sm:col-span-1"
              />
            </div>

            <Alert className={auditRequired ? 'border-foreground/20 bg-foreground/5' : 'border-border bg-muted/30'}>
              {auditRequired ? (
                <>
                  <WarningCircle weight="duotone" className="h-4 w-4 text-foreground flex-shrink-0" />
                  <AlertDescription className="text-xs sm:text-sm text-foreground">
                    <strong className="font-semibold">Audit required</strong> — Fees included in calculation
                  </AlertDescription>
                </>
              ) : (
                <>
                  <CheckCircle weight="duotone" className="h-4 w-4 text-foreground flex-shrink-0" />
                  <AlertDescription className="text-xs sm:text-sm text-foreground">
                    <strong className="font-semibold">Audit exempt</strong> — No fees needed
                  </AlertDescription>
                </>
              )}
            </Alert>

            {auditRequired && (
              <Slider
                label="Audit cost"
                value={auditCost}
                onChange={setAuditCost}
                min={3000}
                max={8000}
                step={500}
              />
            )}
          </CardContent>
        </Card>

        {/* CTA - Sticky on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4 pb-4 sm:pb-0">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex-1 h-12 sm:h-11 border-foreground/20 touch-target order-2 sm:order-1"
          >
            Back
          </Button>
          <Button
            onClick={handleCalculate}
            className="flex-1 h-12 sm:h-11 group bg-foreground text-background hover:bg-foreground/90 touch-target order-1 sm:order-2"
          >
            Calculate
            <ArrowRight weight="duotone" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
