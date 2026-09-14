import { AnimatePresence, motion } from 'framer-motion';
import {
  Children,
  cloneElement,
  isValidElement,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';
import { EASE } from '../../lib/motion';

interface AccordionItemProps {
  title: ReactNode;
  children: ReactNode;
  /** Initial open state, read by the parent `Accordion`. */
  defaultOpen?: boolean;
  /** Injected by the parent `Accordion`. */
  open?: boolean;
  onToggle?: () => void;
}

/** One expandable row — title always visible, body slides open on click. */
export function AccordionItem({
  title,
  children,
  open = false,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start transition hover:bg-surface-2"
      >
        <span className="font-bold text-teal-700">{title}</span>
        <motion.span
          aria-hidden
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
            open
              ? 'border-orange-300 bg-orange-50 text-orange-600'
              : 'border-line text-teal-700'
          }`}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden>
            <path
              d="m2.5 4.5 3.5 3.5 3.5-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="overflow-hidden"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: EASE, delay: 0.08 }}
              className="px-6 pb-5 text-sm leading-relaxed text-ink-soft"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export function Accordion({
  children,
  className = '',
  allowMultiple = false,
}: {
  children: ReactNode;
  className?: string;
  /** Allow more than one item open at once. Defaults to single-open. */
  allowMultiple?: boolean;
}) {
  const items = Children.toArray(children).filter((child) =>
    isValidElement(child),
  ) as ReactElement<AccordionItemProps>[];

  const [openIndexes, setOpenIndexes] = useState<Set<number>>(() => {
    const seeded = items
      .map((child, i) => (child.props.defaultOpen ? i : -1))
      .filter((i) => i >= 0);
    return new Set(allowMultiple ? seeded : seeded.slice(0, 1));
  });

  const toggle = (index: number) => {
    setOpenIndexes((prev) => {
      const isOpen = prev.has(index);
      if (allowMultiple) {
        const next = new Set(prev);
        if (isOpen) {
          next.delete(index);
        } else {
          next.add(index);
        }
        return next;
      }
      return isOpen ? new Set() : new Set([index]);
    });
  };

  return (
    <div data-reveal="up" className={`space-y-3 ${className}`}>
      {items.map((child, i) =>
        cloneElement(child, {
          open: openIndexes.has(i),
          onToggle: () => toggle(i),
        }),
      )}
    </div>
  );
}
