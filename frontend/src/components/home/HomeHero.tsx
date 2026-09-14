import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import heroClassroom from '../../assets/images/hero-classroom.jpg';
import { EASE } from '../../lib/motion';
import type { SiteStats } from '../../lib/types';
import { useHomeHero } from '../../lib/useHomeHero';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { MagneticButton } from '../motion/MagneticButton';
import { Container } from '../ui/Container';
import { FloatingChip } from './FloatingChip';
import { HomeButton } from './HomeButton';

/** Splits "Sentence one. Sentence two." into its two sentences so the
 * heading can render line one plain and line two gradient-filled. */
function splitHeadline(text: string): [string, string] {
  const match = text.match(/^(.+?[.!؟?])\s+(.+)$/);
  return match ? [match[1], match[2]] : [text, ''];
}

export function HomeHero() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const reducedMotion = useReducedMotion();
  const { data: stats } = useResource<SiteStats>('/stats');
  const hero = useHomeHero();

  const [line1, line2] = splitHeadline(hero.title);

  return (
    <section className="relative isolate flex min-h-[94vh] items-center overflow-hidden bg-[#04141d]">
      <div className="absolute inset-0">
        <img
          src={heroClassroom}
          alt={t('media.heroClassroom')}
          className="home-kenburns h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        {/* Overlays to keep the text readable on the photo */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(4,20,29,0.5) 0%, rgba(6,32,44,0.42) 45%, rgba(7,38,52,0.62) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(62% 62% at 50% 50%, rgba(4,20,29,0.62) 0%, rgba(4,20,29,0.32) 60%, transparent 80%)',
          }}
        />
        <div className="home-beam" />
        <div className="home-floor-grid" />
        <span
          aria-hidden
          className="absolute -start-24 -top-24 h-[26rem] w-[26rem] rounded-full opacity-30 blur-[90px]"
          style={{ background: 'var(--orange)' }}
        />
        <span
          aria-hidden
          className="absolute -end-24 top-1/3 h-[24rem] w-[24rem] rounded-full opacity-25 blur-[90px]"
          style={{ background: 'var(--blue-accent)' }}
        />
      </div>

      <Container className="relative z-10 flex flex-col items-center py-28 text-center">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="home-logo-halo"
        >
          {/* White background so the logo is readable on the photo */}
          <span className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]">
            <img
              src="/lmc-logo-full.png"
              alt={t('brand.name')}
              className="h-10 w-auto sm:h-11"
            />
          </span>
        </motion.div>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
          className="mt-6"
        >
          <FloatingChip>{t('brand.name')}</FloatingChip>
        </motion.div>

        <motion.h1
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.24 }}
          className="home-heading mt-7 text-white"
          style={{
            fontSize: 'clamp(2.4rem, 5.6vw, 4.4rem)',
            // Keep the blur soft, a tight shadow makes Arabic letters look muddy.
            textShadow: '0 2px 18px rgba(4,20,29,0.55)',
          }}
        >
          <span className="block">{line1}</span>
          {line2 && <span className="home-grad-text block">{line2}</span>}
        </motion.h1>

        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.36 }}
          className="mt-6 max-w-2xl text-[#d6e3ec]"
          style={{ lineHeight: 1.8, textShadow: '0 1px 12px rgba(4,20,29,0.75)' }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.48 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton>
            <HomeButton to="/programs" size="lg" variant="primary">
              {t('common.explorePrograms')}
            </HomeButton>
          </MagneticButton>
          <HomeButton to="/contact" size="lg" variant="ghost-dark">
            {t('common.contactUs')}
          </HomeButton>
        </motion.div>

        {stats && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <FloatingChip tone="blue">
              {stats.students.toLocaleString('en-US')}+ {loc(stats.labels.students)}
            </FloatingChip>
            <FloatingChip>
              {stats.languages}+ {loc(stats.labels.languages)}
            </FloatingChip>
            <FloatingChip tone="blue">
              {stats.programsCount}+ {loc(stats.labels.programsCount)}
            </FloatingChip>
          </motion.div>
        )}
      </Container>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="home-mono text-[0.62rem] uppercase tracking-[0.2em] text-[#6f8a9c]">
          {t('landing.scrollCue')}
        </span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1.5">
          <motion.span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: 'var(--orange)' }}
            animate={reducedMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}
