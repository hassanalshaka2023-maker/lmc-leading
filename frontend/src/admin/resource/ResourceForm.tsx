import { useTranslation } from 'react-i18next';
import type { Localized } from '../../lib/types';
import { Btn, Label, TextArea, TextInput, Toggle } from '../ui/AdminUI';
import { ImageInput } from '../ui/ImageInput';
import { LocalizedInput } from '../ui/LocalizedInput';
import type { FieldDef } from './types';

type Data = Record<string, unknown>;

export function ResourceForm({
  fields,
  value,
  onChange,
}: {
  fields: FieldDef[];
  value: Data;
  onChange: (next: Data) => void;
}) {
  const { t } = useTranslation();
  const set = (name: string, v: unknown) => onChange({ ...value, [name]: v });

  return (
    <div className="space-y-4">
      {fields.map((f) => {
        const v = value[f.name];
        switch (f.type) {
          case 'text':
          case 'slug':
          case 'url':
            return (
              <div key={f.name}>
                <Label hint={f.help}>{f.label}</Label>
                <TextInput
                  dir={f.type === 'text' ? undefined : 'ltr'}
                  value={(v as string) ?? ''}
                  onChange={(e) => set(f.name, e.target.value)}
                />
              </div>
            );
          case 'number':
            return (
              <div key={f.name}>
                <Label hint={f.help}>{f.label}</Label>
                <TextInput
                  type="number"
                  dir="ltr"
                  value={v === undefined || v === null ? '' : String(v)}
                  onChange={(e) =>
                    set(
                      f.name,
                      e.target.value === '' ? undefined : Number(e.target.value),
                    )
                  }
                />
              </div>
            );
          case 'boolean':
            return (
              <div key={f.name} className="flex items-center justify-between">
                <Label>{f.label}</Label>
                <Toggle
                  checked={Boolean(v)}
                  onChange={(b) => set(f.name, b)}
                  labels={[t('admin.common.yes'), t('admin.common.no')]}
                />
              </div>
            );
          case 'select':
            return (
              <div key={f.name}>
                <Label>{f.label}</Label>
                <select
                  className="field"
                  value={(v as string) ?? ''}
                  onChange={(e) => set(f.name, e.target.value)}
                >
                  <option value="" disabled>
                    —
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          case 'image':
            return (
              <ImageInput
                key={f.name}
                label={f.label}
                value={v as string | undefined}
                onChange={(url) => set(f.name, url)}
              />
            );
          case 'localized':
            return (
              <LocalizedInput
                key={f.name}
                label={f.label}
                value={v as Partial<Localized> | undefined}
                onChange={(nv) => set(f.name, nv)}
              />
            );
          case 'localizedMultiline':
            return (
              <LocalizedInput
                key={f.name}
                label={f.label}
                multiline
                value={v as Partial<Localized> | undefined}
                onChange={(nv) => set(f.name, nv)}
              />
            );
          case 'localizedList':
            return (
              <LocalizedListInput
                key={f.name}
                label={f.label}
                value={(v as Localized[] | undefined) ?? []}
                onChange={(nv) => set(f.name, nv)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function LocalizedListInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Localized[];
  onChange: (v: Localized[]) => void;
}) {
  const { t } = useTranslation();
  const update = (i: number, nv: Localized) =>
    onChange(value.map((row, idx) => (idx === i ? nv : row)));
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const add = () => onChange([...value, { ar: '', en: '' }]);

  return (
    <div>
      <Label>{label}</Label>
      <div className="space-y-3">
        {value.map((row, i) => (
          <div
            key={i}
            className="rounded-lg border border-line bg-surface-2 p-3"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <TextArea
                dir="rtl"
                rows={2}
                placeholder="عربي"
                value={row.ar}
                onChange={(e) => update(i, { ...row, ar: e.target.value })}
              />
              <TextArea
                dir="ltr"
                rows={2}
                placeholder="English"
                value={row.en}
                onChange={(e) => update(i, { ...row, en: e.target.value })}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-2 text-xs font-semibold text-red-600"
            >
              {t('admin.common.removeLine')}
            </button>
          </div>
        ))}
      </div>
      <Btn tone="ghost" type="button" className="mt-3" onClick={add}>
        {t('admin.common.addLine')}
      </Btn>
    </div>
  );
}
