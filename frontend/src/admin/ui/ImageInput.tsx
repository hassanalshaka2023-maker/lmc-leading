import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi, apiErrorMessage } from '../adminApi';
import { Label } from './AdminUI';

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/** Uploads to /admin/media and returns the public URL. Shows a preview. */
export function ImageInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pick = () => inputRef.current?.click();

  const upload = async (file: File) => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(t('admin.common.errorFileType'));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError(t('admin.common.errorFileSize'));
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await adminApi.post('/admin/media', form);
      onChange(data.url as string);
    } catch (err) {
      setError(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface-2">
          {value ? (
            <img
              src={value}
              alt=""
              className="h-full w-full object-contain"
            />
          ) : (
            <span className="text-xs text-muted">{t('admin.common.noImage')}</span>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={pick}
              disabled={busy}
              className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-teal-700 hover:bg-surface-2 disabled:opacity-60"
            >
              {busy
                ? t('admin.common.uploading')
                : value
                  ? t('admin.common.change')
                  : t('admin.common.uploadImage')}
            </button>
            {value ? (
              <button
                type="button"
                onClick={() => onChange(undefined)}
                className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted hover:bg-surface-2"
              >
                {t('admin.common.remove')}
              </button>
            ) : null}
          </div>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <p className="text-xs text-muted">{t('admin.common.imageHint')}</p>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}
