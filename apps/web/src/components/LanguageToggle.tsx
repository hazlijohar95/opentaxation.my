import { useLanguage } from '@/i18n/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ms' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 touch-target"
      aria-label={language === 'en' ? 'Tukar ke Bahasa Melayu' : 'Switch to English'}
    >
      {language === 'en' ? 'BM' : 'EN'}
    </button>
  );
}
