import { useLanguage } from '@/i18n/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-0.5 p-1 bg-muted/50 rounded-lg border border-border/30">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
          language === 'en'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-[var(--blue)]'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ms')}
        className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
          language === 'ms'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-[var(--blue)]'
        }`}
        aria-label="Tukar ke Bahasa Melayu"
      >
        BM
      </button>
    </div>
  );
}
