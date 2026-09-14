import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { Localized } from './types';

/** Returns a picker that reads the current locale's side of a `{ ar, en }` value. */
export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = (i18n.resolvedLanguage ?? 'en') as keyof Localized;

  return useCallback(
    (value?: Localized | null, fallback = ''): string => {
      if (!value) return fallback;
      return value[lang] || value.ar || value.en || fallback;
    },
    [lang],
  );
}
