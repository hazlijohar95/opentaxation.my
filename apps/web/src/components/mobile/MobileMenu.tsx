import { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Translate } from 'phosphor-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/i18n/LanguageContext';
import { useTranslation } from 'react-i18next';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useTranslation();
  const { resolvedTheme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-background/60 backdrop-blur-xl"
            onClick={onClose}
          />

          {/* Menu panel - slides up from bottom */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
              mass: 0.8,
            }}
            className="absolute bottom-0 left-0 right-0 bg-background border-t border-border/30 rounded-t-3xl shadow-2xl"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header with close button */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-lg font-semibold text-foreground">
                {t('common.settings', 'Settings')}
              </h2>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-muted/50 active:scale-95 transition-all"
                aria-label="Close menu"
              >
                <X weight="bold" className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {/* Menu content */}
            <div className="px-6 pb-8 space-y-6">
              {/* Theme selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sun weight="duotone" className="h-4 w-4" />
                  {t('settings.theme', 'Theme')}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      resolvedTheme === 'light'
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30'
                    }`}
                  >
                    <Sun
                      weight={resolvedTheme === 'light' ? 'fill' : 'regular'}
                      className="h-5 w-5"
                    />
                    {t('settings.light', 'Light')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      resolvedTheme === 'dark'
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30'
                    }`}
                  >
                    <Moon
                      weight={resolvedTheme === 'dark' ? 'fill' : 'regular'}
                      className="h-5 w-5"
                    />
                    {t('settings.dark', 'Dark')}
                  </button>
                </div>
              </div>

              {/* Language selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Translate weight="duotone" className="h-4 w-4" />
                  {t('settings.language', 'Language')}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      language === 'en'
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ms')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      language === 'ms'
                        ? 'bg-foreground text-background shadow-lg'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted border border-border/30'
                    }`}
                  >
                    Bahasa Melayu
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default memo(MobileMenu);
