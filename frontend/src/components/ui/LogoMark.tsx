import { useTranslation } from 'react-i18next';

/** Full logo image (public/lmc-logo-full.png). */
export function LogoMark({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <img
      src="/lmc-logo-full.png"
      alt={t('brand.name')}
      className={`h-11 w-auto sm:h-12 ${className}`}
    />
  );
}
