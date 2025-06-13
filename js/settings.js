// Settings functionality
class SettingsManager {
    constructor() {
        this.wallpapers = [
            { name: 'Greece', file: 'greece.webp' },
            { name: 'Game of Thrones', file: 'gameofthrones.webp' },
            { name: 'Colosseum', file: 'Colleseum.webp' },
            { name: 'Colosseum 2', file: 'Colluseum2.webp' },
            { name: 'Colosseum 3', file: 'Coluseum3.webp' },
            { name: 'Corfu Greece', file: 'CorfuGreece.webp' },
            { name: 'Corfu Greece 2', file: 'CorfuGreece2.webp' },
            { name: 'Rome', file: 'Rome.webp' },
            { name: 'Hawaii', file: 'Hawaii.webp' },
            { name: 'Croatia Beach', file: 'CroatiaBeach.webp' },
            { name: 'Colorado Springs', file: 'ColoradoSprings.webp' },
            { name: 'Ocean City MD', file: 'OceanCityMD.webp' }
        ];
        this.currentWallpaper = this.getDefaultWallpaper(); // Responsive default wallpaper
        this.init();
    }

    getDefaultWallpaper() {
        // Detect if mobile device
        const isMobile = window.innerWidth <= 768 || 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Return appropriate default wallpaper
        return isMobile ? 'CorfuGreece.webp' : 'ColoradoSprings.webp';
    }

    init() {
        this.loadWallpapers();
        this.bindEvents();
    }

    loadWallpapers() {
        const wallpaperGrid = document.getElementById('wallpaper-grid');
        if (!wallpaperGrid) return;

        // Set up the grid with fixed dimensions to prevent layout shifts
        wallpaperGrid.style.display = 'grid';
        wallpaperGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';
        wallpaperGrid.style.gap = '15px';
        wallpaperGrid.style.padding = '20px';
        wallpaperGrid.style.minHeight = '400px';
        wallpaperGrid.style.contain = 'layout style paint';
        wallpaperGrid.className = 'wallpaper-grid';

        wallpaperGrid.innerHTML = '';

        this.wallpapers.forEach(wallpaper => {
            const wallpaperOption = document.createElement('div');
            wallpaperOption.className = 'wallpaper-option';
            wallpaperOption.dataset.wallpaper = wallpaper.file;
            
            // Set fixed dimensions immediately to prevent shifts
            wallpaperOption.style.width = '140px';
            wallpaperOption.style.minHeight = '120px';
            wallpaperOption.style.maxHeight = '120px';
            wallpaperOption.style.contain = 'layout style paint';
            wallpaperOption.style.boxSizing = 'border-box';
            
            // Check if this is the current wallpaper
            if (wallpaper.file === this.currentWallpaper) {
                wallpaperOption.classList.add('selected');
            }

            // Use placeholder first, load actual image lazily with progressive loading
            const placeholder = Utils.ProgressiveImageLoader.createPlaceholder(120, 80, '#f0f0f0');
            
            wallpaperOption.innerHTML = `
                <img src="${placeholder}" 
                     data-src="images/wallpapers/${wallpaper.file}" 
                     alt="${wallpaper.name}" 
                     class="wallpaper-preview lazy-load"
                     width="120" 
                     height="80"
                     style="width: 120px !important; height: 80px !important; flex-shrink: 0; display: block;"
                     loading="lazy">
                <div class="wallpaper-name" style="height: 16px; line-height: 16px; overflow: hidden;">${wallpaper.name}</div>
            `;

            wallpaperOption.addEventListener('click', () => {
                this.selectWallpaper(wallpaper.file);
            });

            wallpaperGrid.appendChild(wallpaperOption);
        });

        // Initialize progressive lazy loading
        this.initProgressiveLazyLoading();
    }

    initProgressiveLazyLoading() {
        // Use Intersection Observer for lazy loading with progressive enhancement
        if ('IntersectionObserver' in window) {
            const lazyImageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const highResSrc = img.dataset.src;
                        
                        // Use progressive loading if network allows
                        if (Utils.NetworkMonitor.shouldUseHighQualityImages()) {
                            Utils.ProgressiveImageLoader.loadImageProgressive(img, highResSrc, {
                                onComplete: () => {
                                    img.classList.remove('lazy-load');
                                    observer.unobserve(img);
                                },
                                onError: () => {
                                    console.warn('Failed to load wallpaper preview:', highResSrc);
                                    observer.unobserve(img);
                                }
                            });
                        } else {
                            // For slow connections, use a simpler approach
                            img.src = highResSrc;
                            img.classList.remove('lazy-load');
                            observer.unobserve(img);
                        }
                    }
                });
            }, {
                // Load images when they're 200px from viewport (increased buffer for slow connections)
                rootMargin: '200px'
            });

            document.querySelectorAll('.lazy-load').forEach(img => {
                lazyImageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without Intersection Observer
            this.fallbackLazyLoad();
        }
    }

    fallbackLazyLoad() {
        // Simple fallback that loads images on scroll or after a delay
        const loadImagesOnScroll = () => {
            const lazyImages = document.querySelectorAll('.lazy-load');
            lazyImages.forEach(img => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-load');
                }
            });
        };

        // Load images on scroll
        window.addEventListener('scroll', loadImagesOnScroll, { passive: true });
        
        // Also load images after a delay (for settings window)
        setTimeout(loadImagesOnScroll, 1000);
    }

    selectWallpaper(wallpaperFile) {
        // Update visual selection
        const allOptions = document.querySelectorAll('.wallpaper-option');
        allOptions.forEach(option => option.classList.remove('selected'));
        
        const selectedOption = document.querySelector(`[data-wallpaper="${wallpaperFile}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
        }

        // Update desktop background
        this.changeDesktopBackground(wallpaperFile);
        
        // Store current selection
        this.currentWallpaper = wallpaperFile;
        this.saveWallpaperPreference(wallpaperFile);
    }

    changeDesktopBackground(wallpaperFile) {
        const desktop = document.getElementById('desktop');
        if (desktop) {
            desktop.style.backgroundImage = `url('images/wallpapers/${wallpaperFile}')`;
        }
    }

    saveWallpaperPreference(wallpaperFile) {
        // Save to localStorage for persistence
        try {
            localStorage.setItem('selectedWallpaper', wallpaperFile);
        } catch (e) {
            console.log('Could not save wallpaper preference:', e);
        }
    }

    loadWallpaperPreference() {
        // Load from localStorage
        try {
            const saved = localStorage.getItem('selectedWallpaper');
            if (saved && this.wallpapers.some(w => w.file === saved)) {
                this.currentWallpaper = saved;
                this.changeDesktopBackground(saved);
            } else {
                // No saved preference, use responsive default
                this.currentWallpaper = this.getDefaultWallpaper();
                this.changeDesktopBackground(this.currentWallpaper);
            }
        } catch (e) {
            console.log('Could not load wallpaper preference:', e);
            // Fallback to responsive default
            this.currentWallpaper = this.getDefaultWallpaper();
            this.changeDesktopBackground(this.currentWallpaper);
        }
    }

    // Method to dynamically detect new wallpapers
    async refreshWallpapers() {
        try {
            // This would need a server endpoint to list files
            // For now, we'll manually manage the list
            this.loadWallpapers();
        } catch (e) {
            console.log('Could not refresh wallpapers:', e);
        }
    }

    bindEvents() {
        // Handle settings window opening
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-app="settings"]')) {
                this.loadWallpapers(); // Refresh wallpapers when opening settings
            }
        });
    }

    // Method to add new wallpapers programmatically
    addWallpaper(name, filename) {
        this.wallpapers.push({ name: name, file: filename });
        this.loadWallpapers();
    }
}

// Initialize settings manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const settingsManager = new SettingsManager();
    
    // Load saved wallpaper preference
    settingsManager.loadWallpaperPreference();
    
    // Make it globally accessible for debugging
    window.settingsManager = settingsManager;
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} 