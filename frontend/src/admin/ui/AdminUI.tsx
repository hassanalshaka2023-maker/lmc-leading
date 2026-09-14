import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';
import { useTranslation } from 'react-i18next';

type BtnTone = 'primary' | 'secondary' | 'danger' | 'ghost';
const btnTones: Record<BtnTone, string> = {
  primary:
    'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-[0_10px_22px_-10px_rgba(240,82,35,0.4)] ' +
    'hover:shadow-[0_14px_28px_-10px_rgba(240,82,35,0.5)] hover:-translate-y-0.5 ring-1 ring-inset ring-white/15',
  secondary: 'bg-surface text-teal-700 border border-line hover:bg-surface-3',
  danger: 'bg-surface text-red-600 border border-red-200 hover:bg-red-50',
  ghost: 'bg-transparent text-teal-700 hover:bg-teal-50',
};

export function Btn({
  tone = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: BtnTone }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 hover:scale-[1.02] active:scale-100 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100 ${btnTones[tone]} ${className}`}
      {...props}
    />
  );
}

/** Matches the public site's Card — same rounded-card shape + top accent bar. */
export function Panel({
  title,
  eyebrow,
  actions,
  children,
  className = '',
}: {
  title?: ReactNode;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative overflow-hidden rounded-card border border-line bg-surface p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-orange-400 to-teal-600"
      />
      {(title || actions || eyebrow) && (
        <header className="mb-5 flex items-start justify-between gap-3">
          <div>
            {eyebrow ? (
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-orange-700">
                {eyebrow}
              </span>
            ) : null}
            {title ? (
              <h2 className="text-lg font-extrabold text-teal-700">{title}</h2>
            ) : null}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function PageTitle({
  eyebrow,
  title,
  actions,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-700">
            <span className="h-px w-6 bg-orange-500" aria-hidden />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-2 text-2xl font-extrabold text-teal-700 sm:text-3xl">
          {title}
        </h1>
      </div>
      {actions}
    </div>
  );
}

export function Label({
  children,
  hint,
}: {
  children: ReactNode;
  hint?: ReactNode;
}) {
  return (
    <label className="mb-1 flex items-center justify-between text-sm font-semibold text-ink">
      <span>{children}</span>
      {hint ? (
        <span className="text-xs font-normal text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${props.className ?? ''}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea rows={3} {...props} className={`field ${props.className ?? ''}`} />
  );
}

export function Toggle({
  checked,
  onChange,
  labels,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  labels?: [string, string];
}) {
  const { t } = useTranslation();
  const [onLabel, offLabel] = labels ?? [
    t('admin.common.published'),
    t('admin.common.draft'),
  ];
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
        checked
          ? 'border-teal-200 bg-teal-50 text-teal-700'
          : 'border-line bg-surface-2 text-muted'
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${checked ? 'bg-orange-500' : 'bg-muted'}`}
      />
      {checked ? onLabel : offLabel}
    </button>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block h-6 w-6 animate-spin rounded-full border-2 border-teal-200 border-t-teal-600 ${className}`}
    />
  );
}

export function QueryState({
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
  if (loading)
    return (
      <div className="flex items-center justify-center gap-3 py-12">
        <Spinner />
        <span className="text-muted">{t('admin.common.loading')}</span>
      </div>
    );
  if (error)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {error}
        {onRetry ? (
          <button onClick={onRetry} className="ms-3 font-semibold underline">
            {t('admin.common.retry')}
          </button>
        ) : null}
      </div>
    );
  if (empty)
    return (
      <p className="rounded-xl border border-dashed border-line bg-surface-2 p-8 text-center text-sm text-muted">
        {t('admin.common.empty')}
      </p>
    );
  return null;
}
