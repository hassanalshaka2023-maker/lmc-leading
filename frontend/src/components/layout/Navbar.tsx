import { useGSAP } from '@gsap/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap, prefersReducedMotion } from '../../lib/gsap';
import { ScrollProgress } from '../motion/ScrollProgress';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { LogoMark } from '../ui/LogoMark';
import { LanguageToggle } from './LanguageToggle';
import { NAV_LINKS } from './navLinks';

export function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.from(headerRef.current, {
      y: -22,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: 0.05,
    });
  }, []);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-1 text-sm font-semibold transition-colors ${
      isActive ? 'text-teal-700' : 'text-ink-soft hover:text-teal-700'
    } after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-orange-500 after:transition-transform after:duration-300 ${
      isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
    }`;

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b border-white/40 bg-surface/70 backdrop-blur-lg transition-shadow duration-300 ${
        scrolled
          ? 'shadow-[0_1px_0_rgba(15,82,112,0.08),0_8px_24px_-16px_rgba(15,82,112,0.25)]'
          : 'shadow-none'
      }`}
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <NavLink to="/" aria-label={t('brand.name')}>
          <LogoMark />
        </NavLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={'end' in l ? l.end : undefined}
              className={linkClass}
            >
              {t(l.key)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageToggle />
          <Button to="/contact" size="md">
            {t('nav.registerNow')}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface/70 backdrop-blur lg:hidden"
          aria-expanded={open}
          aria-label={open ? t('nav.close') : t('nav.menu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute inset-x-0 top-0 h-0.5 rounded bg-ink transition ${
                open ? 'translate-y-1.5 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1.5 h-0.5 rounded bg-ink transition ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`absolute inset-x-0 top-3 h-0.5 rounded bg-ink transition ${
                open ? '-translate-y-1.5 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </Container>

      {open ? (
        <div className="border-t border-line bg-surface/90 backdrop-blur-md lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={'end' in l ? l.end : undefined}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-semibold ${
                    isActive
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-ink-soft hover:bg-surface-2'
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            ))}
            <div className="mt-3 flex items-center gap-3">
              <LanguageToggle />
              <Button to="/contact" size="md" className="flex-1">
                {t('nav.registerNow')}
              </Button>
            </div>
          </Container>
        </div>
      ) : null}

      <ScrollProgress />
    </header>
  );
}
