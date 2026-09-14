# LMC — MVP Scope Freeze (Single Source of Truth)

> تاريخ التثبيت: 2026-08-27. أي إضافة خارج هذه الوثيقة تحتاج موافقة العميل أولاً.

> **تحديث 2026-08-29 (مراجعة QA + إصلاحات):** أُضيف كيان `contactInfo` منظَّم (هاتف/واتساب/إيميل/عنوان/خريطة/روابط اجتماعية) بدل تخزين التواصل كنص حر داخل `pages.contact` — هذا تنفيذ لمتطلب CONTACT في وثيقة المتطلبات. نُفِّذ `RolesGuard` كما في القسم 5. أُزيل رفع SVG من مكتبة الوسائط (خطر تنفيذ سكربت). أُضيفت اختبارات (unit + e2e). التفاصيل في `QA.md`.

## 1. القرارات المعتمدة (Phase 0)

| البند | القرار |
|---|---|
| الدفع الإلكتروني | مؤجَّل — لا بوابة دفع في MVP. حقول السعر تُخزَّن لكن لا تُعرض ولا تُعالَج. |
| زر "Register Now" | نموذج طلب فقط → `submissions` بـ `type: "enrollment"`. لا حسابات طلاب. |
| الحسابات | Admin واحد فقط. JWT + Refresh Tokens + Rate limiting على `/auth/login`. حقل `role` موجود في الـ schema للتوسعة المستقبلية بلا واجهة إدارة أدوار. |
| اللغة | عربي + إنجليزي من الآن. حقول محتوى متداخلة `{ ar, en }`. تبديل RTL/LTR في الواجهة والداشبورد. |
| LMC Points / Membership | محتوى ثابت قابل للتحرير فقط (`membershipContent`). **لا منطق نقاط، لا أرصدة، لا حساب تلقائي.** |
| الاستضافة | Hostinger VPS → Docker Compose + Nginx reverse proxy + Let's Encrypt. |
| قاعدة البيانات | **MongoDB** + **Mongoose** (`@nestjs/mongoose`). ليست PostgreSQL/Prisma. |
| رفع الملفات | تخزين محلي على الـ VPS خلف واجهة `StorageService` قابلة للتبديل إلى S3 لاحقاً. |
| الشعار | يُستخدم كما هو. المستخدم سيوفّر SVG + PNG شفاف. Favicon يُولَّد من الأيقونة فقط. |
| بيانات Contact | Placeholders تُحرَّر من الداشبورد (لا أرقام/روابط حقيقية بعد). |
| المدربون / الآراء / الشركاء | Placeholders تُزرع الآن، تُستبدل من الداشبورد. |
| ORM/ODM justification | Mongoose هو المعيار الفعلي مع NestJS + MongoDB؛ محتوى شبه ثابت كثيف القراءة بلا Transactions → نموذج المستندات مناسب. |

## 2. الهوية البصرية

- الألوان: أزرق تيل `#0F5270` · برتقالي `#F05223` · أبيض `#FFFFFF` · رمادي فاتح للخلفيات.
- **ممنوع أي ذهبي أو Gradient يحاكيه.**
- أزرق: التنقّل، العناوين، العناصر الرئيسية. برتقالي: الأزرار، CTA، الأيقونات، التمييز.
- مساحات بيضاء واسعة، بطاقات دائرية الحواف، أنيميشن خلفي خفيف، تصوير تعليمي احترافي.
- لا يبدو "قالباً جاهزاً" — عناصر بصرية مخصّصة، Micro-interactions.

## 3. الصفحات العامة (Public Site)

الترتيب: Home → About → Programs → Corporate Training → Services → Membership → Trainers → Partners → Testimonials → Contact

| الصفحة | المحتوى (من وثيقة المتطلبات) | المصدر |
|---|---|---|
| **Home** | Headline: "Empowering Learners. Building Futures." / Sub: "Languages, professional training and educational services designed for academic, career and personal success." / أزرار: Explore Programs, Contact Us. أقسام مختصرة: عن LMC، لمحة برامج، Why LMC، إحصائيات، شركاء، آراء. | `pages.home`, `siteStats`, مقتطفات من الكيانات |
| **About** | نبذة المركز + قسم **Why LMC** (مدربون محترفون، تعلّم عملي، برامج تركّز على الهوية، دعم شخصي، أساليب حديثة، شهادات، مجتمع طلابي، شراكات) + الإحصائيات: 1500+ طالب / 7 لغات / 10000+ ساعة تدريب / +50 برنامج. | `pages.about`, `siteStats` |
| **Programs** | English Tracks: General, Business, Corporate, Content Creator, Engineers, Markets & Professionals, Academic, Conversation & Speaking, IELTS Prep, TOEFL Prep. Other Languages: German, Turkish, Spanish, Italian, Russian, Dutch. بطاقات + "Learn More". | `languagePrograms` |
| **Corporate Training** | Business Communication, Corporate English, Presentation Skills, Workplace Communication, Customer Service Communication, Leadership & Professional Development, تدريب مخصّص للشركات. | `corporatePrograms` |
| **Services** | Study Abroad Guidance, University & Medical Equivalency Support, Educational File Preparation, Examination Services, Academic Consultation, Translation Support. | `educationalServices` |
| **Membership** | برنامج عضوية بخصومات وامتيازات + وصف نظام النقاط (نصي فقط). | `membershipContent` |
| **Trainers** | بطاقات: صورة، اسم، تخصص، مؤهلات، سنوات خبرة + عنوان "Meet Our Trainers". | `trainers` |
| **Partners** | شعارات جهات شريكة (placeholders قابلة للتعديل). | `partners` |
| **Testimonials** | آراء طلاب بأسماء وصور (placeholders). | `testimonials` |
| **Contact** | هاتف، واتساب، إيميل، موقع، روابط اجتماعية، Google Maps placeholder + نموذج: Name, Phone, Email, Service/Course Interested In, Message. | `contactInfo` (معلومات منظَّمة) + `POST /submissions` |

**Navigation (Sticky):** Home · About · Programs · Services · Trainers · Membership · Partners · Contact + زر بارز **Register Now**.
**Footer:** شعار، روابط سريعة، معلومات تواصل، حقوق.

## 4. نموذج البيانات (MongoDB Collections)

كل الحقول النصية الظاهرة للجمهور = `{ ar: string, en: string }`.

| Collection | الحقول الأساسية |
|---|---|
| `pages` | `key` (home/about/membership/contact...), `sections: [{ key, heading:{ar,en}, body:{ar,en}, order }]`, `seo:{ title:{ar,en}, description:{ar,en} }`, `updatedAt`, `updatedBy` |
| `siteStats` | مستند **واحد**: `students:number`, `languages:number`, `trainingHours:number`, `programsCount:number`, `labels:{ students:{ar,en}, ... }`, `updatedAt` |
| `languagePrograms` | `title:{ar,en}`, `slug`, `description:{ar,en}`, `category: "english-track" \| "other-language"`, `level?:{ar,en}`, `priceAmount?:number`, `priceCurrency?:string` (مخفي في MVP), `isFeatured:boolean`, `order:number`, `isPublished:boolean` |
| `corporatePrograms` | `title:{ar,en}`, `slug`, `description:{ar,en}`, `outcomes:[{ar,en}]`, `order`, `isPublished` |
| `educationalServices` | `title:{ar,en}`, `slug`, `description:{ar,en}`, `icon?:string`, `order`, `isPublished` |
| `trainers` | `name:string`, `photoAssetId?:ObjectId`, `specialty:{ar,en}`, `qualifications:{ar,en}`, `experienceYears:number`, `order`, `isPublished` |
| `testimonials` | `name:string`, `photoAssetId?:ObjectId`, `role:{ar,en}`, `text:{ar,en}`, `order`, `isPublished` |
| `partners` | `name:string`, `logoAssetId?:ObjectId`, `websiteUrl?:string`, `order`, `isPublished` |
| `membershipContent` | مستند واحد: `intro:{ar,en}`, `benefits:[{ title:{ar,en}, body:{ar,en} }]`, `pointsExplanation:{ar,en}`, `updatedAt` |
| `contactInfo` | مستند **واحد** (`key:"default"`): `phone`, `whatsapp` (أرقام فقط), `email`, `address:{ar,en}`, `mapEmbedUrl` (رابط تضمين خرائط Google), `socialLinks:[{ platform, url, order }]`, `updatedAt`, `updatedBy` |
| `submissions` | `type: "contact" \| "enrollment"`, `name`, `phone`, `email`, `serviceOfInterest?`, `message`, `status: "new" \| "in_progress" \| "done"`, `createdAt`, `handledBy?`, `notes?` |
| `adminUsers` | `email` (unique), `passwordHash`, `role: "ADMIN"`, `refreshTokenHash?`, `lastLoginAt?`, `createdAt` |
| `mediaAssets` | `url`, `storageKey`, `originalName`, `mimeType`, `sizeBytes`, `width?`, `height?`, `uploadedBy`, `createdAt` |

**Indexes:** `slug` فريد لكل مجموعة برامج/خدمات · `submissions.createdAt` تنازلي · `submissions.status` · `adminUsers.email` فريد · `order` على كل مجموعة قابلة للترتيب.

## 5. Backend API (NestJS + Mongoose)

### Modules
`AuthModule` · `PagesModule` · `StatsModule` · `LanguageProgramsModule` · `CorporateProgramsModule` · `EducationalServicesModule` · `TrainersModule` · `TestimonialsModule` · `PartnersModule` · `MembershipModule` · `ContactModule` · `SubmissionsModule` · `MediaModule` · `HealthModule`

### Public endpoints (بلا مصادقة)
```
GET  /api/pages/:key
GET  /api/stats
GET  /api/language-programs            ?category=english-track|other-language
GET  /api/corporate-programs
GET  /api/educational-services
GET  /api/trainers
GET  /api/testimonials
GET  /api/partners
GET  /api/membership
GET  /api/contact-info
POST /api/submissions                  { type, name, phone, email, serviceOfInterest?, message }
GET  /api/health
```

### Auth endpoints
```
POST /api/auth/login                   { email, password }  → { accessToken, refreshToken }
POST /api/auth/refresh                  { refreshToken }
POST /api/auth/logout                  (JWT)
GET  /api/auth/me                       (JWT)
```

### Admin endpoints (JWT + RolesGuard: ADMIN)
```
# لكل كيان محتوى: pages, stats, language-programs, corporate-programs,
# educational-services, trainers, testimonials, partners, membership, contact-info
GET    /api/admin/<entity>
GET    /api/admin/<entity>/:id
POST   /api/admin/<entity>
PATCH  /api/admin/<entity>/:id
DELETE /api/admin/<entity>/:id
PATCH  /api/admin/<entity>/reorder     { items: [{ id, order }] }

# submissions
GET    /api/admin/submissions          ?status=&type=&page=&limit=
PATCH  /api/admin/submissions/:id      { status, notes }
GET    /api/admin/submissions/export   → CSV

# media
POST   /api/admin/media                (multipart) → mediaAsset
GET    /api/admin/media                ?page=&limit=
DELETE /api/admin/media/:id
```

### Cross-cutting
- DTO + `class-validator` على كل مدخل. `ValidationPipe` عام (whitelist + forbidNonWhitelisted).
- Swagger على `/api/docs` يغطي كل Endpoint.
- Rate limiting (`@nestjs/throttler`) على `/api/auth/login` و `/api/submissions`.
- Helmet + CORS مضبوط لأصل الواجهة فقط.
- `GlobalExceptionFilter` بصيغة خطأ موحّدة.
- Seed script: admin افتراضي + محتوى placeholder لكل الصفحات والكيانات.

## 6. الداشبورد (Admin SPA)

- شاشة Login (بريد/كلمة مرور، معالجة قفل بعد محاولات فاشلة).
- تخطيط: Sidebar بهوية LMC (ليست رمادية عامة)، رأس فيه تبديل اللغة + خروج.
- شاشات:
  - **نظرة عامة**: عدّادات (رسائل جديدة، عناصر منشورة/مسودة).
  - **الصفحات**: محرّر أقسام لكل صفحة (عربي/إنجليزي جنباً إلى جنب) + معاينة.
  - **الإحصائيات**: نموذج واحد للأرقام الأربعة.
  - **البرامج اللغوية / برامج الشركات / الخدمات التعليمية / المدربون / الآراء / الشركاء**: جداول + CRUD + Drag&Drop لإعادة الترتيب + رفع صورة مع معاينة قبل الحفظ + تبديل نشر/مسودة.
  - **محتوى العضوية**: محرّر نصي ثنائي اللغة.
  - **معلومات التواصل**: هاتف/واتساب/إيميل/عنوان (ثنائي اللغة)/رابط خريطة + قائمة روابط تواصل اجتماعي (إضافة/حذف).
  - **الرسائل**: جدول مع فلترة بالحالة/النوع، تفاصيل، تغيير الحالة، ملاحظات، **تصدير CSV**.
  - **مكتبة الوسائط**: شبكة صور، رفع، حذف.
- كل تعديل ينعكس فوراً على الموقع العام (لا كاش عدواني؛ أو إبطال كاش عند الكتابة).

## 7. Tech Stack (نهائي)

| الطبقة | التقنية |
|---|---|
| Backend | NestJS 11 (TypeScript) |
| DB | MongoDB — التطوير المحلي على **Atlas M0 مجاني** (بلا استهلاك على الجهاز)؛ بديل offline: `npm run db` (mongodb-memory-server) أو `docker compose up -d mongo`. الإنتاج على Hostinger بخادم MongoDB حقيقي |
| ODM | Mongoose + `@nestjs/mongoose` |
| Frontend عام | React 19 (TS) + Vite |
| Frontend داشبورد | نفس تطبيق Vite، مسار `/leaderrami` محمي |
| التنسيق | Tailwind CSS + Design System خاص بـ LMC (Tokens قبل أي صفحة) |
| النماذج | react-hook-form + zod |
| التوجيه | react-router-dom |
| HTTP | axios (interceptor للـ refresh token) |
| i18n | react-i18next |
| المصادقة | JWT + Refresh، `@nestjs/jwt` + `passport-jwt` |
| رفع الملفات | Multer → تخزين محلي خلف `StorageService` |
| الحاويات | اختيارية للتطوير المحلي (خفّة على الجهاز) — `docker-compose.yml` متاح لمن يريده. مستخدمة للإنتاج على Hostinger |
| التوثيق | Swagger/OpenAPI على `/api/docs` |
| النشر | Hostinger VPS، Nginx + Certbot |

## 8. معايير القبول

- [ ] كل قسم في وثيقة المتطلبات موجود وقابل للتعديل من الداشبورد بلا كود.
- [ ] لا رقم إحصائي متضارب بين الصفحات (مصدر واحد `siteStats`).
- [ ] الألوان مطابقة 100% لأكواد Hex، بلا ذهبي.
- [ ] التصميم لا يعطي انطباع "قالب جاهز".
- [ ] نموذج التواصل يُحفظ في قاعدة البيانات ويظهر في الداشبورد.
- [ ] الموقع يعمل على الجوال والتابلت وسطح المكتب.
- [ ] كل الأسئلة المفتوحة في القسم 2 مُجابة وموثّقة (هذه الوثيقة).

## 9. خارج نطاق MVP (يتطلب موافقة صريحة لاحقاً)

دفع إلكتروني · بوابة طالب/حسابات عامة · منطق نقاط تلقائي · مستوى Editor · تكامل S3 فعلي · مدوّنة/أخبار · بحث · إشعارات بريد للأدمن · تحليلات · Multi-tenant.
