import type { ReactNode } from 'react';
import { Container } from './Container';
import { Eyebrow } from './Eyebrow';

type Tone = 'default' | 'muted' | 'tint' | 'teal';

const tones: Record<Tone, string> = {
  default: 'bg-canvas',
  muted: 'bg-surface-2',
  tint: 'bg-teal-50',
  teal: 'bg-teal-700 text-white',
};

export function Section({
  id,
  tone = 'default',
  className = '',
  children,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`py-16 sm:py-24 ${tones[tone]} ${className}`}
    >
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'start',
  invert = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'start' | 'center';
  invert?: boolean;
}) {
  return (
    <div
      data-reveal="up"
      className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        className={`mt-3 text-3xl font-extrabold leading-tight sm:text-4xl ${
          invert ? 'text-white' : ''
        }`}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={`mt-3 text-lg ${
            invert ? 'text-teal-50/90' : 'text-ink-soft'
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
