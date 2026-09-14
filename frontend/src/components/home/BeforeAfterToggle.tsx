import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EASE } from '../../lib/motion';
import { Container } from '../ui/Container';

const KEYS = ['vocabulary', 'confidence', 'career', 'certification'] as const;

export function BeforeAfterToggle() {
  const { t } = useTranslation();
  const [active, setActive] = useState<'before' | 'after'>('before');

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <span className="home-eyebrow justify-center">{t('landing.transformEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.transformTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.transformTitleGrad')}</span>
          </h2>
        </div>

        <div className="mt-9 flex justify-center" data-reveal="up">
          <div className="home-toggle-track inline-flex">
            <button
              type="button"
              onClick={() => setActive('before')}
              className={`home-toggle-btn ${active === 'before' ? 'active' : ''}`}
            >
              {t('landing.beforeLabel')}
            </button>
            <button
              type="button"
              onClick={() => setActive('after')}
              className={`home-toggle-btn ${active === 'after' ? 'active' : ''}`}
            >
              {t('landing.afterLabel')}
            </button>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence>
            {KEYS.map((key, i) => (
              <motion.div
                key={active + key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE, delay: i * 0.06 } }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2, ease: EASE } }}
                className="home-card p-6 text-center"
              >
                <span
                  className="home-mono text-[0.62rem] uppercase tracking-[0.1em]"
                  style={{ color: 'var(--orange)' }}
                >
                  {t(`landing.transform.${key}.label`)}
                </span>
                <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--navy)', lineHeight: 1.6 }}>
                  {t(`landing.transform.${key}.${active}`)}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
