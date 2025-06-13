// Main Application Controller
const PortfolioApp = {
    // Application state
    state: {
        initialized: false,
        activeWindows: new Set(),
        windowStates: new Map(),
        dragState: null,
        currentTheme: 'light'
    },
    
    // Loading screen management
    loadingManager: {
        progress: 0,
        steps: [
            'Initializing Kevin OS...',
            'Loading healthcare marketing expertise...',
            'Calibrating coffee sensors...',
            'Connecting to Columbia, MD servers...',
            'Initializing creative genius protocols...',
            'Loading professional achievements...',
            'Preparing portfolio interface...',
            'Kevin Plumlee system ready!'
        ],
        
        async start() {
            const loadingScreen = Utils.dom.get('loading-screen');
            const loadingBar = Utils.dom.get('loading-bar');
            const loadingStatus = Utils.dom.get('loading-status');
            
            if (!loadingScreen || !loadingBar || !loadingStatus) return;
            
            // Show loading screen
            loadingScreen.classList.remove('hidden');
            
            // Animate through loading steps
            for (let i = 0; i < this.steps.length; i++) {
                const progress = ((i + 1) / this.steps.length) * 100;
                
                // Update status text
                loadingStatus.textContent = this.steps[i];
                
                // Animate progress bar
                loadingBar.style.width = progress + '%';
                
                // Wait for each step (vary timing for realism) - Cut in half
                const delay = i === this.steps.length - 1 ? 400 : Math.random() * 300 + 200;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            // Wait a moment to show completion - Cut in half
            await new Promise(resolve => setTimeout(resolve, 250));
            
            // Hide loading screen
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after transition
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 1000);
        }
    },
    
    // Initialize the entire application
    async init() {
        try {
            Utils.logger.info('Initializing Portfolio App...');
            
            // Check if already initialized
            if (this.state.initialized) {
                Utils.logger.warn('App already initialized');
                return;
            }
            
            // Initialize mobile interface first
            if (typeof MobileInterface !== 'undefined') {
                MobileInterface.init();
            }
            
            // Start loading screen
            await this.loadingManager.start();
            
            // Initialize core systems
            await this.initializeSystems();
            
            // Initialize UI components
            this.initializeUI();
            
            // Load user preferences
            this.loadUserPreferences();
            
            // Start background processes
            this.startBackgroundProcesses();
            
            // Mark as initialized
            this.state.initialized = true;
            
            Utils.logger.info('Portfolio App initialized successfully');
            
            // Show welcome message and open About Kevin (only on desktop)
            if (typeof MobileInterface === 'undefined' || !MobileInterface.isMobileView()) {
                this.showWelcomeMessage();
            }
            
        } catch (error) {
            Utils.logger.error('Failed to initialize app:', error);
        }
    },
    
    // Initialize core systems
    async initializeSystems() {
        // Initialize managers
        WindowManager.init();
        DockManager.init();
        DesktopManager.init();
        MenuBarManager.init();
        AnimationsManager.init();
        
        // Initialize window management
        this.initializeWindows();
        
        // Initialize dock
        this.initializeDock();
        
        // Initialize desktop
        this.initializeDesktop();
        
        // Initialize menu bar
        this.initializeMenuBar();
        
        // Set up global event listeners
        this.setupGlobalEvents();
        
        // Initialize keyboard shortcuts
        this.initializeKeyboardShortcuts();
        
        // Start content preloading
        await ContentLoader.preloadAll();
    },
    
    // Initialize window system
    initializeWindows() {
        const windows = Utils.dom.queryAll('.window');
        
        windows.forEach((window, index) => {
            const appName = window.dataset.app;
            
            // Use larger default size from config
            const defaultSize = { width: Config.windows.defaultWidth, height: Config.windows.defaultHeight };
            const baseZIndex = 1000;
            
            // Calculate center position for first window, then stack others with offset
            const centerX = Math.max(50, (window.innerWidth - defaultSize.width) / 2);
            const centerY = Math.max(50, (window.innerHeight - defaultSize.height) / 2);
            const stackOffset = 40; // Larger offset for better visibility
            
            this.state.windowStates.set(appName, {
                isOpen: false,
                isMinimized: false,
                isMaximized: false,
                zIndex: baseZIndex + index,
                position: { 
                    x: centerX + (index * stackOffset), 
                    y: centerY + (index * stackOffset) 
                },
                size: defaultSize
            });
            
            // Set initial z-index
            window.style.zIndex = baseZIndex + index;
            
            // Add click-to-front functionality - listen for any click on the window
            Utils.dom.on(window, 'mousedown', (e) => {
                // Only bring to front if the window is open but not already the frontmost
                const windowState = this.state.windowStates.get(appName);
                if (windowState && windowState.isOpen && !windowState.isMinimized) {
                    this.bringWindowToFront(appName);
                    this.updateDockIndicators();
                }
            });
            
            // Also handle clicks on window content
            Utils.dom.on(window, 'click', (e) => {
                const windowState = this.state.windowStates.get(appName);
                if (windowState && windowState.isOpen && !windowState.isMinimized) {
                    this.bringWindowToFront(appName);
                }
            });
        });
        
        Utils.logger.debug('Windows initialized');
    },
    
    // Initialize dock system
    initializeDock() {
        const dockItems = Utils.dom.queryAll('.dock-item');
        
        dockItems.forEach(item => {
            // Click handlers
            Utils.dom.on(item, 'click', (e) => {
                e.preventDefault();
                const appName = item.dataset.app;
                this.handleDockItemClick(appName);
            });
        });
        
        Utils.logger.debug('Dock initialized');
    },
    
    // Initialize desktop
    initializeDesktop() {
        const desktopIcons = Utils.dom.queryAll('.desktop-icon');
        
        desktopIcons.forEach(icon => {
            // Double click to open
            Utils.dom.on(icon, 'dblclick', () => {
                const appName = icon.dataset.app;
                this.openApplication(appName);
            });
        });
        
        Utils.logger.debug('Desktop initialized');
    },
    
    // Initialize menu bar
    initializeMenuBar() {
        // Apple logo easter egg - Enhanced with multiple click patterns
        const appleIcon = Utils.dom.query('.fab.fa-apple');
        const plumIcon = Utils.dom.query('.plum-icon.menu-icon');
        const targetIcon = appleIcon || plumIcon;
        
        if (targetIcon) {
            let clickCount = 0;
            let rapidClicks = 0;
            let lastClickTime = 0;
            let clickPattern = [];
            let secretUnlocked = false;
            
            Utils.dom.on(targetIcon, 'click', (e) => {
                const currentTime = Date.now();
                const timeDiff = currentTime - lastClickTime;
                
                clickCount++;
                clickPattern.push(timeDiff);
                
                // Rapid clicking detection (clicks within 300ms)
                if (timeDiff < 300) {
                    rapidClicks++;
                } else {
                    rapidClicks = 0;
                }
                
                // Visual feedback for each click
                this.addClickEffect(targetIcon, clickCount);
                
                // Different responses based on click patterns
                if (rapidClicks >= 10) {
                    // Super rapid clicking
                    this.showHyperCaffeinated();
                    clickCount = 0;
                    rapidClicks = 0;
                    clickPattern = [];
                } else if (clickCount === 3 && timeDiff > 1000) {
                    // Slow deliberate triple click
                    this.showSecretMessage();
                    clickCount = 0;
                } else if (clickCount === 7) {
                    // Lucky number 7
                    this.showLuckyMessage();
                    clickCount = 0;
                } else if (clickCount >= 5 && clickCount < 10) {
                    // Original 5+ click behavior but enhanced
                    this.showAboutMac();
                    clickCount = 0;
                } else if (clickCount >= 15) {
                    // Persistent clicking
                    this.showPersistentClickerMessage();
                    clickCount = 0;
                    rapidClicks = 0;
                    clickPattern = [];
                }
                
                // Reset click count after 3 seconds of inactivity
                setTimeout(() => {
                    if (Date.now() - lastClickTime > 3000) {
                        clickCount = 0;
                        rapidClicks = 0;
                        clickPattern = [];
                    }
                }, 3000);
                
                lastClickTime = currentTime;
            });
            
            // Double-click for instant coffee mode
            Utils.dom.on(targetIcon, 'dblclick', (e) => {
                e.preventDefault();
                this.showInstantCoffeeMode();
            });
            
            // Add hover effects
            Utils.dom.on(targetIcon, 'mouseenter', () => {
                this.addHoverEffect(targetIcon);
            });
        }
        
        // Update time
        this.updateMenuBarTime();
        
        Utils.logger.debug('Menu bar initialized with enhanced apple interactions');
    },
    
    // Add visual click effects
    addClickEffect(element, clickCount) {
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 9999;
        `;
        
        const rect = element.getBoundingClientRect();
        ripple.style.left = (rect.left + rect.width / 2 - 10) + 'px';
        ripple.style.top = (rect.top + rect.height / 2 - 10) + 'px';
        
        document.body.appendChild(ripple);
        
        // Scale effect based on click count
        element.style.transform = `scale(${1 + (clickCount * 0.1)})`;
        setTimeout(() => {
            element.style.transform = 'scale(1)';
            ripple.remove();
        }, 300);
        
        // Add CSS animation
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    // Add hover effects
    addHoverEffect(element) {
        element.style.transition = 'all 0.3s ease';
        element.style.filter = 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) brightness(1.2)';
        
        setTimeout(() => {
            element.style.filter = '';
        }, 1000);
    },
    
    // Show hyper-caffeinated mode
    showHyperCaffeinated() {
        const messages = [
            '🚨 HYPER-CAFFEINATED MODE DETECTED! ☕💨\n\nClick Speed: SUPERHUMAN\nCaffeine Level: MAXIMUM OVERDRIVE\nProductivity: THROUGH THE ROOF\n\nKevin\'s brain is now operating at 347% normal capacity!\n\n⚠️ Warning: May cause spontaneous brilliance and uncontrollable healthcare marketing ideas!',
            '⚡ RAPID-FIRE GENIUS ACTIVATED! ⚡\n\nClick Rate: 847 CPM (Clicks Per Marketing-idea)\nEnergy Level: UNSTOPPABLE FORCE\nCreativity: OVERFLOWING LIKE NIAGARA FALLS\n\nYou\'ve unlocked Kevin\'s hidden BEAST MODE!\n\n🎯 Achievement Unlocked: Speed Demon Healthcare Marketer!',
            '🌪️ WHIRLWIND KEVIN UNLEASHED! 🌪️\n\nTurbocharged Thinking: ENGAGED\nImpossible Speed: ACHIEVED\nMarketing Momentum: LEGENDARY\n\nCongratulations! You\'ve triggered Kevin\'s SECRET TURBO MODE!\n\n💡 Ideas are now generating faster than you can click!'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showEnhancedAlert(message, '⚡', 'hyper');
    },
    
    // Show secret message for slow triple click
    showSecretMessage() {
        const secrets = [
            '🤫 SECRET UNLOCKED: The Kevin Code\n\nYou\'ve discovered the ancient art of the deliberate triple-click!\n\n🔑 Hidden Truth: Kevin\'s superpowers actually come from a secret blend of Colombian coffee beans and pure healthcare marketing passion.\n\n✨ Bonus Secret: Every website Kevin touches gets an automatic +47% conversion boost!',
            '🕵️ CONFIDENTIAL: Behind the Scenes\n\nPsst... you found the secret entrance!\n\n🎭 Kevin\'s Secret Identity: By day, VP Performance Marketing. By night, CSS Superhero and JavaScript Wizard.\n\n🦸‍♂️ Special Power: Can debug healthcare marketing campaigns with his eyes closed while drinking coffee.',
            '🔮 MYSTICAL REVELATION UNLOCKED!\n\nThe Triple-Click of Wisdom has been activated!\n\n🧙‍♂️ Ancient Kevin Wisdom: "A conversion optimized is a patient helped, a coffee consumed is an idea born."\n\n🌟 You are now blessed with +10 Marketing Intuition and permanent coffee immunity!'
        ];
        const secret = secrets[Math.floor(Math.random() * secrets.length)];
        this.showEnhancedAlert(secret, '🤫', 'secret');
    },
    
    // Show lucky number 7 message
    showLuckyMessage() {
        const luckyMessages = [
            '🍀 LUCKY NUMBER 7 ACTIVATED! 🍀\n\nJackpot! You\'ve hit Kevin\'s lucky number!\n\n🎰 Your Winnings:\n• 7x Healthcare Marketing Luck\n• 777% Conversion Rate Boost\n• Lucky LinkedIn Connection Charm\n• Infinite Coffee Refill Power-up\n\n🌟 Lady Luck smiles upon your marketing endeavors!',
            '🎯 SEVEN WONDERS OF KEVIN UNLOCKED! 🎯\n\n7️⃣ Magic Number Achievement!\n\n✨ The 7 Pillars of Kevin\'s Success:\n1. Coffee ☕  2. Creativity 💡  3. Conversions 📈\n4. Caffeine ☕  5. Code 💻  6. Coffee ☕  7. COFFEE ☕\n\n🏆 Congratulations! Your marketing karma just increased by 777 points!',
            '🌈 RAINBOW OF HEALTHCARE MARKETING MAGIC! 🌈\n\nSeven clicks = Seven times the awesome!\n\n🦄 Magical Kevin Powers Activated:\n• SEO Unicorn Summoning\n• Conversion Rate Leprechaun\n• Patient Acquisition Rainbow Bridge\n• Coffee-to-Gold Alchemy\n\n☘️ May all your campaigns be blessed with Kevin\'s lucky 7 magic!'
        ];
        const lucky = luckyMessages[Math.floor(Math.random() * luckyMessages.length)];
        this.showEnhancedAlert(lucky, '🍀', 'lucky');
    },
    
    // Show instant coffee mode
    showInstantCoffeeMode() {
        const instantMessages = [
            '☕ INSTANT COFFEE MODE ACTIVATED! ⚡\n\nDouble-click detected: MAXIMUM EFFICIENCY ENGAGED!\n\n🚀 Instant Results:\n• Ideas: Brewing in 0.5 seconds\n• Solutions: Ready-to-serve\n• Creativity: Instantly caffeinated\n• Healthcare marketing: Instantly optimized\n\n⏰ No waiting required - Kevin delivers instant gratification!',
            '💨 ESPRESSO EXPRESS ACTIVATED! 💨\n\nDouble-click = Double the speed!\n\n⚡ Lightning Fast Kevin Services:\n• Instant website diagnosis\n• Rapid conversion optimization\n• Turbo-charged SEO analysis\n• Express healthcare marketing strategy\n\n🏁 From zero to marketing hero in 2.3 seconds!',
            '🎯 RAPID-FIRE RESULTS MODE! 🎯\n\nYou chose speed over everything!\n\n💥 Instant Kevin Delivery:\n• Problem identified: 0.1 sec\n• Solution generated: 0.2 sec\n• Implementation plan: 0.3 sec\n• Mind blown: 0.4 sec\n\n⚡ Warning: Results may be too fast for human comprehension!'
        ];
        const instant = instantMessages[Math.floor(Math.random() * instantMessages.length)];
        this.showEnhancedAlert(instant, '☕', 'instant');
    },
    
    // Show persistent clicker message
    showPersistentClickerMessage() {
        const persistentMessages = [
            '🤖 CLICK MASTER DETECTED! 🤖\n\nImpressive dedication! You\'ve achieved PERSISTENT CLICKER status!\n\n🏆 Awards Earned:\n• Tenacity Trophy 🏆\n• Dedication Diamond 💎\n• Persistence Plaque 🥇\n• Kevin\'s Personal Respect Badge 🎖️\n\n🎉 You clearly understand that good things come to those who click (a lot)!',
            '🔥 UNSTOPPABLE FORCE MEETS UNMOVABLE KEVIN! 🔥\n\nYour clicking power is LEGENDARY!\n\n⚔️ Battle Stats:\n• Clicks Survived: 15+\n• Kevin\'s Amazement: MAXIMUM\n• Determination Level: SUPERHUMAN\n• Finger Strength: ELITE\n\n👑 You are now officially Kevin\'s #1 Fan and Click Champion!',
            '🌟 CLICKING HALL OF FAME INDUCTEE! 🌟\n\nCongratulations! Your name will be remembered in Kevin\'s Digital History!\n\n📜 Your Legacy:\n• Most Dedicated Clicker of 2024\n• First Person to Out-Click Kevin\'s Expectations\n• Official Healthcare Marketing Click Champion\n\n🎊 Kevin salutes your unwavering commitment to button pressing!'
        ];
        const persistent = persistentMessages[Math.floor(Math.random() * persistentMessages.length)];
        this.showEnhancedAlert(persistent, '🏆', 'persistent');
    },
    
    // Enhanced alert system with different themes
    showEnhancedAlert(message, icon = '💡', theme = 'normal') {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(20px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.2s ease;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(40px);
            border-radius: 12px;
            padding: 24px 32px;
            max-width: 500px;
            max-height: 75vh;
            overflow-y: auto;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            text-align: left;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 0.5px rgba(255, 255, 255, 0.1);
            transform: scale(0.95);
            animation: popIn 0.2s ease forwards;
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.08);
        `;
        
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 56px; margin-bottom: 8px; animation: bounce 2s infinite;">${icon}</div>
            </div>
            <div style="
                font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                white-space: pre-wrap;
                line-height: 1.4;
                margin: 0;
                font-size: 13px;
                color: #e5e5e7;
                background: rgba(0, 0, 0, 0.2);
                padding: 16px;
                border-radius: 8px;
                border: 1px solid rgba(255, 255, 255, 0.05);
            ">${message}</div>
            <div style="text-align: center; margin-top: 24px;">
                <button onclick="this.closest('.modal').remove()" style="
                    background: rgba(0, 122, 255, 0.8);
                    border: none;
                    color: white;
                    padding: 8px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    transition: all 0.2s ease;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                " onmouseover="this.style.background='rgba(0, 122, 255, 1)'; this.style.transform='scale(1.02)'" onmouseout="this.style.background='rgba(0, 122, 255, 0.8)'; this.style.transform='scale(1)'">
                    OK
                </button>
            </div>
        `;
        
        modal.className = 'modal';
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add macOS-style CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes popIn {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-8px); }
                60% { transform: translateY(-4px); }
            }
        `;
        document.head.appendChild(style);
        
        // Auto-close after 15 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                style.remove();
            }
        }, 15000);
    },
    
    showAboutMac() {
        const aboutMessages = [
            '🖥️ About This Kevin™ - DEVELOPER EDITION\n\nModel: Kevin Plumlee (Healthcare Marketing Powerhouse)\nProcessor: M1 Pro Creativity Chip + Coffee Accelerator\nMemory: 15+ Years of Healthcare Marketing RAM\nStorage: Unlimited Patient Success Stories\nGraphics: Pure CSS Magic with Healthcare Focus\nOperating System: KevinOS v2024.12 "Columbia Command Center"\n\n🔧 Installed Applications:\n• Healthcare Marketing Suite Pro\n• SEO Optimization Engine\n• Conversion Rate Maximizer\n• Coffee Dependency Manager\n• LinkedIn Networking Protocol\n\n📊 System Performance:\n• Uptime: 15+ years of excellence\n• Crashes: 0 (Kevin doesn\'t break)\n• Updates: Daily coffee-powered improvements\n• Warranty: Lifetime guarantee of awesome\n\n☕ Power Source: Premium Colombian Coffee Beans\n🚀 Turbo Mode: Always Enabled',
            '💻 Kevin™ System Specifications - ULTIMATE EDITION\n\n🧠 Processor: Healthcare Marketing Genius M2 Ultra Pro Max\n⚡ Clock Speed: 3.4 GHz (Ideas per second)\n🔋 Battery: Coffee-Powered Perpetual Motion Engine\n💾 RAM: Infinite Healthcare Knowledge Database\n💿 Storage: 15+ Years of Epic Marketing Wins\n📱 Display: Visionary Healthcare Strategy Retina\n🔊 Audio: Conversion "Cha-Ching" Surround Sound\n\n🛠️ Built-in Features:\n• Auto-SEO Optimization\n• Real-time ROI Calculator\n• Patient Acquisition Radar\n• HIPAA Compliance Detector\n• Coffee Level Monitor (Critical System)\n\n🌟 Kevin Certification: Authentic Healthcare Marketing Genius\n⚠️ Warning: Operating without coffee may void warranty',
            '🚀 Kevin™ Advanced System Report - LEGENDARY STATUS\n\n🏥 Primary Function: Healthcare Marketing Domination\n☕ Core Requirements: Colombian Coffee Bean Architecture\n🎯 Target Acquisition: 99.9% Conversion Success Rate\n📈 Performance Metrics: Continuously Exceeding Expectations\n💡 Innovation Engine: Perpetual Breakthrough Generator\n\n🔍 Diagnostic Results:\n✅ Creative Processes: Optimal\n✅ Healthcare Knowledge: Maximum Capacity\n✅ Coffee Integration: Perfect Harmony\n✅ Client Satisfaction: Off the Charts\n✅ Fun Factor: Legendary Levels\n\n🎖️ Certifications:\n• ISO 9001 Coffee Quality Management\n• Healthcare Marketing Excellence Award\n• Unlimited Dad Jokes License\n• Professional Awesome Certification\n\n📞 Technical Support: Kevin Personally Available 24/7*\n*Except during power naps and coffee breaks'
        ];
        
        const aboutMessage = aboutMessages[Math.floor(Math.random() * aboutMessages.length)];
        this.showEnhancedAlert(aboutMessage, '🖥️');
    },
    
    // Set up global event listeners
    setupGlobalEvents() {
        // Prevent context menu
        Utils.dom.on(document, 'contextmenu', (e) => {
            e.preventDefault();
        });
        
        Utils.logger.debug('Global events initialized');
    },
    
    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts() {
        Utils.dom.on(document, 'keydown', (e) => {
            // Close window: Cmd/Ctrl + W
            if (Utils.event.matchKey(e, 'ctrl+w')) {
                e.preventDefault();
                this.closeActiveWindow();
            }
            
            // Minimize window: Cmd/Ctrl + M
            if (Utils.event.matchKey(e, 'ctrl+m')) {
                e.preventDefault();
                this.minimizeActiveWindow();
            }
        });
        
        Utils.logger.debug('Keyboard shortcuts initialized');
    },
    
    // Application control methods
    async openApplication(appName) {
        Utils.logger.debug(`Opening application: ${appName}`);
        
        const windowState = this.state.windowStates.get(appName);
        if (!windowState) {
            Utils.logger.warn(`No window state found for ${appName}`);
            return;
        }
        
        // Show dock feedback for opening
        if (window.DockManager && typeof window.DockManager.showOpenFeedback === 'function') {
            window.DockManager.showOpenFeedback(appName);
        }
        
        // Show window first
        this.showWindow(appName);
        
        // Load content if not already loaded
        try {
            await ContentLoader.loadContent(appName);
        } catch (error) {
            Utils.logger.error(`Failed to load content for ${appName}:`, error);
            return;
        }
        
        // Update states
        windowState.isOpen = true;
        windowState.isMinimized = false;
        this.state.activeWindows.add(appName);
        
        // Update dock
        this.updateDockIndicators();
        
        // Bring to front
        this.bringWindowToFront(appName);
        
        // Final layout recalculation after everything is loaded
        setTimeout(() => {
            const window = Utils.dom.get(`${appName}-window`);
            if (window && window.classList.contains('active')) {
                this.recalculateWindowLayout(window);
            }
        }, 600);
    },
    
    // Show window with animation
    showWindow(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        if (!window) return;
        
        // Remove active class from all other windows
        Utils.dom.queryAll('.window').forEach(w => w.classList.remove('active'));
        
        // Set initial window positioning and size
        const windowState = this.state.windowStates.get(appName);
        if (windowState) {
            window.style.left = windowState.position.x + 'px';
            window.style.top = windowState.position.y + 'px';
            window.style.width = windowState.size.width + 'px';
            window.style.height = windowState.size.height + 'px';
            
            // Make sure z-index is set properly
            window.style.zIndex = windowState.zIndex;
        }
        
        window.classList.add('open', 'active');
        window.classList.remove('minimized');
        
        // Force layout recalculation and enable scrolling
        setTimeout(() => {
            this.recalculateWindowLayout(window);
        }, 50);
        
        // Animate appearance
        Utils.animation.scale(window, 0.8, 1, 300);
    },
    
    // Recalculate window layout to enable scrolling
    recalculateWindowLayout(window) {
        const content = window.querySelector('.window-content');
        if (!content) return;
        
        // Force reflow to calculate proper dimensions
        content.style.height = 'auto';
        const rect = window.getBoundingClientRect();
        const headerHeight = window.querySelector('.window-header')?.offsetHeight || 36;
        const availableHeight = rect.height - headerHeight;
        
        // Set proper content height
        content.style.height = availableHeight + 'px';
        
        // Force scroll recalculation
        content.scrollTop = content.scrollTop;
        
        Utils.logger.debug('Window layout recalculated for scrolling');
    },
    
    // Handle dock item clicks
    handleDockItemClick(appName) {
        if (!appName) return;
        
        // Handle special dock items
        switch (appName) {
            case 'linkedin':
                window.open('https://linkedin.com/in/kevinplumlee', '_blank');
                break;
            case 'unlock-health':
                window.open('https://unlockhealth.com', '_blank');
                break;
            case 'credentials':
                window.open('https://badgr.com/public/assertions/thX0QvfBRc-IOJV7qjZs7g', '_blank');
                break;
            case 'finder':
                this.showFinder();
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'trash':
                this.showTrash();
                break;
            default:
                // Handle app windows with toggle functionality
                const windowState = this.state.windowStates.get(appName);
                if (windowState && windowState.isOpen) {
                    if (windowState.isMinimized) {
                        // If minimized, restore it
                        this.unminimizeWindow(appName);
                    } else {
                        // If open and active, check if it's the currently active window
                        const windowElement = Utils.dom.get(`${appName}-window`);
                        if (windowElement && windowElement.classList.contains('active')) {
                            // If it's the active window, close it completely
                            this.closeWindow(appName);
                        } else {
                            // If it's open but not active, bring it to front
                            this.bringWindowToFront(appName);
                        }
                    }
                } else {
                    // If not open, open it
                    this.openApplication(appName);
                }
        }
    },
    
    // Window control methods
    closeWindow(appName) {
        const windowElement = Utils.dom.get(`${appName}-window`);
        const windowState = this.state.windowStates.get(appName);
        if (!windowElement || !windowState) return;
        
        // Show dock feedback for closing
        if (window.DockManager && typeof window.DockManager.showToggleCloseFeedback === 'function') {
            window.DockManager.showToggleCloseFeedback(appName);
        }
        
        // Add smooth closing animation
        windowElement.style.transition = 'all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        windowElement.style.transform = 'scale(0.9)';
        windowElement.style.opacity = '0';
        
        // Update state immediately to prevent double-clicks
        windowState.isOpen = false;
        windowState.isMinimized = false;
        this.state.activeWindows.delete(appName);
        
        // Update dock indicators immediately for responsive feedback
        this.updateDockIndicators();
        
        // Remove classes after animation completes
        setTimeout(() => {
            windowElement.classList.remove('active', 'open');
            
            // Reset styles for next opening
            windowElement.style.transition = '';
            windowElement.style.transform = '';
            windowElement.style.opacity = '';
            
            // Log for debugging
            Utils.logger.debug(`Window ${appName} closed via dock toggle`);
        }, 250);
    },
    
    minimizeWindow(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        const windowState = this.state.windowStates.get(appName);
        
        if (!window || !windowState) return;
        
        window.classList.add('minimized');
        window.classList.remove('active');
        // Keep 'open' class so it can be restored later
        
        windowState.isMinimized = true;
        this.updateDockIndicators();
    },
    
    unminimizeWindow(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        const windowState = this.state.windowStates.get(appName);
        
        if (!window || !windowState) return;
        
        // Remove active class from all other windows first
        Utils.dom.queryAll('.window').forEach(w => w.classList.remove('active'));
        
        window.classList.remove('minimized');
        window.classList.add('active');
        // 'open' class should already be there from when it was first opened
        
        windowState.isMinimized = false;
        this.bringWindowToFront(appName);
        this.updateDockIndicators();
        
        // Recalculate layout when unminimizing
        setTimeout(() => {
            this.recalculateWindowLayout(window);
        }, 100);
    },
    
    // Bring window to front
    bringWindowToFront(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        const windowState = this.state.windowStates.get(appName);
        
        if (!window || !windowState) return;
        
        // Find the highest z-index among all open windows
        let highestZIndex = 1000;
        this.state.windowStates.forEach((state, name) => {
            if (state.isOpen && !state.isMinimized) {
                highestZIndex = Math.max(highestZIndex, state.zIndex);
            }
        });
        
        // Remove active class from all other windows
        Utils.dom.queryAll('.window').forEach(w => {
            if (w !== window) {
                w.classList.remove('active');
            }
        });
        
        // Make this window active and set it above all others
        window.classList.add('active');
        // Always increment z-index to ensure proper layering
        windowState.zIndex = highestZIndex + 1;
        window.style.zIndex = windowState.zIndex;
        
        Utils.logger.debug(`Brought window ${appName} to front with z-index ${windowState.zIndex}`);
    },
    
    // Update dock indicators
    updateDockIndicators() {
        Utils.dom.queryAll('.dock-item').forEach(item => {
            const appName = item.dataset.app;
            const windowState = this.state.windowStates.get(appName);
            
            item.classList.remove('active');
            
            if (windowState && windowState.isOpen && !windowState.isMinimized) {
                item.classList.add('active');
            }
        });
    },
    
    // Update menu bar time
    updateMenuBarTime() {
        const timeElement = Utils.dom.get('current-time');
        if (timeElement) {
            timeElement.textContent = Utils.time.formatTime();
        }
    },
    
    // Start background processes
    startBackgroundProcesses() {
        // Update time every second
        setInterval(() => {
            this.updateMenuBarTime();
        }, 1000);
        
        Utils.logger.debug('Background processes started');
    },
    
    // Load user preferences
    loadUserPreferences() {
        const preferences = Utils.storage.get('portfolio_preferences', {});
        
        if (preferences.theme) {
            this.state.currentTheme = preferences.theme;
        }
        
        Utils.logger.debug('User preferences loaded');
    },
    
    // Show welcome message and always open About Kevin
    showWelcomeMessage() {
        // Always open the About Kevin window after loading finishes
        setTimeout(() => {
            this.openApplication('about');
            
            // Update last visit timestamp
            Utils.storage.set('portfolio_last_visit', Date.now());
        }, 1000);
    },
    
    // Initialize UI components
    initializeUI() {
        // Set up window controls
        Utils.dom.queryAll('.control').forEach(control => {
            Utils.dom.on(control, 'click', (e) => {
                e.stopPropagation();
                const action = control.dataset.action;
                const window = control.closest('.window');
                const appName = window.dataset.app;
                
                switch (action) {
                    case 'close':
                        this.closeWindow(appName);
                        break;
                    case 'minimize':
                        this.minimizeWindow(appName);
                        break;
                    case 'maximize':
                        this.toggleMaximizeWindow(appName);
                        break;
                }
            });
        });
    },
    
    // Special window methods
    showFinder() {
        const content = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: #007AFF; margin-bottom: 20px;"></i>
                <h2>Finder</h2>
                <p>File explorer functionality would go here.</p>
            </div>
        `;
        this.showTemporaryWindow('Finder', content);
    },
    
    showSettings() {
        this.openApplication('settings');
    },
    
    showTrash() {
        const content = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-trash" style="font-size: 48px; color: #666; margin-bottom: 20px;"></i>
                <h2>Trash (Empty)</h2>
                <p>No items in trash.</p>
            </div>
        `;
        this.showTemporaryWindow('Trash', content);
    },
    
    showTemporaryWindow(title, content) {
        const centerX = Math.max(50, (window.innerWidth - Config.windows.defaultWidth) / 2);
        const centerY = Math.max(50, (window.innerHeight - Config.windows.defaultHeight) / 2);
        
        const tempWindow = Utils.dom.create('div', {
            className: 'window active',
            style: `
                left: ${centerX + Math.random() * 100}px;
                top: ${centerY + Math.random() * 100}px;
                width: ${Config.windows.defaultWidth}px;
                height: ${Config.windows.defaultHeight}px;
                z-index: ${Date.now()};
            `
        });
        
        tempWindow.innerHTML = `
            <div class="window-header">
                <div class="window-controls">
                    <div class="control close" onclick="this.closest('.window').remove()"></div>
                    <div class="control minimize"></div>
                    <div class="control maximize"></div>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">${content}</div>
        `;
        
        Utils.dom.get('windows-container').appendChild(tempWindow);
        
        // Auto remove after 30 seconds
        setTimeout(() => {
            if (tempWindow.parentNode) {
                tempWindow.remove();
            }
        }, 30000);
    },
    
    // Debug method to test scrolling
    testScrolling() {
        Utils.dom.queryAll('.window.active').forEach(window => {
            const content = window.querySelector('.window-content');
            if (content) {
                console.log(`Window: ${window.dataset.app}`);
                console.log(`Content height: ${content.scrollHeight}px`);
                console.log(`Visible height: ${content.clientHeight}px`);
                console.log(`Scrollable: ${content.scrollHeight > content.clientHeight}`);
                console.log(`Overflow Y: ${getComputedStyle(content).overflowY}`);
                console.log('---');
            }
        });
    },
    
    // Helper methods
    getActiveWindow() {
        const activeWindows = Array.from(this.state.activeWindows);
        if (activeWindows.length === 0) return null;
        
        return activeWindows.reduce((highest, current) => {
            const currentState = this.state.windowStates.get(current);
            const highestState = this.state.windowStates.get(highest);
            
            return currentState.zIndex > highestState.zIndex ? current : highest;
        });
    },
    
    closeActiveWindow() {
        const activeWindow = this.getActiveWindow();
        if (activeWindow) {
            this.closeWindow(activeWindow);
        }
    },
    
    minimizeActiveWindow() {
        const activeWindow = this.getActiveWindow();
        if (activeWindow) {
            this.minimizeWindow(activeWindow);
        }
    },
    
    // Toggle maximize window
    toggleMaximizeWindow(appName) {
        const window = Utils.dom.get(`${appName}-window`);
        const windowState = this.state.windowStates.get(appName);
        
        if (!window || !windowState) return;
        
        if (windowState.isMaximized) {
            // Restore window
            window.classList.remove('maximized');
            window.style.left = windowState.position.x + 'px';
            window.style.top = windowState.position.y + 'px';
            window.style.width = windowState.size.width + 'px';
            window.style.height = windowState.size.height + 'px';
            windowState.isMaximized = false;
        } else {
            // Store current position and size
            const rect = window.getBoundingClientRect();
            windowState.position.x = rect.left;
            windowState.position.y = rect.top;
            windowState.size.width = rect.width;
            windowState.size.height = rect.height;
            
            // Maximize window
            window.classList.add('maximized');
            windowState.isMaximized = true;
        }
        
        // Recalculate layout after maximize/restore
        setTimeout(() => {
            this.recalculateWindowLayout(window);
        }, 100);
    }
};

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        PortfolioApp.init();
    });
} else {
    PortfolioApp.init();
}

// Global access
window.PortfolioApp = PortfolioApp; 