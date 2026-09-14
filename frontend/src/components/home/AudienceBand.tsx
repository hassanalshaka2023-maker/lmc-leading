import { useTranslation } from 'react-i18next';
import chatPhoto from '../../assets/images/chat.jpg';
import { Container } from '../ui/Container';
import { IconBox } from './IconBox';
import { IconGraduationCap, IconSparkle, IconTrendingUp, IconUsers } from './icons';

const SEGMENTS = [
  { icon: IconSparkle, titleKey: 'landing.audienceIndividualsTitle', bodyKey: 'landing.audienceIndividualsBody' },
  { icon: IconGraduationCap, titleKey: 'landing.audienceStudentsTitle', bodyKey: 'landing.audienceStudentsBody' },
  { icon: IconTrendingUp, titleKey: 'landing.audienceProfessionalsTitle', bodyKey: 'landing.audienceProfessionalsBody' },
  { icon: IconUsers, titleKey: 'landing.audienceCorporateTitle', bodyKey: 'landing.audienceCorporateBody' },
] as const;

export function AudienceBand() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0" aria-hidden>
        <img src={chatPhoto} alt="" className="h-full w-full object-cover opacity-[0.08]" />
        <div className="absolute inset-0" style={{ background: 'var(--bg)' }} />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center" data-reveal="up">
          <span className="home-eyebrow justify-center">{t('landing.audienceEyebrow')}</span>
          <h2
            className="home-heading mt-4"
            style={{ fontSize: 'clamp(2.2rem, 4.4vw, 3.4rem)', color: 'var(--navy)' }}
          >
            {t('landing.audienceTitlePlain')}{' '}
            <span className="home-grad-text-onlight">{t('landing.audienceTitleGrad')}</span>
          </h2>
        </div>

        <div
          className="mt-14 grid divide-y overflow-hidden rounded-[28px] border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
          style={{ borderColor: 'var(--line)', background: 'var(--panel)' }}
          data-reveal="up"
        >
          {SEGMENTS.map((seg) => {
            const Icon = seg.icon;
            return (
              <div key={seg.titleKey} className="p-8 text-center" style={{ borderColor: 'var(--line)' }}>
                <IconBox className="mx-auto">
                  <Icon />
                </IconBox>
                <h3 className="mt-4 font-bold" style={{ color: 'var(--navy)' }}>
                  {t(seg.titleKey)}
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--muted)', lineHeight: 1.75 }}>
                  {t(seg.bodyKey)}
                </p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
