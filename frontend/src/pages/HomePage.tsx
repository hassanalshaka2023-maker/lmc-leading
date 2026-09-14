import { useTranslation } from 'react-i18next';
import { AudienceBand } from '../components/home/AudienceBand';
import { BeforeAfterToggle } from '../components/home/BeforeAfterToggle';
import { CapabilityGrid } from '../components/home/CapabilityGrid';
import { CinematicClose } from '../components/home/CinematicClose';
import { FinalCta } from '../components/home/FinalCta';
import { HomeHero } from '../components/home/HomeHero';
import { IconBriefcase, IconGraduationCap } from '../components/home/icons';
import { InsightsSection } from '../components/home/InsightsSection';
import { JourneyFlow } from '../components/home/JourneyFlow';
import { MembershipSpotlight } from '../components/home/MembershipSpotlight';
import { PlansGrid } from '../components/home/PlansGrid';
import { PortalSection } from '../components/home/PortalSection';
import { ShowcaseStrip } from '../components/home/ShowcaseStrip';
import { SignatureStrip } from '../components/home/SignatureStrip';
import { ValuePropSplit } from '../components/home/ValuePropSplit';
import './home.css';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="home-page">
      <HomeHero />
      <SignatureStrip />
      <CapabilityGrid />
      <AudienceBand />
      <PlansGrid />
      <ShowcaseStrip />
      <PortalSection
        eyebrowKey="landing.portalCorporateEyebrow"
        titlePlainKey="landing.portalCorporateTitlePlain"
        titleGradKey="landing.portalCorporateTitleGrad"
        bodyKey="landing.portalCorporateBody"
        bulletKeys={[
          'landing.portalCorporateBullet1',
          'landing.portalCorporateBullet2',
          'landing.portalCorporateBullet3',
        ]}
        to="/corporate-training"
        gatewayLabel={t('landing.portalCorporateLabel')}
        icon={IconBriefcase}
        chips={[
          { text: t('corporate.title'), tone: 'orange', className: '-top-4 start-6' },
          { text: t('landing.portalCorporateLabel'), tone: 'blue', className: '-bottom-4 end-6' },
        ]}
      />
      <PortalSection
        reverse
        eyebrowKey="landing.portalServicesEyebrow"
        titlePlainKey="landing.portalServicesTitlePlain"
        titleGradKey="landing.portalServicesTitleGrad"
        bodyKey="landing.portalServicesBody"
        bulletKeys={[
          'landing.portalServicesBullet1',
          'landing.portalServicesBullet2',
          'landing.portalServicesBullet3',
        ]}
        to="/services"
        gatewayLabel={t('landing.portalServicesLabel')}
        icon={IconGraduationCap}
        chips={[
          { text: t('services.title'), tone: 'blue', className: '-top-4 end-6' },
          { text: t('landing.portalServicesLabel'), tone: 'orange', className: '-bottom-4 start-6' },
        ]}
      />
      <MembershipSpotlight />
      <BeforeAfterToggle />
      <InsightsSection />
      <JourneyFlow />
      <ValuePropSplit />
      <FinalCta />
      <CinematicClose />
    </div>
  );
}
