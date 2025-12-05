import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  GithubLogo,
  User,
  Buildings,
  Coins,
  Receipt,
  Wallet,
  ChartLineUp,
  CheckCircle,
} from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserMenu } from '@/components/UserMenu';

interface CalculatorContentProps {
  onStart: () => void;
}

export default function CalculatorContent({ onStart }: CalculatorContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-full">
      {/* Hero Section - Primary background */}
      <section className="section-primary section-padding">
        <div className="container-content text-center space-y-8">
          {/* Headline */}
          <div className="relative">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4 text-balance">
              {t('landingPage.hero.title')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mx-auto">
              {t('landingPage.hero.subtitle')}
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isLoading ? (
                <div className="h-14 w-48 bg-muted animate-pulse rounded-2xl" />
              ) : (
                <>
                  <Button
                    size="lg"
                    variant="cta"
                    onClick={onStart}
                    className="h-16 px-12 text-lg rounded-2xl group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                  >
                    {t('landingPage.hero.cta')}
                    <ArrowRight weight="bold" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  {user && (
                    <>
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                        className="h-14 px-8 text-lg rounded-2xl"
                      >
                        {t('landingPage.hero.dashboard')}
                      </Button>
                      <UserMenu />
                    </>
                  )}
                </>
              )}
            </div>
            <span className="text-sm font-medium text-primary/80">{t('landingPage.hero.free')}</span>
          </div>

          {/* Social proof - deadpan style */}
          <p className="text-sm text-muted-foreground">
            {t('landingPage.hero.socialProof')}
          </p>
        </div>
      </section>

      {/* Comparison Section - Secondary background */}
      <section className="section-secondary section-padding">
        <div className="container-content space-y-12">
          {/* Visual Comparison - Enterprise vs Sdn Bhd */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Enterprise Card */}
            <div className="group relative p-6 sm:p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl border-2 border-border bg-background flex items-center justify-center">
                  <User weight="duotone" className="h-7 w-7 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t('landingPage.enterprise.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('landingPage.enterprise.subtitle')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{t('landingPage.enterprise.taxRate')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.enterprise.taxRateValue')}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{t('landingPage.enterprise.setupCost')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.enterprise.setupCostValue')}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">{t('landingPage.enterprise.compliance')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.enterprise.complianceValue')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{t('landingPage.enterprise.highlight')}</strong> {t('landingPage.enterprise.description')}
                </p>
              </div>
            </div>

            {/* Sdn Bhd Card */}
            <div className="group relative p-6 sm:p-8 rounded-3xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl border-2 border-border bg-background flex items-center justify-center">
                  <Buildings weight="duotone" className="h-7 w-7 text-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">{t('landingPage.sdnbhd.title')}</h3>
                  <p className="text-sm text-muted-foreground">{t('landingPage.sdnbhd.subtitle')}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{t('landingPage.sdnbhd.taxRate')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.sdnbhd.taxRateValue')}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <span className="text-muted-foreground">{t('landingPage.sdnbhd.setupCost')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.sdnbhd.setupCostValue')}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-muted-foreground">{t('landingPage.sdnbhd.compliance')}</span>
                  <span className="font-semibold text-lg font-numbers">{t('landingPage.sdnbhd.complianceValue')}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">{t('landingPage.sdnbhd.highlight')}</strong> {t('landingPage.sdnbhd.description')}
                </p>
              </div>
            </div>
          </div>

          {/* The Key Insight - Make breakeven prominent */}
          <div className="text-center p-8 sm:p-12 rounded-3xl bg-card border border-border/50 shadow-sm">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-balance">
              {t('landingPage.magic.title')} <span className="text-primary">{t('landingPage.magic.range')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto text-balance">
              {t('landingPage.magic.below')}<br className="hidden sm:inline" />
              {t('landingPage.magic.above')}
            </p>
            <p className="text-base text-muted-foreground/80 mt-3">
              {t('landingPage.magic.caveat')}
            </p>
          </div>
        </div>
      </section>

      {/* The Honest Truth Section - Primary background */}
      <section className="section-primary section-padding">
        <div className="container-content space-y-8">
          <div className="text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-3">{t('landingPage.truth.title')}</h2>
            <p className="text-muted-foreground">{t('landingPage.truth.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow duration-200">
              <ChartLineUp weight="duotone" className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t('landingPage.truth.noWinner.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.noWinner.desc')}</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow duration-200">
              <Receipt weight="duotone" className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t('landingPage.truth.hidden.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.hidden.desc')}</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-shadow duration-200">
              <Coins weight="duotone" className="h-8 w-8 mb-4 text-primary" />
              <h3 className="font-semibold mb-2">{t('landingPage.truth.changed.title')}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('landingPage.truth.changed.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Get - Secondary background */}
      <section className="section-secondary section-padding">
        <div className="container-content">
          <div className="relative p-8 sm:p-10 rounded-3xl bg-card border border-border/50">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">{t('landingPage.know.title')}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { icon: Wallet, textKey: "landingPage.know.keep", color: "text-emerald-600" },
                { icon: Coins, textKey: "landingPage.know.takehome", color: "text-amber-600" },
                { icon: Receipt, textKey: "landingPage.know.epf", color: "text-blue-600" },
                { icon: Buildings, textKey: "landingPage.know.cost", color: "text-purple-600" },
                { icon: ChartLineUp, textKey: "landingPage.know.crossover", color: "text-rose-600" },
                { icon: CheckCircle, textKey: "landingPage.know.fit", color: "text-teal-600" },
              ].map((item) => (
                <div
                  key={item.textKey}
                  className="group flex flex-col items-center text-center gap-3 p-4 rounded-2xl hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="w-14 h-14 rounded-xl bg-background border border-border/50 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
                    <item.icon weight="duotone" className={`h-7 w-7 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium">{t(item.textKey)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Primary background */}
      <section className="section-primary section-padding">
        <div className="container-content max-w-2xl">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-8 text-center">{t('landingPage.faq.title')}</h2>

          <div className="space-y-4">
            {[
              { qKey: 'landingPage.faq.q1', aKey: 'landingPage.faq.a1' },
              { qKey: 'landingPage.faq.q2', aKey: 'landingPage.faq.a2' },
              { qKey: 'landingPage.faq.q3', aKey: 'landingPage.faq.a3' },
              { qKey: 'landingPage.faq.q4', aKey: 'landingPage.faq.a4' },
              { qKey: 'landingPage.faq.q5', aKey: 'landingPage.faq.a5' },
              { qKey: 'landingPage.faq.q6', aKey: 'landingPage.faq.a6' },
            ].map((faq, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-2">
                <h3 className="text-base font-semibold text-foreground">{t(faq.qKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(faq.aKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section - Primary background */}
      <section className="section-primary py-12 sm:py-16">
        <div className="container-content text-center space-y-8 border-t border-border/30 pt-10">
          <a
            href="https://github.com/hazlijohar95/opentaxation.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <GithubLogo weight="duotone" className="h-4 w-4" />
            <span>{t('landingPage.footer.github')}</span>
          </a>

          <p className="text-xs text-muted-foreground/60 max-w-md mx-auto leading-relaxed">
            {t('landingPage.footer.disclaimer')}
          </p>

          <p className="text-xs text-muted-foreground/50 italic">
            {t('landingPage.footer.vibeCoded')}
          </p>
        </div>
      </section>
    </div>
  );
}
