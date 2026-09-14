import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { MembershipContent } from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { useResource } from '../../lib/useResource';
import { Container } from '../ui/Container';
import { IconBox } from './IconBox';
import { IconAward, IconCheck } from './icons';

/** Membership benefits from `/membership`. */
function BenefitsCard() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data } = useResource<MembershipContent>('/membership');
  const benefits = (data?.benefits ?? [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .filter((b) => loc(b.title))
    .slice(0, 4);

  if (benefits.length === 0) return null;

  return (
    <div className="home-card p-8">
      <div className="flex items-center gap-4">
        <IconBox>
          <IconAward />
        </IconBox>
        <h3 className="text-lg font-bold" style={{ color: 'var(--navy)' }}>
          {t('membership.benefitsTitle')}
        </h3>
      </div>
      <ul className="mt-6 space-y-4">
        {benefits.map((b, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ background: 'rgba(242,83,30,0.12)', color: 'var(--orange)' }}
            >
              <IconCheck />
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: 'var(--navy)' }}>
                {loc(b.title)}
              </p>
              {loc(b.body) && (
                <p className="mt-1 text-sm" style={{ color: 'var(--muted)', lineHeight: 1.7 }}>
                  {loc(b.body)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MembershipSpotlight() {
  const { t } = useTranslation();
  return (
    <section className="py-16 sm:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div data-reveal="left">
          <span className="home-eyebrow">{t('landing.membershipEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--navy)' }}
          >
            {t('landing.membershipTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.membershipTitleGrad')}</span>
          </h2>
          <p className="mt-4 max-w-md" style={{ color: 'var(--muted)', lineHeight: 1.85 }}>
            {t('landing.membershipBody')}
          </p>
          <Link
            to="/membership"
            className="home-link mt-7 text-sm font-bold"
            style={{ color: 'var(--orange)' }}
          >
            {t('common.learnMore')}
          </Link>
        </div>
        <div data-reveal="right" className="mx-auto w-full max-w-md">
          <BenefitsCard />
        </div>
      </Container>
    </section>
  );
}
