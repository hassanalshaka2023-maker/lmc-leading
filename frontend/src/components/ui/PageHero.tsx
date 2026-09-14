import type { ReactNode } from 'react';
import { RingMotif } from './BrandMotif';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';

/** Compact hero band for inner pages. */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-surface-2">
      <span
        data-parallax-bg="60"
        className="lmc-dot-grid absolute inset-0 text-teal-900/[0.035]"
      />
      <span
        data-parallax="40"
        className="lmc-blob start-[-6rem] top-[-8rem] h-72 w-72 bg-teal-200"
      />
      <span
        data-parallax="55"
        className="lmc-blob end-[-4rem] bottom-[-10rem] h-72 w-72 bg-orange-200"
      />
      <RingMotif className="lmc-spin-slow hidden end-[-5rem] bottom-[-8rem] h-80 w-80 sm:block" />
      <Container className="relative py-14 sm:py-20">
        <div className="lmc-rise max-w-2xl">
          {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
          {/* leading-tight, not Tailwind's default line-height:1 at text-5xl —
              Arabic tashkeel/descenders get clipped at that tightness. */}
          <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 text-lg text-ink-soft">{subtitle}</p>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
