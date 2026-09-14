import { useTranslation } from 'react-i18next';
import bookPhoto from '../../assets/images/book.jpg';
import briefcasePhoto from '../../assets/images/briefcase.jpg';
import capPhoto from '../../assets/images/cap.jpg';
import chatPhoto from '../../assets/images/chat.jpg';
import globePhoto from '../../assets/images/globe.jpg';

/** Content categories used across program/service/corporate cards. */
export type GlyphName = 'book' | 'globe' | 'briefcase' | 'cap' | 'chat';

const PHOTOS: Record<GlyphName, string> = {
  book: bookPhoto,
  globe: globePhoto,
  briefcase: briefcasePhoto,
  cap: capPhoto,
  chat: chatPhoto,
};

const ALT_KEYS: Record<GlyphName, string> = {
  book: 'media.book',
  globe: 'media.globe',
  briefcase: 'media.briefcase',
  cap: 'media.cap',
  chat: 'media.chat',
};

/** Category photo for accordion rows (one image per category). */
export function CardMedia({
  glyph,
  className = '',
}: {
  glyph: GlyphName;
  className?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className={`relative h-28 overflow-hidden rounded-2xl ${className}`}>
      <img
        src={PHOTOS[glyph]}
        alt={t(ALT_KEYS[glyph])}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Bottom gradient */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-teal-900/35 via-transparent to-transparent"
      />
      <span className="lmc-dot-grid pointer-events-none absolute inset-0 text-white/[0.1]" />
      <span
        aria-hidden
        className="pointer-events-none absolute -end-4 -top-6 h-20 w-20 rounded-full bg-orange-500/30 blur-xl"
      />
    </div>
  );
}
