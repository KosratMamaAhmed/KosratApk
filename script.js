// PWA Installation
let deferredPrompt;
let installButton;

// Sample data for apps and categories
const categories = [
    { id: 'games', name: 'یارییەکان' },
    { id: 'social', name: 'کۆمەڵایەتی' },
    { id: 'education', name: 'پەروەردە' },
    { id: 'business', name: 'بازرگانی' },
    { id: 'entertainment', name: 'کاتبەسەربردن' }
];

const apps = [
    {
        id: 1,
        name: 'کورد گەیم',
        logo: 'https://via.placeholder.com/100',
        description: 'یارییەکی جوان بۆ فێربوونی زمانی کوردی',
        screenshots: ['https://via.placeholder.com/300x500', 'https://via.placeholder.com/300x500', 'https://via.placeholder.com/300x500'],
        releaseDate: '2024-01-15',
        downloads: 12345,
        size: '25 MB',
        category: 'games',
        featured: true,
        pinned: false
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
        pinned: true
    },
    {
        id: 3,
        name: 'کورد درس',
        logo: 'https://via.placeholder.com/100',
        description: 'ئەپی فێرکاری بۆ منداڵان',
        screenshots: ['https://via.placeholder.com/300x500', 'https://via.placeholder.com/300x500'],
        releaseDate: '2024-03-10',
        downloads: 8765,
        size: '30 MB',
        category: 'education',
        featured: true,
        pinned: false
    }
];

const advertisements = [
    {
        id: 1,
        title: 'ڕیکلامی تایبەت',
        content: 'ئەمە ڕیکلامێکی نموونەیە',
        image: 'https://via.placeholder.com/800x200',
        link: '#'
    }
];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupPWA();
    setupEventListeners();
});

function initializeApp() {
    loadCategories();
    loadFeaturedApps();
    loadAllApps();
    loadAdvertisements();
}

function loadCategories() {
    const categoriesDropdown = document.getElementById('categories-dropdown');
    const filterButtons = document.getElementById('filter-buttons');
    
    categories.forEach(category => {
        // Add to dropdown
        const dropdownItem = document.createElement('a');
        dropdownItem.href = '#';
        dropdownItem.textContent = category.name;
        dropdownItem.onclick = () => filterApps(category.id);
        categoriesDropdown.appendChild(dropdownItem);
        
        // Add to filter buttons
        const filterBtn = document.createElement('button');
        filterBtn.className = 'filter-btn';
        filterBtn.textContent = category.name;
        filterBtn.setAttribute('data-category', category.id);
        filterBtn.onclick = () => filterApps(category.id);
        filterButtons.appendChild(filterBtn);
    });
}

function loadFeaturedApps() {
    const featuredApps = document.getElementById('featured-apps');
    const featured = apps.filter(app => app.featured);
    
    featured.forEach(app => {
        const appCard = createAppCard(app, true);
        featuredApps.appendChild(appCard);
    });
}

function loadAllApps() {
    const appList = document.getElementById('app-list');
    appList.innerHTML = '';
    
    // Sort apps: pinned first, then by downloads
    const sortedApps = [...apps].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.downloads - a.downloads;
    });
    
    sortedApps.forEach(app => {
        const appCard = createAppCard(app);
        appList.appendChild(appCard);
    });
}

function createAppCard(app, isFeatured = false) {
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.setAttribute('data-category', app.category);
    
    const pinnedBadge = app.pinned ? '<span class="pinned-badge">📌</span>' : '';
    
    appCard.innerHTML = `
        ${pinnedBadge}
        <div class="app-header">
            <img src="${app.logo}" alt="${app.name}" class="app-logo">
            <div class="app-info">
                <h3>${app.name}</h3>
                <div class="app-meta">
                    <span><i class="fas fa-calendar"></i> ${app.releaseDate}</span>
                    <span><i class="fas fa-download"></i> ${app.downloads.toLocaleString()}</span>
                    <span><i class="fas fa-hdd"></i> ${app.size}</span>
                </div>
            </div>
        </div>
        <p class="app-description">${app.description}</p>
        <div class="screenshots">
            ${app.screenshots.map(screenshot => `<img src="${screenshot}" alt="Screenshot" onclick="openScreenshot('${screenshot}')">`).join('')}
        </div>
        <div class="download-progress">
            <div class="progress-bar-container">
                <div class="progress-bar" id="progress-${app.id}" style="width: 0%;"></div>
            </div>
            <span class="progress-text" id="progress-text-${app.id}">آماده بۆ داونلۆد</span>
        </div>
        <button class="download-btn" onclick="simulateDownload(${app.id})">
            <i class="fas fa-download"></i> داونلۆد
        </button>
    `;
    
    return appCard;
}

function loadAdvertisements() {
    const adSection = document.getElementById('ad-section');
    
    advertisements.forEach(ad => {
        const adBanner = document.createElement('div');
        adBanner.className = 'ad-banner';
        adBanner.innerHTML = `
            <h3>${ad.title}</h3>
            <p>${ad.content}</p>
            <img src="${ad.image}" alt="${ad.title}" style="max-width: 100%; border-radius: 10px; margin-top: 1rem;">
        `;
        adSection.appendChild(adBanner);
    });
}

function filterApps(category) {
    const appCards = document.querySelectorAll('.app-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category || (category === 'all' && btn.getAttribute('data-category') === 'all')) {
            btn.classList.add('active');
        }
    });
    
    // Filter apps
    appCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function simulateDownload(appId) {
    const progressBar = document.getElementById(`progress-${appId}`);
    const progressText = document.getElementById(`progress-text-${appId}`);
    const downloadBtn = progressBar.closest('.app-card').querySelector('.download-btn');
    
    downloadBtn.disabled = true;
    downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> داونلۆد دەکرێت...';
    
    let progress = 0;
    const interval = setInterval(() => {
        if (progress < 100) {
            progress += Math.random() * 15;
            if (progress > 100) progress = 100;
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${Math.round(progress)}%`;
        } else {
            clearInterval(interval);
            progressText.textContent = 'داونلۆد تەواو بوو! ✅';
            downloadBtn.innerHTML = '<i class="fas fa-check"></i> دامەزراند';
            downloadBtn.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
            
            // Update download count
            const app = apps.find(a => a.id === appId);
            if (app) {
                app.downloads++;
                // Update display
                const downloadCount = downloadBtn.closest('.app-card').querySelector('.app-meta span:nth-child(2)');
                downloadCount.innerHTML = `<i class="fas fa-download"></i> ${app.downloads.toLocaleString()}`;
            }
        }
    }, 200);
}

function openScreenshot(src) {
    // Create modal for screenshot viewing
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = src;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.onclick = () => document.body.removeChild(modal);
}

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const appCards = document.querySelectorAll('.app-card');
        
        appCards.forEach(card => {
            const appName = card.querySelector('h3').textContent.toLowerCase();
            const appDescription = card.querySelector('.app-description').textContent.toLowerCase();
            
            if (appName.includes(searchTerm) || appDescription.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterApps(category);
        });
    });
}

// PWA Setup
function setupPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    }
    
    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallButton();
    });
    
    // Handle PWA install
    window.addEventListener('appinstalled', () => {
        hideInstallButton();
        console.log('PWA was installed');
    });
    
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        hideInstallButton();
    }
}

function showInstallButton() {
    if (!installButton) {
        installButton = document.createElement('div');
        installButton.className = 'pwa-install-container';
        installButton.innerHTML = `
            <button class="pwa-install-btn" onclick="installPWA()">
                <i class="fas fa-download"></i>
                دامەزراندنی ئەپ
            </button>
        `;
        document.body.appendChild(installButton);
    }
}

function hideInstallButton() {
    if (installButton) {
        installButton.remove();
        installButton = null;
    }
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((result) => {
            if (result.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    }
}

// Utility functions
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}


