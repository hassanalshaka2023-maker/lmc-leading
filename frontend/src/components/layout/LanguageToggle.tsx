import { useTranslation } from 'react-i18next';

export function LanguageToggle({ className = '' }: { className?: string }) {
  const { t, i18n } = useTranslation();
  const toggle = () =>
    void i18n.changeLanguage(i18n.resolvedLanguage === 'ar' ? 'en' : 'ar');

  return (
    <button
      type="button"
      onClick={toggle}
      className={`rounded-full border border-line bg-surface/60 px-3 py-1.5 text-sm font-semibold text-teal-700 backdrop-blur-sm transition hover:bg-surface-3 ${className}`}
      aria-label={t('common.switchLang')}
    >
      {t('common.switchLang')}
    </button>
  );
}
