import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Container } from '../components/ui/Container';

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="text-6xl font-extrabold text-teal-700">404</span>
      <h1 className="mt-4 text-2xl font-bold">{t('notFound.title')}</h1>
      <p className="mt-2 text-ink-soft">{t('notFound.body')}</p>
      <Button to="/" className="mt-6">
        {t('common.backHome')}
      </Button>
    </Container>
  );
}
