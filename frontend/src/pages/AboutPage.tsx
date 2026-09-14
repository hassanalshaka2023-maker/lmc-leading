import { useTranslation } from 'react-i18next';
import type { Page } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { useResource } from '../lib/useResource';
import { StatsStrip } from '../components/home/StatsStrip';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeading } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

function points(text: string) {
  return text
    .split(/[،,؛;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function AboutPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const about = useResource<Page>('/pages/about');
  const why = useResource<Page>('/pages/why-lmc');

  const intro = about.data?.sections.find((s) => s.key === 'intro');
  const reasons = points(
    loc(why.data?.sections.find((s) => s.key === 'reasons')?.body),
  );

  return (
    <>
      <PageHero
        eyebrow={loc(about.data?.eyebrow, t('about.eyebrow'))}
        title={loc(about.data?.title, t('about.title'))}
        subtitle={loc(about.data?.subtitle)}
      />

      <Section>
        <StateBlock loading={about.loading} error={about.error} />
        {intro && (
          <div data-reveal="up" className="max-w-3xl">
            <h2 className="text-2xl font-bold text-teal-700">
              {loc(intro.heading)}
            </h2>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink-soft">
              {loc(intro.body)}
            </p>
          </div>
        )}
      </Section>

      <StatsStrip />

      {reasons.length > 0 && (
        <Section tone="muted">
          <SectionHeading eyebrow={t('home.whyEyebrow')} title={t('about.whyTitle')} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((p, i) => (
              <Card key={i} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-ink-soft">{p}</p>
              </Card>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
