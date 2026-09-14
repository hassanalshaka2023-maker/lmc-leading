import { useTranslation } from 'react-i18next';
import type { MembershipContent } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Accordion, AccordionItem } from '../components/ui/Accordion';
import { PageHero } from '../components/ui/PageHero';
import { Section, SectionHeading } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function MembershipPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data, loading, error } = useResource<MembershipContent>('/membership');
  const hero = usePageHero('membership', {
    eyebrow: t('membership.eyebrow'),
    title: t('membership.title'),
    subtitle: t('membership.subtitle'),
  });

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <Section>
        <StateBlock loading={loading} error={error} />
        {data && (
          <>
            {loc(data.intro) && (
              <p
                data-reveal="up"
                className="max-w-3xl text-lg leading-relaxed text-ink-soft"
              >
                {loc(data.intro)}
              </p>
            )}

            {data.benefits?.length > 0 && (
              <div className="mt-12">
                <SectionHeading title={t('membership.benefitsTitle')} />
                <Accordion className="mt-8 max-w-3xl">
                  {data.benefits
                    .slice()
                    .sort((a, b) => a.order - b.order)
                    .map((b, i) => (
                      <AccordionItem
                        key={i}
                        title={loc(b.title)}
                        defaultOpen={i === 0}
                      >
                        {loc(b.body)}
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            )}

            {loc(data.pointsExplanation) && (
              <div
                data-reveal="up"
                className="mt-12 rounded-card border border-line bg-surface-2 p-8"
              >
                <h3 className="font-bold text-teal-700">
                  {t('membership.pointsTitle')}
                </h3>
                <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">
                  {loc(data.pointsExplanation)}
                </p>
              </div>
            )}
          </>
        )}
      </Section>
    </>
  );
}
