import type { Localized } from '../../lib/types';
import { Label, TextArea, TextInput } from './AdminUI';

type Value = Partial<Localized>;

export function LocalizedInput({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
}: {
  label: string;
  value: Value | undefined;
  onChange: (v: Localized) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const v: Localized = { ar: value?.ar ?? '', en: value?.en ?? '' };
  const set = (side: keyof Localized, text: string) =>
    onChange({ ...v, [side]: text });

  const renderSide = (side: keyof Localized, dir: 'rtl' | 'ltr', caption: string) => (
    <div>
      <span className="mb-1 block text-xs font-semibold text-muted">
        {caption}
      </span>
      {multiline ? (
        <TextArea
          dir={dir}
          rows={rows}
          value={v[side]}
          onChange={(e) => set(side, e.target.value)}
        />
      ) : (
        <TextInput
          dir={dir}
          value={v[side]}
          onChange={(e) => set(side, e.target.value)}
        />
      )}
    </div>
  );

  return (
    <div>
      <Label>{label}</Label>
      <div className="grid gap-2 sm:grid-cols-2">
        {renderSide('ar', 'rtl', 'العربية')}
        {renderSide('en', 'ltr', 'English')}
      </div>
    </div>
  );
}
