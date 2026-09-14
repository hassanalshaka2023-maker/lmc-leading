import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollRestoration, useLocation } from 'react-router-dom';
import { useParallaxLayers } from '../../hooks/useParallaxLayers';
import { useScrollReveals } from '../../hooks/useScrollReveals';
import { PageWrapper } from '../motion/PageWrapper';
import { ScrollToTopButton } from '../motion/ScrollToTopButton';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

const TITLE_KEY_BY_PATH: Record<string, string> = {
  '/': 'nav.home',
  '/about': 'nav.about',
  '/programs': 'nav.programs',
  '/corporate-training': 'nav.corporate',
  '/services': 'nav.services',
  '/membership': 'nav.membership',
  '/trainers': 'nav.trainers',
  '/partners': 'nav.partners',
  '/testimonials': 'nav.testimonials',
  '/contact': 'nav.contact',
};

export function RootLayout() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const key = TITLE_KEY_BY_PATH[pathname];
    document.title = key
      ? `${t(key)} — ${t('brand.name')}`
      : t('brand.name');
  }, [pathname, t]);

  useScrollReveals(mainRef, [pathname]);
  useParallaxLayers(mainRef, [pathname]);

  return (
    <div className="flex min-h-svh flex-col bg-canvas">
      <Navbar />
      <main className="flex-1" ref={mainRef}>
        <PageWrapper />
      </main>
      <Footer />
      <ScrollToTopButton />
      <ScrollRestoration />
    </div>
  );
}
