import { useTranslation } from 'react-i18next';
import type { CorporateProgram } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Accordion } from '../components/ui/Accordion';
import { MediaAccordionItem } from '../components/ui/MediaAccordionItem';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function CorporateTrainingPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data, loading, error } = useResource<CorporateProgram[]>(
    '/corporate-programs',
  );
  const hero = usePageHero('corporate-training', {
    eyebrow: t('corporate.eyebrow'),
    title: t('corporate.title'),
    subtitle: t('corporate.subtitle'),
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
        {list.length > 0 && (
          <Accordion className="max-w-3xl" allowMultiple>
            {list.map((p, i) => (
              <MediaAccordionItem
                key={p._id}
                glyph="briefcase"
                title={loc(p.title)}
                defaultOpen={i === 0}
              >
                {loc(p.description) && (
                  <p className="text-sm leading-relaxed text-ink-soft">
                    {loc(p.description)}
                  </p>
                )}
                {p.outcomes?.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {p.outcomes.map((o, oi) => (
                      <li key={oi} className="flex gap-2 text-sm text-ink-soft">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                        {loc(o)}
                      </li>
                    ))}
                  </ul>
                )}
              </MediaAccordionItem>
            ))}
          </Accordion>
        )}
      </Section>
    </>
  );
}
