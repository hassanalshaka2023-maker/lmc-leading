/**
 * Idempotent database seed.
 *
 *   npm run seed
 *
 * - creates the admin user if none exists (credentials from SEED_ADMIN_* env)
 * - upserts the two singletons (siteStats, membershipContent)
 * - upserts the static pages with placeholder bilingual copy
 * - upserts the catalogue content from the requirements document
 * - inserts placeholder trainers / testimonials / partners only if those
 *   collections are still empty (so real content is never overwritten)
 *
 * Safe to run repeatedly.
 */
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { connect, connection, model } from 'mongoose';
import configuration from '../config/configuration';

import { AdminUserSchema } from '../modules/auth/schemas/admin-user.schema';
import { CorporateProgramSchema } from '../modules/corporate-programs/schemas/corporate-program.schema';
import { EducationalServiceSchema } from '../modules/educational-services/schemas/educational-service.schema';
import { LanguageProgramSchema } from '../modules/language-programs/schemas/language-program.schema';
import { ContactInfoSchema } from '../modules/contact/schemas/contact-info.schema';
import { MembershipContentSchema } from '../modules/membership/schemas/membership-content.schema';
import { PageSchema } from '../modules/pages/schemas/page.schema';
import { PartnerSchema } from '../modules/partners/schemas/partner.schema';
import { SiteStatsSchema } from '../modules/stats/schemas/site-stats.schema';
import { TestimonialSchema } from '../modules/testimonials/schemas/testimonial.schema';
import { TrainerSchema } from '../modules/trainers/schemas/trainer.schema';

dotenv.config();
const cfg = configuration();

type L = { ar: string; en: string };
const L = (ar: string, en: string): L => ({ ar, en });

const AdminUser = model('AdminUser', AdminUserSchema);
const SiteStats = model('SiteStats', SiteStatsSchema);
const MembershipContent = model('MembershipContent', MembershipContentSchema);
const ContactInfo = model('ContactInfo', ContactInfoSchema);
const Page = model('Page', PageSchema);
const LanguageProgram = model('LanguageProgram', LanguageProgramSchema);
const CorporateProgram = model('CorporateProgram', CorporateProgramSchema);
const EducationalService = model(
  'EducationalService',
  EducationalServiceSchema,
);
const Trainer = model('Trainer', TrainerSchema);
const Testimonial = model('Testimonial', TestimonialSchema);
const Partner = model('Partner', PartnerSchema);

async function seedAdmin() {
  const existing = await AdminUser.countDocuments();
  if (existing > 0) {
    console.log(`  admin: ${existing} already present, skipping`);
    return;
  }
  const passwordHash = await bcrypt.hash(cfg.seed.adminPassword, 12);
  await AdminUser.create({
    email: cfg.seed.adminEmail,
    passwordHash,
    role: 'ADMIN',
  });
  console.log(`  admin: created ${cfg.seed.adminEmail}`);
}

async function seedSiteStats() {
  await SiteStats.updateOne(
    { key: 'default' },
    {
      $setOnInsert: {
        key: 'default',
        students: 1500,
        languages: 7,
        trainingHours: 10000,
        programsCount: 50,
        showPlusSuffix: true,
      },
    },
    { upsert: true },
  );
  console.log('  siteStats: ok');
}

async function seedMembership() {
  await MembershipContent.updateOne(
    { key: 'default' },
    {
      $setOnInsert: {
        key: 'default',
        intro: L(
          'برنامج عضوية LMC يمنحك خصومات شراكات وامتيازات حصرية.',
          'The LMC membership programme gives you partner discounts and exclusive perks.',
        ),
        benefits: [
          {
            title: L('خصومات الشركاء', 'Partner discounts'),
            body: L(
              'عروض حصرية لدى الجهات الشريكة للمركز.',
              'Exclusive offers with LMC partner organisations.',
            ),
            order: 0,
          },
          {
            title: L('أولوية التسجيل', 'Priority enrolment'),
            body: L(
              'مقاعد مبكرة في الدورات المطلوبة.',
              'Early access to seats in high-demand courses.',
            ),
            order: 1,
          },
        ],
        pointsExplanation: L(
          'تُكتسب النقاط عبر الإنجازات وإتمام الدورات والإحالات، وتُستبدل بخصومات ومكافآت. (تُدار حالياً يدوياً من إدارة المركز.)',
          'Points are earned through achievements, course completion and referrals, and redeemed for discounts and rewards. (Currently administered manually by LMC staff.)',
        ),
      },
    },
    { upsert: true },
  );
  console.log('  membershipContent: ok');
}

async function seedContactInfo() {
  await ContactInfo.updateOne(
    { key: 'default' },
    {
      $setOnInsert: {
        key: 'default',
        // Placeholders, edited later from the dashboard.
        phone: '+000 000 0000',
        whatsapp: '000000000000',
        email: 'info@example.com',
        address: L('العنوان يُحدَّد لاحقاً', 'Address to be confirmed'),
        mapEmbedUrl: '',
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/', order: 0 },
          { platform: 'facebook', url: 'https://facebook.com/', order: 1 },
          { platform: 'linkedin', url: 'https://linkedin.com/', order: 2 },
        ],
      },
    },
    { upsert: true },
  );
  console.log('  contactInfo: ok');
}

const PAGES: Array<{
  key: string;
  title: L;
  eyebrow?: L;
  subtitle?: L;
  sections: any[];
}> = [
  {
    key: 'home',
    title: L(
      'نُمكّن المتعلمين. نبني المستقبل.',
      'Empowering Learners. Building Futures.',
    ),
    subtitle: L(
      'لغات وتدريب مهني وخدمات تعليمية مصمّمة للنجاح الأكاديمي والمهني والشخصي.',
      'Languages, professional training and educational services designed for academic, career and personal success.',
    ),
    sections: [
      {
        key: 'hero',
        heading: L(
          'نُمكّن المتعلمين. نبني المستقبل.',
          'Empowering Learners. Building Futures.',
        ),
        body: L(
          'لغات وتدريب مهني وخدمات تعليمية مصمّمة للنجاح الأكاديمي والمهني والشخصي.',
          'Languages, professional training and educational services designed for academic, career and personal success.',
        ),
        order: 0,
      },
    ],
  },
  {
    key: 'about',
    title: L('عن Leading Mastery Center', 'About Leading Mastery Center'),
    eyebrow: L('من نحن', 'About LMC'),
    sections: [
      {
        key: 'intro',
        heading: L('عن مركز LMC', 'About LMC'),
        body: L(
          'مركز يجمع بين تعليم اللغات والتدريب المهني والتطوير الوظيفي والخدمات التعليمية.',
          'A center that brings together language education, professional training, career development and educational services.',
        ),
        order: 0,
      },
    ],
  },
  {
    key: 'why-lmc',
    title: L('لماذا LMC', 'Why LMC'),
    sections: [
      {
        key: 'reasons',
        heading: L('لماذا تختار LMC', 'Why choose LMC'),
        body: L(
          'مدربون محترفون، تعلّم عملي، برامج تركّز على الهوية، دعم شخصي، أساليب تعليم حديثة، شهادات، مجتمع طلابي، وشراكات.',
          'Professional trainers, practical learning, identity-focused programmes, personal support, modern teaching methods, certificates, a student community, and partnerships.',
        ),
        order: 0,
      },
    ],
  },
  {
    key: 'programs',
    title: L('البرامج اللغوية', 'Language Programs'),
    eyebrow: L('البرامج', 'Programs'),
    subtitle: L(
      'اختر المسار الذي يناسب أهدافك.',
      'Choose a track that matches your goals.',
    ),
    sections: [],
  },
  {
    key: 'corporate-training',
    title: L(
      'التدريب المهني وتدريب الشركات',
      'Professional & Corporate Training',
    ),
    eyebrow: L('للمؤسسات', 'For organisations'),
    subtitle: L(
      'تدريب على التواصل والقيادة مصمّم لفرق عملك.',
      'Communication and leadership training tailored to your teams.',
    ),
    sections: [],
  },
  {
    key: 'services',
    title: L('الخدمات التعليمية', 'Educational Services'),
    eyebrow: L('الخدمات التعليمية', 'Educational services'),
    subtitle: L(
      'دعم في كل خطوة من مسارك الأكاديمي.',
      'Support at every step of your academic path.',
    ),
    sections: [],
  },
  {
    key: 'trainers',
    title: L('تعرّف على مدربينا', 'Meet Our Trainers'),
    eyebrow: L('فريقنا', 'Our team'),
    subtitle: L(
      'محترفون ذوو خبرة مكرّسون لتقدّمك.',
      'Experienced professionals dedicated to your progress.',
    ),
    sections: [],
  },
  {
    key: 'partners',
    title: L('الشراكات والمجتمع', 'Partners & Community'),
    eyebrow: L('الشراكات والمجتمع', 'Partners & community'),
    subtitle: L(
      'مؤسسات ومبادرات مجتمعية نعمل معها.',
      'Organisations and community initiatives we work with.',
    ),
    sections: [],
  },
  {
    key: 'testimonials',
    title: L('قصص المتعلّمين', 'Learner Stories'),
    eyebrow: L('آراء الطلاب', 'Testimonials'),
    subtitle: L(
      'تجارب حقيقية من طلاب LMC.',
      'Real experiences from LMC students.',
    ),
    sections: [],
  },
  {
    key: 'membership',
    title: L('عضوية LMC والنقاط', 'LMC Membership & Points'),
    eyebrow: L('العضوية', 'Membership'),
    subtitle: L(
      'خصومات وامتيازات حصرية لأعضاء LMC.',
      'Exclusive discounts and perks for LMC members.',
    ),
    sections: [],
  },
  {
    key: 'contact',
    title: L('تواصل معنا', 'Contact Us'),
    eyebrow: L('تواصل', 'Contact'),
    subtitle: L(
      'أرسل لنا رسالة وسيعاود فريقنا التواصل معك.',
      'Send us a message and our team will get back to you.',
    ),
    sections: [
      {
        key: 'details',
        heading: L('معلومات التواصل', 'Contact details'),
        // Placeholder values, edited later from the dashboard.
        body: L(
          'الهاتف: +000 000 0000 · واتساب: +000 000 0000 · البريد: info@example.com · الموقع: يُحدَّد لاحقاً',
          'Phone: +000 000 0000 · WhatsApp: +000 000 0000 · Email: info@example.com · Location: TBD',
        ),
        order: 0,
      },
    ],
  },
];

async function seedPages() {
  for (const p of PAGES) {
    await Page.updateOne(
      { key: p.key },
      {
        $setOnInsert: {
          key: p.key,
          title: p.title,
          eyebrow: p.eyebrow ?? { ar: '', en: '' },
          subtitle: p.subtitle ?? { ar: '', en: '' },
          sections: p.sections,
        },
      },
      { upsert: true },
    );
  }
  console.log(`  pages: ${PAGES.length} ensured`);
}

const ENGLISH_TRACKS: Array<[string, string, string]> = [
  ['general-english', 'الإنجليزية العامة', 'General English'],
  ['business-english', 'إنجليزية الأعمال', 'Business English'],
  ['corporate-english', 'الإنجليزية للشركات', 'Corporate English'],
  [
    'content-creator-english',
    'الإنجليزية لصنّاع المحتوى',
    'English for Content Creators',
  ],
  ['engineers-english', 'الإنجليزية للمهندسين', 'English for Engineers'],
  [
    'markets-professionals-english',
    'الإنجليزية للأسواق والمهنيين',
    'English for Markets & Professionals',
  ],
  ['academic-english', 'الإنجليزية الأكاديمية', 'Academic English'],
  ['conversation-speaking', 'المحادثة والتحدث', 'Conversation & Speaking'],
  ['ielts-prep', 'التحضير لاختبار IELTS', 'IELTS Preparation'],
  ['toefl-prep', 'التحضير لاختبار TOEFL', 'TOEFL Preparation'],
];

const OTHER_LANGUAGES: Array<[string, string, string]> = [
  ['german', 'الألمانية', 'German'],
  ['turkish', 'التركية', 'Turkish'],
  ['spanish', 'الإسبانية', 'Spanish'],
  ['italian', 'الإيطالية', 'Italian'],
  ['russian', 'الروسية', 'Russian'],
  ['dutch', 'الهولندية', 'Dutch'],
];

async function seedLanguagePrograms() {
  let order = 0;
  for (const [slug, ar, en] of ENGLISH_TRACKS) {
    await LanguageProgram.updateOne(
      { slug },
      {
        $setOnInsert: {
          slug,
          title: L(ar, en),
          description: L('', ''),
          category: 'english-track',
          order: order++,
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }
  order = 0;
  for (const [slug, ar, en] of OTHER_LANGUAGES) {
    await LanguageProgram.updateOne(
      { slug },
      {
        $setOnInsert: {
          slug,
          title: L(ar, en),
          description: L('', ''),
          category: 'other-language',
          order: order++,
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }
  console.log(
    `  languagePrograms: ${ENGLISH_TRACKS.length} english + ${OTHER_LANGUAGES.length} other ensured`,
  );
}

const CORPORATE: Array<[string, string, string]> = [
  ['business-communication', 'التواصل في الأعمال', 'Business Communication'],
  [
    'corporate-english-training',
    'تدريب الإنجليزية للشركات',
    'Corporate English',
  ],
  ['presentation-skills', 'مهارات العرض والتقديم', 'Presentation Skills'],
  [
    'workplace-communication',
    'التواصل في بيئة العمل',
    'Workplace Communication',
  ],
  [
    'customer-service-communication',
    'التواصل في خدمة العملاء',
    'Customer Service Communication',
  ],
  [
    'leadership-professional-development',
    'القيادة والتطوير المهني',
    'Leadership & Professional Development',
  ],
  [
    'custom-corporate-training',
    'تدريب مخصّص للشركات',
    'Custom Corporate Training',
  ],
];

async function seedCorporate() {
  let order = 0;
  for (const [slug, ar, en] of CORPORATE) {
    await CorporateProgram.updateOne(
      { slug },
      {
        $setOnInsert: {
          slug,
          title: L(ar, en),
          description: L('', ''),
          outcomes: [],
          order: order++,
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }
  console.log(`  corporatePrograms: ${CORPORATE.length} ensured`);
}

const SERVICES: Array<[string, string, string]> = [
  ['study-abroad-guidance', 'إرشاد الدراسة في الخارج', 'Study Abroad Guidance'],
  [
    'equivalency-support',
    'دعم معادلة الشهادات الجامعية والطبية',
    'University & Medical Equivalency Support',
  ],
  [
    'educational-file-preparation',
    'إعداد الملف التعليمي',
    'Educational File Preparation',
  ],
  ['examination-services', 'خدمات الاختبارات', 'Examination Services'],
  ['academic-consultation', 'الاستشارات الأكاديمية', 'Academic Consultation'],
  ['translation-support', 'دعم الترجمة', 'Translation Support'],
];

async function seedServices() {
  let order = 0;
  for (const [slug, ar, en] of SERVICES) {
    await EducationalService.updateOne(
      { slug },
      {
        $setOnInsert: {
          slug,
          title: L(ar, en),
          description: L('', ''),
          order: order++,
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }
  console.log(`  educationalServices: ${SERVICES.length} ensured`);
}

async function seedPlaceholders() {
  if ((await Trainer.countDocuments()) === 0) {
    await Trainer.insertMany(
      [1, 2, 3].map((i) => ({
        name: `Trainer ${i}`,
        specialty: L('تخصص المدرب', 'Trainer specialty'),
        qualifications: L('المؤهلات', 'Qualifications'),
        experienceYears: 5 + i,
        order: i - 1,
        isPublished: true,
      })),
    );
    console.log('  trainers: 3 placeholders inserted');
  } else {
    console.log('  trainers: present, skipped');
  }

  if ((await Testimonial.countDocuments()) === 0) {
    await Testimonial.insertMany(
      [1, 2, 3].map((i) => ({
        name: `Student ${i}`,
        role: L('طالب جامعي', 'University student'),
        text: L(
          'تجربة تعليمية ممتازة في LMC.',
          'An excellent learning experience at LMC.',
        ),
        order: i - 1,
        isPublished: true,
      })),
    );
    console.log('  testimonials: 3 placeholders inserted');
  } else {
    console.log('  testimonials: present, skipped');
  }

  if ((await Partner.countDocuments()) === 0) {
    await Partner.insertMany(
      [1, 2, 3, 4].map((i) => ({
        name: `Partner ${i}`,
        order: i - 1,
        isPublished: true,
      })),
    );
    console.log('  partners: 4 placeholders inserted');
  } else {
    console.log('  partners: present, skipped');
  }
}

async function main() {
  console.log(`Seeding ${cfg.mongoUri.replace(/\/\/.*@/, '//***@')}`);
  await connect(cfg.mongoUri);
  try {
    await seedAdmin();
    await seedSiteStats();
    await seedMembership();
    await seedContactInfo();
    await seedPages();
    await seedLanguagePrograms();
    await seedCorporate();
    await seedServices();
    await seedPlaceholders();
    console.log('Seed complete.');
  } finally {
    await connection.close();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
