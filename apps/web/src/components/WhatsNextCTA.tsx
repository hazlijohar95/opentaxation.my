import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import {
  Buildings,
  BookBookmark,
  Calculator,
  Bank,
  CaretRight,
  X,
  EnvelopeSimple,
  CheckCircle
} from 'phosphor-react';
import type { ComparisonResult } from '@tax-engine/core';
import { createLead, getUtmParams, getReferrer } from '@/lib/leads';
import { useAuth } from '@/contexts/AuthContext';

interface WhatsNextCTAProps {
  comparison: ComparisonResult;
  onDismiss?: () => void;
}

interface ServiceItem {
  icon: typeof Buildings;
  titleKey: string;
  descriptionKey: string;
  priceRangeKey: string;
}

const serviceConfigs: ServiceItem[] = [
  {
    icon: Buildings,
    titleKey: 'whatsNext.service.secretary.title',
    descriptionKey: 'whatsNext.service.secretary.desc',
    priceRangeKey: 'whatsNext.service.secretary.price',
  },
  {
    icon: BookBookmark,
    titleKey: 'whatsNext.service.accounting.title',
    descriptionKey: 'whatsNext.service.accounting.desc',
    priceRangeKey: 'whatsNext.service.accounting.price',
  },
  {
    icon: Calculator,
    titleKey: 'whatsNext.service.tax.title',
    descriptionKey: 'whatsNext.service.tax.desc',
    priceRangeKey: 'whatsNext.service.tax.price',
  },
  {
    icon: Bank,
    titleKey: 'whatsNext.service.banking.title',
    descriptionKey: 'whatsNext.service.banking.desc',
    priceRangeKey: 'whatsNext.service.banking.price',
  },
];

function WhatsNextCTA({ comparison, onDismiss }: WhatsNextCTAProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isDismissed, setIsDismissed] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only show when Sdn Bhd is recommended
  if (comparison.whichIsBetter !== 'sdnBhd' || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const result = await createLead({
      email,
      leadType: 'incorporation',
      source: 'whats_next_cta',
      metadata: {
        potentialSavings: comparison.savingsIfSwitch,
        recommendation: comparison.whichIsBetter,
        ...getUtmParams(),
        referrer: getReferrer(),
      },
      userId: user?.id || null,
    });

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError(result.error || 'Something went wrong. Please try again.');
    }

    setIsSubmitting(false);
  };

  const savingsAmount = comparison.savingsIfSwitch;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Card className="relative border border-border/60 bg-gradient-to-br from-muted/30 via-background to-muted/20 shadow-sm overflow-hidden">
          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/50 transition-colors z-10"
            aria-label="Dismiss"
          >
            <X weight="bold" className="h-4 w-4 text-muted-foreground" />
          </button>

          <CardContent className="p-5 sm:p-6 space-y-5">
            {/* Header */}
            <div className="pr-8">
              <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                {t('whatsNext.title')}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('whatsNext.subtitle')}{' '}
                <span className="font-numbers font-medium text-foreground">
                  RM{savingsAmount.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                {t('whatsNext.perYear')}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-3">
              {serviceConfigs.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.titleKey}
                    className="group p-3 rounded-xl bg-background/50 border border-border/40 hover:border-border/60 hover:bg-background/80 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                        <Icon weight="duotone" className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {t(service.titleKey)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {t(service.descriptionKey)}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 font-numbers">
                          {t(service.priceRangeKey)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Email capture or Success state */}
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                >
                  <CheckCircle weight="duotone" className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      {t('whatsNext.onTheList')}
                    </p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                      {t('whatsNext.connectSoon')}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <EnvelopeSimple className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        placeholder="your@email.com"
                        className={`w-full h-11 pl-9 pr-4 rounded-xl border bg-background text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all ${
                          error ? 'border-red-500/50' : 'border-border'
                        }`}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting || !email}
                      className="h-11 px-5 rounded-xl bg-foreground text-background text-sm font-medium hover:bg-foreground/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <span className="animate-subtle-pulse">{t('whatsNext.sending')}</span>
                      ) : (
                        <>
                          {t('whatsNext.getQuotes')}
                          <CaretRight weight="bold" className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  {error ? (
                    <p className="text-xs text-red-500 text-center">{error}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground/70 text-center">
                      {t('whatsNext.noSpam')}
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="text-xs text-muted-foreground/60">
                {t('whatsNext.trustedBy')}
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(WhatsNextCTA);
