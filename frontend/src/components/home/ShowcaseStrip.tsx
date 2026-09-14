import { useTranslation } from 'react-i18next';
import bookPhoto from '../../assets/images/book.jpg';
import briefcasePhoto from '../../assets/images/briefcase.jpg';
import capPhoto from '../../assets/images/cap.jpg';
import chatPhoto from '../../assets/images/chat.jpg';
import globePhoto from '../../assets/images/globe.jpg';
import { Container } from '../ui/Container';

const TILES = [
  { photo: bookPhoto, tagKey: 'landing.showcaseLanguagesTag', titleKey: 'landing.showcaseLanguagesTitle' },
  { photo: globePhoto, tagKey: 'landing.showcaseWorldTag', titleKey: 'landing.showcaseWorldTitle' },
  { photo: briefcasePhoto, tagKey: 'landing.showcaseCorporateTag', titleKey: 'landing.showcaseCorporateTitle' },
  { photo: capPhoto, tagKey: 'landing.showcaseGradTag', titleKey: 'landing.showcaseGradTitle' },
  { photo: chatPhoto, tagKey: 'landing.showcaseCommunityTag', titleKey: 'landing.showcaseCommunityTitle' },
] as const;

export function ShowcaseStrip() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="max-w-2xl" data-reveal="up">
          <span className="home-eyebrow">{t('landing.showcaseEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.showcaseTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.showcaseTitleGrad')}</span>
          </h2>
        </div>
      </Container>

      <div
        className="mt-12 flex gap-5 overflow-x-auto px-5 pb-4 sm:px-8"
        style={{ scrollSnapType: 'x mandatory' }}
        data-reveal="fade"
      >
        {TILES.map((tile) => (
          <div
            key={tile.titleKey}
            className="group relative h-80 w-64 shrink-0 overflow-hidden rounded-[24px]"
            style={{ scrollSnapAlign: 'start' }}
          >
            <img
              src={tile.photo}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(6,36,48,0.88) 100%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span
                className="home-mono text-[0.6rem] uppercase tracking-[0.12em]"
                style={{ color: 'var(--orange-bright)' }}
              >
                {t(tile.tagKey)}
              </span>
              <h3 className="mt-1 text-lg font-bold text-white">{t(tile.titleKey)}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
