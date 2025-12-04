import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import InputField from './InputField';
import { CaretDown, CaretUp } from 'phosphor-react';
import type { PersonalReliefs } from '@tax-engine/config';

interface ReliefsSectionProps {
  reliefs: PersonalReliefs;
  onChange: (reliefs: PersonalReliefs) => void;
}

export default function ReliefsSection({ reliefs, onChange }: ReliefsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateRelief = (key: keyof PersonalReliefs, value: number) => {
    onChange({
      ...reliefs,
      [key]: value,
    });
  };

  return (
    <Card className="border">
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base sm:text-lg font-semibold">Tax Reliefs (Optional)</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Customize your tax reliefs for more accurate calculation
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-8"
          >
            {isExpanded ? <CaretUp weight="duotone" className="h-4 w-4" /> : <CaretDown weight="duotone" className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="bg-muted/30 p-3 rounded-lg border border-border text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Default reliefs:</p>
            <p>Basic: RM9,000 • EPF/Life Insurance: RM7,000 • Medical: RM8,000</p>
            <p className="mt-1">Total: RM24,000</p>
          </div>

          <InputField
            label="Basic Relief"
            value={reliefs.basic || 9000}
            onChange={(val) => updateRelief('basic', val)}
            tooltip="Standard personal relief (RM9,000)"
            min={0}
            max={9000}
          />

          <InputField
            label="EPF & Life Insurance"
            value={reliefs.epfAndLifeInsurance || 7000}
            onChange={(val) => updateRelief('epfAndLifeInsurance', val)}
            tooltip="Combined EPF contributions and life insurance premiums (max RM7,000)"
            min={0}
            max={7000}
          />

          <InputField
            label="Medical Expenses"
            value={reliefs.medical || 8000}
            onChange={(val) => updateRelief('medical', val)}
            tooltip="Medical insurance and expenses (RM8,000)"
            min={0}
            max={8000}
          />

          <div className="pt-2 border-t">
            <p className="text-xs font-semibold text-foreground mb-3">Additional Reliefs (if applicable):</p>
            
            <InputField
              label="Spouse Relief"
              value={reliefs.spouse || 0}
              onChange={(val) => updateRelief('spouse', val)}
              tooltip="If spouse has no income (RM4,000)"
              min={0}
              max={4000}
            />

            <InputField
              label="Children Relief"
              value={reliefs.children || 0}
              onChange={(val) => updateRelief('children', val)}
              tooltip="Per child relief (RM2,000 per child, varies by age)"
              min={0}
            />

            <InputField
              label="Education/Medical (Children)"
              value={reliefs.education || 0}
              onChange={(val) => updateRelief('education', val)}
              tooltip="Education and medical expenses for children (RM8,000 per child)"
              min={0}
            />
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Total Reliefs: <span className="font-numbers">RM{Object.values(reliefs).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0).toLocaleString('en-MY')}</span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

