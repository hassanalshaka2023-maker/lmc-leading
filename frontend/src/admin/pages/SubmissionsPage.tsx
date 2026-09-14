import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, PageTitle, Panel, QueryState } from '../ui/AdminUI';
import { Modal } from '../ui/Modal';

interface Submission {
  _id: string;
  type: 'contact' | 'enrollment';
  name: string;
  phone: string;
  email: string;
  serviceOfInterest?: string;
  message: string;
  status: 'new' | 'in_progress' | 'done';
  notes?: string;
  createdAt: string;
}
interface Paged {
  items: Submission[];
  total: number;
  page: number;
  pages: number;
}

function FilterSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className="field max-w-[10rem]" />;
}

export function SubmissionsPage() {
  const { t, i18n } = useTranslation();
  const statusLabel: Record<Submission['status'], string> = {
    new: t('admin.submissions.statusNew'),
    in_progress: t('admin.submissions.statusInProgress'),
    done: t('admin.submissions.statusDone'),
  };
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const query = useMemo(() => {
    const p = new URLSearchParams({ page: String(page), limit: '20' });
    if (status) p.set('status', status);
    if (type) p.set('type', type);
    return `/admin/submissions?${p.toString()}`;
  }, [status, type, page]);

  const { data, loading, error, reload } = useAdminQuery<Paged>(query);
  const [active, setActive] = useState<Submission | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const exportCsv = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const p = new URLSearchParams();
      if (status) p.set('status', status);
      if (type) p.set('type', type);
      const res = await adminApi.get(
        `/admin/submissions/export?${p.toString()}`,
        { responseType: 'blob' },
      );
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'submissions.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(apiErrorMessage(err));
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageTitle
        eyebrow={t('admin.submissions.eyebrow')}
        title={t('admin.submissions.title')}
        actions={
          <Btn onClick={exportCsv} disabled={exporting}>
            {exporting ? t('admin.submissions.exporting') : t('admin.submissions.exportCsv')}
          </Btn>
        }
      />

      {exportError ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {exportError}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('admin.submissions.allStatuses')}</option>
          <option value="new">{t('admin.submissions.statusNew')}</option>
          <option value="in_progress">{t('admin.submissions.statusInProgress')}</option>
          <option value="done">{t('admin.submissions.statusDone')}</option>
        </FilterSelect>
        <FilterSelect
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t('admin.submissions.allTypes')}</option>
          <option value="contact">{t('admin.submissions.typeContact')}</option>
          <option value="enrollment">{t('admin.submissions.typeEnrollment')}</option>
        </FilterSelect>
      </div>

      <Panel>
        <QueryState
          loading={loading}
          error={error}
          empty={!loading && !error && (data?.items.length ?? 0) === 0}
          onRetry={reload}
        />
        {data && data.items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-start text-xs uppercase text-muted">
                  {[
                    t('admin.submissions.colDate'),
                    t('admin.submissions.colType'),
                    t('admin.submissions.colName'),
                    t('admin.submissions.colPhone'),
                    t('admin.submissions.colStatus'),
                    '',
                  ].map((h, i) => (
                    <th key={i} className="py-2 pe-3 text-start font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-line/60 last:border-0"
                  >
                    <td className="py-2 pe-3 text-xs text-muted">
                      {new Date(s.createdAt).toLocaleString(
                        i18n.resolvedLanguage === 'ar' ? 'ar' : 'en-US',
                      )}
                    </td>
                    <td className="py-2 pe-3">
                      {s.type === 'enrollment'
                        ? t('admin.submissions.typeEnrollment')
                        : t('admin.submissions.typeContact')}
                    </td>
                    <td className="py-2 pe-3 font-semibold">{s.name}</td>
                    <td className="py-2 pe-3" dir="ltr">
                      {s.phone}
                    </td>
                    <td className="py-2 pe-3">{statusLabel[s.status]}</td>
                    <td className="py-2">
                      <button
                        onClick={() => setActive(s)}
                        className="font-semibold text-teal-700 hover:underline"
                      >
                        {t('admin.submissions.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted">
                {t('admin.submissions.paginationSummary', {
                  total: data.total,
                  page: data.page,
                  pages: data.pages,
                })}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-lg border border-line px-3 py-1 disabled:opacity-50"
                >
                  {t('admin.submissions.prev')}
                </button>
                <button
                  disabled={page >= (data.pages ?? 1)}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-line px-3 py-1 disabled:opacity-50"
                >
                  {t('admin.submissions.next')}
                </button>
              </div>
            </div>
          </div>
        )}
      </Panel>

      {active ? (
        <SubmissionDetail
          submission={active}
          onClose={() => setActive(null)}
          onSaved={() => {
            setActive(null);
            reload();
          }}
        />
      ) : null}
    </div>
  );
}

function SubmissionDetail({
  submission,
  onClose,
  onSaved,
}: {
  submission: Submission;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [status, setStatus] = useState(submission.status);
  const [notes, setNotes] = useState(submission.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setErr(null);
    try {
      await adminApi.patch(`/admin/submissions/${submission._id}`, {
        status,
        notes,
      });
      onSaved();
    } catch (e) {
      setErr(apiErrorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      wide
      title={t('admin.submissions.messageFrom', { name: submission.name })}
      onClose={onClose}
      footer={
        <>
          <Btn tone="ghost" onClick={onClose} disabled={saving}>
            {t('admin.common.close')}
          </Btn>
          <Btn onClick={save} disabled={saving}>
            {saving ? t('admin.common.saving') : t('admin.common.save')}
          </Btn>
        </>
      }
    >
      <dl className="grid gap-2 text-sm">
        <Row k={t('admin.submissions.rowEmail')} v={submission.email} ltr />
        <Row k={t('admin.submissions.rowPhone')} v={submission.phone} ltr />
        <Row k={t('admin.submissions.rowService')} v={submission.serviceOfInterest || '—'} />
        <Row
          k={t('admin.submissions.rowType')}
          v={
            submission.type === 'enrollment'
              ? t('admin.submissions.typeEnrollment')
              : t('admin.submissions.typeContact')
          }
        />
      </dl>
      <div className="mt-4">
        <p className="mb-1 text-sm font-semibold">{t('admin.submissions.message')}</p>
        <p className="whitespace-pre-line rounded-lg bg-surface-2 p-3 text-sm text-ink-soft">
          {submission.message}
        </p>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-sm font-semibold">{t('admin.submissions.status')}</p>
          <select
            className="field"
            value={status}
            onChange={(e) => setStatus(e.target.value as Submission['status'])}
          >
            <option value="new">{t('admin.submissions.statusNew')}</option>
            <option value="in_progress">{t('admin.submissions.statusInProgress')}</option>
            <option value="done">{t('admin.submissions.statusDone')}</option>
          </select>
        </div>
      </div>
      <div className="mt-3">
        <p className="mb-1 text-sm font-semibold">{t('admin.submissions.internalNotes')}</p>
        <textarea
          className="field"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
    </Modal>
  );
}

function Row({ k, v, ltr }: { k: string; v: string; ltr?: boolean }) {
  return (
    <div className="flex gap-2">
      <dt className="w-20 shrink-0 text-muted">{k}</dt>
      <dd dir={ltr ? 'ltr' : undefined} className="font-medium">
        {v}
      </dd>
    </div>
  );
}
