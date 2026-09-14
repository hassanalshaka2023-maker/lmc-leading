import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import ar from './locales/ar.json';
import en from './locales/en.json';

export const SUPPORTED_LOCALES = ['ar', 'en'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

const RTL_LOCALES: Locale[] = ['ar'];

export function applyDirection(locale: string) {
  const isRtl = RTL_LOCALES.includes(locale as Locale);
  const root = document.documentElement;
  root.setAttribute('lang', locale);
  root.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: ar },
      en: { translation: en },
    },
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LOCALES as unknown as string[],
    interpolation: { escapeValue: false },
    detection: {
      // English by default; the language picked in LanguageToggle is saved.
      order: ['localStorage'],
      lookupLocalStorage: 'lmc.locale',
      caches: ['localStorage'],
    },
  });

applyDirection(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', applyDirection);

export default i18n;
