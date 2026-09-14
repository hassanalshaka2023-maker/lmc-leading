import type { Page } from './types';
import { useLocalized } from './useLocalized';
import { useResource } from './useResource';

/** Page hero text from `/pages/:key`, falling back to the given strings. */
export function usePageHero(
  key: string,
  fallback: { eyebrow?: string; title: string; subtitle?: string },
) {
  const loc = useLocalized();
  const { data } = useResource<Page>(`/pages/${key}`);

  return {
    eyebrow: loc(data?.eyebrow, fallback.eyebrow ?? ''),
    title: loc(data?.title, fallback.title),
    subtitle: loc(data?.subtitle, fallback.subtitle ?? ''),
  };
}
