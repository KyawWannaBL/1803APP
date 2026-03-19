import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { env } from '@/lib/env';

type Locale = 'en' | 'mm';
type ContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, fallback?: string) => string;
};

const STORAGE_KEY = 'britium-locale';
const dictionaries: Record<Locale, Record<string, string>> = {
  en: {
    'common.portalDirectory': 'Portal Directory',
    'common.logout': 'Logout',
  },
  mm: {
    'common.portalDirectory': 'Portal Directory',
    'common.logout': 'Logout',
  },
};

const I18nContext = createContext<ContextValue | undefined>(undefined);

function lookup(locale: Locale, key: string, fallback?: string) {
  return dictionaries[locale][key] ?? fallback ?? key.split('.').slice(-1)[0];
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const initialLocale = (localStorage.getItem(STORAGE_KEY) as Locale | null)
    ?? (env.defaultLocale === 'mm' ? 'mm' : 'en');
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const value = useMemo<ContextValue>(() => ({
    locale,
    setLocale: (next) => {
      localStorage.setItem(STORAGE_KEY, next);
      setLocaleState(next);
    },
    t: (key, fallback) => lookup(locale, key, fallback),
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}