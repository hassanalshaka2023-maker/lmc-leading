import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { GatewayCard } from './GatewayCard';
import { IconCheck } from './icons';

interface Chip {
  text: string;
  tone?: 'orange' | 'blue';
  className: string;
}

export function PortalSection({
  reverse = false,
  eyebrowKey,
  titlePlainKey,
  titleGradKey,
  bodyKey,
  bulletKeys,
  to,
  gatewayLabel,
  icon,
  chips,
}: {
  reverse?: boolean;
  eyebrowKey: string;
  titlePlainKey: string;
  titleGradKey: string;
  bodyKey: string;
  bulletKeys: string[];
  to: string;
  gatewayLabel: ReactNode;
  icon: ComponentType<{ className?: string }>;
  chips?: Chip[];
}) {
  const { t } = useTranslation();

  const copy = (
    <div data-reveal={reverse ? 'right' : 'left'}>
      <span className="home-eyebrow">{t(eyebrowKey)}</span>
      <h2
        className="home-heading mt-4"
        style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--navy)' }}
      >
        {t(titlePlainKey)} <span className="home-grad-text-onlight">{t(titleGradKey)}</span>
      </h2>
      <p className="mt-4 max-w-md" style={{ color: 'var(--muted)', lineHeight: 1.85 }}>
        {t(bodyKey)}
      </p>
      <ul className="mt-6 space-y-3">
        {bulletKeys.map((key) => (
          <li key={key} className="flex items-start gap-3 text-sm" style={{ color: 'var(--muted-light)' }}>
            <span
              className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(242,83,30,0.12)', color: 'var(--orange)' }}
            >
              <IconCheck />
            </span>
            {t(key)}
          </li>
        ))}
      </ul>
      <Link
        to={to}
        className="home-link mt-7 text-sm font-bold"
        style={{ color: 'var(--orange)' }}
      >
        {t('common.learnMore')}
      </Link>
    </div>
  );

  const visual = (
    <div data-reveal={reverse ? 'left' : 'right'}>
      <GatewayCard icon={icon} label={gatewayLabel} to={to} chips={chips} />
    </div>
  );

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        {reverse ? (
          <>
            {visual}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {visual}
          </>
        )}
      </div>
    </section>
  );
}
