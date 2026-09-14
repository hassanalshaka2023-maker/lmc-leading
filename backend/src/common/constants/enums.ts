/**
 * Shared domain enums. Kept as `as const` string unions so they serialize
 * cleanly to JSON and are usable both as Mongoose enum values and DTO types.
 */

export const PROGRAM_CATEGORY = ['english-track', 'other-language'] as const;
export type ProgramCategory = (typeof PROGRAM_CATEGORY)[number];

export const SUBMISSION_TYPE = ['contact', 'enrollment'] as const;
export type SubmissionType = (typeof SUBMISSION_TYPE)[number];

export const SUBMISSION_STATUS = ['new', 'in_progress', 'done'] as const;
export type SubmissionStatus = (typeof SUBMISSION_STATUS)[number];

export const ADMIN_ROLE = ['ADMIN'] as const;
export type AdminRole = (typeof ADMIN_ROLE)[number];

/**
 * Well-known singleton / static page keys. Not enforced as an enum on the
 * schema (admins may add sections freely), but used by the seed + frontend.
 */
export const PAGE_KEY = [
  'home',
  'about',
  'why-lmc',
  'membership',
  'contact',
] as const;
export type PageKey = (typeof PAGE_KEY)[number];
