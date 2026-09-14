import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EASE } from '../../lib/motion';

/** Fixed, appears once the page has scrolled past one viewport height. */
export function ScrollToTopButton() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={t('common.scrollToTop')}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-teal-700 text-white shadow-[var(--shadow-card-lg)] transition hover:bg-teal-600"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
            <path
              d="M4 12.5 10 6.5 16 12.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
