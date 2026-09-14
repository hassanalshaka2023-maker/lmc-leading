import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const BASE = 'Leading Mastery Center';

/** Sets `<title>` to "<page> — LMC" while the component is mounted. */
export function useDocumentTitle(pageTitle?: string) {
  const { i18n } = useTranslation();
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} — ${BASE}` : BASE;
  }, [pageTitle, i18n.resolvedLanguage]);
}
