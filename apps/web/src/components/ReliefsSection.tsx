import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            <CardTitle className="text-base sm:text-lg font-semibold">{t('inputs.reliefs.title')}</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              {t('inputs.reliefs.subtitle')}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-10 min-w-[44px] min-h-[44px]"
          >
            {isExpanded ? <CaretUp weight="duotone" className="h-4 w-4" /> : <CaretDown weight="duotone" className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-4 px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="bg-muted/30 p-3 rounded-lg border border-border text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">{t('inputs.reliefs.default')}</p>
            <p>{t('inputs.reliefs.basic')}: RM9,000 • {t('inputs.reliefs.epf')}: RM7,000 • {t('inputs.reliefs.medical')}: RM8,000</p>
            <p className="mt-1">{t('inputs.reliefs.total')}: RM24,000</p>
          </div>

          <InputField
            label={t('inputs.reliefs.basicLabel')}
            value={reliefs.basic || 9000}
            onChange={(val) => updateRelief('basic', val)}
            tooltip={t('inputs.reliefs.basicTooltip')}
            min={0}
            max={9000}
          />

          <InputField
            label={t('inputs.reliefs.epfLabel')}
            value={reliefs.epfAndLifeInsurance || 7000}
            onChange={(val) => updateRelief('epfAndLifeInsurance', val)}
            tooltip={t('inputs.reliefs.epfTooltip')}
            min={0}
            max={7000}
          />

          <InputField
            label={t('inputs.reliefs.medicalLabel')}
            value={reliefs.medical || 8000}
            onChange={(val) => updateRelief('medical', val)}
            tooltip={t('inputs.reliefs.medicalTooltip')}
            min={0}
            max={8000}
          />

          <div className="pt-2 border-t">
            <p className="text-xs font-semibold text-foreground mb-3">{t('inputs.reliefs.additional')}</p>

            <InputField
              label={t('inputs.reliefs.spouseLabel')}
              value={reliefs.spouse || 0}
              onChange={(val) => updateRelief('spouse', val)}
              tooltip={t('inputs.reliefs.spouseTooltip')}
              min={0}
              max={4000}
            />

            <InputField
              label={t('inputs.reliefs.childrenLabel')}
              value={reliefs.children || 0}
              onChange={(val) => updateRelief('children', val)}
              tooltip={t('inputs.reliefs.childrenTooltip')}
              min={0}
            />

            <InputField
              label={t('inputs.reliefs.educationLabel')}
              value={reliefs.education || 0}
              onChange={(val) => updateRelief('education', val)}
              tooltip={t('inputs.reliefs.educationTooltip')}
              min={0}
            />
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              {t('inputs.reliefs.totalReliefs')}: <span className="font-numbers">RM{Object.values(reliefs).reduce((sum: number, val) => sum + (typeof val === 'number' ? val : 0), 0).toLocaleString('en-MY')}</span>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

