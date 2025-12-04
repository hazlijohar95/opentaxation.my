import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-full">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12 lg:py-16 space-y-12 sm:space-y-16">

        {/* Hero Section - Big visual impact */}
        <div className="text-center space-y-8">
          {/* Large animated number display */}
          <div className="relative">
            <div className="inline-flex items-baseline gap-1 font-display">
              <span className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-foreground">
                RM
              </span>
              <span className="text-6xl sm:text-8xl md:text-9xl font-bold tracking-tight text-muted-foreground/30 animate-pulse">
                ?
              </span>
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground mt-4">
              How much will you actually take home?
            </p>
          </div>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you run an Enterprise or Sdn Bhd, this calculator shows you the real numbers—taxes, EPF, compliance costs, and what actually lands in your pocket.
          </p>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {isLoading ? (
                <div className="h-14 w-48 bg-muted animate-pulse rounded-2xl" />
              ) : !user ? (
                <Button
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="h-14 px-10 text-lg rounded-2xl group"
                >
                  Calculate Now
                  <ArrowRight weight="bold" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    onClick={onStart}
                    className="h-14 px-10 text-lg rounded-2xl group"
                  >
                    Start Calculating
                    <ArrowRight weight="bold" className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate('/dashboard')}
                    className="h-14 px-8 text-lg rounded-2xl"
                  >
                    Dashboard
                  </Button>
                  <UserMenu />
                </>
              )}
            </div>
            <span className="text-sm text-muted-foreground">Free forever. No ads.</span>
          </div>
        </div>

        {/* Visual Comparison - Enterprise vs Sdn Bhd */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Enterprise Card */}
          <div className="group relative p-6 sm:p-8 rounded-3xl border border-border/60 bg-card hover:border-foreground/20 transition-all duration-500">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl border-2 border-foreground/10 flex items-center justify-center">
                <User weight="duotone" className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Enterprise</h3>
                <p className="text-sm text-muted-foreground">Sole Proprietorship</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Tax Rate</span>
                <span className="font-semibold text-lg">0-30%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Setup Cost</span>
                <span className="font-semibold text-lg">~RM500</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Annual Compliance</span>
                <span className="font-semibold text-lg">~RM0</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Simpler.</strong> No company secretary, no audits, less paperwork. But you pay personal income tax on everything.
              </p>
            </div>
          </div>

          {/* Sdn Bhd Card */}
          <div className="group relative p-6 sm:p-8 rounded-3xl border-2 border-foreground/20 bg-card hover:border-foreground/40 transition-all duration-500">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-foreground text-background flex items-center justify-center">
                <Buildings weight="fill" className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">Sdn Bhd</h3>
                <p className="text-sm text-muted-foreground">Private Limited Company</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Corporate Tax</span>
                <span className="font-semibold text-lg">15-24%</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <span className="text-muted-foreground">Setup Cost</span>
                <span className="font-semibold text-lg">~RM3,000</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">Annual Compliance</span>
                <span className="font-semibold text-lg">RM5-15k</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Lower tax rates</strong> and tax-free dividends. But more admin, more costs, more complexity.
              </p>
            </div>
          </div>
        </div>

        {/* The Honest Truth - Visual blocks */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">The Honest Truth</h2>
            <p className="text-muted-foreground">No marketing fluff. Just facts.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-muted/50 border border-border/50">
              <ChartLineUp weight="duotone" className="h-8 w-8 mb-4 text-foreground/70" />
              <h3 className="font-semibold mb-2">No Universal Winner</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">It depends on your profit, salary, and tolerance for paperwork</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-muted/50 border border-border/50">
              <Coins weight="duotone" className="h-8 w-8 mb-4 text-foreground/70" />
              <h3 className="font-semibold mb-2">Breakeven: RM100-300k</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Below this, Enterprise usually wins. Above, Sdn Bhd might be better.</p>
            </div>
            <div className="p-5 sm:p-6 rounded-2xl bg-muted/50 border border-border/50">
              <Receipt weight="duotone" className="h-8 w-8 mb-4 text-foreground/70" />
              <h3 className="font-semibold mb-2">Hidden Costs Matter</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Secretary fees, audits, bookkeeping—they add up fast with Sdn Bhd</p>
            </div>
          </div>
        </div>

        {/* What You'll See - Visual checklist */}
        <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-muted/80 to-muted/30 border border-border/50">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6">What You'll See</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: Wallet, text: "Exact tax for both structures" },
                { icon: Coins, text: "Net cash you'll actually receive" },
                { icon: Receipt, text: "EPF contributions calculated" },
                { icon: Buildings, text: "Compliance costs included" },
                { icon: ChartLineUp, text: "Visual crossover analysis" },
                { icon: CheckCircle, text: "Clear recommendation" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-background border border-border/60 flex items-center justify-center flex-shrink-0">
                    <item.icon weight="duotone" className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-6 pb-8 pt-8 border-t border-border/30">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
            <span className="text-sm font-medium text-foreground">Free forever. No ads.</span>
            <a
              href="https://github.com/syaifulazham/opentaxation.my"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <GithubLogo weight="duotone" className="h-4 w-4" />
              <span>Open source on GitHub</span>
            </a>
          </div>

          <p className="text-xs text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Uses YA 2024/2025 tax rates. Includes the new 2% dividend surcharge for amounts over RM100k.
            Not financial advice—consult a tax professional for your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
}
