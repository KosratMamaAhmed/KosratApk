// Node.js Backend API for Kurd App Store
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create necessary directories
const uploadsDir = path.join(__dirname, '../uploads');
const apksDir = path.join(uploadsDir, 'apks');
const imagesDir = path.join(uploadsDir, 'images');

fs.ensureDirSync(uploadsDir);
fs.ensureDirSync(apksDir);
fs.ensureDirSync(imagesDir);

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'apk') {
            cb(null, apksDir);
        } else {
            cb(null, imagesDir);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'apk') {
            if (file.mimetype === 'application/vnd.android.package-archive' || 
                path.extname(file.originalname).toLowerCase() === '.apk') {
                cb(null, true);
            } else {
                cb(new Error('Only APK files are allowed'));
            }
        } else {
            if (file.mimetype.startsWith('image/')) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed'));
            }
        }
    }
});

// Data storage (in production, use a proper database)
let appsData = [
    {
        id: 1,
        name: 'کورد گەیم',
        logo: '/uploads/images/kurd-game-logo.png',
        description: 'یارییەکی جوان بۆ فێربوونی زمانی کوردی',
        screenshots: ['/uploads/images/kurd-game-1.png', '/uploads/images/kurd-game-2.png'],
        releaseDate: '2024-01-15',
        downloads: 12345,
        size: '25 MB',
        category: 'games',
        featured: true,
        pinned: false,
        apkPath: '/uploads/apks/kurd-game.apk',
        status: 'active'
    },
    {
        id: 2,
        name: 'کورد چات',
        logo: '/uploads/images/kurd-chat-logo.png',
        description: 'ئەپی پەیوەندیکردن بۆ کوردان',
        screenshots: ['/uploads/images/kurd-chat-1.png', '/uploads/images/kurd-chat-2.png'],
        releaseDate: '2024-02-20',
        downloads: 54321,
        size: '50 MB',
        category: 'social',
        featured: false,
        pinned: true,
        apkPath: '/uploads/apks/kurd-chat.apk',
        status: 'active'
    }
];

let categoriesData = [
    { id: 'games', name: 'یارییەکان', icon: 'fas fa-gamepad' },
    { id: 'social', name: 'کۆمەڵایەتی', icon: 'fas fa-users' },
    { id: 'education', name: 'پەروەردە', icon: 'fas fa-graduation-cap' },
    { id: 'business', name: 'بازرگانی', icon: 'fas fa-briefcase' },
    { id: 'entertainment', name: 'کاتبەسەربردن', icon: 'fas fa-film' }
];

let adsData = [
    {
        id: 1,
        title: 'ڕیکلامی تایبەت',
        content: 'ئەمە ڕیکلامێکی نموونەیە',
        image: '/uploads/images/ad-banner.png',
        link: '#',
        active: true
    }
];

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Routes

// Public routes
app.get('/api/apps', (req, res) => {
    const publicApps = appsData.map(app => ({
        ...app,
        apkPath: undefined // Don't expose APK path to public
    }));
    res.json(publicApps);
});

app.get('/api/categories', (req, res) => {
    res.json(categoriesData);
});

app.get('/api/ads', (req, res) => {
    const activeAds = adsData.filter(ad => ad.active);
    res.json(activeAds);
});

// Download APK
app.get('/api/download/:appId', (req, res) => {
    const appId = parseInt(req.params.appId);
    const app = appsData.find(a => a.id === appId);
    
    if (!app) {
        return res.status(404).json({ message: 'App not found' });
    }
    
    const apkPath = path.join(__dirname, '..', app.apkPath);
    
    if (!fs.existsSync(apkPath)) {
        return res.status(404).json({ message: 'APK file not found' });
    }
    
    // Increment download count
    app.downloads++;
    
    res.download(apkPath, `${app.name}.apk`);
});

// Admin authentication
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (password === adminPassword) {
        const token = jwt.sign(
            { admin: true }, 
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );
        
        res.json({ 
            message: 'Login successful', 
            token: token 
        });
    } else {
        res.status(401).json({ message: 'Invalid password' });
    }
});

// Admin routes (protected)
app.get('/api/admin/apps', authenticateAdmin, (req, res) => {
    res.json(appsData);
});

app.post('/api/admin/apps', authenticateAdmin, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'apk', maxCount: 1 },
    { name: 'screenshots', maxCount: 10 }
]), (req, res) => {
    try {
        const { name, description, category, featured, pinned } = req.body;
        
        if (!req.files.logo || !req.files.apk) {
            return res.status(400).json({ message: 'Logo and APK files are required' });
        }
        
        const logoPath = '/uploads/images/' + req.files.logo[0].filename;
        const apkPath = '/uploads/apks/' + req.files.apk[0].filename;
        
        const screenshots = req.files.screenshots ? 
            req.files.screenshots.map(file => '/uploads/images/' + file.filename) : [];
        
        // Get APK file size
        const apkFilePath = path.join(__dirname, '..', apkPath);
        const stats = fs.statSync(apkFilePath);
        const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(1);
        
        const newApp = {
            id: Date.now(),
            name,
            description,
            category,
            logo: logoPath,
            apkPath,
            screenshots,
            size: `${fileSizeInMB} MB`,
            releaseDate: new Date().toISOString().split('T')[0],
            downloads: 0,
            featured: featured === 'true',
            pinned: pinned === 'true',
            status: 'active'
        };
        
        appsData.push(newApp);
        
        res.json({ 
            message: 'App uploaded successfully', 
            app: newApp 
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

app.put('/api/admin/apps/:id', authenticateAdmin, (req, res) => {
    const appId = parseInt(req.params.id);
    const appIndex = appsData.findIndex(app => app.id === appId);
    
    if (appIndex === -1) {
        return res.status(404).json({ message: 'App not found' });
    }
    
    appsData[appIndex] = { ...appsData[appIndex], ...req.body };
    
    res.json({ 
        message: 'App updated successfully', 
        app: appsData[appIndex] 
    });
});

app.delete('/api/admin/apps/:id', authenticateAdmin, (req, res) => {
    const appId = parseInt(req.params.id);
    const appIndex = appsData.findIndex(app => app.id === appId);
    
    if (appIndex === -1) {
        return res.status(404).json({ message: 'App not found' });
    }
    
    const app = appsData[appIndex];
    
    // Delete associated files
    try {
        if (app.logo) fs.unlinkSync(path.join(__dirname, '..', app.logo));
        if (app.apkPath) fs.unlinkSync(path.join(__dirname, '..', app.apkPath));
        app.screenshots.forEach(screenshot => {
            fs.unlinkSync(path.join(__dirname, '..', screenshot));
        });
    } catch (error) {
        console.log('Error deleting files:', error.message);
    }
    
    appsData.splice(appIndex, 1);
    
    res.json({ message: 'App deleted successfully' });
});

// Categories management
app.get('/api/admin/categories', authenticateAdmin, (req, res) => {
    res.json(categoriesData);
});

app.post('/api/admin/categories', authenticateAdmin, (req, res) => {
    const { name, icon } = req.body;
    
    const newCategory = {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name,
        icon: icon || 'fas fa-folder'
    };
    
    categoriesData.push(newCategory);
    
    res.json({ 
        message: 'Category added successfully', 
        category: newCategory 
    });
});

app.delete('/api/admin/categories/:id', authenticateAdmin, (req, res) => {
    const categoryId = req.params.id;
    const categoryIndex = categoriesData.findIndex(cat => cat.id === categoryId);
    
    if (categoryIndex === -1) {
        return res.status(404).json({ message: 'Category not found' });
    }
    
    categoriesData.splice(categoryIndex, 1);
    
    res.json({ message: 'Category deleted successfully' });
});

// Ads management
app.get('/api/admin/ads', authenticateAdmin, (req, res) => {
    res.json(adsData);
});

app.post('/api/admin/ads', authenticateAdmin, upload.single('image'), (req, res) => {
    const { title, content, link } = req.body;
    
    const imagePath = req.file ? '/uploads/images/' + req.file.filename : null;
    
    const newAd = {
        id: Date.now(),
        title,
        content,
        image: imagePath,
        link: link || '#',
        active: true
    };
    
    adsData.push(newAd);
    
    res.json({ 
        message: 'Ad added successfully', 
        ad: newAd 
    });
});

app.delete('/api/admin/ads/:id', authenticateAdmin, (req, res) => {
    const adId = parseInt(req.params.id);
    const adIndex = adsData.findIndex(ad => ad.id === adId);
    
    if (adIndex === -1) {
        return res.status(404).json({ message: 'Ad not found' });
    }
    
    const ad = adsData[adIndex];
    
    // Delete associated image
    if (ad.image) {
        try {
            fs.unlinkSync(path.join(__dirname, '..', ad.image));
        } catch (error) {
            console.log('Error deleting image:', error.message);
        }
    }
    
    adsData.splice(adIndex, 1);
    
    res.json({ message: 'Ad deleted successfully' });
});

// Statistics
app.get('/api/admin/stats', authenticateAdmin, (req, res) => {
    const stats = {
        totalApps: appsData.length,
        totalDownloads: appsData.reduce((sum, app) => sum + app.downloads, 0),
        totalCategories: categoriesData.length,
        totalAds: adsData.length,
        featuredApps: appsData.filter(app => app.featured).length,
        pinnedApps: appsData.filter(app => app.pinned).length
    };
    
    res.json(stats);
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'File too large' });
        }
    }
    
    res.status(500).json({ message: error.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

