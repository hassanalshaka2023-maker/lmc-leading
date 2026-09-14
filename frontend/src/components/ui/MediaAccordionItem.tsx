import type { ReactNode } from 'react';
import { AccordionItem } from './Accordion';
import { CardMedia, type GlyphName } from './SceneArt';

/** Accordion row with a category photo (programs, corporate training, services). */
export function MediaAccordionItem({
  glyph,
  title,
  badge,
  defaultOpen,
  open,
  onToggle,
  children,
}: {
  glyph: GlyphName;
  title: ReactNode;
  /** Small tag next to the title (e.g. a "featured" pill). */
  badge?: ReactNode;
  defaultOpen?: boolean;
  /** Injected by the parent `Accordion` — passed straight through. */
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  return (
    <AccordionItem
      title={
        badge ? (
          <span className="inline-flex flex-wrap items-center gap-2">
            {title}
            {badge}
          </span>
        ) : (
          title
        )
      }
      defaultOpen={defaultOpen}
      open={open}
      onToggle={onToggle}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <CardMedia
          glyph={glyph}
          className="h-40 w-full shrink-0 sm:h-auto sm:w-48"
        />
        <div className="flex-1">{children}</div>
      </div>
    </AccordionItem>
  );
}
