import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useResource } from '../../lib/useResource';
import { useLocalized } from '../../lib/useLocalized';
import type { ContactInfo } from '../../lib/types';
import { RingMotif } from '../ui/BrandMotif';
import { Container } from '../ui/Container';
import { LogoMark } from '../ui/LogoMark';
import { NAV_LINKS } from './navLinks';

const digits = (v: string) => (v || '').replace(/\D/g, '');

export function Footer() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data: info } = useResource<ContactInfo>('/contact-info');
  const wa = digits(info?.whatsapp ?? '');
  const socials = (info?.socialLinks ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((s) => s.url);

  return (
    <footer className="relative overflow-hidden border-t border-teal-100 bg-teal-50/60">
      <RingMotif
        className="lmc-spin-slow hidden start-[-6rem] bottom-[-9rem] h-80 w-80 sm:block"
      />
      <div className="lmc-rule absolute inset-x-0 top-0 h-[3px]" aria-hidden />
      <Container className="relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div data-reveal="up" className="lg:col-span-2">
          <LogoMark />
          <p className="mt-4 max-w-sm text-sm text-muted">
            {t('footer.tagline')}
          </p>
        </div>

        <div data-reveal="up">
          <h3 className="text-sm font-bold text-ink">
            {t('footer.quickLinks')}
          </h3>
          <ul className="mt-4 space-y-2">
            {[
              ...NAV_LINKS,
              { to: '/corporate-training', key: 'nav.corporate' },
              { to: '/testimonials', key: 'nav.testimonials' },
            ].map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-sm text-muted transition hover:text-teal-700"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal="up">
          <h3 className="text-sm font-bold text-ink">{t('footer.contact')}</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {info?.phone ? (
              <li>
                <a
                  href={`tel:${digits(info.phone) ? '+' + digits(info.phone) : info.phone}`}
                  className="transition hover:text-teal-700"
                >
                  {info.phone}
                </a>
              </li>
            ) : null}
            {wa ? (
              <li>
                <a
                  href={`https://wa.me/${wa}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-teal-700"
                >
                  {t('contact.whatsapp')}
                </a>
              </li>
            ) : null}
            {info?.email ? (
              <li>
                <a
                  href={`mailto:${info.email}`}
                  className="transition hover:text-teal-700"
                >
                  {info.email}
                </a>
              </li>
            ) : null}
            {loc(info?.address) ? (
              <li className="whitespace-pre-line">{loc(info?.address)}</li>
            ) : null}
          </ul>

          {socials.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {socials.map((s) => (
                <li key={s.platform + s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-line px-3 py-1 text-xs font-medium capitalize text-teal-700 transition hover:border-orange-400 hover:text-orange-700"
                  >
                    {s.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>

      <div className="relative border-t border-teal-100">
        <Container className="flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <span>
            © {new Date().getFullYear()} {t('brand.name')}.{' '}
            {t('footer.rights')}
          </span>
        </Container>
      </div>
    </footer>
  );
}
