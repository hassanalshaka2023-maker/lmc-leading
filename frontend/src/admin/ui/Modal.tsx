import { useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  const { t } = useTranslation();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/40 p-4 sm:p-8">
      <div
        className={`w-full ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        } rounded-2xl border border-line bg-surface shadow-xl`}
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-3">
          <h3 className="font-bold text-teal-700">{title}</h3>
          <button
            onClick={onClose}
            aria-label={t('admin.common.close')}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-2"
          >
            ✕
          </button>
        </header>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <footer className="flex justify-end gap-2 border-t border-line px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
