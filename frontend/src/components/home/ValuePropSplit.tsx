import { useTranslation } from 'react-i18next';
import type { Page } from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { Container } from '../ui/Container';
import { IconCheck } from './icons';

/** Splits the "why-lmc" text (comma or ؛ separated) into points. */
function toPoints(text: string): string[] {
  return text
    .split(/[،,؛;]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ValuePropSplit() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data } = useResource<Page>('/pages/why-lmc');
  const body = loc(data?.sections.find((s) => s.key === 'reasons')?.body);
  const points = toPoints(body);
  if (points.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left">
          <span className="home-eyebrow">{t('home.whyEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('home.whyTitle')}
          </h2>
        </div>
        <div className="space-y-4">
          {points.map((p, i) => (
            <div key={i} className="home-card flex items-start gap-4 p-5" data-reveal="right">
              <span
                className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: 'rgba(242,83,30,0.12)', color: 'var(--orange)' }}
              >
                <IconCheck />
              </span>
              <p className="text-sm" style={{ color: 'var(--muted-light)', lineHeight: 1.75 }}>
                {p}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
