import { useI18n } from '@/i18n/I18nProvider';

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      type="button"
      className="toolbar-button"
      onClick={() => setLocale(locale === 'en' ? 'mm' : 'en')}
    >
      {locale === 'en' ? 'မြန်မာ' : 'EN'}
    </button>
  );
}