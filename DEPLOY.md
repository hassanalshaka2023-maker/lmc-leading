# دليل النشر

## المعمارية

الفرونت والباك بينشروا بمكانين مختلفين، وهذا مقصود:

```
المتصفح
  ├── lmc.example.com      → Vercel   (React SPA، ملفات ثابتة)
  └── api.example.com      → VPS      (Nginx → NestJS → MongoDB)
                                       الملفات المرفوعة على قرص الـ VPS
```

**ليش الباك مش على Vercel؟** `StorageService` بيكتب الملفات المرفوعة على القرص
المحلي، ونظام ملفات Vercel للقراءة فقط ومؤقت — مكتبة الوسائط بالداشبورد بتتعطّل.
وكمان Vercel ما بيستضيف MongoDB.

---

## الجزء الأول — الباك اند على الـ VPS

### 1. متطلبات السيرفر

- **2 vCPU / 4GB RAM / 40GB SSD** — كافية بشكل مريح
- Ubuntu 22.04 أو 24.04
- صلاحيات root

### 2. تركيب Docker

```bash
ssh root@SERVER_IP
curl -fsSL https://get.docker.com | sh
docker --version && docker compose version
```

### 3. ربط الدومين (DNS)

من لوحة مسجّل الدومين، أضف سجلّين:

| النوع | الاسم | القيمة |
|---|---|---|
| A | `api` | `SERVER_IP` |
| A أو CNAME | `@` أو `www` | (قيم Vercel — الجزء الثاني) |

تأكّد إن الـ DNS انتشر **قبل** ما تطلب الشهادة، وإلا Certbot رح يفشل:

```bash
dig +short api.example.com     # لازم يرجّع SERVER_IP
```

### 4. جلب الكود وضبط البيئة

```bash
git clone <REPO_URL> /opt/lmc && cd /opt/lmc
cp .env.production.example .env.production

# ولّد مفتاحين مختلفين
openssl rand -hex 48        # → JWT_ACCESS_SECRET
openssl rand -hex 48        # → JWT_REFRESH_SECRET
openssl rand -hex 24        # → MONGO_ROOT_PASSWORD

nano .env.production        # املأ كل قيم CHANGE_ME
```

قيمتان دقيقتان لازم تظبطهم صح:

- `CORS_ORIGIN` — دومين الفرونت، **بدون سلاش بالنهاية**. حطّ دوميناتك وvercel.app
  مفصولين بفاصلة. غلط هون = كل طلبات الموقع بتفشل بالمتصفح.
- `STORAGE_PUBLIC_BASE_URL` — `https://api.example.com/uploads`. غلط هون = الصور
  المرفوعة ما بتظهر.

### 5. استبدل الدومين بإعداد Nginx

```bash
sed -i 's/API_DOMAIN_PLACEHOLDER/api.example.com/g' deploy/nginx/*.conf*
```

### 6. الإقلاع الأول (HTTP فقط)

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
docker compose -f docker-compose.prod.yml ps
curl http://api.example.com/api/health      # لازم: {"status":"ok","db":"connected"}
```

إذا فشل، شوف السبب: `docker compose -f docker-compose.prod.yml logs backend`

### 7. زراعة البيانات

الحاوية الإنتاجية ما فيها Nest CLI (منحذف بـ `npm prune`)، فشغّل السكربت المبني مباشرة:

```bash
docker compose -f docker-compose.prod.yml exec backend node dist/database/seed.js
```

السكربت idempotent — بيقدر ينعاد بلا ضرر.

### 8. شهادة SSL

```bash
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot -w /var/www/certbot \
  -d api.example.com \
  --email YOUR_EMAIL --agree-tos --no-eff-email

# فعّل إعداد HTTPS
mv deploy/nginx/api-ssl.conf.template deploy/nginx/api.conf
docker compose -f docker-compose.prod.yml restart nginx

curl https://api.example.com/api/health
```

التجديد تلقائي — حاوية `certbot` بتفحص كل ١٢ ساعة.

### 9. الجدار الناري

```bash
ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
```

MongoDB **ما بينعرض على الإنترنت** أصلاً — ما إلها `ports:` بملف compose، بتشتغل
على شبكة Docker الداخلية فقط.

### 10. أغلق Swagger (مهم)

`/api/docs` بينعرض للعامة بالإنتاج. إما احظره من Nginx أو اجعله شرطيّاً بالكود.
أبسط حل — أضف داخل بلوك الـ `server` بـ `deploy/nginx/api.conf`:

```nginx
location /api/docs { return 404; }
```

---

## الجزء الثاني — الفرونت على Vercel

1. **New Project** → استورد المستودع من GitHub.
2. **Root Directory: `frontend`** ← أهم إعداد. بدونه البناء بيفشل.
   البقية بتنقرأ من `frontend/vercel.json`.
3. **Environment Variables** — أضف:

   | المتغيّر | القيمة |
   |---|---|
   | `VITE_API_BASE_URL` | `https://api.example.com/api` |

   **هذا إلزامي.** بالتطوير Vite بيعمل proxy لـ `/api`، وهذا الـ proxy **غير موجود
   على Vercel**. بدون المتغيّر، الطلبات بتروح لـ Vercel نفسه وبترجع 404.

   متغيّرات Vite بتنحقن **وقت البناء** — أي تعديل عليها بدّو إعادة deploy.

4. **Deploy**، وبعدين **Settings → Domains** → أضف دومينك واتبع سجلات DNS.
5. رجّع لـ `.env.production` على السيرفر وتأكد إن `CORS_ORIGIN` فيه الدومين النهائي، ثم:

   ```bash
   docker compose -f docker-compose.prod.yml --env-file .env.production up -d
   ```

---

## التحقق النهائي

```bash
curl https://api.example.com/api/health          # {"status":"ok","db":"connected"}
curl https://api.example.com/api/language-programs | head -c 200
```

ثم بالمتصفح: افتح الموقع، افتح **DevTools → Network**، وتأكّد إن طلبات الـ API
رايحة لـ `api.example.com` وراجعة **200** مش أخطاء CORS. جرّب `/leaderrami` وسجّل دخول،
وارفع صورة من مكتبة الوسائط وتأكّد إنها بتظهر.

---

## التحديثات اللاحقة

```bash
cd /opt/lmc && git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

الفرونت بينبني تلقائياً على Vercel مع كل push.

## النسخ الاحتياطي

```bash
# قاعدة البيانات
docker compose -f docker-compose.prod.yml exec -T mongo \
  mongodump --archive --username "$MONGO_ROOT_USER" --password "$MONGO_ROOT_PASSWORD" \
  --authenticationDatabase admin > lmc-$(date +%F).archive

# الملفات المرفوعة
docker run --rm -v lmc_backend_uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

**الملفات المرفوعة موجودة بمكان واحد فقط — على الـ VPS.** خُذ نسخة احتياطية دورية.
