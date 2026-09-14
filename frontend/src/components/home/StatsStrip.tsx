import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCountUp } from '../../hooks/useCountUp';
import type { SiteStats } from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { RingMotif } from '../ui/BrandMotif';
import { Container } from '../ui/Container';

function fmt(n: number, plus: boolean) {
  return n.toLocaleString('en-US') + (plus ? '+' : '');
}

export function StatsStrip() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data } = useResource<SiteStats>('/stats');
  const ref = useRef<HTMLElement>(null);
  useCountUp(ref, [data]);
  if (!data) return null;

  const items = [
    { value: data.students, label: data.labels.students },
    { value: data.languages, label: data.labels.languages },
    { value: data.trainingHours, label: data.labels.trainingHours },
    { value: data.programsCount, label: data.labels.programsCount },
  ];

  return (
    <section id="stats" className="px-5 py-8 sm:px-8 sm:py-10" ref={ref}>
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[1.75rem] bg-teal-700 text-white shadow-[var(--shadow-card-lg)]">
        <RingMotif tone="dark" className="hidden start-[-5rem] top-[-6rem] h-72 w-72 sm:block" />
        <Container className="relative grid grid-cols-2 gap-8 py-12 sm:py-14 lg:grid-cols-4">
          {items.map((it, i) => (
            <div key={i} data-reveal="up" className="text-center">
              <div
                className="lmc-nums text-3xl font-extrabold sm:text-4xl"
                data-count-to={it.value}
                data-count-suffix={data.showPlusSuffix ? '+' : ''}
              >
                {fmt(it.value, data.showPlusSuffix)}
              </div>
              <div className="mt-1 text-sm text-teal-50/80">{loc(it.label)}</div>
            </div>
          ))}
        </Container>
        <span className="sr-only">{t('home.statsEyebrow')}</span>
      </div>
    </section>
  );
}
