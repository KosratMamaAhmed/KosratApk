# کورد ئەپ ستۆر - Kurd App Store

ئەپ ستۆرێکی تەواو بۆ بەڕێوەبردن و دابەشکردنی ئەپە کوردییەکان بە تایبەتمەندی PWA و ئەدمین پانێڵی پێشکەوتوو.

## تایبەتمەندییەکان

### 🎯 تایبەتمەندییە سەرەکییەکان
- **داشبۆردی جوان**: دیزاینی مۆدێرن و ڕەسپۆنسیڤ
- **PWA تایبەتمەندی**: دامەزراندنی ئەپ لە مۆبایل و دێسکتۆپ
- **فۆنتی کوردی**: بەکارهێنانی فۆنتی Noto Sans Arabic Regular
- **Progress Bar**: نیشاندانی ڕێژەی داونلۆد بە ڕاستەوخۆ
- **کاتەگۆری**: پۆلبەندی ئەپەکان بە جۆرەکانی جیاواز

### 🔧 ئەدمین پانێڵ
- **چوونەژوورەوە**: بە environment variable پارێزراو
- **بەڕێوەبردنی ئەپەکان**: زیادکردن، دەستکاری، سڕینەوە
- **Pin کردن**: تایبەتکردنی ئەپە گرنگەکان
- **بەڕێوەبردنی ڕیکلام**: زیادکردن و بەڕێوەبردنی ڕیکلامەکان
- **بەڕێوەبردنی پۆلەکان**: دروستکردن و بەڕێوەبردنی کاتەگۆرییەکان

### 🚀 تەکنەلۆژییەکان
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: JSON-based (قابل گۆڕین بۆ MongoDB/PostgreSQL)
- **Authentication**: JWT Token
- **File Upload**: Multer
- **Deployment**: Vercel

## ڕێکخستن و دامەزراندن

### پێشمەرجەکان
```bash
Node.js >= 14.0.0
npm یان yarn
```

### دامەزراندن
```bash
# کلۆنکردنی پڕۆژە
git clone [repository-url]
cd app-store-project

# دامەزراندنی dependencies
npm install

# ڕێکخستنی environment variables
cp .env.example .env
# دەستکاری کردنی .env فایل

# دەستپێکردنی سێرڤەر
npm start
```

### Environment Variables
```env
ADMIN_PASSWORD=admin123
JWT_SECRET=kurd-app-store-secret-key-2024
PORT=3000
MAX_FILE_SIZE=104857600
CORS_ORIGIN=*
```

## بەکارهێنان

### بۆ بەکارهێنەرانی ئاسایی
1. سەردانی ماڵپەڕ بکە
2. لە ئەپەکان بگەڕێ
3. ئەپی دڵخواز هەڵبژێرە
4. کلیک لە دوگمەی داونلۆد بکە
5. Progress bar چاودێری بکە

### بۆ ئەدمینەکان
1. بچۆ بۆ `/admin.html`
2. پاسوۆردی ئەدمین بنووسە
3. ئەپەکان بەڕێوە ببە:
   - ئەپی نوێ زیاد بکە
   - ئەپە هەبووەکان دەستکاری بکە
   - ئەپەکان pin بکە یان لە pin دەربهێنە
   - ڕیکلام و پۆلەکان بەڕێوە ببە

## ستراکچەری فایلەکان

```
app-store-project/
├── index.html              # لاپەڕەی سەرەکی
├── admin.html              # ئەدمین پانێڵ
├── style.css               # ستایلی سەرەکی
├── admin-style.css         # ستایلی ئەدمین پانێڵ
├── script.js               # جاڤاسکریپتی سەرەکی
├── admin-script.js         # جاڤاسکریپتی ئەدمین پانێڵ
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── api/
│   └── index.js            # باکێندی Node.js
├── uploads/
│   ├── apks/               # فایلە APK ەکان
│   └── images/             # وێنە و لۆگۆکان
├── package.json
├── vercel.json             # ڕێکخستنی Vercel
└── .env                    # Environment variables
```

## API Documentation

### Public Endpoints
- `GET /api/apps` - وەرگرتنی لیستی ئەپەکان
- `GET /api/categories` - وەرگرتنی لیستی پۆلەکان
- `GET /api/ads` - وەرگرتنی ڕیکلامە چالاکەکان
- `GET /api/download/:appId` - داونلۆدی ئەپ

### Admin Endpoints (پێویستی بە Authentication هەیە)
- `POST /api/admin/login` - چوونەژوورەوەی ئەدمین
- `GET /api/admin/apps` - وەرگرتنی هەموو ئەپەکان
- `POST /api/admin/apps` - زیادکردنی ئەپی نوێ
- `PUT /api/admin/apps/:id` - دەستکاریکردنی ئەپ
- `DELETE /api/admin/apps/:id` - سڕینەوەی ئەپ
- `GET /api/admin/categories` - بەڕێوەبردنی پۆلەکان
- `POST /api/admin/categories` - زیادکردنی پۆلی نوێ
- `DELETE /api/admin/categories/:id` - سڕینەوەی پۆل
- `GET /api/admin/ads` - بەڕێوەبردنی ڕیکلامەکان
- `POST /api/admin/ads` - زیادکردنی ڕیکلامی نوێ
- `DELETE /api/admin/ads/:id` - سڕینەوەی ڕیکلام
- `GET /api/admin/stats` - وەرگرتنی ئامارەکان

## دیپلۆی لە Vercel

### هەنگاوەکان
1. پڕۆژە push بکە بۆ GitHub
2. Vercel account دروست بکە
3. پڕۆژە import بکە لە Vercel
4. Environment variables دابنێ:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
5. Deploy بکە

### ڕێکخستنی Environment Variables لە Vercel
```bash
vercel env add ADMIN_PASSWORD
vercel env add JWT_SECRET
```

## بەشداری کردن

### گۆڕانکاری کردن
1. Fork کردنی پڕۆژە
2. Branch ی نوێ دروست بکە
3. گۆڕانکارییەکان جێبەجێ بکە
4. Pull Request بنێرە

### کێشەکان ڕاپۆرت بکە
لە GitHub Issues بەکار بهێنە بۆ ڕاپۆرتکردنی کێشەکان یان پێشنیارکردنی تایبەتمەندی نوێ.

## لایسەنس

MIT License - بڕوانە LICENSE فایل بۆ زانیاری زیاتر.

## پشتگیری

بۆ پشتگیری تەکنیکی:
- GitHub Issues بەکار بهێنە
- ئیمەیل بنێرە بۆ: support@kurdappstore.com

---

**تێبینی**: ئەم پڕۆژەیە بۆ کۆمەڵگای کوردی دروست کراوە بە مەبەستی پەرەپێدانی تەکنەلۆژیا بە زمانی کوردی.

"# KosratApk" 
