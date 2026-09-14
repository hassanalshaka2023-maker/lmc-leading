import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Localized, SiteStats } from '../../lib/types';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import {
  Btn,
  Label,
  PageTitle,
  Panel,
  QueryState,
  TextInput,
  Toggle,
} from '../ui/AdminUI';
import { LocalizedInput } from '../ui/LocalizedInput';

export function StatsPage() {
  const { t } = useTranslation();
  const { data, loading, error, reload } = useAdminQuery<SiteStats>('/admin/stats');
  const [form, setForm] = useState<Partial<SiteStats>>({});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const NUM_FIELDS: { key: keyof SiteStats; label: string }[] = [
    { key: 'students', label: t('admin.stats.students') },
    { key: 'languages', label: t('admin.stats.languages') },
    { key: 'trainingHours', label: t('admin.stats.trainingHours') },
    { key: 'programsCount', label: t('admin.stats.programsCount') },
  ];

  const LABEL_FIELDS: { key: keyof SiteStats['labels']; label: string }[] = [
    { key: 'students', label: t('admin.stats.labelStudents') },
    { key: 'languages', label: t('admin.stats.labelLanguages') },
    { key: 'trainingHours', label: t('admin.stats.labelTrainingHours') },
    { key: 'programsCount', label: t('admin.stats.labelProgramsCount') },
  ];

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.patch('/admin/stats', {
        students: form.students,
        languages: form.languages,
        trainingHours: form.trainingHours,
        programsCount: form.programsCount,
        showPlusSuffix: form.showPlusSuffix,
        labels: form.labels,
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
      <PageTitle eyebrow={t('admin.stats.eyebrow')} title={t('admin.stats.title')} />
      <p className="mb-6 text-sm text-muted">{t('admin.stats.intro')}</p>

      <Panel>
        <QueryState loading={loading} error={error} onRetry={reload} />
        {data && (
          <div className="max-w-lg space-y-4">
            {NUM_FIELDS.map((f) => (
              <div key={f.key as string}>
                <Label>{f.label}</Label>
                <TextInput
                  type="number"
                  dir="ltr"
                  value={String(form[f.key] ?? '')}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      [f.key]: e.target.value === '' ? 0 : Number(e.target.value),
                    }))
                  }
                />
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Label>{t('admin.stats.showPlusSuffix')}</Label>
              <Toggle
                checked={Boolean(form.showPlusSuffix)}
                onChange={(v) => setForm((s) => ({ ...s, showPlusSuffix: v }))}
                labels={[t('admin.common.yes'), t('admin.common.no')]}
              />
            </div>

            <div className="space-y-4 border-t border-line pt-4">
              {LABEL_FIELDS.map((f) => (
                <LocalizedInput
                  key={f.key as string}
                  label={f.label}
                  value={form.labels?.[f.key] ?? { ar: '', en: '' }}
                  onChange={(v: Localized) =>
                    setForm((s) => ({
                      ...s,
                      labels: { ...(s.labels as SiteStats['labels']), [f.key]: v },
                    }))
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Btn onClick={save} disabled={saving}>
                {saving ? t('admin.common.saving') : t('admin.common.save')}
              </Btn>
              {msg ? (
                <span className="text-sm text-ink-soft">{msg}</span>
              ) : null}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
}
