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
  label: string;
  enterprise: {
    value: string;
    isPositive: boolean;
  };
  sdnBhd: {
    value: string;
    isPositive: boolean;
  };
  tooltip?: string;
}

const factors: Factor[] = [
  {
    icon: <ShieldCheck weight="duotone" className="h-4 w-4" />,
    label: 'Liability',
    enterprise: {
      value: 'Unlimited personal liability',
      isPositive: false,
    },
    sdnBhd: {
      value: 'Limited to share capital',
      isPositive: true,
    },
    tooltip: 'Enterprise: Owner personally liable for all debts - personal assets (house, savings, car) can be seized. Sdn Bhd: Shareholders only liable up to their share value.',
  },
  {
    icon: <Bank weight="duotone" className="h-4 w-4" />,
    label: 'Banking',
    enterprise: {
      value: 'Loans available (up to RM100k)',
      isPositive: true,
    },
    sdnBhd: {
      value: 'Higher loan limits available',
      isPositive: true,
    },
    tooltip: 'Both can get SME loans from banks like Maybank, CIMB, Bank Islam. Enterprise typically limited to ~RM100k; Sdn Bhd can access RM250k-RM5M+ and government guarantee schemes (SJPP).',
  },
  {
    icon: <Handshake weight="duotone" className="h-4 w-4" />,
    label: 'Credibility',
    enterprise: {
      value: 'Suitable for local/small ops',
      isPositive: true,
    },
    sdnBhd: {
      value: 'Preferred by corporates',
      isPositive: true,
    },
    tooltip: 'Corporate clients, government tenders, and international partners often require or prefer dealing with Sdn Bhd. Enterprise works well for local retail/services.',
  },
  {
    icon: <TrendUp weight="duotone" className="h-4 w-4" />,
    label: 'Funding',
    enterprise: {
      value: 'Cannot issue equity',
      isPositive: false,
    },
    sdnBhd: {
      value: 'Can issue shares to investors',
      isPositive: true,
    },
    tooltip: 'Only Sdn Bhd can bring in investors by issuing shares. Essential if you plan to raise capital or have business partners with equity stakes.',
  },
  {
    icon: <Infinity weight="duotone" className="h-4 w-4" />,
    label: 'Continuity',
    enterprise: {
      value: 'Ends with owner',
      isPositive: false,
    },
    sdnBhd: {
      value: 'Perpetual existence',
      isPositive: true,
    },
    tooltip: 'Enterprise ceases when owner dies or stops operating. Sdn Bhd is a separate legal entity that continues regardless of shareholder changes.',
  },
  {
    icon: <FileText weight="duotone" className="h-4 w-4" />,
    label: 'Compliance',
    enterprise: {
      value: 'SSM renewal only',
      isPositive: true,
    },
    sdnBhd: {
      value: 'Secretary + audit* + returns',
      isPositive: false,
    },
    tooltip: 'Enterprise: Just annual SSM renewal. Sdn Bhd: Company secretary (RM80-200/mth), annual returns, and audit (RM2k-7k/yr) unless exempt. *Small companies may qualify for audit exemption from 2025.',
  },
  {
    icon: <CurrencyCircleDollar weight="duotone" className="h-4 w-4" />,
    label: 'Setup Cost',
    enterprise: {
      value: 'RM30-60/year',
      isPositive: true,
    },
    sdnBhd: {
      value: 'RM1,000+ (SSM) + RM3k-5k/yr',
      isPositive: false,
    },
    tooltip: 'Enterprise: RM30 (own name) or RM60 (trade name) per year. Sdn Bhd: RM1,010 SSM registration + RM3,000-5,000 annual maintenance (secretary, tax filing, audit if required).',
  },
];

export default function NonTaxFactorsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-border/50 shadow-sm">
        <CardHeader className="pb-4 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Beyond Tax</CardTitle>
            <Badge variant="secondary" className="text-xs font-medium bg-muted/50">
              Non-Tax Factors
            </Badge>
          </div>
          <CardDescription className="text-xs mt-1">
            Important factors beyond tax savings to consider
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-5 pb-5">
          {/* Desktop: Table Layout */}
          <div className="hidden sm:block">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 mb-3 px-2">
              <div className="text-xs font-semibold text-muted-foreground">Factor</div>
              <div className="text-xs font-semibold text-muted-foreground text-center">Enterprise</div>
              <div className="text-xs font-semibold text-muted-foreground text-center">Sdn Bhd</div>
            </div>

            {/* Table Rows */}
            <div className="space-y-1">
              {factors.map((factor, idx) => (
                <motion.div
                  key={factor.label}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.2 }}
                  className="grid grid-cols-[1fr_1fr_1fr] gap-2 py-2.5 px-2 rounded-md hover:bg-muted/40 transition-colors duration-150 group"
                >
                  {/* Factor Label */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{factor.icon}</span>
                    <span className="text-xs font-medium text-foreground">{factor.label}</span>
                    {factor.tooltip && (
                      <div className="relative">
                        <Info
                          weight="fill"
                          className="h-3 w-3 text-muted-foreground/50 cursor-help opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-popover border border-border rounded-md shadow-lg text-xs text-muted-foreground opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
                          {factor.tooltip}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Enterprise Value */}
                  <div className="flex items-center justify-center gap-1.5">
                    {factor.enterprise.isPositive ? (
                      <Check weight="bold" className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <X weight="bold" className="h-3 w-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs text-center ${
                      factor.enterprise.isPositive
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-muted-foreground'
                    }`}>
                      {factor.enterprise.value}
                    </span>
                  </div>

                  {/* Sdn Bhd Value */}
                  <div className="flex items-center justify-center gap-1.5">
                    {factor.sdnBhd.isPositive ? (
                      <Check weight="bold" className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <X weight="bold" className="h-3 w-3 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs text-center ${
                      factor.sdnBhd.isPositive
                        ? 'text-green-700 dark:text-green-400'
                        : 'text-muted-foreground'
                    }`}>
                      {factor.sdnBhd.value}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: Card Layout */}
          <div className="sm:hidden space-y-3">
            {factors.map((factor, idx) => (
              <motion.div
                key={factor.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2 }}
                className="bg-muted/30 rounded-lg p-4 space-y-3"
              >
                {/* Factor Header */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{factor.icon}</span>
                  <span className="text-sm font-medium text-foreground">{factor.label}</span>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Enterprise</div>
                    <div className="flex items-start gap-1.5">
                      {factor.enterprise.isPositive ? (
                        <Check weight="bold" className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X weight="bold" className="h-3.5 w-3.5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-tight ${
                        factor.enterprise.isPositive
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}>
                        {factor.enterprise.value}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Sdn Bhd</div>
                    <div className="flex items-start gap-1.5">
                      {factor.sdnBhd.isPositive ? (
                        <Check weight="bold" className="h-3.5 w-3.5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X weight="bold" className="h-3.5 w-3.5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs leading-tight ${
                        factor.sdnBhd.isPositive
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-muted-foreground'
                      }`}>
                        {factor.sdnBhd.value}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tooltip as inline note on mobile */}
                {factor.tooltip && (
                  <p className="text-[10px] text-muted-foreground/70 leading-relaxed pt-1 border-t border-border/30">
                    {factor.tooltip}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-4 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              Tax savings alone may not justify incorporation. Consider your business goals,
              growth plans, and risk tolerance when making this decision.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
