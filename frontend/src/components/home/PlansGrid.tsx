import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import bookPhoto from '../../assets/images/book.jpg';
import globePhoto from '../../assets/images/globe.jpg';
import type { LanguageProgram } from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { Container } from '../ui/Container';
import { IconArrowStart } from './icons';

export function PlansGrid() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data } = useResource<LanguageProgram[]>('/language-programs');

  const featured = (data ?? [])
    .slice()
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || a.order - b.order)
    .slice(0, 6);

  if (featured.length === 0) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6" data-reveal="up">
          <div className="max-w-xl">
            <span className="home-eyebrow">{t('landing.plansEyebrow')}</span>
            <h2
              className="home-heading mt-4"
              style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
            >
              {t('landing.plansTitlePlain')}{' '}
              <span className="home-grad-text-onlight">{t('landing.plansTitleGrad')}</span>
            </h2>
          </div>
          <Link
            to="/programs"
            className="home-link text-sm font-bold"
            style={{ color: 'var(--orange)' }}
          >
            {t('home.viewAllPrograms')}
            <IconArrowStart />
          </Link>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <Link
              key={p._id}
              to="/programs"
              className="home-card block overflow-hidden"
              data-reveal="up"
            >
              <div className="h-40 overflow-hidden">
                <img
                  src={p.category === 'other-language' ? globePhoto : bookPhoto}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-7">
                {p.isFeatured && (
                  <span
                    className="home-mono mb-3 inline-block rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.1em]"
                    style={{ background: 'rgba(242,83,30,0.12)', color: 'var(--orange)' }}
                  >
                    {t('programs.featured')}
                  </span>
                )}
                <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
                  {loc(p.title)}
                </h3>
                {loc(p.description) && (
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)', lineHeight: 1.75 }}>
                    {loc(p.description)}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
