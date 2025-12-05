import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleLogo, ArrowLeft, Calculator, ShieldCheck, ChartLineUp } from 'phosphor-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

// Animated background component that works in both light and dark modes
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient - adapts to theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/30" />

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {/* Large circle - top right */}
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.08] blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Medium circle - bottom left */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-gradient-to-tr from-foreground/[0.04] to-foreground/[0.06] blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />

        {/* Small accent circle - center */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-gradient-to-br from-foreground/[0.02] to-foreground/[0.05] blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Diagonal lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" preserveAspectRatio="none">
        <defs>
          <pattern id="diagonal-lines" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonal-lines)" />
      </svg>

      {/* Floating small shapes */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-foreground/10"
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-2/3 right-1/3 w-3 h-3 rounded-full bg-foreground/10"
        animate={{
          y: [0, -20, 0],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/2 w-2 h-2 rounded-full bg-foreground/10"
        animate={{
          y: [0, -25, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-foreground/[0.02] to-transparent" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-foreground/[0.02] to-transparent" />
    </div>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, isLoading, signInWithGoogle } = useAuth();

  // Redirect to dashboard if already signed in
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isLoading, navigate]);

  const features = [
    {
      icon: Calculator,
      title: 'Instant Calculations',
      description: 'Compare Enterprise vs Sdn Bhd taxes in seconds',
    },
    {
      icon: ChartLineUp,
      title: 'Save & Track',
      description: 'Store your calculations and track changes over time',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared',
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex bg-background">
      {/* Left side - Auth form */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-4 sm:p-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft weight="bold" className="h-5 w-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="lg:hidden">
            <Logo size="sm" />
          </div>
          <div className="w-20" /> {/* Spacer for centering */}
        </header>

        {/* Main content */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm space-y-6"
          >
            {/* Welcome text */}
            <div className="text-center space-y-2">
              <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your tax calculator
              </p>
            </div>

            {/* Sign in button */}
            <div className="space-y-4">
              <Button
                size="lg"
                variant="outline"
                onClick={signInWithGoogle}
                disabled={isLoading}
                className="w-full h-14 text-base font-medium rounded-xl border-2 hover:bg-muted/50 hover:border-primary/30 transition-all duration-300"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-muted-foreground/30 border-t-foreground rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <GoogleLogo weight="bold" className="h-5 w-5" />
                    <span>Continue with Google</span>
                  </div>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <a href="/terms" className="underline hover:text-foreground transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="underline hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Features - visible on mobile */}
            <div className="lg:hidden pt-6 space-y-4">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <feature.icon weight="duotone" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="p-4 sm:p-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} opentaxation.my. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Right side - Animated visual background */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
        <AnimatedBackground />

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between p-8 lg:p-12 xl:p-16 w-full">
          {/* Logo */}
          <div className="flex justify-end">
            <div className="bg-background/80 backdrop-blur-sm rounded-2xl px-5 py-3 border border-border/50">
              <Logo size="lg" />
            </div>
          </div>

          {/* Main content card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="max-w-xl ml-auto"
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-3xl p-8 border border-border/50">
              <h1 className="font-display text-3xl xl:text-4xl font-bold leading-tight mb-4">
                Make smarter tax decisions for your Malaysian business
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Join thousands of business owners using our free calculator to optimize their tax structure.
              </p>
            </div>
          </motion.div>

          {/* Bottom stats pill */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex justify-end"
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50 flex items-center gap-5 text-sm font-medium">
              <span>YA2025 Rates</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>100% Free</span>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span>LHDN Compliant</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
