import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, CalendarBlank } from 'phosphor-react';
import Logo from '../Logo';
import LegalFooter from '../pages/LegalFooter';
import CalendarContent from '../calendar/CalendarContent';
import CalculatorContent from '../calculator/CalculatorContent';
import { LanguageToggle } from '../LanguageToggle';
import { ThemeToggle } from '../ThemeToggle';

type TabType = 'calculator' | 'calendar';

interface LandingSectionProps {
  onStart: () => void;
}

export default function LandingSection({ onStart }: LandingSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('calculator');

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-foreground focus:text-background focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <div id="main-content" className="min-h-screen min-h-[100dvh] w-full bg-background flex flex-col safe-area-insets">
        {/* Header with Logo and Tabs - Fixed on mobile */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between px-5 sm:px-8 lg:px-12 py-4 sm:py-5">
            <Logo size="md" className="flex-shrink-0" />

            {/* Tab Navigation - Pill style */}
            <nav className="flex items-center gap-0.5 bg-muted/50 p-1.5 rounded-full border border-border/30" role="tablist">
              <button
                role="tab"
                aria-selected={activeTab === 'calculator'}
                onClick={() => setActiveTab('calculator')}
                className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-500 min-h-[40px] ${
                  activeTab === 'calculator'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-[var(--blue)] active:scale-95'
                }`}
              >
                <Calculator
                  weight={activeTab === 'calculator' ? 'fill' : 'regular'}
                  className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                />
                <span className="hidden xs:inline sm:inline">{t('nav.calculator')}</span>
              </button>
              <button
                role="tab"
                aria-selected={activeTab === 'calendar'}
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-500 min-h-[40px] ${
                  activeTab === 'calendar'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-[var(--blue)] active:scale-95'
                }`}
              >
                <CalendarBlank
                  weight={activeTab === 'calendar' ? 'fill' : 'regular'}
                  className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                />
                <span className="hidden xs:inline sm:inline">{t('nav.calendar')}</span>
              </button>
            </nav>

            {/* Theme and Language Toggles */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'calculator' ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <CalculatorContent onStart={onStart} />
              </motion.div>
            ) : (
              <motion.div
                key="calendar"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <CalendarContent />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <LegalFooter />
    </>
  );
}
