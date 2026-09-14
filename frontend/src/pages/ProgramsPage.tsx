import { useTranslation } from 'react-i18next';
import type { CorporateProgram, LanguageProgram } from '../lib/types';
import { useLocalized } from '../lib/useLocalized';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { Accordion } from '../components/ui/Accordion';
import { Eyebrow } from '../components/ui/Eyebrow';
import { MediaAccordionItem } from '../components/ui/MediaAccordionItem';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';

export function ProgramsPage() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data, loading, error } = useResource<LanguageProgram[]>(
    '/language-programs',
  );
  const { data: corporateData } = useResource<CorporateProgram[]>(
    '/corporate-programs',
  );
  const hero = usePageHero('programs', {
    eyebrow: t('programs.eyebrow'),
    title: t('programs.title'),
    subtitle: t('programs.subtitle'),
  });

  const list = data ?? [];
  const english = list.filter((p) => p.category === 'english-track');
  const other = list.filter((p) => p.category === 'other-language');
  const corporate = corporateData ?? [];

  const group = (
    items: LanguageProgram[],
    label: string,
    glyph: 'book' | 'globe',
  ) =>
    items.length > 0 && (
      <div className="mt-12 first:mt-0">
        <Eyebrow>{label}</Eyebrow>
        <Accordion className="mt-5 max-w-3xl" allowMultiple>
          {items.map((p, i) => (
            <MediaAccordionItem
              key={p._id}
              glyph={glyph}
              title={loc(p.title)}
              defaultOpen={i === 0}
              badge={
                p.isFeatured ? (
                  <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-700">
                    {t('programs.featured')}
                  </span>
                ) : undefined
              }
            >
              <p className="text-sm leading-relaxed text-ink-soft">
                {loc(p.description)}
              </p>
            </MediaAccordionItem>
          ))}
        </Accordion>
      </div>
    );

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
        {group(english, t('programs.englishTracks'), 'book')}
        {group(other, t('programs.otherLanguages'), 'globe')}

        {corporate.length > 0 && (
          <div className="mt-12 first:mt-0">
            <Eyebrow>{t('nav.corporate')}</Eyebrow>
            <Accordion className="mt-5 max-w-3xl" allowMultiple>
              {corporate.map((p, i) => (
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
                        <li
                          key={oi}
                          className="flex gap-2 text-sm text-ink-soft"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                          {loc(o)}
                        </li>
                      ))}
                    </ul>
                  )}
                </MediaAccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </Section>
    </>
  );
}
