# ڕێبەری دیپلۆی - Deployment Guide

ئەم بەڵگەیە ڕێنمایی تەواو دەدات بۆ دیپلۆیکردنی کورد ئەپ ستۆر لە پلاتفۆرمە جیاوازەکان.

## دیپلۆی لە Vercel (پێشنیارکراو)

### هەنگاو بە هەنگاو

#### 1. ئامادەکردنی پڕۆژە
```bash
# دڵنیابوون لە تەواوی فایلەکان
ls -la
# دەبێت ئەم فایلانە هەبن:
# - index.html
# - admin.html
# - style.css, admin-style.css
# - script.js, admin-script.js
# - manifest.json, sw.js
# - api/index.js
# - package.json
# - vercel.json
# - .env
```

#### 2. ڕێکخستنی Git Repository
```bash
# دەستپێکردنی git (ئەگەر پێشتر نەکراوە)
git init

# زیادکردنی .gitignore
echo "node_modules/
.env
uploads/
server.log
*.log" > .gitignore

# زیادکردنی فایلەکان
git add .
git commit -m "Initial commit: Kurd App Store"

# پەیوەندیکردن بە GitHub
git remote add origin [your-github-repo-url]
git push -u origin main
```

#### 3. دیپلۆی لە Vercel
```bash
# دامەزراندنی Vercel CLI
npm install -g vercel

# چوونەژوورەوە
vercel login

# دیپلۆیکردن
vercel

# دانانی environment variables
vercel env add ADMIN_PASSWORD production
vercel env add JWT_SECRET production

# دیپلۆیکردنی کۆتایی
vercel --prod
```

#### 4. ڕێکخستنی Environment Variables لە Vercel Dashboard
1. بچۆ بۆ [vercel.com](https://vercel.com)
2. پڕۆژەکەت هەڵبژێرە
3. Settings > Environment Variables
4. ئەم variables انە زیاد بکە:
   - `ADMIN_PASSWORD`: پاسوۆردی ئەدمین
   - `JWT_SECRET`: کلیلی نهێنی بۆ JWT

### تاقیکردنەوەی دیپلۆی
```bash
# تاقیکردنەوەی API
curl https://your-app.vercel.app/api/apps

# تاقیکردنەوەی لاپەڕەی سەرەکی
curl https://your-app.vercel.app/
```

## دیپلۆی لە Netlify

### بۆ Static Frontend تەنها
```bash
# بیلدکردنی فایلە static ەکان
mkdir dist
cp index.html admin.html style.css admin-style.css script.js admin-script.js manifest.json sw.js dist/

# دیپلۆی لە Netlify
npm install -g netlify-cli
netlify login
netlify deploy --dir=dist
netlify deploy --prod --dir=dist
```

## دیپلۆی لە Heroku

### ئامادەکردن
```bash
# دامەزراندنی Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# چوونەژوورەوە
heroku login

# دروستکردنی ئەپ
heroku create kurd-app-store

# دانانی environment variables
heroku config:set ADMIN_PASSWORD=your-password
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
```

### ڕێکخستنی package.json بۆ Heroku
```json
{
  "scripts": {
    "start": "node api/index.js",
    "heroku-postbuild": "echo 'Build completed'"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

### دیپلۆی
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

## دیپلۆی لە DigitalOcean App Platform

### ڕێکخستن
1. بچۆ بۆ DigitalOcean App Platform
2. "Create App" کلیک بکە
3. GitHub repository هەڵبژێرە
4. ڕێکخستنەکان:
   - **Build Command**: `npm install`
   - **Run Command**: `node api/index.js`
   - **Environment Variables**: ADMIN_PASSWORD, JWT_SECRET

## دیپلۆی لە VPS (Ubuntu Server)

### ئامادەکردنی سێرڤەر
```bash
# نوێکردنەوەی سیستەم
sudo apt update && sudo apt upgrade -y

# دامەزراندنی Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# دامەزراندنی PM2
sudo npm install -g pm2

# دامەزراندنی Nginx
sudo apt install nginx -y
```

### ڕێکخستنی پڕۆژە
```bash
# کلۆنکردنی پڕۆژە
git clone [your-repo-url] /var/www/kurd-app-store
cd /var/www/kurd-app-store

# دامەزراندنی dependencies
npm install

# دروستکردنی .env فایل
sudo nano .env
# زیادکردنی environment variables

# دەستپێکردن بە PM2
pm2 start api/index.js --name "kurd-app-store"
pm2 startup
pm2 save
```

### ڕێکخستنی Nginx
```nginx
# /etc/nginx/sites-available/kurd-app-store
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# چالاککردنی site
sudo ln -s /etc/nginx/sites-available/kurd-app-store /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL Certificate (Let's Encrypt)

```bash
# دامەزراندنی Certbot
sudo apt install certbot python3-certbot-nginx -y

# وەرگرتنی SSL certificate
sudo certbot --nginx -d your-domain.com

# نوێکردنەوەی خۆکار
sudo crontab -e
# زیادکردنی ئەم لاینە:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## مۆنیتۆرینگ و لۆگەکان

### بۆ Vercel
```bash
# بینینی لۆگەکان
vercel logs [deployment-url]
```

### بۆ VPS
```bash
# بینینی لۆگەکانی PM2
pm2 logs kurd-app-store

# بینینی لۆگەکانی Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## باکئەپ و ڕیستۆر

### باکئەپکردنی داتا
```bash
# باکئەپی uploads فۆڵدەر
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz uploads/

# باکئەپی environment variables
cp .env .env.backup
```

### ڕیستۆرکردن
```bash
# ڕیستۆری uploads
tar -xzf uploads-backup-YYYYMMDD.tar.gz

# ڕیستۆری environment variables
cp .env.backup .env
```

## تڕابڵشووتینگ

### کێشە باوەکان

#### 1. Module Not Found
```bash
# چارەسەر
npm install
# یان
rm -rf node_modules package-lock.json
npm install
```

#### 2. Permission Denied
```bash
# چارەسەر
sudo chown -R $USER:$USER /var/www/kurd-app-store
chmod -R 755 /var/www/kurd-app-store
```

#### 3. Port Already in Use
```bash
# دۆزینەوەی پڕۆسەس
sudo lsof -i :3000
# کوشتنی پڕۆسەس
sudo kill -9 [PID]
```

#### 4. Environment Variables Not Loading
```bash
# دڵنیابوون لە .env فایل
cat .env
# دڵنیابوون لە require('dotenv').config()
```

## ئاسایش

### پێشنیارەکان
1. **پاسوۆردی بەهێز**: کەمتر لە 12 کاراکتەر نەبێت
2. **JWT Secret**: کاراکتەری ڕەندۆم بەکار بهێنە
3. **HTTPS**: هەمیشە SSL بەکار بهێنە
4. **Firewall**: تەنها پۆرتە پێویستەکان بکەرەوە
5. **نوێکردنەوە**: بەردەوام dependencies نوێ بکەرەوە

### مۆنیتۆرینگ
```bash
# چاودێری CPU و Memory
htop

# چاودێری Disk Space
df -h

# چاودێری Network
netstat -tulpn
```

---

**تێبینی**: هەمیشە پێش دیپلۆیکردن لە ژینگەی تاقیکردنەوە تەست بکە.

