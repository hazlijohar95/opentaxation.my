import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Bank,
  Handshake,
  TrendUp,
  Infinity,
  FileText,
  CurrencyCircleDollar,
  Check,
  X,
  Info,
} from 'phosphor-react';

interface Factor {
  icon: React.ReactNode;
  labelKey: string;
  enterpriseKey: string;
  enterprisePositive: boolean;
  sdnBhdKey: string;
  sdnBhdPositive: boolean;
  tooltipKey?: string;
}

const factorConfigs: Factor[] = [
  {
    icon: <ShieldCheck weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.liability.label',
    enterpriseKey: 'nonTax.liability.enterprise',
    enterprisePositive: false,
    sdnBhdKey: 'nonTax.liability.sdnbhd',
    sdnBhdPositive: true,
    tooltipKey: 'nonTax.liability.tooltip',
  },
  {
    icon: <Bank weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.banking.label',
    enterpriseKey: 'nonTax.banking.enterprise',
    enterprisePositive: true,
    sdnBhdKey: 'nonTax.banking.sdnbhd',
    sdnBhdPositive: true,
    tooltipKey: 'nonTax.banking.tooltip',
  },
  {
    icon: <Handshake weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.credibility.label',
    enterpriseKey: 'nonTax.credibility.enterprise',
    enterprisePositive: true,
    sdnBhdKey: 'nonTax.credibility.sdnbhd',
    sdnBhdPositive: true,
    tooltipKey: 'nonTax.credibility.tooltip',
  },
  {
    icon: <TrendUp weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.funding.label',
    enterpriseKey: 'nonTax.funding.enterprise',
    enterprisePositive: false,
    sdnBhdKey: 'nonTax.funding.sdnbhd',
    sdnBhdPositive: true,
    tooltipKey: 'nonTax.funding.tooltip',
  },
  {
    icon: <Infinity weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.continuity.label',
    enterpriseKey: 'nonTax.continuity.enterprise',
    enterprisePositive: false,
    sdnBhdKey: 'nonTax.continuity.sdnbhd',
    sdnBhdPositive: true,
    tooltipKey: 'nonTax.continuity.tooltip',
  },
  {
    icon: <FileText weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.compliance.label',
    enterpriseKey: 'nonTax.compliance.enterprise',
    enterprisePositive: true,
    sdnBhdKey: 'nonTax.compliance.sdnbhd',
    sdnBhdPositive: false,
    tooltipKey: 'nonTax.compliance.tooltip',
  },
  {
    icon: <CurrencyCircleDollar weight="duotone" className="h-4 w-4" />,
    labelKey: 'nonTax.setupCost.label',
    enterpriseKey: 'nonTax.setupCost.enterprise',
    enterprisePositive: true,
    sdnBhdKey: 'nonTax.setupCost.sdnbhd',
    sdnBhdPositive: false,
    tooltipKey: 'nonTax.setupCost.tooltip',
  },
];

export default function NonTaxFactorsCard() {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">{t('nonTax.title')}</CardTitle>
            <Badge variant="secondary" className="text-xs font-medium bg-muted/50">
              {t('nonTax.badge')}
            </Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            {t('nonTax.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-5 pb-5">
          {/* Desktop: Table Layout */}
          <div className="hidden sm:block">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mb-3 px-2">
              <div className="text-xs font-semibold text-muted-foreground">{t('nonTax.factor')}</div>
              <div className="text-xs font-semibold text-muted-foreground text-center">{t('nonTax.enterprise')}</div>
              <div className="text-xs font-semibold text-muted-foreground text-center">{t('nonTax.sdnBhd')}</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1">
              {factorConfigs.map((factor, idx) => (
                <motion.div
                  key={factor.labelKey}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                  className="grid grid-cols-[1fr_1fr_1fr] gap-2 py-2.5 px-2 rounded-md hover:bg-muted/40 transition-colors duration-150 group"
                >
                  {/* Factor Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{factor.icon}</span>
                    <span className="text-xs font-medium text-foreground">{t(factor.labelKey)}</span>
                    {factor.tooltipKey && (
                      <div className="relative">
                        <Info
                          weight="fill"
                          className="h-3 w-3 text-muted-foreground/50 cursor-help opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover border border-border rounded-md shadow-lg text-xs text-muted-foreground opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                          {t(factor.tooltipKey)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enterprise Value */}
                  <div className="flex items-center justify-center gap-1.5">
                    {factor.enterprisePositive ? (
                      <Check weight="bold" className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <X weight="bold" className="h-3 w-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs text-center ${
                      factor.enterprisePositive
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-muted-foreground'
                    }`}>
                      {t(factor.enterpriseKey)}
                    </span>
                  </div>

                  {/* Sdn Bhd Value */}
                  <div className="flex items-center justify-center gap-1.5">
                    {factor.sdnBhdPositive ? (
                      <Check weight="bold" className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <X weight="bold" className="h-3 w-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs text-center ${
                      factor.sdnBhdPositive
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-muted-foreground'
                    }`}>
                      {t(factor.sdnBhdKey)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Card Layout */}
          <div className="sm:hidden space-y-3">
            {factorConfigs.map((factor, idx) => (
              <motion.div
                key={factor.labelKey}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                className="bg-muted/30 rounded-lg p-4 space-y-3"
              >
                {/* Factor Header */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{factor.icon}</span>
                  <span className="text-sm font-medium text-foreground">{t(factor.labelKey)}</span>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t('nonTax.enterprise')}</div>
                    <div className="flex items-start gap-1.5">
                      {factor.enterprisePositive ? (
                        <Check weight="bold" className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X weight="bold" className="h-3.5 w-3.5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-tight ${
                        factor.enterprisePositive
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}>
                        {t(factor.enterpriseKey)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">{t('nonTax.sdnBhd')}</div>
                    <div className="flex items-start gap-1.5">
                      {factor.sdnBhdPositive ? (
                        <Check weight="bold" className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X weight="bold" className="h-3.5 w-3.5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-tight ${
                        factor.sdnBhdPositive
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}>
                        {t(factor.sdnBhdKey)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tooltip as inline note on mobile */}
                {factor.tooltipKey && (
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed pt-1 border-t border-border/30">
                    {t(factor.tooltipKey)}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              {t('nonTax.footer')}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
