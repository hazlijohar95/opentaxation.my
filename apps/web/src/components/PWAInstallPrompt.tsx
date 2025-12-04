import { motion, AnimatePresence } from 'framer-motion';
import { X, Export, Plus, DotsThreeVertical, ArrowDown, DeviceMobile } from 'phosphor-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/button';

export function PWAInstallPrompt() {
  const {
    shouldShowPrompt,
    isIOS,
    showIOSInstructions,
    install,
    dismiss,
    closeIOSInstructions,
  } = usePWAInstall();

  return (
    <>
      {/* Bottom Sheet Install Prompt */}
      <AnimatePresence>
        {shouldShowPrompt && !showIOSInstructions && (
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 inset-x-0 z-50 p-4 pb-safe"
          >
            <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
              {/* Header */}
              <div className="relative bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-5 pb-4">
                <button
                  onClick={dismiss}
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-muted/80 transition-colors"
                  aria-label="Dismiss"
                >
                  <X weight="bold" className="h-4 w-4 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center overflow-hidden">
                    <img
                      src="/favicon.png"
                      alt="OpenTaxation"
                      className="h-10 w-10"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Install OpenTax
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      opentaxation.my
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 pt-3 space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Install for quick access, offline support, and a native app experience.
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: '1s', label: 'Instant Load' },
                    { icon: 'Offline', label: 'Works Offline' },
                    { icon: 'Free', label: 'No App Store' },
                  ].map(({ icon, label }) => (
                    <div
                      key={label}
                      className="text-center p-2.5 rounded-lg bg-muted/50"
                    >
                      <div className="text-xs font-bold text-primary mb-0.5">{icon}</div>
                      <div className="text-[10px] text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-1">
                  <Button
                    variant="ghost"
                    onClick={dismiss}
                    className="flex-1 h-11"
                  >
                    Not Now
                  </Button>
                  <Button
                    variant="cta"
                    onClick={install}
                    className="flex-1 h-11 gap-2"
                  >
                    <DeviceMobile weight="bold" className="h-4 w-4" />
                    Install App
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Instructions Modal */}
      <AnimatePresence>
        {showIOSInstructions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={closeIOSInstructions}
            />

            {/* Modal */}
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-50 p-4 pb-safe"
            >
              <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-w-md mx-auto">
                {/* Header */}
                <div className="relative p-5 pb-4 border-b border-border">
                  <button
                    onClick={closeIOSInstructions}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted/80 transition-colors"
                    aria-label="Close"
                  >
                    <X weight="bold" className="h-4 w-4 text-muted-foreground" />
                  </button>

                  <h3 className="font-display text-xl font-semibold text-foreground pr-8">
                    Install on {isIOS ? 'iPhone' : 'Your Device'}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Follow these simple steps
                  </p>
                </div>

                {/* Steps */}
                <div className="p-5 space-y-5">
                  {isIOS ? (
                    // iOS Safari Instructions
                    <>
                      <Step
                        number={1}
                        icon={<Export weight="bold" className="h-6 w-6" />}
                        title="Tap Share"
                        description="Tap the Share button at the bottom of Safari"
                        highlight="blue"
                      />
                      <Step
                        number={2}
                        icon={<Plus weight="bold" className="h-6 w-6" />}
                        title='Find "Add to Home Screen"'
                        description="Scroll down and tap this option"
                        highlight="green"
                      />
                      <Step
                        number={3}
                        icon={<ArrowDown weight="bold" className="h-6 w-6" />}
                        title="Tap Add"
                        description="Confirm by tapping Add in the top right"
                        highlight="purple"
                      />
                    </>
                  ) : (
                    // Android Chrome Instructions
                    <>
                      <Step
                        number={1}
                        icon={<DotsThreeVertical weight="bold" className="h-6 w-6" />}
                        title="Tap Menu"
                        description="Tap the three dots in the top right corner"
                        highlight="blue"
                      />
                      <Step
                        number={2}
                        icon={<Plus weight="bold" className="h-6 w-6" />}
                        title='Tap "Install app"'
                        description='Or "Add to Home screen"'
                        highlight="green"
                      />
                      <Step
                        number={3}
                        icon={<ArrowDown weight="bold" className="h-6 w-6" />}
                        title="Confirm Install"
                        description="Tap Install to confirm"
                        highlight="purple"
                      />
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="p-5 pt-0">
                  <Button
                    variant="outline"
                    onClick={closeIOSInstructions}
                    className="w-full h-11"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface StepProps {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  highlight: 'blue' | 'green' | 'purple';
}

function Step({ number, icon, title, description, highlight }: StepProps) {
  const highlightColors = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: number * 0.1 }}
      className="flex items-start gap-4"
    >
      <div className={`flex-shrink-0 h-12 w-12 rounded-xl border flex items-center justify-center ${highlightColors[highlight]}`}>
        {icon}
      </div>
      <div className="flex-1 pt-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Step {number}</span>
        </div>
        <h4 className="font-medium text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </motion.div>
  );
}
