import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, PageTitle, Panel, QueryState } from '../ui/AdminUI';
import { Confirm } from '../ui/Confirm';

interface Asset {
  _id: string;
  url: string;
  originalName: string;
  sizeBytes: number;
  createdAt: string;
}
interface Paged {
  items: Asset[];
  total: number;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function MediaPage() {
  const { t } = useTranslation();
  const { data, loading, error, reload } =
    useAdminQuery<Paged>('/admin/media?limit=60');
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<Asset | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [msgTone, setMsgTone] = useState<'error' | 'success'>('error');

  const upload = async (file: File) => {
    setMsg(null);
    if (!ALLOWED_TYPES.includes(file.type)) {
      setMsgTone('error');
      setMsg(t('admin.common.errorFileType'));
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setMsgTone('error');
      setMsg(t('admin.common.errorFileSize'));
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append('file', file);
      await adminApi.post('/admin/media', form);
      setMsgTone('success');
      setMsg(t('admin.common.uploaded'));
      reload();
    } catch (err) {
      setMsgTone('error');
      setMsg(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await adminApi.delete(`/admin/media/${toDelete._id}`);
      setToDelete(null);
      reload();
    } catch (err) {
      setMsgTone('error');
      setMsg(apiErrorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageTitle
        eyebrow={t('admin.media.eyebrow')}
        title={t('admin.media.title')}
        actions={
          <Btn onClick={() => fileRef.current?.click()} disabled={busy}>
            {busy ? t('admin.common.uploading') : t('admin.common.uploadImage')}
          </Btn>
        }
      />
      <div className="hidden">
        <input
          ref={fileRef}
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

      {msg ? (
        <p className={`text-sm ${msgTone === 'success' ? 'text-teal-700' : 'text-red-600'}`}>
          {msg}
        </p>
      ) : null}

      <Panel>
        <QueryState
          loading={loading}
          error={error}
          empty={!loading && !error && (data?.items.length ?? 0) === 0}
          onRetry={reload}
        />
        {data && data.items.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {data.items.map((a) => (
              <figure
                key={a._id}
                className="overflow-hidden rounded-lg border border-line"
              >
                <div className="flex h-28 items-center justify-center bg-surface-2">
                  <img
                    src={a.url}
                    alt={a.originalName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <figcaption className="flex items-center justify-between gap-1 px-2 py-1.5 text-[11px]">
                  <span className="truncate" title={a.originalName}>
                    {a.originalName}
                  </span>
                  <button
                    onClick={() => setToDelete(a)}
                    className="shrink-0 font-semibold text-red-600"
                  >
                    {t('admin.common.delete')}
                  </button>
                </figcaption>
                <button
                  onClick={() => navigator.clipboard?.writeText(a.url)}
                  className="w-full border-t border-line py-1 text-[11px] font-semibold text-teal-700 hover:bg-surface-2"
                >
                  {t('admin.media.copyLink')}
                </button>
              </figure>
            ))}
          </div>
        )}
      </Panel>

      <Confirm
        open={!!toDelete}
        message={t('admin.media.deleteConfirm')}
        onConfirm={remove}
        onCancel={() => setToDelete(null)}
        busy={busy}
      />
    </div>
  );
}
