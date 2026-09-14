import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Container } from '../ui/Container';
import { GlassCard } from './GlassCard';
import { IconBox } from './IconBox';
import { IconAward, IconBriefcase, IconGlobe, IconGraduationCap } from './icons';

const ITEMS = [
  {
    icon: IconGlobe,
    to: '/programs',
    titleKey: 'landing.capLanguagesTitle',
    bodyKey: 'landing.capLanguagesBody',
  },
  {
    icon: IconBriefcase,
    to: '/corporate-training',
    titleKey: 'landing.capTrainingTitle',
    bodyKey: 'landing.capTrainingBody',
  },
  {
    icon: IconGraduationCap,
    to: '/services',
    titleKey: 'landing.capServicesTitle',
    bodyKey: 'landing.capServicesBody',
  },
  {
    icon: IconAward,
    to: '/membership',
    titleKey: 'landing.capMembershipTitle',
    bodyKey: 'landing.capMembershipBody',
  },
] as const;

export function CapabilityGrid() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <span className="home-eyebrow justify-center">
            {t('landing.capabilityEyebrow')}
          </span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.capabilityTitlePlain')}{' '}
            <span className="home-grad-text-onlight">
              {t('landing.capabilityTitleGrad')}
            </span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} className="block" data-reveal="up">
                <GlassCard className="h-full">
                  <IconBox>
                    <Icon />
                  </IconBox>
                  <h3 className="mt-5 text-xl font-bold" style={{ color: 'var(--navy)' }}>
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm" style={{ color: 'var(--muted)', lineHeight: 1.8 }}>
                    {t(item.bodyKey)}
                  </p>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
