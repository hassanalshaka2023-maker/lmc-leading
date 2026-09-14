import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { HomeButton } from './HomeButton';

export function FinalCta() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div
          className="home-card home-card-dark relative mx-auto max-w-3xl overflow-hidden p-10 text-center sm:p-16"
          data-reveal="scale"
        >
          <div className="home-dot-grid-dark" />
          <span
            aria-hidden
            className="absolute inset-x-0 -top-20 mx-auto h-72 w-72 rounded-full opacity-40 blur-[100px]"
            style={{ background: 'var(--orange)' }}
          />
          <div className="home-logo-halo relative mx-auto inline-flex">
            <span className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]">
              <img
                src="/lmc-logo-full.png"
                alt=""
                aria-hidden
                className="h-10 w-auto sm:h-11"
              />
            </span>
          </div>
          <h2
            className="home-heading home-grad-text relative mt-6"
            style={{ fontSize: 'clamp(2rem, 4.6vw, 3.2rem)' }}
          >
            {t('home.ctaTitle')}
          </h2>
          <p className="relative mt-4 max-w-xl mx-auto" style={{ color: '#d6e3ec' }}>
            {t('home.ctaBody')}
          </p>
          <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
            <HomeButton to="/contact" variant="primary" size="lg">
              {t('home.ctaButton')}
            </HomeButton>
            <HomeButton to="/programs" variant="ghost-dark" size="lg">
              {t('common.explorePrograms')}
            </HomeButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
