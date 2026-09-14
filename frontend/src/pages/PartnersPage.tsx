import { useTranslation } from 'react-i18next';
import type { Partner } from '../lib/types';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function PartnersPage() {
  const { t } = useTranslation();
  const { data, loading, error } = useResource<Partner[]>('/partners');
  const hero = usePageHero('partners', {
    eyebrow: t('partners.eyebrow'),
    title: t('partners.title'),
    subtitle: t('partners.subtitle'),
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
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => {
            const inner = p.logoUrl ? (
              <img
                src={p.logoUrl}
                alt={p.name}
                className="max-h-12 max-w-[8rem] object-contain"
              />
            ) : (
              <span className="text-sm font-semibold text-muted">{p.name}</span>
            );
            return (
              <div
                key={p._id}
                data-reveal="scale"
                className="flex h-28 items-center justify-center rounded-card border border-line bg-surface p-6 transition hover:border-teal-200 hover:shadow-[var(--shadow-card)]"
              >
                {p.websiteUrl ? (
                  <a
                    href={p.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    title={t('common.visitWebsite')}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
