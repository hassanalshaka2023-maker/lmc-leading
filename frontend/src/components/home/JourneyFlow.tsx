import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { IconAward, IconClipboard, IconCompass, IconGraduationCap, IconUsers } from './icons';
import { IconBox } from './IconBox';

const STEPS = [
  { icon: IconCompass, titleKey: 'landing.journeyStep1Title', bodyKey: 'landing.journeyStep1Body' },
  { icon: IconClipboard, titleKey: 'landing.journeyStep2Title', bodyKey: 'landing.journeyStep2Body' },
  { icon: IconGraduationCap, titleKey: 'landing.journeyStep3Title', bodyKey: 'landing.journeyStep3Body' },
  { icon: IconAward, titleKey: 'landing.journeyStep4Title', bodyKey: 'landing.journeyStep4Body' },
  { icon: IconUsers, titleKey: 'landing.journeyStep5Title', bodyKey: 'landing.journeyStep5Body' },
] as const;

export function JourneyFlow() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <span className="home-eyebrow justify-center">{t('landing.journeyEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.journeyTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.journeyTitleGrad')}</span>
          </h2>
        </div>

        <div className="mt-14 flex flex-col gap-6 lg:flex-row lg:items-stretch">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Fragment key={step.titleKey}>
                <div className="home-card flex-1 p-6 text-center" data-reveal="up">
                  <span className="home-mono text-xs font-semibold" style={{ color: 'var(--orange)' }}>
                    0{i + 1}
                  </span>
                  <IconBox className="mx-auto mt-3">
                    <Icon />
                  </IconBox>
                  <h3 className="mt-3 text-sm font-bold" style={{ color: 'var(--navy)' }}>
                    {t(step.titleKey)}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: 'var(--muted)', lineHeight: 1.6 }}>
                    {t(step.bodyKey)}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:flex lg:items-center" aria-hidden>
                    <span className="home-connector" />
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
