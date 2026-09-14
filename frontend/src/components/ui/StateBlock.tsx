import { useTranslation } from 'react-i18next';

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600 ${className}`}
    />
  );
}

/** Renders one of loading / error / empty; returns null when there is data. */
export function StateBlock({
  loading,
  error,
  empty,
  onRetry,
}: {
  loading?: boolean;
  error?: string | null;
  empty?: boolean;
  onRetry?: () => void;
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
        <span className="ms-3 text-muted">{t('common.loading')}</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-card border border-line bg-surface-2 p-8 text-center">
        <p className="font-semibold text-ink">{t('common.errorTitle')}</p>
        <p className="mt-1 text-sm text-muted">{error}</p>
        {onRetry ? (
          <button
            onClick={onRetry}
            className="mt-4 rounded-full border border-line px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-surface-3"
          >
            {t('common.retry')}
          </button>
        ) : null}
      </div>
    );
  }
  if (empty) {
    return (
      <p className="rounded-card border border-dashed border-line bg-surface-2 p-8 text-center text-muted">
        {t('common.empty')}
      </p>
    );
  }
  return null;
}
