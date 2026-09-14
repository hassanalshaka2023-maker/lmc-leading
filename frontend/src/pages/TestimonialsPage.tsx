import { useTranslation } from 'react-i18next';
import type { Testimonial } from '../lib/types';
import { usePageHero } from '../lib/usePageHero';
import { useResource } from '../lib/useResource';
import { PageHero } from '../components/ui/PageHero';
import { Section } from '../components/ui/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { TestimonialCard } from '../components/ui/TestimonialCard';

export function TestimonialsPage() {
  const { t } = useTranslation();
  const { data, loading, error } = useResource<Testimonial[]>('/testimonials');
  const hero = usePageHero('testimonials', {
    eyebrow: t('testimonials.eyebrow'),
    title: t('testimonials.title'),
    subtitle: t('testimonials.subtitle'),
  });
  const list = data ?? [];

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        subtitle={hero.subtitle}
      />
      <Section>
        <StateBlock
          loading={loading}
          error={error}
          empty={!loading && !error && list.length === 0}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((item) => (
            <TestimonialCard key={item._id} item={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
