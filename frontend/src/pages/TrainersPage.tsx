import { useTranslation } from 'react-i18next';
import type { Trainer } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Card } from '../components/ui/Card';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function TrainersPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data, loading, error } = useResource<Trainer[]>('/trainers');
  const hero = usePageHero('trainers', {
    eyebrow: t('trainers.eyebrow'),
    title: t('trainers.title'),
    subtitle: t('trainers.subtitle'),
  });
  const list = data ?? [];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <Section>
        <StateBlock
          loading={loading}
          error={error}
          empty={!loading && !error && list.length === 0}
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((tr) => (
            <Card key={tr._id} interactive tone="outlined" className="text-center">
              {tr.photoUrl ? (
                <img
                  src={tr.photoUrl}
                  alt={tr.name}
                  className="mx-auto h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-teal-100 text-2xl font-bold text-teal-700">
                  {tr.name.charAt(0).toUpperCase()}
                </span>
              )}
              <h3 className="mt-4 text-lg font-bold text-ink">{tr.name}</h3>
              <p className="text-sm font-semibold text-orange-700">
                {loc(tr.specialty)}
              </p>
              {loc(tr.qualifications) && (
                <p className="mt-2 text-sm text-ink-soft">
                  {loc(tr.qualifications)}
                </p>
              )}
              {tr.experienceYears > 0 && (
                <p className="mt-3 text-xs text-muted">
                  {tr.experienceYears}+ {t('common.yearsExperience')}
                </p>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
