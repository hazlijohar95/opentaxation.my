import { memo, useState } from 'react';
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
  title: string;
  description: string;
  priceRange: string;
}

const services: ServiceItem[] = [
  {
    icon: Buildings,
    title: 'Company Secretary',
    description: 'SSM registration & compliance',
    priceRange: 'from RM1,200/year',
  },
  {
    icon: BookBookmark,
    title: 'Accounting Services',
    description: 'Bookkeeping & financial statements',
    priceRange: 'from RM200/month',
  },
  {
    icon: Calculator,
    title: 'Tax Filing',
    description: 'Corporate tax returns & planning',
    priceRange: 'from RM500/year',
  },
  {
    icon: Bank,
    title: 'Business Banking',
    description: 'Corporate account setup assistance',
    priceRange: 'Free guidance',
  },
];

function WhatsNextCTA({ comparison, onDismiss }: WhatsNextCTAProps) {
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
                Ready to incorporate?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                With potential savings of{' '}
                <span className="font-numbers font-medium text-foreground">
                  RM{savingsAmount.toLocaleString('en-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                /year, here's what you'll need:
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.title}
                    className="group p-3 rounded-xl bg-background/50 border border-border/40 hover:border-border/60 hover:bg-background/80 transition-all duration-200"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-muted transition-colors">
                        <Icon weight="duotone" className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground leading-tight">
                          {service.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                          {service.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1 font-numbers">
                          {service.priceRange}
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
                      You're on the list!
                    </p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                      We'll connect you with verified partners soon.
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
                        <span className="animate-subtle-pulse">Sending...</span>
                      ) : (
                        <>
                          Get quotes
                          <CaretRight weight="bold" className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                  {error ? (
                    <p className="text-xs text-red-500 text-center">{error}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground/70 text-center">
                      We'll connect you with verified professionals. No spam, ever.
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <span className="text-xs text-muted-foreground/60">
                Trusted by 1,000+ Malaysian businesses
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default memo(WhatsNextCTA);
