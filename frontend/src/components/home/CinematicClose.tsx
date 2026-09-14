import heroClassroom from '../../assets/images/hero-classroom.jpg';
import { useHomeHero } from '../../lib/useHomeHero';
import { Container } from '../ui/Container';

/** Closing banner with the home headline. */
export function CinematicClose() {
  const hero = useHomeHero();
  return (
    <section className="relative isolate flex min-h-[72vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroClassroom}
          alt=""
          aria-hidden
          className="h-full w-full object-cover"
          style={{ filter: 'grayscale(0.45) brightness(0.45)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #062430 0%, rgba(6,36,48,0.86) 45%, #062430 100%)',
          }}
        />
        <div className="home-dot-grid-dark" />
        <div className="home-beam" />
      </div>

      <Container className="relative z-10 text-center">
        <div className="home-logo-halo mx-auto inline-flex" data-reveal="scale">
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
          className="home-heading home-grad-text mt-8"
          style={{ fontSize: 'clamp(2.4rem, 6vw, 5rem)' }}
          data-reveal="up"
        >
          {hero.title}
        </h2>
        <p className="mt-5 text-lg" style={{ color: '#d6e3ec' }} data-reveal="up">
          {hero.subtitle}
        </p>
      </Container>
    </section>
  );
}
