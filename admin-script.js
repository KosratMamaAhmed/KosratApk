// Admin Panel JavaScript

// Global variables
let isLoggedIn = false;
let currentSection = 'dashboard';

// Sample data (in real app, this would come from backend)
let appsData = [
    {
        id: 1,
        name: 'کورد گەیم',
        logo: 'https://via.placeholder.com/100',
        description: 'یارییەکی جوان بۆ فێربوونی زمانی کوردی',
        screenshots: ['https://via.placeholder.com/300x500', 'https://via.placeholder.com/300x500'],
        releaseDate: '2024-01-15',
        downloads: 12345,
        size: '25 MB',
        category: 'games',
        featured: true,
        pinned: false,
        status: 'active'
    },
    {
        id: 2,
        name: 'کورد چات',
        logo: 'https://via.placeholder.com/100',
        description: 'ئەپی پەیوەندیکردن بۆ کوردان',
        screenshots: ['https://via.placeholder.com/300x500', 'https://via.placeholder.com/300x500'],
        releaseDate: '2024-02-20',
        downloads: 54321,
        size: '50 MB',
        category: 'social',
        featured: false,
        pinned: true,
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
        image: 'https://via.placeholder.com/800x200',
        link: '#',
        active: true
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
    setupEventListeners();
});

function initializeAdmin() {
    // Check if already logged in (in real app, check session/token)
    const savedLogin = localStorage.getItem('adminLoggedIn');
    if (savedLogin === 'true') {
        showDashboard();
    } else {
        showLoginModal();
    }
}

function setupEventListeners() {
    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Upload form
    document.getElementById('upload-form').addEventListener('submit', handleAppUpload);
    
    // Category form
    document.getElementById('category-form').addEventListener('submit', handleCategoryAdd);
    
    // Ad form
    document.getElementById('ad-form').addEventListener('submit', handleAdAdd);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    
    // In real app, this would be an environment variable check via backend
    // For demo purposes, using a simple check
    if (password === 'admin123' || password === process?.env?.ADMIN_PASSWORD) {
        isLoggedIn = true;
        localStorage.setItem('adminLoggedIn', 'true');
        showDashboard();
    } else {
        alert('پاسوۆردی هەڵە!');
    }
}

function logout() {
    isLoggedIn = false;
    localStorage.removeItem('adminLoggedIn');
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('admin-password').value = '';
}

function goToMainSite() {
    window.location.href = 'index.html';
}

// UI Functions
function showLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
    document.getElementById('admin-dashboard').classList.add('hidden');
}

function showDashboard() {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadDashboardData();
    showSection('dashboard');
}

function showSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionName) {
            item.classList.add('active');
        }
    });
    
    // Update content sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`${sectionName}-section`).classList.add('active');
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'apps':
            loadAppsTable();
            break;
        case 'upload':
            loadCategoriesForUpload();
            break;
        case 'categories':
            loadCategoriesGrid();
            break;
        case 'ads':
            loadAdsGrid();
            break;
    }
}

// Dashboard Functions
function loadDashboardData() {
    document.getElementById('total-apps').textContent = appsData.length;
    document.getElementById('total-downloads').textContent = appsData.reduce((sum, app) => sum + app.downloads, 0).toLocaleString();
    document.getElementById('total-categories').textContent = categoriesData.length;
    document.getElementById('total-ads').textContent = adsData.length;
}

// Apps Management
function loadAppsTable() {
    const tbody = document.getElementById('apps-table-body');
    tbody.innerHTML = '';
    
    appsData.forEach(app => {
        const row = document.createElement('tr');
        
        const statusBadges = [];
        if (app.featured) statusBadges.push('<span class="status-badge status-featured">تایبەت</span>');
        if (app.pinned) statusBadges.push('<span class="status-badge status-pinned">pin کراو</span>');
        if (statusBadges.length === 0) statusBadges.push('<span class="status-badge status-active">ئاسایی</span>');
        
        row.innerHTML = `
            <td><img src="${app.logo}" alt="${app.name}" class="app-logo-small"></td>
            <td>${app.name}</td>
            <td>${getCategoryName(app.category)}</td>
            <td>${app.downloads.toLocaleString()}</td>
            <td>${app.releaseDate}</td>
            <td>${statusBadges.join(' ')}</td>
            <td>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editApp(${app.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="togglePin(${app.id})">
                        <i class="fas fa-thumbtack"></i>
                    </button>
                    <button class="btn btn-sm btn-success" onclick="toggleFeatured(${app.id})">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteApp(${app.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getCategoryName(categoryId) {
    const category = categoriesData.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
}

function editApp(appId) {
    const app = appsData.find(a => a.id === appId);
    if (app) {
        // Fill upload form with app data
        document.getElementById('app-name').value = app.name;
        document.getElementById('app-category').value = app.category;
        document.getElementById('app-description').value = app.description;
        document.getElementById('app-featured').checked = app.featured;
        document.getElementById('app-pinned').checked = app.pinned;
        
        showSection('upload');
    }
}

function togglePin(appId) {
    const app = appsData.find(a => a.id === appId);
    if (app) {
        app.pinned = !app.pinned;
        loadAppsTable();
        showNotification(`ئەپ ${app.pinned ? 'pin کرا' : 'pin نەکرا'}`);
    }
}

function toggleFeatured(appId) {
    const app = appsData.find(a => a.id === appId);
    if (app) {
        app.featured = !app.featured;
        loadAppsTable();
        showNotification(`ئەپ ${app.featured ? 'وەک تایبەت دانرا' : 'لە تایبەتەکان لابرا'}`);
    }
}

function deleteApp(appId) {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم ئەپە؟')) {
        appsData = appsData.filter(a => a.id !== appId);
        loadAppsTable();
        loadDashboardData();
        showNotification('ئەپ بە سەرکەوتوویی سڕایەوە');
    }
}

// Upload Functions
function loadCategoriesForUpload() {
    const select = document.getElementById('app-category');
    select.innerHTML = '<option value="">پۆلێک هەڵبژێرە</option>';
    
    categoriesData.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function handleAppUpload(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('app-name').value);
    formData.append('category', document.getElementById('app-category').value);
    formData.append('description', document.getElementById('app-description').value);
    formData.append('logo', document.getElementById('app-logo').files[0]);
    formData.append('apk', document.getElementById('app-apk').files[0]);
    formData.append('featured', document.getElementById('app-featured').checked);
    formData.append('pinned', document.getElementById('app-pinned').checked);
    
    // Handle screenshots
    const screenshots = document.getElementById('app-screenshots').files;
    for (let i = 0; i < screenshots.length; i++) {
        formData.append('screenshots', screenshots[i]);
    }
    
    // In real app, send to backend API
    // For demo, add to local data
    const newApp = {
        id: Date.now(),
        name: formData.get('name'),
        category: formData.get('category'),
        description: formData.get('description'),
        logo: 'https://via.placeholder.com/100',
        screenshots: ['https://via.placeholder.com/300x500'],
        releaseDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        size: '25 MB',
        featured: formData.get('featured') === 'true',
        pinned: formData.get('pinned') === 'true',
        status: 'active'
    };
    
    appsData.push(newApp);
    document.getElementById('upload-form').reset();
    showNotification('ئەپ بە سەرکەوتوویی زیادکرا');
    loadDashboardData();
}

// Categories Management
function loadCategoriesGrid() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '';
    
    categoriesData.forEach(category => {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-header">
                <div>
                    <i class="${category.icon} category-icon"></i>
                    <h3>${category.name}</h3>
                </div>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editCategory('${category.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p>ژمارەی ئەپەکان: ${appsData.filter(app => app.category === category.id).length}</p>
        `;
        grid.appendChild(card);
    });
}

function showAddCategoryModal() {
    document.getElementById('category-modal').style.display = 'flex';
}

function closeCategoryModal() {
    document.getElementById('category-modal').style.display = 'none';
    document.getElementById('category-form').reset();
}

function handleCategoryAdd(e) {
    e.preventDefault();
    
    const name = document.getElementById('category-name').value;
    const icon = document.getElementById('category-icon').value || 'fas fa-folder';
    
    const newCategory = {
        id: name.toLowerCase().replace(/\s+/g, '_'),
        name: name,
        icon: icon
    };
    
    categoriesData.push(newCategory);
    closeCategoryModal();
    loadCategoriesGrid();
    loadCategoriesForUpload();
    showNotification('پۆل بە سەرکەوتوویی زیادکرا');
}

function editCategory(categoryId) {
    const category = categoriesData.find(cat => cat.id === categoryId);
    if (category) {
        document.getElementById('category-name').value = category.name;
        document.getElementById('category-icon').value = category.icon;
        showAddCategoryModal();
    }
}

function deleteCategory(categoryId) {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم پۆلە؟')) {
        categoriesData = categoriesData.filter(cat => cat.id !== categoryId);
        loadCategoriesGrid();
        showNotification('پۆل بە سەرکەوتوویی سڕایەوە');
    }
}

// Ads Management
function loadAdsGrid() {
    const grid = document.getElementById('ads-grid');
    grid.innerHTML = '';
    
    adsData.forEach(ad => {
        const card = document.createElement('div');
        card.className = 'ad-card';
        card.innerHTML = `
            <div class="ad-header">
                <h3>${ad.title}</h3>
                <div class="card-actions">
                    <button class="btn btn-sm btn-primary" onclick="editAd(${ad.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteAd(${ad.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <p>${ad.content}</p>
            <img src="${ad.image}" alt="${ad.title}" style="width: 100%; border-radius: 8px; margin-top: 1rem;">
            <p><strong>بەستەر:</strong> ${ad.link}</p>
            <p><strong>دۆخ:</strong> ${ad.active ? 'چالاک' : 'ناچالاک'}</p>
        `;
        grid.appendChild(card);
    });
}

function showAddAdModal() {
    document.getElementById('ad-modal').style.display = 'flex';
}

function closeAdModal() {
    document.getElementById('ad-modal').style.display = 'none';
    document.getElementById('ad-form').reset();
}

function handleAdAdd(e) {
    e.preventDefault();
    
    const newAd = {
        id: Date.now(),
        title: document.getElementById('ad-title').value,
        content: document.getElementById('ad-content').value,
        image: 'https://via.placeholder.com/800x200',
        link: document.getElementById('ad-link').value,
        active: true
    };
    
    adsData.push(newAd);
    closeAdModal();
    loadAdsGrid();
    loadDashboardData();
    showNotification('ڕیکلام بە سەرکەوتوویی زیادکرا');
}

function editAd(adId) {
    const ad = adsData.find(a => a.id === adId);
    if (ad) {
        document.getElementById('ad-title').value = ad.title;
        document.getElementById('ad-content').value = ad.content;
        document.getElementById('ad-link').value = ad.link;
        showAddAdModal();
    }
}

function deleteAd(adId) {
    if (confirm('دڵنیایت لە سڕینەوەی ئەم ڕیکلامە؟')) {
        adsData = adsData.filter(a => a.id !== adId);
        loadAdsGrid();
        loadDashboardData();
        showNotification('ڕیکلام بە سەرکەوتوویی سڕایەوە');
    }
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 10001;
        font-family: 'Noto Sans Arabic', sans-serif;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Export data for main site (in real app, this would be API calls)
function getAppsData() {
    return appsData;
}

function getCategoriesData() {
    return categoriesData;
}

function getAdsData() {
    return adsData;
}

