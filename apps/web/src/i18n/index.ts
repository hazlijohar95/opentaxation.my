import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import ms from './locales/ms';

// Language detection priority:
// 1. URL parameter (?lang=ms)
// 2. localStorage
// 3. Browser language
// 4. Default: English
function detectInitialLanguage(): 'en' | 'ms' {
  // Check URL parameter
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang === 'en' || urlLang === 'ms') return urlLang;

    // Check localStorage
    const stored = localStorage.getItem('preferred_language');
    if (stored === 'en' || stored === 'ms') return stored;

    // Check browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ms') || browserLang.startsWith('my')) return 'ms';
  }

  return 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ms: { translation: ms },
  },
  lng: detectInitialLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  react: {
    useSuspense: false, // Translations are bundled, no async loading
  },
});

export default i18n;
