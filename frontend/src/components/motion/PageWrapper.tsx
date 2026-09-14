import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Outlet, useLocation, useOutlet } from 'react-router-dom';
import { EASE } from '../../lib/motion';

/**
 * Page transition between routes. `useOutlet()` keeps the old page mounted
 * while AnimatePresence plays its exit animation.
 */
export function PageWrapper() {
  const { pathname } = useLocation();
  const element = useOutlet();
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Outlet />;
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE } }}
        exit={{ opacity: 0, y: -18, transition: { duration: 0.28, ease: EASE } }}
      >
        {element}
      </motion.div>
    </AnimatePresence>
  );
}
