import { useTranslation } from 'react-i18next';
import type { EducationalService } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Accordion } from '../components/ui/Accordion';
import { MediaAccordionItem } from '../components/ui/MediaAccordionItem';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function ServicesPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data, loading, error } = useResource<EducationalService[]>(
    '/educational-services',
  );
  const hero = usePageHero('services', {
    eyebrow: t('services.eyebrow'),
    title: t('services.title'),
    subtitle: t('services.subtitle'),
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
            {list.map((s, i) => (
              <MediaAccordionItem
                key={s._id}
                glyph="cap"
                title={loc(s.title)}
                defaultOpen={i === 0}
              >
                <p className="text-sm leading-relaxed text-ink-soft">
                  {loc(s.description)}
                </p>
              </MediaAccordionItem>
            ))}
          </Accordion>
        )}
      </Section>
    </>
  );
}
