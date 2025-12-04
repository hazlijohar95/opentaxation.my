import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, GithubLogo } from 'phosphor-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Logo size="sm" />
          <a
            href="https://github.com/syaifulazham/opentaxation.my"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <GithubLogo weight="duotone" className="h-5 w-5" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Hero */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight leading-[1.15]">
              Know exactly how much money you'll take home.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Whether you run an Enterprise or Sdn Bhd, this calculator shows you the real numbers—taxes, EPF, compliance costs, and what actually lands in your pocket.
            </p>
          </div>

          {/* CTA */}
          <div>
            <Button
              size="lg"
              onClick={() => navigate('/input')}
              className="text-base px-8 h-12 group"
            >
              Calculate Now
              <ArrowRight weight="duotone" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* The Truth Section */}
          <div className="space-y-6 pt-8 border-t border-border/50">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              The honest truth
            </h2>
            <div className="space-y-4 text-foreground">
              <p className="leading-relaxed">
                <strong>There's no universal "better" structure.</strong> It depends on your profit, how much salary you pay yourself, your other income, and how much hassle you're willing to deal with.
              </p>
              <p className="leading-relaxed">
                <strong>Enterprise is simpler.</strong> No company secretary, no audits (usually), less paperwork. But you pay personal income tax on everything—up to 30%.
              </p>
              <p className="leading-relaxed">
                <strong>Sdn Bhd has lower tax rates</strong> (15-24% corporate tax), and dividends are tax-free. But you need a company secretary, bookkeeping, annual filings, and possibly audits. That costs RM5,000-15,000+ per year.
              </p>
              <p className="leading-relaxed text-muted-foreground">
                The breakeven point? Usually somewhere between RM100k-300k profit. But your situation is unique. That's why you need to run the numbers.
              </p>
            </div>
          </div>

          {/* What You'll See */}
          <div className="space-y-6 pt-8 border-t border-border/50">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              What you'll see
            </h2>
            <ul className="space-y-3 text-foreground">
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>Exact tax amount for both structures</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>Net cash you'll actually receive</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>EPF contributions (employer & employee)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>Compliance costs factored in</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-muted-foreground mt-0.5">→</span>
                <span>Clear recommendation with reasoning</span>
              </li>
            </ul>
          </div>

          {/* Fine Print */}
          <div className="space-y-4 pt-8 border-t border-border/50 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Free. No signup. No ads.</strong> Built by Malaysian developers who got tired of guessing.
            </p>
            <p>
              Uses YA 2024/2025 tax rates. Includes the new 2% dividend surcharge for amounts over RM100k. Not financial advice—consult a tax professional for your specific situation.
            </p>
          </div>

          {/* Second CTA */}
          <div className="pt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/input')}
              className="text-base px-8 h-12 group border-foreground/20"
            >
              Run the Numbers
              <ArrowRight weight="duotone" className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <a href="/privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-foreground transition-colors">Terms</a>
            <a href="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</a>
          </div>
          <a
            href="https://github.com/syaifulazham/opentaxation.my"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <GithubLogo weight="duotone" className="h-4 w-4" />
            <span>Open source</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
