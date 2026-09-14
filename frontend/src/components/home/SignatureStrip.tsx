import { useTranslation } from 'react-i18next';
import type { SiteStats } from '../../lib/types';
import { useResource } from '../../lib/useResource';
import { Container } from '../ui/Container';

/** One-line stats strip under the hero. */
export function SignatureStrip() {
  const { t } = useTranslation();
  const { data } = useResource<SiteStats>('/stats');
  if (!data) return null;

  return (
    <div className="border-y py-6" style={{ borderColor: 'var(--line)' }} data-reveal="fade">
      <Container className="text-center">
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          {t('landing.signatureStrip', {
            students: data.students.toLocaleString('en-US'),
            languages: data.languages,
          })}
        </p>
      </Container>
    </div>
  );
}
