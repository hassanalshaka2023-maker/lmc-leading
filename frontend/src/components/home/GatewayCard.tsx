import type { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FloatingChip } from './FloatingChip';
import { IconArrowStart } from './icons';
import { IconBox } from './IconBox';

interface Chip {
  text: string;
  tone?: 'orange' | 'blue';
  className: string;
}

/** Large dark link card with an icon, label and floating chips. */
export function GatewayCard({
  icon: Icon,
  label,
  to,
  chips = [],
}: {
  icon: ComponentType<{ className?: string }>;
  label: ReactNode;
  to: string;
  chips?: Chip[];
}) {
  const { t } = useTranslation();
  return (
    <Link
      to={to}
      className="home-card home-card-dark group relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-5 p-10 text-center"
    >
      <div className="home-dot-grid-dark" />
      <div className="home-scanlines">
        <span />
        <span />
        <span />
      </div>

      <IconBox className="relative z-10">
        <Icon />
      </IconBox>
      <span className="home-mono home-grad-text relative z-10 text-3xl font-semibold sm:text-4xl">
        {label}
      </span>
      <span className="relative z-10 inline-flex items-center gap-2 text-sm font-bold text-white transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
        {t('common.learnMore')}
        <IconArrowStart />
      </span>

      {chips.map((chip, i) => (
        <FloatingChip key={i} tone={chip.tone} className={`absolute ${chip.className}`}>
          {chip.text}
        </FloatingChip>
      ))}
    </Link>
  );
}
