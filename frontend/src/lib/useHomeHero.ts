import { useTranslation } from 'react-i18next';
import type { Page } from './types';
import { useLocalized } from './useLocalized';
import { useResource } from './useResource';

/** Home headline and subheadline, from the `hero` section of the home page. */
export function useHomeHero() {
  const { t } = useTranslation();
  const loc = useLocalized();
  const { data } = useResource<Page>('/pages/home');
  const hero = data?.sections.find((s) => s.key === 'hero');

  return {
    title: loc(hero?.heading, t('home.headline')),
    subtitle: loc(hero?.body, t('home.subheadline')),
  };
}
