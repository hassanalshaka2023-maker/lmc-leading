import type { TFunction } from 'i18next';
import type { Localized } from '../../lib/types';
import type { ResourceConfig } from './types';

const L = (v: unknown): string => {
  const o = v as Partial<Localized> | undefined;
  return o?.ar || o?.en || '—';
};

const nameCell = (row: Record<string, unknown>) => (
  <div>
    <div className="font-semibold text-ink">{L(row.title ?? row.name)}</div>
    <div className="text-xs text-muted">
      {((row.title ?? row.name) as Partial<Localized>)?.en ??
        (row.name as string) ??
        ''}
    </div>
  </div>
);

/** Configs for the generic CRUD pages. Takes `t` so labels follow the UI language. */
export function buildResourceConfigs(
  t: TFunction,
): Record<string, ResourceConfig> {
  const publishField = {
    name: 'isPublished',
    label: t('admin.common.published'),
    type: 'boolean' as const,
  };
  const orderField = {
    name: 'order',
    label: t('admin.common.orderField'),
    type: 'number' as const,
    help: t('admin.common.orderFieldHelp'),
  };

  return {
    'language-programs': {
      key: 'language-programs',
      title: t('admin.resources.languagePrograms.title'),
      endpoint: '/admin/language-programs',
      itemNoun: t('admin.resources.languagePrograms.itemNoun'),
      reorder: true,
      columns: [
        { label: t('admin.common.nameField'), render: nameCell },
        {
          label: t('admin.resources.languagePrograms.colCategory'),
          render: (r) =>
            r.category === 'english-track'
              ? t('admin.resources.languagePrograms.englishTrack')
              : t('admin.resources.languagePrograms.otherLanguage'),
        },
      ],
      defaults: {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        slug: '',
        category: 'english-track',
        isFeatured: false,
        isPublished: true,
        order: 0,
      },
      fields: [
        { name: 'title', label: t('admin.common.titleField'), type: 'localized' },
        {
          name: 'slug',
          label: t('admin.common.slugField'),
          type: 'slug',
          help: t('admin.resources.languagePrograms.fieldSlugHelp'),
        },
        {
          name: 'category',
          label: t('admin.resources.languagePrograms.fieldCategory'),
          type: 'select',
          options: [
            {
              value: 'english-track',
              label: t('admin.resources.languagePrograms.englishTrack'),
            },
            {
              value: 'other-language',
              label: t('admin.resources.languagePrograms.otherLanguage'),
            },
          ],
        },
        {
          name: 'description',
          label: t('admin.common.descriptionField'),
          type: 'localizedMultiline',
        },
        {
          name: 'level',
          label: t('admin.resources.languagePrograms.fieldLevel'),
          type: 'localized',
        },
        {
          name: 'isFeatured',
          label: t('admin.resources.languagePrograms.fieldFeatured'),
          type: 'boolean',
        },
        publishField,
        orderField,
      ],
    },

    'corporate-programs': {
      key: 'corporate-programs',
      title: t('admin.resources.corporatePrograms.title'),
      endpoint: '/admin/corporate-programs',
      itemNoun: t('admin.resources.corporatePrograms.itemNoun'),
      reorder: true,
      columns: [{ label: t('admin.common.nameField'), render: nameCell }],
      defaults: {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        slug: '',
        outcomes: [],
        isPublished: true,
        order: 0,
      },
      fields: [
        { name: 'title', label: t('admin.common.titleField'), type: 'localized' },
        { name: 'slug', label: t('admin.common.slugField'), type: 'slug' },
        {
          name: 'description',
          label: t('admin.common.descriptionField'),
          type: 'localizedMultiline',
        },
        {
          name: 'outcomes',
          label: t('admin.resources.corporatePrograms.fieldOutcomes'),
          type: 'localizedList',
        },
        publishField,
        orderField,
      ],
    },

    'educational-services': {
      key: 'educational-services',
      title: t('admin.resources.educationalServices.title'),
      endpoint: '/admin/educational-services',
      itemNoun: t('admin.resources.educationalServices.itemNoun'),
      reorder: true,
      columns: [{ label: t('admin.common.nameField'), render: nameCell }],
      defaults: {
        title: { ar: '', en: '' },
        description: { ar: '', en: '' },
        slug: '',
        isPublished: true,
        order: 0,
      },
      fields: [
        { name: 'title', label: t('admin.common.titleField'), type: 'localized' },
        { name: 'slug', label: t('admin.common.slugField'), type: 'slug' },
        {
          name: 'description',
          label: t('admin.common.descriptionField'),
          type: 'localizedMultiline',
        },
        {
          name: 'icon',
          label: t('admin.resources.educationalServices.fieldIcon'),
          type: 'text',
        },
        publishField,
        orderField,
      ],
    },

    trainers: {
      key: 'trainers',
      title: t('admin.resources.trainers.title'),
      endpoint: '/admin/trainers',
      itemNoun: t('admin.resources.trainers.itemNoun'),
      reorder: true,
      columns: [
        {
          label: t('admin.common.nameField'),
          render: (r) => <span className="font-semibold">{r.name as string}</span>,
        },
        { label: t('admin.resources.trainers.colSpecialty'), render: (r) => L(r.specialty) },
        {
          label: t('admin.resources.trainers.colExperience'),
          render: (r) => `${(r.experienceYears as number) ?? 0}+`,
        },
      ],
      defaults: {
        name: '',
        specialty: { ar: '', en: '' },
        qualifications: { ar: '', en: '' },
        experienceYears: 0,
        isPublished: true,
        order: 0,
      },
      fields: [
        { name: 'name', label: t('admin.common.nameField'), type: 'text' },
        {
          name: 'photoUrl',
          label: t('admin.resources.trainers.fieldPhoto'),
          type: 'image',
        },
        {
          name: 'specialty',
          label: t('admin.resources.trainers.fieldSpecialty'),
          type: 'localized',
        },
        {
          name: 'qualifications',
          label: t('admin.resources.trainers.fieldQualifications'),
          type: 'localizedMultiline',
        },
        {
          name: 'experienceYears',
          label: t('admin.resources.trainers.fieldExperience'),
          type: 'number',
        },
        publishField,
        orderField,
      ],
    },

    testimonials: {
      key: 'testimonials',
      title: t('admin.resources.testimonials.title'),
      endpoint: '/admin/testimonials',
      itemNoun: t('admin.resources.testimonials.itemNoun'),
      reorder: true,
      columns: [
        {
          label: t('admin.common.nameField'),
          render: (r) => <span className="font-semibold">{r.name as string}</span>,
        },
        { label: t('admin.resources.testimonials.colRole'), render: (r) => L(r.role) },
        {
          label: t('admin.resources.testimonials.colText'),
          render: (r) => (
            <span className="line-clamp-2 max-w-xs text-xs text-muted">
              {L(r.text)}
            </span>
          ),
        },
      ],
      defaults: {
        name: '',
        role: { ar: '', en: '' },
        text: { ar: '', en: '' },
        isPublished: true,
        order: 0,
      },
      fields: [
        { name: 'name', label: t('admin.common.nameField'), type: 'text' },
        {
          name: 'photoUrl',
          label: t('admin.resources.testimonials.fieldPhoto'),
          type: 'image',
        },
        {
          name: 'role',
          label: t('admin.resources.testimonials.fieldRole'),
          type: 'localized',
        },
        {
          name: 'text',
          label: t('admin.resources.testimonials.fieldText'),
          type: 'localizedMultiline',
        },
        publishField,
        orderField,
      ],
    },

    partners: {
      key: 'partners',
      title: t('admin.resources.partners.title'),
      endpoint: '/admin/partners',
      itemNoun: t('admin.resources.partners.itemNoun'),
      reorder: true,
      columns: [
        {
          label: t('admin.common.nameField'),
          render: (r) => <span className="font-semibold">{r.name as string}</span>,
        },
        {
          label: t('admin.resources.partners.colLogo'),
          render: (r) =>
            r.logoUrl ? (
              <img src={r.logoUrl as string} alt="" className="h-8" />
            ) : (
              '—'
            ),
        },
        {
          label: t('admin.resources.partners.colWebsite'),
          render: (r) => (r.websiteUrl as string) ?? '—',
        },
      ],
      defaults: { name: '', isPublished: true, order: 0 },
      fields: [
        { name: 'name', label: t('admin.common.nameField'), type: 'text' },
        {
          name: 'logoUrl',
          label: t('admin.resources.partners.fieldLogo'),
          type: 'image',
        },
        {
          name: 'websiteUrl',
          label: t('admin.resources.partners.fieldWebsite'),
          type: 'url',
        },
        publishField,
        orderField,
      ],
    },
  };
}
