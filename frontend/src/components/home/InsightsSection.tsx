import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useCountUp } from '../../hooks/useCountUp';
import type {
  CorporateProgram,
  EducationalService,
  LanguageProgram,
  SiteStats,
} from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { Container } from '../ui/Container';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { GlassCard } from './GlassCard';

function fmt(n: number) {
  return n.toLocaleString('en-US');
}

/** Counters and charts built from the stats and catalogue endpoints. */
export function InsightsSection() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data: stats } = useResource<SiteStats>('/stats');
  const { data: languagePrograms } = useResource<LanguageProgram[]>('/language-programs');
  const { data: corporatePrograms } = useResource<CorporateProgram[]>('/corporate-programs');
  const { data: services } = useResource<EducationalService[]>('/educational-services');

  const kpiRef = useRef<HTMLDivElement>(null);
  useCountUp(kpiRef, [stats]);

  if (!stats) return null;

  const englishCount = (languagePrograms ?? []).filter((p) => p.category === 'english-track').length;
  const otherCount = (languagePrograms ?? []).filter((p) => p.category === 'other-language').length;

  const kpis = [
    { value: stats.students, label: loc(stats.labels.students) },
    { value: stats.languages, label: loc(stats.labels.languages) },
    { value: stats.programsCount, label: loc(stats.labels.programsCount) },
    { value: stats.trainingHours, label: loc(stats.labels.trainingHours) },
  ];

  const bars = [
    { label: t('nav.programs'), value: languagePrograms?.length ?? 0 },
    { label: t('nav.corporate'), value: corporatePrograms?.length ?? 0 },
    { label: t('nav.services'), value: services?.length ?? 0 },
  ];

  const suffix = stats.showPlusSuffix ? '+' : '';

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <span className="home-eyebrow justify-center">{t('landing.insightsEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.insightsTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.insightsTitleGrad')}</span>
          </h2>
        </div>

        <div ref={kpiRef} className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4" data-reveal="up">
          {kpis.map((k) => (
            <div key={k.label} className="home-card p-6 text-center">
              <div
                className="home-mono text-2xl font-bold sm:text-3xl"
                style={{ color: 'var(--navy)' }}
                data-count-to={k.value}
                data-count-suffix={suffix}
              >
                {fmt(k.value)}
                {suffix}
              </div>
              <div className="mt-1 text-xs" style={{ color: 'var(--muted)' }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <GlassCard>
            <h3 className="font-bold" style={{ color: 'var(--navy)' }}>
              {t('landing.insightsDonutTitle')}
            </h3>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-8">
              <DonutChart
                segments={[
                  { label: t('programs.englishTracks'), value: englishCount, color: 'var(--orange)' },
                  { label: t('programs.otherLanguages'), value: otherCount, color: 'var(--blue-accent)' },
                ]}
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-light)' }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--orange)' }} />
                  {t('programs.englishTracks')} · {englishCount}
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--muted-light)' }}>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'var(--blue-accent)' }} />
                  {t('programs.otherLanguages')} · {otherCount}
                </div>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <h3 className="font-bold" style={{ color: 'var(--navy)' }}>
              {t('landing.insightsBarTitle')}
            </h3>
            <div className="mt-6">
              <BarChart bars={bars} />
            </div>
          </GlassCard>
        </div>
      </Container>
    </section>
  );
}
