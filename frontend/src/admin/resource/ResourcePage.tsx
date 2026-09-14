import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, PageTitle, Panel, QueryState, Toggle } from '../ui/AdminUI';
import { Confirm } from '../ui/Confirm';
import { Modal } from '../ui/Modal';
import { buildResourceConfigs } from './configs';
import { ResourceForm } from './ResourceForm';

type Row = Record<string, unknown> & { _id: string; isPublished?: boolean };

export function ResourcePage({ resourceKey }: { resourceKey: string }) {
  const { t } = useTranslation();
  const config = useMemo(
    () => buildResourceConfigs(t)[resourceKey],
    [t, resourceKey],
  );
  const { data, loading, error, reload } = useAdminQuery<Row[]>(config.endpoint);
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const openCreate = () => {
    setForm({ ...config.defaults });
    setFormError(null);
    setCreating(true);
  };
  const openEdit = (row: Row) => {
    setForm({ ...row });
    setFormError(null);
    setEditing(row);
  };
  const closeForm = () => {
    setCreating(false);
    setEditing(null);
  };

  const save = async () => {
    setSaving(true);
    setFormError(null);
    try {
      const payload = stripMeta(form);
      if (editing) {
        await adminApi.patch(`${config.endpoint}/${editing._id}`, payload);
      } else {
        await adminApi.post(config.endpoint, payload);
      }
      closeForm();
      reload();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const doDelete = async () => {
    if (!toDelete) return;
    setSaving(true);
    try {
      await adminApi.delete(`${config.endpoint}/${toDelete._id}`);
      setToDelete(null);
      reload();
    } catch (err) {
      setFormError(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (row: Row) => {
    setRows((rs) =>
      rs.map((r) =>
        r._id === row._id ? { ...r, isPublished: !r.isPublished } : r,
      ),
    );
    try {
      await adminApi.patch(`${config.endpoint}/${row._id}`, {
        isPublished: !row.isPublished,
      });
    } catch {
      reload();
    }
  };

  const persistOrder = async (ordered: Row[]) => {
    setRows(ordered);
    if (!config.reorder) return;
    try {
      await adminApi.patch(`${config.endpoint}/reorder`, {
        items: ordered.map((r, i) => ({ id: r._id, order: i })),
      });
    } catch {
      reload();
    }
  };

  const onDrop = (target: number) => {
    if (dragIndex === null || dragIndex === target) return;
    const next = rows.slice();
    const [moved] = next.splice(dragIndex, 1);
    next.splice(target, 0, moved);
    setDragIndex(null);
    void persistOrder(next);
  };

  return (
    <div>
      <PageTitle
        eyebrow={t('admin.common.contentManagement')}
        title={config.title}
        actions={
          <Btn onClick={openCreate}>
            {t('admin.common.addItem', { item: config.itemNoun })}
          </Btn>
        }
      />

      <Panel>
        <QueryState
          loading={loading}
          error={error}
          empty={!loading && !error && rows.length === 0}
          onRetry={reload}
        />
        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-start text-xs uppercase text-muted">
                  {config.reorder ? <th className="w-8 py-2"></th> : null}
                  {config.columns.map((c) => (
                    <th key={c.label} className="py-2 pe-3 text-start font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th className="py-2 pe-3 text-start font-semibold">
                    {t('admin.common.status')}
                  </th>
                  <th className="py-2 text-start font-semibold">
                    {t('admin.common.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={row._id}
                    className="border-b border-line/60 transition last:border-0 hover:bg-surface-2/60"
                    draggable={config.reorder}
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => config.reorder && e.preventDefault()}
                    onDrop={() => onDrop(i)}
                  >
                    {config.reorder ? (
                      <td
                        className="cursor-grab py-3 text-muted"
                        title={t('admin.common.dragToReorder')}
                      >
                        ⠿
                      </td>
                    ) : null}
                    {config.columns.map((c) => (
                      <td key={c.label} className="py-3 pe-3 align-top">
                        {c.render(row)}
                      </td>
                    ))}
                    <td className="py-3 pe-3 align-top">
                      {'isPublished' in row ? (
                        <Toggle
                          checked={Boolean(row.isPublished)}
                          onChange={() => togglePublish(row)}
                        />
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-3 align-top">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEdit(row)}
                          className="font-semibold text-teal-700 hover:underline"
                        >
                          {t('admin.common.edit')}
                        </button>
                        <button
                          onClick={() => setToDelete(row)}
                          className="font-semibold text-red-600 hover:underline"
                        >
                          {t('admin.common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal
        open={creating || !!editing}
        wide
        title={
          editing
            ? t('admin.common.editItemTitle', { item: config.itemNoun })
            : t('admin.common.addItemTitle', { item: config.itemNoun })
        }
        onClose={closeForm}
        footer={
          <>
            <Btn tone="ghost" onClick={closeForm} disabled={saving}>
              {t('admin.common.cancel')}
            </Btn>
            <Btn onClick={save} disabled={saving}>
              {saving ? t('admin.common.saving') : t('admin.common.save')}
            </Btn>
          </>
        }
      >
        {formError ? (
          <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}
        <ResourceForm fields={config.fields} value={form} onChange={setForm} />
      </Modal>

      <Confirm
        open={!!toDelete}
        message={t('admin.common.deleteConfirmMessage')}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
        busy={saving}
      />
    </div>
  );
}

/** Drop Mongo/meta keys the API rejects on write. */
function stripMeta(obj: Record<string, unknown>) {
  const clone: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (['_id', '__v', 'createdAt', 'updatedAt', 'slug_lower'].includes(k))
      continue;
    clone[k] = v;
  }
  return clone;
}
