// Mobile Interface Handler for iPhone-style Experience
const MobileInterface = {
    // State management
    state: {
        isMobile: false,
        isInitialized: false,
        currentView: 'home',
        currentWallpaper: null,
        availableWallpapers: [
            { name: 'Default Gradient', file: null },
            { name: 'Greece', file: 'images/wallpapers/greece.webp' },
            { name: 'Game of Thrones', file: 'images/wallpapers/gameofthrones.webp' },
            { name: 'Colosseum', file: 'images/wallpapers/Colleseum.webp' },
            { name: 'Colosseum 2', file: 'images/wallpapers/Colluseum2.webp' },
            { name: 'Colosseum 3', file: 'images/wallpapers/Coluseum3.webp' },
            { name: 'Corfu Greece', file: 'images/wallpapers/CorfuGreece.webp' },
            { name: 'Corfu Greece 2', file: 'images/wallpapers/CorfuGreece2.webp' },
            { name: 'Rome', file: 'images/wallpapers/Rome.webp' },
            { name: 'Hawaii', file: 'images/wallpapers/Hawaii.webp' },
            { name: 'Croatia Beach', file: 'images/wallpapers/CroatiaBeach.webp' },
            { name: 'Colorado Springs', file: 'images/wallpapers/ColoradoSprings.webp' },
            { name: 'Ocean City MD', file: 'images/wallpapers/OceanCityMD.webp' }
        ],
        activeDropdown: null,
        batteryLevel: 84,
        batteryTimeRemaining: '6:42',
        wifiStrength: 3,
        connectedNetwork: 'KevinPlumlee_5G'
    },
    
    // Initialize mobile interface
    init() {
        this.detectMobileDevice();
                if (this.state.isMobile) {
            this.setupMobileInterface();
            this.setupMobileEventListeners();
            this.updateMobileTime();
            this.loadSavedWallpaper();
            this.state.isInitialized = true;
            
            // Double-check that mobile interface is visible
            setTimeout(() => {
                const homeScreen = Utils.dom.get('mobile-home-screen');
                const computedStyle = window.getComputedStyle(homeScreen);
                console.log('📱 Mobile home screen visibility check:', {
                    display: computedStyle.display,
                    visibility: computedStyle.visibility,
                    opacity: computedStyle.opacity,
                    zIndex: computedStyle.zIndex
                });
                
                if (computedStyle.display === 'none') {
                    console.warn('⚠️ Mobile home screen is hidden, forcing visibility...');
                    homeScreen.style.display = 'block';
                    homeScreen.style.visibility = 'visible';
                    homeScreen.style.opacity = '1';
                }
            }, 500);
            
            console.log('✅ Mobile interface initialized successfully');
        } else {
            console.log('🖥️ Desktop interface active - no mobile setup needed');
        }
    },
    
    // Detect if device is mobile
    detectMobileDevice() {
        const isMobileSize = window.innerWidth <= 680;
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Use size OR user agent for better detection
        this.state.isMobile = isMobileSize || (isMobileUserAgent && window.innerWidth <= 1024);
        
        // Update body class for mobile styling
        if (this.state.isMobile) {
            document.body.classList.add('mobile-interface');
            console.log('🔧 Mobile interface activated');
        } else {
            document.body.classList.remove('mobile-interface');
            console.log('🖥️ Desktop interface activated');
        }
        
        console.log('📱 Mobile detection:', {
            screenWidth: window.innerWidth,
            screenHeight: window.innerHeight,
            isMobileSize,
            isTouchDevice,
            isMobileUserAgent,
            finalDecision: this.state.isMobile
        });
    },
    
    // Setup mobile interface elements
    setupMobileInterface() {
        console.log('🔧 Setting up mobile interface...');
        
        // Show mobile home screen
        const mobileHomeScreen = Utils.dom.get('mobile-home-screen');
        if (mobileHomeScreen) {
            mobileHomeScreen.style.display = 'block';
            console.log('✅ Mobile home screen shown');
        } else {
            console.error('❌ Mobile home screen not found');
        }
        
        // Hide desktop elements
        const desktop = Utils.dom.get('desktop');
        const menuBar = Utils.dom.query('.menu-bar');
        const dock = Utils.dom.query('.dock');
        
        if (desktop) {
            desktop.style.display = 'none';
            console.log('✅ Desktop hidden');
        }
        if (menuBar) {
            menuBar.style.display = 'none';
            console.log('✅ Menu bar hidden');
        }
        if (dock) {
            dock.style.display = 'none';
            console.log('✅ Dock hidden');
        }
        
        // Update viewport for mobile
        this.updateViewportMeta();
        
        // Prevent zoom on input focus (iOS Safari)
        this.preventInputZoom();
        
        // Force body styling
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';
        
        console.log('✅ Mobile interface setup complete');
    },
    
    // Setup mobile event listeners
    setupMobileEventListeners() {
        console.log('📱 Setting up mobile event listeners');
        
        // iPhone app click handlers
        const iphoneApps = Utils.dom.queryAll('.iphone-app');
        iphoneApps.forEach(app => {
            Utils.dom.on(app, 'click', (e) => {
                e.preventDefault();
                this.handleAppClick(app.dataset.app);
            });
            
            // Add touch feedback
            Utils.dom.on(app, 'touchstart', () => {
                app.style.transform = 'scale(0.95)';
            });
            
            Utils.dom.on(app, 'touchend', () => {
                setTimeout(() => {
                    app.style.transform = 'scale(1)';
                }, 150);
            });
        });
        
        // iPhone back button handlers
        const backButtons = Utils.dom.queryAll('.iphone-back-button');
        backButtons.forEach(button => {
            Utils.dom.on(button, 'click', (e) => {
                e.preventDefault();
                this.handleBackButton();
            });
        });
        
        // Window resize handler
        Utils.dom.on(window, 'resize', () => {
            this.handleResize();
        });
        
        // Orientation change handler
        Utils.dom.on(window, 'orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Prevent default touch behaviors that might interfere
        Utils.dom.on(document, 'touchmove', (e) => {
            // Allow scrolling within scrollable containers
            const target = e.target;
            const scrollableParent = target.closest('.window-content, .mobile-home-screen');
            if (!scrollableParent) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Add long-press gesture to change wallpaper on home screen
        this.setupWallpaperGesture();
        
        // Setup mobile status bar interactions (new dropdown functionality)
        this.setupMobileStatusBarListeners();
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.mobile-dropdown') && !e.target.closest('.status-right')) {
                this.closeMobileDropdowns();
            }
        });
    },
    
    // Setup wallpaper gesture
    setupWallpaperGesture() {
        const homeScreen = Utils.dom.get('mobile-home-screen');
        if (!homeScreen) return;
        
        let longPressTimer;
        let startTouch = null;
        let isLongPressing = false;
        
        // Improved touch start handler
        const handleTouchStart = (e) => {
            // Only on background touches, not on apps
            if (e.target.closest('.iphone-app, .iphone-profile-card')) {
                return;
            }
            
            console.log('🎯 Touch start detected for wallpaper gesture');
            
            startTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
                time: Date.now()
            };
            
            isLongPressing = false;
            
            longPressTimer = setTimeout(() => {
                console.log('⏰ Long press detected, cycling wallpaper');
                isLongPressing = true;
                
                // Haptic feedback if available
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
                
                this.cycleWallpaper();
            }, 600); // Reduced from 800ms to 600ms for better responsiveness
        };
        
        // Improved touch move handler
        const handleTouchMove = (e) => {
            if (!startTouch || isLongPressing) return;
            
            const currentTouch = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
            
            const distance = Math.sqrt(
                Math.pow(currentTouch.x - startTouch.x, 2) + 
                Math.pow(currentTouch.y - startTouch.y, 2)
            );
            
            // Cancel long press if moved too much
            if (distance > 15) { // Increased threshold for better touch tolerance
                console.log('👆 Touch moved too much, cancelling long press');
                clearTimeout(longPressTimer);
                startTouch = null;
            }
        };
        
        // Improved touch end handler
        const handleTouchEnd = (e) => {
            clearTimeout(longPressTimer);
            
            if (isLongPressing) {
                console.log('✅ Long press completed');
                e.preventDefault();
                e.stopPropagation();
            }
            
            startTouch = null;
            isLongPressing = false;
        };
        
        // Remove existing listeners first
        homeScreen.removeEventListener('touchstart', this.boundTouchStart);
        homeScreen.removeEventListener('touchmove', this.boundTouchMove);
        homeScreen.removeEventListener('touchend', this.boundTouchEnd);
        
        // Bind the handlers to this context
        this.boundTouchStart = handleTouchStart.bind(this);
        this.boundTouchMove = handleTouchMove.bind(this);
        this.boundTouchEnd = handleTouchEnd.bind(this);
        
        // Add event listeners with optimized passive options
        homeScreen.addEventListener('touchstart', this.boundTouchStart, { passive: true });
        homeScreen.addEventListener('touchmove', this.boundTouchMove, { passive: true });
        homeScreen.addEventListener('touchend', this.boundTouchEnd, { passive: false }); // Only touchend needs to prevent default
        
        console.log('✅ Mobile wallpaper gesture setup complete');
    },
    
    // Handle app clicks
    handleAppClick(appName) {
        if (!appName) return;
        
        Utils.logger.debug(`Mobile app clicked: ${appName}`);
        
        // Handle special apps
        switch (appName) {
            case 'linkedin':
                window.open('https://linkedin.com/in/kevinplumlee', '_blank');
                break;
            case 'unlock-health':
                window.open('https://unlockhealth.com', '_blank');
                break;
            case 'settings':
                // Handle settings with mobile wallpaper options
                this.openSettingsApp();
                break;
            default:
                // Handle regular app windows
                this.openMobileApp(appName);
        }
    },
    
    // Open mobile app (full screen)
    async openMobileApp(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        if (!window) {
            Utils.logger.warn(`Window not found: ${appName}`);
            return;
        }
        
        try {
            // Load content first
            await ContentLoader.loadContent(appName);
            
            // Show the window with mobile animation
            this.showMobileWindow(window, appName);
            
            // Update state
            this.state.currentView = appName;
            
            // Hide home screen
            const homeScreen = Utils.dom.get('mobile-home-screen');
            if (homeScreen) {
                homeScreen.style.display = 'none';
            }
            
        } catch (error) {
            Utils.logger.error(`Failed to open mobile app ${appName}:`, error);
        }
    },
    
    // Show mobile window with animation
    showMobileWindow(window, appName) {
        // Remove any existing open windows
        Utils.dom.queryAll('.window').forEach(w => {
            w.classList.remove('open', 'active');
            w.style.transform = 'translateX(100%)';
        });
        
        // Show the new window
        window.classList.add('open', 'active');
        
        // Animate in from right
        window.style.transform = 'translateX(100%)';
        setTimeout(() => {
            window.style.transform = 'translateX(0)';
        }, 10);
        
        // Ensure content is scrollable
        setTimeout(() => {
            this.ensureContentScrollable(window);
        }, 300);
    },
    
    // Ensure window content is scrollable
    ensureContentScrollable(window) {
        const content = window.querySelector('.window-content');
        if (content) {
            content.style.overflowY = 'auto';
            content.style.height = 'calc(100vh - 60px)';
            content.scrollTop = 0;
        }
    },
    
    // Handle back button
    handleBackButton() {
        const activeWindow = Utils.dom.query('.window.active');
        if (activeWindow) {
            // Animate out to right
            activeWindow.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                activeWindow.classList.remove('open', 'active');
                
                // Show home screen
                const homeScreen = Utils.dom.get('mobile-home-screen');
                if (homeScreen) {
                    homeScreen.style.display = 'block';
                }
                
                this.state.currentView = 'home';
            }, 300);
        }
    },
    
    // Handle window resize
    handleResize() {
        const wasMobile = this.state.isMobile;
        this.detectMobileDevice();
        
        // If mobile state changed, reinitialize
        if (wasMobile !== this.state.isMobile) {
            if (this.state.isMobile) {
                this.setupMobileInterface();
            } else {
                this.teardownMobileInterface();
            }
        }
    },
    
    // Handle orientation change
    handleOrientationChange() {
        if (this.state.isMobile) {
            // Force a resize check
            setTimeout(() => {
                this.handleResize();
                this.updateMobileViewport();
            }, 200);
        }
    },
    
    // Update mobile viewport
    updateMobileViewport() {
        // Force viewport recalculation
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            const content = viewport.getAttribute('content');
            viewport.setAttribute('content', content + ', user-scalable=no');
            setTimeout(() => {
                viewport.setAttribute('content', content);
            }, 10);
        }
    },
    
    // Teardown mobile interface
    teardownMobileInterface() {
        // Hide mobile home screen
        const mobileHomeScreen = Utils.dom.get('mobile-home-screen');
        if (mobileHomeScreen) {
            mobileHomeScreen.style.display = 'none';
        }
        
        // Show desktop elements
        const desktop = Utils.dom.get('desktop');
        const menuBar = Utils.dom.query('.menu-bar');
        const dock = Utils.dom.query('.dock');
        
        if (desktop) desktop.style.display = 'block';
        if (menuBar) menuBar.style.display = 'flex';
        if (dock) dock.style.display = 'flex';
        
        // Close any open windows
        Utils.dom.queryAll('.window').forEach(window => {
            window.classList.remove('open', 'active');
            window.style.transform = '';
        });
        
        this.state.currentView = 'home';
    },
    
    // Update mobile time display
    updateMobileTime() {
        const updateTime = () => {
            const mobileTimeEl = Utils.dom.get('mobile-time');
            if (mobileTimeEl && this.state.isMobile) {
                const now = new Date();
                const timeString = now.toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });
                mobileTimeEl.textContent = timeString;
            }
            
            // Update detailed time if dropdown is open
            if (this.state.activeDropdown === 'time') {
                this.updateMobileDetailedTime();
            }
        };
        
        updateTime();
        setInterval(updateTime, 1000);
    },
    
    // Update viewport meta tag for mobile
    updateViewportMeta() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    },
    
    // Prevent input zoom on iOS
    preventInputZoom() {
        const inputs = Utils.dom.queryAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                input.style.fontSize = '16px';
            }
        });
    },
    
    // Public API methods
    isMobileView() {
        return this.state.isMobile;
    },
    
    getCurrentView() {
        return this.state.currentView;
    },
    
    // Force mobile mode (for testing)
    forceMobileMode(enabled = true) {
        this.state.isMobile = enabled;
        if (enabled) {
            this.setupMobileInterface();
            this.setupMobileEventListeners();
        } else {
            this.teardownMobileInterface();
        }
    },
    
    // Wallpaper management
    loadSavedWallpaper() {
        if (this.state.isMobile) {
            console.log('🎨 Loading saved wallpaper...');
            const savedWallpaper = localStorage.getItem('mobile-wallpaper');
            console.log('🎨 Saved wallpaper from storage:', savedWallpaper);
            
            if (savedWallpaper) {
                const wallpaper = this.state.availableWallpapers.find(w => w.file === savedWallpaper);
                if (wallpaper) {
                    console.log('🎨 Found saved wallpaper:', wallpaper.name);
                    this.setWallpaper(wallpaper);
                } else {
                    console.log('🎨 Saved wallpaper not found in available wallpapers, using random');
                    this.setRandomWallpaper();
                }
            } else {
                console.log('🎨 No saved wallpaper, setting random');
                this.setRandomWallpaper();
            }
        }
    },
    
    setRandomWallpaper() {
        // Set a random wallpaper by default (excluding the first one which is "Default Gradient")
        const randomIndex = Math.floor(Math.random() * (this.state.availableWallpapers.length - 1)) + 1;
        const randomWallpaper = this.state.availableWallpapers[randomIndex];
        console.log('🎨 Setting random wallpaper:', randomWallpaper.name);
        this.setWallpaper(randomWallpaper);
    },
    
    setWallpaper(wallpaper) {
        if (!this.state.isMobile) return;
        
        this.state.currentWallpaper = wallpaper;
        
        console.log(`🎨 Setting wallpaper: ${wallpaper.name}`, wallpaper);
        
        if (wallpaper.file) {
            // Set wallpaper background on body with !important to override any other styles
            document.body.style.setProperty('background-image', `url('${wallpaper.file}')`, 'important');
            document.body.style.setProperty('background-size', 'cover', 'important');
            document.body.style.setProperty('background-position', 'center', 'important');
            document.body.style.setProperty('background-repeat', 'no-repeat', 'important');
            document.body.style.setProperty('background-attachment', 'fixed', 'important');
            
            // Add the wallpaper class
            document.body.classList.add('has-wallpaper');
            
            // Force re-render by toggling a class
            document.body.classList.remove('wallpaper-refresh');
            setTimeout(() => {
                document.body.classList.add('wallpaper-refresh');
            }, 10);
            
            // Save to localStorage
            localStorage.setItem('mobile-wallpaper', wallpaper.file);
            
            console.log(`✅ Wallpaper set: ${wallpaper.name} (${wallpaper.file})`);
        } else {
            // Use default gradient
            document.body.style.removeProperty('background-image');
            document.body.style.removeProperty('background-size');
            document.body.style.removeProperty('background-position');
            document.body.style.removeProperty('background-repeat');
            document.body.style.removeProperty('background-attachment');
            document.body.classList.remove('has-wallpaper');
            localStorage.removeItem('mobile-wallpaper');
            
            console.log('✅ Wallpaper reset to default gradient');
        }
        
        // Force a visual update and verify
        setTimeout(() => {
            const hasWallpaper = document.body.classList.contains('has-wallpaper');
            const backgroundImage = getComputedStyle(document.body).backgroundImage;
            const bodyClassList = Array.from(document.body.classList);
            
            console.log('🎨 Wallpaper verification:', {
                hasWallpaperClass: hasWallpaper,
                computedBackgroundImage: backgroundImage,
                wallpaperName: wallpaper.name,
                bodyClasses: bodyClassList,
                isMobile: this.state.isMobile
            });
            
            // Double-check that the wallpaper is actually visible
            if (wallpaper.file && backgroundImage === 'none') {
                console.warn('⚠️ Wallpaper not applied correctly, retrying...');
                // Try again with a different approach
                document.body.style.background = `url('${wallpaper.file}') center/cover no-repeat fixed`;
            }
        }, 200);
    },
    
    getAvailableWallpapers() {
        return this.state.availableWallpapers;
    },
    
    getCurrentWallpaper() {
        return this.state.currentWallpaper;
    },
    
    cycleWallpaper() {
        if (!this.state.isMobile) return;
        
        const currentIndex = this.state.availableWallpapers.findIndex(w => w === this.state.currentWallpaper);
        const nextIndex = (currentIndex + 1) % this.state.availableWallpapers.length;
        const nextWallpaper = this.state.availableWallpapers[nextIndex];
        
        this.setWallpaper(nextWallpaper);
        
        // Show wallpaper change notification
        this.showWallpaperNotification(nextWallpaper.name);
    },
    
    showWallpaperNotification(wallpaperName) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            backdrop-filter: blur(10px);
            transition: opacity 0.3s ease;
        `;
        notification.textContent = `Wallpaper: ${wallpaperName}`;
        
        document.body.appendChild(notification);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    },
    
    // Open settings app with mobile wallpaper options
    async openSettingsApp() {
        try {
            // Load the settings content first (this will load desktop settings)
            await ContentLoader.loadContent('settings');
            
            // Show the window with mobile animation
            const window = Utils.dom.get('settings-window');
            if (window) {
                this.showMobileWindow(window, 'settings');
                
                // Update state
                this.state.currentView = 'settings';
                
                // Hide home screen
                const homeScreen = Utils.dom.get('mobile-home-screen');
                if (homeScreen) {
                    homeScreen.style.display = 'none';
                }
            }
            
            // Show mobile settings section after a short delay
            setTimeout(() => {
                this.setupMobileSettings();
            }, 300);
            
        } catch (error) {
            Utils.logger.error('Failed to open settings app:', error);
        }
    },
    
    // Setup mobile settings content
    setupMobileSettings() {
        if (!this.state.isMobile) return;
        
        // Get the settings content container
        const settingsContent = document.getElementById('settings-content');
        if (!settingsContent) return;
        
        // Clear existing content
        settingsContent.innerHTML = '';
        
        // Create mobile-specific settings content
        const mobileSettingsHTML = `
            <div class="settings-section mobile-only">
                <h3>Mobile Background</h3>
                <p>Select a wallpaper for your mobile experience:</p>
                <div class="mobile-wallpaper-grid" id="mobile-wallpaper-grid">
                    <!-- Mobile wallpapers will be loaded dynamically -->
                </div>
                <div class="settings-tip">
                    <i class="fas fa-info-circle"></i>
                    <span>Tip: Long-press on the home screen to cycle through wallpapers</span>
                </div>
            </div>
        `;
        
        settingsContent.innerHTML = mobileSettingsHTML;
        
        // Populate wallpaper grid
        this.populateMobileWallpaperGrid();
    },
    
    // Populate mobile wallpaper grid
    populateMobileWallpaperGrid() {
        const grid = document.getElementById('mobile-wallpaper-grid');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        this.state.availableWallpapers.forEach((wallpaper, index) => {
            const item = document.createElement('div');
            item.className = 'mobile-wallpaper-item';
            item.dataset.wallpaper = index;
            
            if (wallpaper.file) {
                item.style.backgroundImage = `url('${wallpaper.file}')`;
            } else {
                item.classList.add('gradient');
            }
            
            if (this.state.currentWallpaper === wallpaper) {
                item.classList.add('active');
            }
            
            const nameLabel = document.createElement('div');
            nameLabel.className = 'mobile-wallpaper-name';
            nameLabel.textContent = wallpaper.name;
            item.appendChild(nameLabel);
            
            item.addEventListener('click', () => {
                this.selectWallpaperFromSettings(wallpaper);
            });
            
            grid.appendChild(item);
        });
    },
    
    // Select wallpaper from settings
    selectWallpaperFromSettings(wallpaper) {
        this.setWallpaper(wallpaper);
        
        // Update active state in grid
        const grid = document.getElementById('mobile-wallpaper-grid');
        if (grid) {
            grid.querySelectorAll('.mobile-wallpaper-item').forEach(item => {
                item.classList.remove('active');
            });
            
            const activeItem = grid.querySelector(`[data-wallpaper="${this.state.availableWallpapers.indexOf(wallpaper)}"]`);
            if (activeItem) {
                activeItem.classList.add('active');
            }
        }
        
        // Show selection feedback
        this.showWallpaperNotification(`Selected: ${wallpaper.name}`);
    },

    // Setup mobile status bar listeners
    setupMobileStatusBarListeners() {
        if (!this.state.isMobile) return;

        console.log('📱 Setting up mobile app header (simplified design)');

        // Just verify the time element exists - no more dropdown functionality
        setTimeout(() => {
            const timeElement = document.querySelector('.iphone-status-bar #mobile-time');
            if (timeElement) {
                console.log('✅ Time element found in app header');
            } else {
                console.warn('⚠️ Time element not found in app header');
            }
        }, 100);
    },

    // Create mobile dropdown elements
    createMobileDropdowns() {
        const statusRight = document.querySelector('.iphone-status-bar .status-right');
        if (!statusRight) {
            console.error('iPhone status-right container not found - cannot create mobile dropdowns');
            return;
        }

        console.log('📱 Creating mobile dropdowns...');

        // Remove any existing dropdowns first
        statusRight.querySelectorAll('.mobile-dropdown').forEach(dropdown => dropdown.remove());

        // Time dropdown
        const timeDropdown = document.createElement('div');
        timeDropdown.id = 'mobile-time-dropdown';
        timeDropdown.className = 'mobile-dropdown';
        timeDropdown.innerHTML = this.getMobileTimeDropdownHTML();
        statusRight.appendChild(timeDropdown);

        // WiFi dropdown
        const wifiDropdown = document.createElement('div');
        wifiDropdown.id = 'mobile-wifi-dropdown';
        wifiDropdown.className = 'mobile-dropdown';
        wifiDropdown.innerHTML = this.getMobileWifiDropdownHTML();
        statusRight.appendChild(wifiDropdown);

        // Battery dropdown
        const batteryDropdown = document.createElement('div');
        batteryDropdown.id = 'mobile-battery-dropdown';
        batteryDropdown.className = 'mobile-dropdown';
        batteryDropdown.innerHTML = this.getMobileBatteryDropdownHTML();
        statusRight.appendChild(batteryDropdown);

        console.log('✅ Mobile dropdowns created:', {
            time: document.getElementById('mobile-time-dropdown'),
            wifi: document.getElementById('mobile-wifi-dropdown'),
            battery: document.getElementById('mobile-battery-dropdown')
        });
    },

    // Toggle mobile dropdown
    toggleMobileDropdown(type) {
        const dropdown = document.getElementById(`mobile-${type}-dropdown`);
        if (!dropdown) return;

        // Close other dropdowns
        this.closeMobileDropdowns(type);

        // Toggle current dropdown
        if (this.state.activeDropdown === type) {
            dropdown.classList.remove('show');
            this.state.activeDropdown = null;
        } else {
            dropdown.classList.add('show');
            this.state.activeDropdown = type;

            // Update content for specific dropdowns
            if (type === 'time') {
                this.updateMobileDetailedTime();
            } else if (type === 'battery') {
                this.updateMobileBatteryLevel();
            }
        }
    },

    // Close mobile dropdowns
    closeMobileDropdowns(except = null) {
        ['time', 'wifi', 'battery'].forEach(type => {
            if (type !== except) {
                const dropdown = document.getElementById(`mobile-${type}-dropdown`);
                if (dropdown) {
                    dropdown.classList.remove('show');
                }
            }
        });
        
        if (!except) {
            this.state.activeDropdown = null;
        }
    },

    // Get mobile time dropdown HTML
    getMobileTimeDropdownHTML() {
        return `
            <div class="mobile-dropdown-content">
                <div class="mobile-digital-clock">
                    <div class="mobile-time-display" id="mobile-detailed-time">12:00:00 PM</div>
                    <div class="mobile-date-display" id="mobile-detailed-date">Monday, January 1, 2024</div>
                </div>
                <div class="mobile-calendar-container">
                    <div class="mobile-calendar-header">
                        <button onclick="MobileInterface.previousMonth()">&lt;</button>
                        <span id="mobile-calendar-title">January 2024</span>
                        <button onclick="MobileInterface.nextMonth()">&gt;</button>
                    </div>
                    <div class="mobile-calendar-grid" id="mobile-calendar-grid">
                        <!-- Calendar will be populated dynamically -->
                    </div>
                </div>
            </div>
        `;
    },

    // Get mobile WiFi dropdown HTML
    getMobileWifiDropdownHTML() {
        const networks = [
            { name: "KevinPlumlee_5G", strength: 3, locked: false, connected: true },
            { name: "FBI Surveillance Van", strength: 2, locked: true, connected: false },
            { name: "404_Network_Unavailable", strength: 1, locked: true, connected: false },
            { name: "Pretty_Fly_For_A_WiFi", strength: 2, locked: true, connected: false },
            { name: "Loading...", strength: 1, locked: false, connected: false },
            { name: "It_Hurts_When_IP", strength: 3, locked: true, connected: false }
        ];

        let html = '<div class="mobile-dropdown-content"><div class="mobile-wifi-header">Wi-Fi Networks</div>';
        networks.forEach(network => {
            const bars = '▂▄▆'.substring(0, network.strength);
            const lockIcon = network.locked ? '🔒' : '';
            const checkIcon = network.connected ? '✓' : '';
            html += `
                <div class="mobile-wifi-network ${network.connected ? 'connected' : ''}" onclick="MobileInterface.connectToMobileWifi('${network.name}')">
                    <span class="mobile-network-name">${checkIcon} ${network.name} ${lockIcon}</span>
                    <span class="mobile-signal-strength">${bars}</span>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },

    // Get mobile battery dropdown HTML
    getMobileBatteryDropdownHTML() {
        return `
            <div class="mobile-dropdown-content">
                <div class="mobile-battery-header">Battery Status</div>
                <div class="mobile-battery-visual">
                    <div class="mobile-battery-body">
                        <div class="mobile-battery-level" id="mobile-battery-fill"></div>
                    </div>
                    <div class="mobile-battery-tip"></div>
                </div>
                <div class="mobile-battery-info">
                    <div class="mobile-battery-percentage" id="mobile-battery-percent">${this.state.batteryLevel}%</div>
                    <div class="mobile-battery-time" id="mobile-battery-time">${this.state.batteryTimeRemaining} remaining</div>
                </div>
                <div class="mobile-battery-tips">
                    <div class="mobile-tip">💡 Tip: Your phone is powered by pure determination</div>
                    <div class="mobile-tip">⚡ Fun fact: This battery is 73% organic</div>
                    <div class="mobile-tip">🔋 Current mood: Electrically optimistic</div>
                </div>
                <button class="mobile-battery-saver" onclick="MobileInterface.toggleMobileBatterySaver()">
                    Enable Focus Mode
                </button>
            </div>
        `;
    },

    // Update mobile detailed time
    updateMobileDetailedTime() {
        const timeEl = document.getElementById('mobile-detailed-time');
        const dateEl = document.getElementById('mobile-detailed-date');
        if (timeEl && dateEl) {
            const now = new Date();
            timeEl.textContent = now.toLocaleTimeString('en-US', {
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
            });
            dateEl.textContent = now.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        this.updateMobileCalendar();
    },

    // Update mobile calendar
    updateMobileCalendar() {
        const grid = document.getElementById('mobile-calendar-grid');
        const title = document.getElementById('mobile-calendar-title');
        if (!grid || !title) return;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const currentDate = now.getDate();

        title.textContent = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        // Clear grid
        grid.innerHTML = '';

        // Add day headers
        const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        const headerRow = document.createElement('div');
        headerRow.className = 'mobile-calendar-row';
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'mobile-calendar-day-header';
            header.textContent = day;
            headerRow.appendChild(header);
        });
        grid.appendChild(headerRow);

        // Get first day of month and number of days
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Add calendar days
        let dayCount = 1;
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

        for (let week = 0; week < totalCells / 7; week++) {
            const weekRow = document.createElement('div');
            weekRow.className = 'mobile-calendar-row';

            for (let day = 0; day < 7; day++) {
                const dayCell = document.createElement('div');
                dayCell.className = 'mobile-calendar-day';
                
                const cellIndex = week * 7 + day;
                if (cellIndex >= firstDay && dayCount <= daysInMonth) {
                    dayCell.textContent = dayCount;
                    if (dayCount === currentDate) {
                        dayCell.classList.add('today');
                    }
                    dayCount++;
                } else {
                    dayCell.classList.add('empty');
                }
                
                weekRow.appendChild(dayCell);
            }
            grid.appendChild(weekRow);
        }
    },

    // Mobile WiFi connection handler
    connectToMobileWifi(networkName) {
        console.log(`📶 Connecting to mobile WiFi: ${networkName}`);
        
        // Update state
        this.state.connectedNetwork = networkName;
        
        // Show connection feedback
        this.showMobileNotification(`Connected to ${networkName}`);
        
        // Close dropdown
        this.closeMobileDropdowns();
        
        // Update WiFi dropdown to reflect new connection
        setTimeout(() => {
            const dropdown = document.getElementById('mobile-wifi-dropdown');
            if (dropdown) {
                dropdown.innerHTML = this.getMobileWifiDropdownHTML();
            }
        }, 500);
    },

    // Mobile battery saver toggle
    toggleMobileBatterySaver() {
        console.log('🔋 Toggling mobile battery saver mode');
        this.showMobileNotification('Focus Mode Enabled');
        this.closeMobileDropdowns();
    },

    // Show mobile notification
    showMobileNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'mobile-notification';
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            backdrop-filter: blur(10px);
            transition: opacity 0.3s ease;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Fade out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 2000);
    },

    // Update mobile battery level visual
    updateMobileBatteryLevel() {
        const batteryFill = document.getElementById('mobile-battery-fill');
        const batteryPercent = document.getElementById('mobile-battery-percent');
        const batteryTime = document.getElementById('mobile-battery-time');
        
        if (batteryFill) {
            batteryFill.style.width = `${this.state.batteryLevel}%`;
        }
        if (batteryPercent) {
            batteryPercent.textContent = `${this.state.batteryLevel}%`;
        }
        if (batteryTime) {
            batteryTime.textContent = `${this.state.batteryTimeRemaining} remaining`;
        }
    },

    // Calendar navigation
    previousMonth() {
        // Implementation for calendar navigation
        console.log('📅 Previous month clicked');
    },

    nextMonth() {
        // Implementation for calendar navigation
        console.log('📅 Next month clicked');
    },
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📱 Initializing mobile interface on DOMContentLoaded');
        MobileInterface.init();
    });
} else {
    console.log('📱 Initializing mobile interface immediately');
    MobileInterface.init();
}

// Add manual triggers for testing
window.forceMobileInterface = function() {
    console.log('🔧 Forcing mobile interface...');
    document.body.classList.add('mobile-interface');
    MobileInterface.state.isMobile = true;
    MobileInterface.setupMobileInterface();
    MobileInterface.setupMobileEventListeners();
    MobileInterface.loadSavedWallpaper();
};

window.testWallpaper = function(wallpaperName) {
    const wallpaper = MobileInterface.state.availableWallpapers.find(w => 
        w.name.toLowerCase().includes(wallpaperName.toLowerCase())
    );
    if (wallpaper) {
        console.log('🎨 Testing wallpaper:', wallpaper.name);
        MobileInterface.setWallpaper(wallpaper);
    } else {
        console.log('❌ Wallpaper not found. Available:', 
            MobileInterface.state.availableWallpapers.map(w => w.name)
        );
    }
};

window.testRandomWallpaper = function() {
    console.log('🎲 Setting random wallpaper...');
    MobileInterface.setRandomWallpaper();
};

window.testLongPress = function() {
    console.log('🎯 Testing long press wallpaper cycle...');
    MobileInterface.cycleWallpaper();
};

window.debugMobileWallpaper = function() {
    console.log('🔍 Mobile wallpaper debug info:');
    console.log('- Is mobile:', MobileInterface.state.isMobile);
    console.log('- Current wallpaper:', MobileInterface.state.currentWallpaper);
    console.log('- Available wallpapers:', MobileInterface.state.availableWallpapers);
    console.log('- Body classes:', Array.from(document.body.classList));
    console.log('- Body background:', getComputedStyle(document.body).background);
    console.log('- Home screen element:', document.getElementById('mobile-home-screen'));
    
    // Test wallpaper setting
    const testWallpaper = MobileInterface.state.availableWallpapers[1]; // Greece
    console.log('- Testing wallpaper set with:', testWallpaper.name);
    MobileInterface.setWallpaper(testWallpaper);
};

window.fixMobileWallpaper = function() {
    console.log('🔧 Attempting to fix mobile wallpaper...');
    
    // Force mobile mode
    MobileInterface.state.isMobile = true;
    document.body.classList.add('mobile-interface');
    
    // Show home screen
    const homeScreen = document.getElementById('mobile-home-screen');
    if (homeScreen) {
        homeScreen.style.display = 'block';
        homeScreen.style.visibility = 'visible';
    }
    
    // Set a test wallpaper
    const testWallpaper = MobileInterface.state.availableWallpapers[2]; // Game of Thrones
    MobileInterface.setWallpaper(testWallpaper);
    
    console.log('✅ Mobile wallpaper fix attempt complete');
};

// Also trigger on window load as backup
window.addEventListener('load', () => {
    console.log('📱 Window loaded, checking mobile interface...');
    if (!MobileInterface.state.isInitialized) {
        console.log('📱 Mobile interface not initialized, initializing now...');
        MobileInterface.init();
    }
});

// Debug helper for testing mobile dropdowns
window.testMobileDropdowns = function() {
    console.log('🔧 Testing mobile dropdowns...');
    console.log('- Is mobile:', MobileInterface.state.isMobile);
    console.log('- Status bar exists:', !!document.querySelector('.iphone-status-bar'));
    console.log('- WiFi icon exists:', !!document.querySelector('.iphone-status-bar .fa-wifi'));
    console.log('- Battery icon exists:', !!document.querySelector('.iphone-status-bar .battery-icon'));
    console.log('- Time element exists:', !!document.querySelector('.iphone-status-bar #mobile-time'));
    console.log('- Dropdowns exist:', {
        time: !!document.getElementById('mobile-time-dropdown'),
        wifi: !!document.getElementById('mobile-wifi-dropdown'),
        battery: !!document.getElementById('mobile-battery-dropdown')
    });
    
    // Test dropdown toggle
    console.log('🔧 Testing WiFi dropdown toggle...');
    MobileInterface.toggleMobileDropdown('wifi');
};

window.forceMobileDropdownTest = function() {
    console.log('🔧 Forcing mobile dropdown setup...');
    MobileInterface.state.isMobile = true;
    document.body.classList.add('mobile-interface');
    
    // Show mobile home screen
    const homeScreen = document.getElementById('mobile-home-screen');
    if (homeScreen) {
        homeScreen.style.display = 'block';
    }
    
    // Re-setup mobile listeners
    MobileInterface.setupMobileStatusBarListeners();
}; 