import type { Testimonial } from '../../lib/types';
import { useLocalized } from '../../lib/useLocalized';
import { Card } from './Card';

export function TestimonialCard({ item }: { item: Testimonial }) {
  const loc = useLocalized();
  const initial = item.name.trim().charAt(0).toUpperCase() || '★';

  return (
    <Card tone="tinted" className="flex h-full flex-col">
      <p className="flex-1 text-sm leading-relaxed text-ink-soft">
        “{loc(item.text)}”
      </p>
      <div className="mt-5 flex items-center gap-3">
        {item.photoUrl ? (
          <img
            src={item.photoUrl}
            alt={item.name}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
            {initial}
          </span>
        )}
        <div>
          <div className="text-sm font-bold text-ink">{item.name}</div>
          <div className="text-xs text-muted">{loc(item.role)}</div>
        </div>
      </div>
    </Card>
  );
}
