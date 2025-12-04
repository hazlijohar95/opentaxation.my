import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  calculateSolePropScenario,
  calculateSdnBhdScenario,
  type TaxCalculationInputs,
} from '@tax-engine/core';

interface CrossoverChartProps {
  inputs: TaxCalculationInputs;
}

/**
 * Crossover Chart Component
 * 
 * Per React best practices: https://react.dev/learn/you-might-not-need-an-effect
 * - Uses useMemo to cache expensive chart data calculations
 * - Only recalculates when relevant inputs change
 */
export default function CrossoverChart({ inputs }: CrossoverChartProps) {
  // Extract reliefs values for dependency array
  const reliefs = inputs.reliefs;
  const reliefsKey = reliefs
    ? `${reliefs.basic || 0}-${reliefs.epfAndLifeInsurance || 0}-${reliefs.medical || 0}-${reliefs.spouse || 0}-${reliefs.children || 0}-${reliefs.education || 0}`
    : '';

  // Memoize expensive chart data calculation
  // This prevents recalculating all data points on every render
  const data = useMemo(() => {
    const maxProfit = Math.max(inputs.businessProfit + 50000, 200000);
    const step = Math.max(10000, Math.floor(maxProfit / 20));
    const dataPoints: number[] = [];

    for (let profit = 0; profit <= maxProfit; profit += step) {
      dataPoints.push(profit);
    }
    if (!dataPoints.includes(inputs.businessProfit)) {
      dataPoints.push(inputs.businessProfit);
      dataPoints.sort((a, b) => a - b);
    }

    return dataPoints.map((profit) => {
      const solePropResult = calculateSolePropScenario({
        businessProfit: profit,
        otherIncome: inputs.otherIncome || 0,
        reliefs: inputs.reliefs,
      });

      const sdnBhdResult = calculateSdnBhdScenario({
        businessProfit: profit,
        monthlySalary: inputs.monthlySalary || 5000,
        otherIncome: inputs.otherIncome || 0,
        complianceCosts: inputs.complianceCosts || 5000,
        auditCost: inputs.auditCost,
        auditCriteria: inputs.auditCriteria,
        reliefs: inputs.reliefs,
        applyYa2025DividendSurcharge: inputs.applyYa2025DividendSurcharge,
      });

      return {
        profit,
        enterprise: Math.round(solePropResult.netCash),
        sdnBhd: Math.round(sdnBhdResult.netCash),
      };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- Using primitive values intentionally to avoid unnecessary recalculations from object reference changes
  }, [
    inputs.businessProfit,
    inputs.otherIncome,
    inputs.monthlySalary,
    inputs.complianceCosts,
    inputs.auditCost,
    inputs.auditCriteria?.revenue,
    inputs.auditCriteria?.totalAssets,
    inputs.auditCriteria?.employees,
    reliefsKey, // Use serialized reliefs instead of object reference
    inputs.applyYa2025DividendSurcharge,
  ]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `RM${(value / 1000000).toFixed(1)}M`;
    }
    return `RM${(value / 1000).toFixed(0)}k`;
  };

  return (
    <Card className="border">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-base sm:text-lg font-semibold">Crossover Analysis</CardTitle>
        <CardDescription className="text-xs sm:text-sm">How they compare at different profit levels</CardDescription>
      </CardHeader>
      <CardContent className="px-2 sm:px-6 pb-4 sm:pb-6">
        <div className="h-[280px] sm:h-[350px] lg:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="profit"
              tickFormatter={formatCurrency}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '10px' }}
              className="sm:text-xs"
            />
            <YAxis
              tickFormatter={formatCurrency}
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: '10px' }}
              className="sm:text-xs"
            />
            <Tooltip
              formatter={(value: number) => `RM${value.toLocaleString('en-MY')}`}
              labelFormatter={(label) => `Profit: RM${Number(label).toLocaleString('en-MY')}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)',
                padding: '8px',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey="enterprise"
              stroke="hsl(var(--foreground))"
              strokeWidth={2.5}
              name="Enterprise"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="sdnBhd"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2.5}
              name="Sdn Bhd"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
