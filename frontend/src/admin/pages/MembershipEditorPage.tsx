import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { MembershipContent } from '../../lib/types';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, PageTitle, Panel, QueryState } from '../ui/AdminUI';
import { LocalizedInput } from '../ui/LocalizedInput';

type Benefit = MembershipContent['benefits'][number];

export function MembershipEditorPage() {
  const { t } = useTranslation();
  const { data, loading, error, reload } =
    useAdminQuery<MembershipContent>('/admin/membership');
  const [draft, setDraft] = useState<MembershipContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (data) setDraft(structuredClone(data));
  }, [data]);

  if (loading || error || !draft)
    return (
      <Panel>
        <QueryState loading={loading} error={error} onRetry={reload} />
      </Panel>
    );

  const setBenefit = (i: number, patch: Partial<Benefit>) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            benefits: d.benefits.map((b, idx) =>
              idx === i ? { ...b, ...patch } : b,
            ),
          }
        : d,
    );

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.patch('/admin/membership', {
        intro: draft.intro,
        pointsExplanation: draft.pointsExplanation,
        benefits: draft.benefits.map((b, i) => ({ ...b, order: i })),
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
      <PageTitle eyebrow={t('admin.membership.eyebrow')} title={t('admin.membership.title')} />
      <Panel
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
            label={t('admin.membership.intro')}
            multiline
            value={draft.intro}
            onChange={(v) => setDraft((d) => (d ? { ...d, intro: v } : d))}
          />

          <div className="space-y-4">
            <p className="text-sm font-bold text-ink-soft">{t('admin.membership.benefits')}</p>
            {draft.benefits.map((b, i) => (
              <div
                key={i}
                className="space-y-3 rounded-xl border border-line bg-surface-2 p-4"
              >
                <LocalizedInput
                  label={t('admin.membership.benefitTitle')}
                  value={b.title}
                  onChange={(v) => setBenefit(i, { title: v })}
                />
                <LocalizedInput
                  label={t('admin.common.descriptionField')}
                  multiline
                  value={b.body}
                  onChange={(v) => setBenefit(i, { body: v })}
                />
                <button
                  onClick={() =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            benefits: d.benefits.filter((_, idx) => idx !== i),
                          }
                        : d,
                    )
                  }
                  className="text-xs font-semibold text-red-600"
                >
                  {t('admin.membership.deleteBenefit')}
                </button>
              </div>
            ))}
            <Btn
              tone="ghost"
              onClick={() =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        benefits: [
                          ...d.benefits,
                          {
                            title: { ar: '', en: '' },
                            body: { ar: '', en: '' },
                            order: d.benefits.length,
                          },
                        ],
                      }
                    : d,
                )
              }
            >
              {t('admin.membership.addBenefit')}
            </Btn>
          </div>

          <LocalizedInput
            label={t('admin.membership.pointsExplanation')}
            multiline
            rows={4}
            value={draft.pointsExplanation}
            onChange={(v) =>
              setDraft((d) => (d ? { ...d, pointsExplanation: v } : d))
            }
          />
        </div>
      </Panel>
    </div>
  );
}
