import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ContactInfo, SocialLink } from '../../lib/types';
import { adminApi, apiErrorMessage } from '../adminApi';
import { useAdminQuery } from '../useAdminQuery';
import { Btn, Label, PageTitle, Panel, QueryState, TextInput } from '../ui/AdminUI';
import { LocalizedInput } from '../ui/LocalizedInput';

export function ContactInfoPage() {
  const { t } = useTranslation();
  const { data, loading, error, reload } =
    useAdminQuery<ContactInfo>('/admin/contact-info');
  const [draft, setDraft] = useState<ContactInfo | null>(null);
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

  const set = <K extends keyof ContactInfo>(key: K, value: ContactInfo[K]) =>
    setDraft((d) => (d ? { ...d, [key]: value } : d));

  const setSocial = (i: number, patch: Partial<SocialLink>) =>
    setDraft((d) =>
      d
        ? {
            ...d,
            socialLinks: d.socialLinks.map((s, idx) =>
              idx === i ? { ...s, ...patch } : s,
            ),
          }
        : d,
    );

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await adminApi.patch('/admin/contact-info', {
        phone: draft.phone,
        whatsapp: draft.whatsapp,
        email: draft.email,
        address: draft.address,
        mapEmbedUrl: draft.mapEmbedUrl,
        socialLinks: draft.socialLinks
          .filter((s) => s.platform && s.url)
          .map((s, i) => ({
            platform: s.platform.trim().toLowerCase(),
            url: s.url.trim(),
            order: i,
          })),
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
      <PageTitle eyebrow={t('admin.contact.eyebrow')} title={t('admin.contact.title')} />
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
        <div className="max-w-2xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>{t('admin.contact.phone')}</Label>
              <TextInput
                dir="ltr"
                value={draft.phone}
                onChange={(e) => set('phone', e.target.value)}
              />
            </div>
            <div>
              <Label hint={t('admin.contact.whatsappHint')}>{t('admin.contact.whatsapp')}</Label>
              <TextInput
                dir="ltr"
                value={draft.whatsapp}
                onChange={(e) => set('whatsapp', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>{t('admin.contact.email')}</Label>
            <TextInput
              dir="ltr"
              type="email"
              value={draft.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>

          <LocalizedInput
            label={t('admin.contact.address')}
            multiline
            value={draft.address}
            onChange={(v) => set('address', v)}
          />

          <div>
            <Label>{t('admin.contact.map')}</Label>
            <TextInput
              dir="ltr"
              placeholder="https://www.google.com/maps/embed?pb=..."
              value={draft.mapEmbedUrl}
              onChange={(e) => set('mapEmbedUrl', e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">{t('admin.contact.mapHint')}</p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-bold text-ink-soft">{t('admin.contact.socialLinks')}</p>
            {draft.socialLinks.map((s, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-2 rounded-xl border border-line bg-surface-2 p-3"
              >
                <div className="w-40">
                  <Label>{t('admin.contact.platform')}</Label>
                  <TextInput
                    dir="ltr"
                    placeholder="instagram"
                    value={s.platform}
                    onChange={(e) => setSocial(i, { platform: e.target.value })}
                  />
                </div>
                <div className="min-w-[12rem] flex-1">
                  <Label>{t('admin.contact.link')}</Label>
                  <TextInput
                    dir="ltr"
                    placeholder="https://..."
                    value={s.url}
                    onChange={(e) => setSocial(i, { url: e.target.value })}
                  />
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            socialLinks: d.socialLinks.filter(
                              (_, idx) => idx !== i,
                            ),
                          }
                        : d,
                    )
                  }
                  className="pb-2 text-xs font-semibold text-red-600"
                >
                  {t('admin.common.delete')}
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
                        socialLinks: [
                          ...d.socialLinks,
                          { platform: '', url: '', order: d.socialLinks.length },
                        ],
                      }
                    : d,
                )
              }
            >
              {t('admin.contact.addLink')}
            </Btn>
          </div>
        </div>
      </Panel>
    </div>
  );
}
