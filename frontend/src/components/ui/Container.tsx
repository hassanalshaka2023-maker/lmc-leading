import type { ElementType, ReactNode } from 'react';

export function Container({
  as: Tag = 'div',
  className = '',
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>
      {children}
    </Tag>
  );
}
