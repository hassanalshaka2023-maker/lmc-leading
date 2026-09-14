export interface Localized {
  ar: string;
  en: string;
}

export interface SiteStats {
  students: number;
  languages: number;
  trainingHours: number;
  programsCount: number;
  showPlusSuffix: boolean;
  labels: {
    students: Localized;
    languages: Localized;
    trainingHours: Localized;
    programsCount: Localized;
  };
}

export interface PageSection {
  key: string;
  heading: Localized;
  body: Localized;
  order: number;
}

export interface Page {
  key: string;
  title: Localized;
  eyebrow?: Localized;
  subtitle?: Localized;
  sections: PageSection[];
  seo?: { title: Localized; description: Localized };
}

export type ProgramCategory = 'english-track' | 'other-language';

export interface LanguageProgram {
  _id: string;
  title: Localized;
  slug: string;
  description: Localized;
  category: ProgramCategory;
  level?: Localized;
  isFeatured: boolean;
  order: number;
}

export interface CorporateProgram {
  _id: string;
  title: Localized;
  slug: string;
  description: Localized;
  outcomes: Localized[];
  order: number;
}

export interface EducationalService {
  _id: string;
  title: Localized;
  slug: string;
  description: Localized;
  icon?: string;
  order: number;
}

export interface Trainer {
  _id: string;
  name: string;
  photoUrl?: string;
  specialty: Localized;
  qualifications: Localized;
  experienceYears: number;
  order: number;
}

export interface Testimonial {
  _id: string;
  name: string;
  photoUrl?: string;
  role: Localized;
  text: Localized;
  order: number;
}

export interface Partner {
  _id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  order: number;
}

export interface MembershipBenefit {
  title: Localized;
  body: Localized;
  order: number;
}

export interface MembershipContent {
  intro: Localized;
  benefits: MembershipBenefit[];
  pointsExplanation: Localized;
}

export interface SocialLink {
  platform: string;
  url: string;
  order: number;
}

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: Localized;
  mapEmbedUrl: string;
  socialLinks: SocialLink[];
}

export type SubmissionType = 'contact' | 'enrollment';

export interface CreateSubmission {
  type: SubmissionType;
  name: string;
  phone: string;
  email: string;
  serviceOfInterest?: string;
  message: string;
}
