import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Localized, Page, PageSection } from '../../lib/types';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, PageTitle, Panel, QueryState, TextInput } from '../ui/AdminUI';
import { LocalizedInput } from '../ui/LocalizedInput';

export function PagesEditorPage() {
  const { t } = useTranslation();
  const pageLabel = (key: string) =>
    t(`admin.pages.labels.${key}`, { defaultValue: key });
  const { data, loading, error, reload } = useAdminQuery<Page[]>('/admin/pages');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length && !activeKey) setActiveKey(data[0].key);
  }, [data, activeKey]);

  const active = useMemo(
    () => data?.find((p) => p.key === activeKey) ?? null,
    [data, activeKey],
  );
  useEffect(() => {
    setDraft(active ? structuredClone(active) : null);
    setMsg(null);
  }, [active]);

  if (loading || error)
    return (
      <Panel>
        <QueryState loading={loading} error={error} onRetry={reload} />
      </Panel>
    );
  if (!draft) return null;

  const setSection = (i: number, patch: Partial<PageSection>) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            sections: d.sections.map((s, idx) =>
              idx === i ? { ...s, ...patch } : s,
            ),
          }
        : d,
    );

  const addSection = () =>
    setDraft((d) =>
      d
        ? {
            ...d,
            sections: [
              ...d.sections,
              {
                key: `section-${d.sections.length + 1}`,
                heading: { ar: '', en: '' },
                body: { ar: '', en: '' },
                order: d.sections.length,
              },
            ],
          }
        : d,
    );

  const removeSection = (i: number) =>
    setDraft((d) =>
      d ? { ...d, sections: d.sections.filter((_, idx) => idx !== i) } : d,
    );

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.patch(`/admin/pages/${draft.key}`, {
        title: draft.title,
        eyebrow: draft.eyebrow,
        subtitle: draft.subtitle,
        sections: draft.sections.map((s, i) => ({ ...s, order: i })),
      });
      setMsg(t('admin.common.saved'));
      reload();
    } catch (err) {
      setMsg(apiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageTitle eyebrow={t('admin.pages.eyebrow')} title={t('admin.pages.title')} />

      <div className="mb-4 flex flex-wrap gap-2">
        {data?.map((p) => (
          <button
            key={p.key}
            onClick={() => setActiveKey(p.key)}
            className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${
              p.key === activeKey
                ? 'bg-teal-700 text-white'
                : 'border border-line text-teal-700 hover:bg-surface-2'
            }`}
          >
            {pageLabel(p.key)}
          </button>
        ))}
      </div>

      <Panel
        title={t('admin.pages.editing', { page: pageLabel(draft.key) })}
        actions={
          <div className="flex items-center gap-3">
            {msg ? <span className="text-xs text-ink-soft">{msg}</span> : null}
            <Btn onClick={save} disabled={saving}>
              {saving ? t('admin.common.saving') : t('admin.common.save')}
            </Btn>
          </div>
        }
      >
        <div className="space-y-6">
          <LocalizedInput
            label={t('admin.pages.eyebrowField')}
            value={draft.eyebrow ?? { ar: '', en: '' }}
            onChange={(v: Localized) => setDraft((d) => (d ? { ...d, eyebrow: v } : d))}
          />
          <LocalizedInput
            label={t('admin.pages.titleField')}
            value={draft.title}
            onChange={(v: Localized) => setDraft((d) => (d ? { ...d, title: v } : d))}
          />
          <LocalizedInput
            label={t('admin.pages.subtitleField')}
            multiline
            rows={2}
            value={draft.subtitle ?? { ar: '', en: '' }}
            onChange={(v: Localized) => setDraft((d) => (d ? { ...d, subtitle: v } : d))}
          />

          <div className="space-y-5">
            {draft.sections.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-line bg-surface-2 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <TextInput
                    dir="ltr"
                    className="max-w-xs"
                    value={s.key}
                    onChange={(e) => setSection(i, { key: e.target.value })}
                  />
                  <button
                    onClick={() => removeSection(i)}
                    className="text-xs font-semibold text-red-600"
                  >
                    {t('admin.pages.deleteSection')}
                  </button>
                </div>
                <div className="space-y-3">
                  <LocalizedInput
                    label={t('admin.pages.sectionHeading')}
                    value={s.heading}
                    onChange={(v) => setSection(i, { heading: v })}
                  />
                  <LocalizedInput
                    label={t('admin.pages.sectionBody')}
                    multiline
                    rows={4}
                    value={s.body}
                    onChange={(v) => setSection(i, { body: v })}
                  />
                </div>
              </div>
            ))}
          </div>

          <Btn tone="ghost" onClick={addSection}>
            {t('admin.pages.addSection')}
          </Btn>
        </div>
      </Panel>
    </div>
  );
}
