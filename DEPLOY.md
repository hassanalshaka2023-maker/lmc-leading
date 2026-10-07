# دليل النشر

كل المشروع بينشر على سيرفر VPS واحد بحاويات Docker. السيرفر بيخدم مواقع تانية
بـ Nginx تبعه، فمشروعنا ما بياخد المنافذ 80/443 — بيشتغل على منافذ محليّة و
Nginx الموجود بيوجّه الدومين الفرعي إلها:

```
المتصفح → lmc.hopexcompany.com (443)
            └── Nginx تبع السيرفر  ← موقع الشركة بيضل شغّال جنبه
                 ├── /          → 127.0.0.1:8080  حاوية الواجهة (React مبنيّة)
                 ├── /api       → 127.0.0.1:3001  حاوية الـ API (NestJS)
                 └── /uploads   → 127.0.0.1:3001  الملفات المرفوعة (قرص السيرفر)
                                   └── MongoDB (حاوية داخلية، مش معروضة ع الإنترنت)
```

الموقع والـ API على نفس العنوان، فما في طلبات cross-origin ولا مشاكل CORS.

---

## 1. الدومين

لازم يكون سجل A للدومين الفرعي مأشّر على الـ IP تبع السيرفر:

| النوع | الاسم | القيمة |
|---|---|---|
| A | `lmc` | `SERVER_IP` |

**ممنوع** تستعمل شرطة سفلية `_` باسم الدومين — ما في جهة بتصدر شهادة SSL لاسم
فيه `_`. استعمل شرطة عادية `-` أو اسم بسيط.

```bash
dig +short lmc.hopexcompany.com     # لازم يرجّع SERVER_IP
```

## 2. Docker

```bash
ssh root@SERVER_IP
docker --version || curl -fsSL https://get.docker.com | sh
docker compose version
```

## 3. جلب الكود

```bash
git clone <REPO_URL> /opt/lmc && cd /opt/lmc
```

## 4. التنصيب

السكربت بيولّد كلمات السر، بيبني الحاويات، بيزرع البيانات، بيضيف إعداد Nginx
للدومين الفرعي (بدون ما يلمس المواقع التانية)، وبيركّب شهادة SSL:

```bash
bash deploy/setup-vps.sh lmc.hopexcompany.com you@example.com
```

**مهم:** أول مرة بيولّد `.env.production` وبيوقف ليخبرك تعدّل حساب المدير:

```bash
nano /opt/lmc/.env.production
#   SEED_ADMIN_EMAIL=بريدك
#   SEED_ADMIN_PASSWORD=كلمة سر قوية
```

بعدها أعد تشغيل السكربت. السكربت idempotent — بتقدر تعيده بلا ضرر.

### أو يدويّاً، خطوة خطوة

```bash
cp .env.production.example .env.production
openssl rand -hex 48        # → JWT_ACCESS_SECRET
openssl rand -hex 48        # → JWT_REFRESH_SECRET
openssl rand -hex 24        # → MONGO_ROOT_PASSWORD
nano .env.production        # املأ كل قيم CHANGE_ME وحط الدومين

docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
curl http://127.0.0.1:3001/api/health       # لازم: {"status":"ok","db":"connected"}

# زراعة البيانات — الحاوية الإنتاجية ما فيها Nest CLI، فشغّل السكربت المبني:
docker compose -f docker-compose.prod.yml exec backend node dist/database/seed.js

# إعداد Nginx
sed 's/DOMAIN_PLACEHOLDER/lmc.hopexcompany.com/g' deploy/nginx/lmc.conf \
  > /etc/nginx/sites-available/lmc
ln -sf /etc/nginx/sites-available/lmc /etc/nginx/sites-enabled/lmc
nginx -t && systemctl reload nginx

# شهادة SSL — Certbot بيعدّل إعداد Nginx لحاله ويضيف التحويل لـ https
apt install -y certbot python3-certbot-nginx
certbot --nginx -d lmc.hopexcompany.com --email you@example.com \
  --agree-tos --no-eff-email --redirect
```

التجديد تلقائي عن طريق مؤقّت certbot بالنظام.

قيمتان دقيقتان بـ `.env.production`:

- `CORS_ORIGIN` — دومينك، **بدون سلاش بالنهاية**.
- `STORAGE_PUBLIC_BASE_URL` — `https://lmc.hopexcompany.com/uploads`. غلط هون =
  الصور المرفوعة ما بتظهر.

## 5. الجدار الناري

المنافذ 80 و443 مفتوحة أصلاً للمواقع التانية. حاويات المشروع منشورة على
`127.0.0.1` بس، وMongoDB ما إلها `ports:` نهائياً — يعني ولا وحدة منهم معروضة
ع الإنترنت. و`/api/docs` (Swagger) محظور من Nginx.

---

## التحقق النهائي

```bash
curl https://lmc.hopexcompany.com/api/health            # {"status":"ok","db":"connected"}
curl https://lmc.hopexcompany.com/api/language-programs | head -c 200
curl -I https://hopexcompany.com                        # موقع الشركة لازم يضل شغّال
```

ثم بالمتصفح: افتح الموقع، افتح **DevTools → Network**، وتأكّد إن طلبات الـ API
راجعة **200**. جرّب `/leaderrami` وسجّل دخول، وارفع صورة من مكتبة الوسائط وتأكّد
إنها بتظهر.

---

## التحديثات اللاحقة

```bash
cd /opt/lmc && git pull
docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build
```

## النسخ الاحتياطي

```bash
cd /opt/lmc && set -a && . ./.env.production && set +a

# قاعدة البيانات
docker compose -f docker-compose.prod.yml exec -T mongo \
  mongodump --archive --username "$MONGO_ROOT_USER" --password "$MONGO_ROOT_PASSWORD" \
  --authenticationDatabase admin > lmc-$(date +%F).archive

# الملفات المرفوعة
docker run --rm -v lmc_backend_uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

**البيانات والملفات المرفوعة موجودة بمكان واحد فقط — على الـ VPS.** خُذ نسخة
احتياطية دورية.

## تغيير حساب المدير

حساب المدير بينزرع **مرة وحدة بس** — الزرع بيتخطّى الخطوة إذا في حساب موجود،
فتعديل `SEED_ADMIN_*` لحاله ما بيغيّر كلمة السر. لتعيين حساب جديد:

```bash
cd /opt/lmc
nano .env.production          # SEED_ADMIN_EMAIL و SEED_ADMIN_PASSWORD

set -a; . ./.env.production; set +a
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
docker compose -f docker-compose.prod.yml --env-file .env.production exec -T mongo \
  mongosh "mongodb://$MONGO_ROOT_USER:$MONGO_ROOT_PASSWORD@localhost:27017/$MONGO_DB_NAME?authSource=admin" \
  --quiet --eval 'db.adminusers.deleteMany({})'
docker compose -f docker-compose.prod.yml --env-file .env.production exec -T backend node dist/database/seed.js
```

بيحذف حسابات المدير بس — محتوى الموقع ما بينمس.
