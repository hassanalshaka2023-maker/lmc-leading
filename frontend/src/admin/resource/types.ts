import type { ReactNode } from 'react';

export type FieldType =
  | 'text'
  | 'slug'
  | 'url'
  | 'number'
  | 'boolean'
  | 'select'
  | 'image'
  | 'localized'
  | 'localizedMultiline'
  | 'localizedList';

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  help?: string;
}

export interface ResourceConfig {
  key: string;
  title: string;
  endpoint: string; // e.g. /admin/language-programs
  /** short label for the "add" button, e.g. "برنامج" */
  itemNoun: string;
  columns: { label: string; render: (row: Record<string, unknown>) => ReactNode }[];
  fields: FieldDef[];
  defaults: Record<string, unknown>;
  reorder?: boolean;
}
