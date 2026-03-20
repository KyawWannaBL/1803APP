import type { ReactNode } from 'react';
import { I18nProvider as CoreI18nProvider, useI18n } from '@/i18n/I18nProvider';

export type Language = 'en' | 'my';

export interface LanguageContextValue {
  language: Language;
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLang: () => void;
  t: (en: string, my?: string) => string;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return <CoreI18nProvider>{children}</CoreI18nProvider>;
}

export function useLanguage(): LanguageContextValue {
  const i18n = useI18n() as any;

  const rawLocale = String(i18n?.locale ?? 'en').toLowerCase();
  const language: Language = rawLocale === 'mm' || rawLocale === 'my' ? 'my' : 'en';

  const setLanguage = (next: Language) => {
    const target = next === 'my' ? 'mm' : 'en';

    if (typeof i18n?.setLocale === 'function') {
      i18n.setLocale(target);
      return;
    }

    if (typeof i18n?.toggleLocale === 'function') {
      const current = String(i18n?.locale ?? 'en').toLowerCase();
      if (current !== target) {
        i18n.toggleLocale();
      }
    }
  };

  const toggleLang = () => {
    setLanguage(language === 'en' ? 'my' : 'en');
  };

  const t = (en: string, my?: string) => {
    return language === 'my' ? my ?? en : en;
  };

  return {
    language,
    lang: language,
    setLanguage,
    toggleLang,
    t,
  };
}

export const useLanguageContext = useLanguage;
export default useLanguage;
