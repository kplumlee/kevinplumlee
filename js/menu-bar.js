// Menu Bar Manager Module
const MenuBarManager = {
    activeDropdown: null,
    
    // Initialize menu bar functionality
    init() {
        console.log('🚀 Initializing Menu Bar Manager...');
        
        this.updateTime();
        this.startClock();
        this.createDropdowns();
        
        // Set up basic event listeners immediately
        this.setupBasicEventListeners();
        
        // Delay full menu setup to ensure PortfolioApp is loaded
        this.waitForPortfolioApp(() => {
            this.setupEventListeners();
        });
        
        Utils.logger.debug('Menu Bar Manager initialized');
        console.log('✅ Menu Bar Manager initialization complete');
    },
    
    // Setup basic event listeners that don't require PortfolioApp
    setupBasicEventListeners() {
        // Use multiple attempts to ensure Apple listener is attached
        this.setupAppleMenuListener();
        
        // Retry setup after a delay in case elements aren't ready
        setTimeout(() => this.setupAppleMenuListener(), 500);
        setTimeout(() => this.setupAppleMenuListener(), 1000);
        
        // Close dropdowns when clicking elsewhere (but not on menu bar elements)
        document.addEventListener('click', (e) => {
            // Don't close if clicking on menu bar or dropdown elements
            if (e.target.closest('.menu-bar') || e.target.closest('.menu-dropdown')) {
                console.log('🔒 Click on menu element - not closing dropdowns');
                return;
            }
            
            console.log('🔒 Click outside menu - closing dropdowns');
            this.closeAllDropdowns();
        });
    },
    
    // Setup Apple menu listener with improved detection
    setupAppleMenuListener() {
        const appleElement = document.querySelector('.plum-icon.menu-icon');
        
        // Skip if already has our listener
        if (appleElement && appleElement.hasAttribute('data-apple-listener')) {
            return;
        }
        
        if (appleElement) {
            console.log('🍇 Setting up Plum menu listener...', appleElement);
            
            // Mark as having listener to prevent duplicates
            appleElement.setAttribute('data-apple-listener', 'true');
            appleElement.style.cursor = 'pointer';
            
            // Add the click handler with proper binding
            appleElement.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🍇 Plum menu clicked!');
                
                // Ensure dropdowns exist
                if (!document.getElementById('apple-dropdown')) {
                    console.log('🔧 Creating dropdowns...');
                    this.createDropdowns();
                }
                
                // Toggle the Apple dropdown
                this.toggleDropdown('apple');
            });
            
            console.log('✅ Plum menu event listener attached successfully');
        } else {
            console.warn('⚠️ Plum icon not found yet, will retry...');
        }
    },
    
    // Wait for PortfolioApp to be available
    waitForPortfolioApp(callback) {
        if (window.PortfolioApp && typeof window.PortfolioApp.openApplication === 'function') {
            callback();
        } else {
            setTimeout(() => {
                this.waitForPortfolioApp(callback);
            }, 50);
        }
    },
    
    // Setup event listeners for menu bar items
    setupEventListeners() {
        // Menu items functionality
        this.setupMenuItems();
        
        // Time dropdown
        const timeElement = Utils.dom.get('current-time');
        if (timeElement) {
            timeElement.style.cursor = 'pointer';
            timeElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('time');
            });
        }
        
        // WiFi dropdown
        const wifiElement = document.querySelector('.menu-right .fa-wifi');
        if (wifiElement) {
            wifiElement.style.cursor = 'pointer';
            wifiElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('wifi');
            });
        }
        
        // Battery dropdown
        const batteryElement = document.querySelector('.menu-right .fa-battery-three-quarters');
        if (batteryElement) {
            batteryElement.style.cursor = 'pointer';
            batteryElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown('battery');
            });
        }
        
        // Apple menu is already set up in setupBasicEventListeners
        // No need to duplicate the event listener here
    },
    
    // Setup menu item functionality
    setupMenuItems() {
        const menuItems = document.querySelectorAll('.menu-item');
        const appMappings = {
            'About': 'about',
            'Healthcare Marketing': 'projects', // Opens projects since it's healthcare focused
            'Resume': 'resume',
            'Contact': 'contact'
        };
        
        menuItems.forEach(item => {
            const itemText = item.textContent.trim();
            
            // Skip the "Kevin Plumlee" item as it's just the brand name
            if (itemText === 'Kevin Plumlee') return;
            
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Update active state
                menuItems.forEach(mi => mi.classList.remove('active'));
                item.classList.add('active');
                
                // Open corresponding app
                const appName = appMappings[itemText];
                
                if (appName) {
                    this.closeAllDropdowns(); // Close any open dropdowns
                    
                    // Use the correct PortfolioApp method
                    if (window.PortfolioApp && typeof window.PortfolioApp.openApplication === 'function') {
                        window.PortfolioApp.openApplication(appName);
                    } else {
                        // Fallback: try to trigger dock item click
                        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
                        if (dockItem) {
                            dockItem.click();
                        }
                    }
                }
            });
        });
    },
    
    // Create dropdown elements
    createDropdowns() {
        const menuBar = document.querySelector('.menu-bar');
        if (!menuBar) {
            console.error('Menu bar not found - cannot create dropdowns');
            return;
        }
        
        console.log('Creating dropdowns...');
        
        // Time dropdown
        const timeDropdown = document.createElement('div');
        timeDropdown.id = 'time-dropdown';
        timeDropdown.className = 'menu-dropdown';
        timeDropdown.innerHTML = this.getTimeDropdownHTML();
        menuBar.appendChild(timeDropdown);
        
        // WiFi dropdown
        const wifiDropdown = document.createElement('div');
        wifiDropdown.id = 'wifi-dropdown';
        wifiDropdown.className = 'menu-dropdown';
        wifiDropdown.innerHTML = this.getWifiDropdownHTML();
        menuBar.appendChild(wifiDropdown);
        
        // Battery dropdown
        const batteryDropdown = document.createElement('div');
        batteryDropdown.id = 'battery-dropdown';
        batteryDropdown.className = 'menu-dropdown';
        batteryDropdown.innerHTML = this.getBatteryDropdownHTML();
        menuBar.appendChild(batteryDropdown);
        
        // Apple dropdown
        const appleDropdown = document.createElement('div');
        appleDropdown.id = 'apple-dropdown';
        appleDropdown.className = 'menu-dropdown';
        appleDropdown.innerHTML = this.getAppleDropdownHTML();
        menuBar.appendChild(appleDropdown);
        
        console.log('✅ All dropdowns created:', {
            time: document.getElementById('time-dropdown'),
            wifi: document.getElementById('wifi-dropdown'),
            battery: document.getElementById('battery-dropdown'),
            apple: document.getElementById('apple-dropdown')
        });
    },
    
    // Toggle dropdown visibility
    toggleDropdown(type) {
        console.log(`🔄 Toggling dropdown: ${type}`);
        const dropdown = document.getElementById(`${type}-dropdown`);
        if (!dropdown) {
            console.error(`❌ Dropdown element not found: ${type}-dropdown`);
            console.log('Available dropdowns:', document.querySelectorAll('.menu-dropdown'));
            return;
        }
        
        console.log(`📍 Found dropdown element:`, dropdown);
        
        if (this.activeDropdown === type) {
            console.log(`🔄 Closing active dropdown: ${type}`);
            this.closeAllDropdowns();
            return;
        }
        
        this.closeAllDropdowns();
        
        // Show the dropdown with enhanced styling
        dropdown.style.display = 'block';
        dropdown.style.visibility = 'visible';
        dropdown.style.opacity = '1';
        dropdown.style.position = 'absolute';
        dropdown.style.zIndex = '9999';
        
        // Enhanced positioning for Apple dropdown
        if (type === 'apple') {
            dropdown.style.left = '8px';
            dropdown.style.top = '24px';
            dropdown.style.right = 'auto';
            dropdown.style.minWidth = '240px';
            dropdown.style.background = 'rgba(30, 30, 30, 0.95)';
            dropdown.style.backdropFilter = 'blur(25px)';
            dropdown.style.borderRadius = '8px';
            dropdown.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
            dropdown.style.border = '1px solid rgba(255, 255, 255, 0.15)';
            console.log('🍎 Applied enhanced Apple dropdown positioning and styling');
        }
        
        this.activeDropdown = type;
        console.log(`✅ Opened dropdown: ${type}`, {
            display: dropdown.style.display,
            visibility: dropdown.style.visibility,
            opacity: dropdown.style.opacity,
            position: dropdown.style.position,
            zIndex: dropdown.style.zIndex,
            left: dropdown.style.left,
            top: dropdown.style.top
        });
        
        if (type === 'time') {
            this.updateCalendar();
            this.updateDetailedTime();
        }
    },
    
    // Close all dropdowns
    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.menu-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
            dropdown.style.visibility = 'hidden';
            dropdown.style.opacity = '0';
        });
        this.activeDropdown = null;
        console.log('🔒 All dropdowns closed');
    },
    
    // Get time dropdown HTML
    getTimeDropdownHTML() {
        return `
            <div class="dropdown-content">
                <div class="digital-clock">
                    <div class="time-display" id="detailed-time"></div>
                    <div class="date-display" id="detailed-date"></div>
                </div>
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button id="prev-month">&lt;</button>
                        <span id="calendar-month-year"></span>
                        <button id="next-month">&gt;</button>
                    </div>
                    <div class="calendar-grid" id="calendar-grid"></div>
                </div>
            </div>
        `;
    },
    
    // Get WiFi dropdown HTML
    getWifiDropdownHTML() {
        const networks = [
            { name: "KevinPlumlee_5G", strength: 3, locked: false, connected: true },
            { name: "FBI Surveillance Van", strength: 2, locked: true, connected: false },
            { name: "404_Network_Unavailable", strength: 1, locked: true, connected: false },
            { name: "Pretty_Fly_For_A_WiFi", strength: 2, locked: true, connected: false },
            { name: "Loading...", strength: 1, locked: false, connected: false },
            { name: "It_Hurts_When_IP", strength: 3, locked: true, connected: false }
        ];
        
        let html = '<div class="dropdown-content"><div class="wifi-header">Wi-Fi Networks</div>';
        networks.forEach(network => {
            const bars = '▂▄▆'.substring(0, network.strength);
            const lockIcon = network.locked ? '🔒' : '';
            const checkIcon = network.connected ? '✓' : '';
            html += `
                <div class="wifi-network ${network.connected ? 'connected' : ''}" onclick="MenuBarManager.connectToWifi('${network.name}')">
                    <span class="network-name">${checkIcon} ${network.name} ${lockIcon}</span>
                    <span class="signal-strength">${bars}</span>
                </div>
            `;
        });
        html += '</div>';
        return html;
    },
    
    // Get Battery dropdown HTML
    getBatteryDropdownHTML() {
        return `
            <div class="dropdown-content">
                <div class="battery-header">Battery Status</div>
                <div class="battery-visual">
                    <div class="battery-body">
                        <div class="battery-level" id="battery-fill"></div>
                    </div>
                    <div class="battery-tip"></div>
                </div>
                <div class="battery-info">
                    <div class="battery-percentage" id="battery-percent">84%</div>
                    <div class="battery-time" id="battery-time">6:42 remaining</div>
                </div>
                <div class="battery-tips">
                    <div class="tip">💡 Tip: Your laptop is powered by caffeine and determination</div>
                    <div class="tip">⚡ Fun fact: This battery is 47% organic</div>
                    <div class="tip">🔋 Current mood: Electrically optimistic</div>
                </div>
                <button class="battery-saver" onclick="MenuBarManager.toggleBatterySaver()">
                    Enable Procrastination Mode
                </button>
            </div>
        `;
    },
    
    // Get Apple dropdown HTML
    getAppleDropdownHTML() {
        return `
            <div class="dropdown-content">
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('about')">
                    <span>About This Kevin™</span>
                </div>
                <div class="menu-separator"></div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('kevin-preferences')">
                    <span>Kevin Preferences... ⚙️</span>
                </div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('healthcare-store')">
                    <span>Healthcare Marketing Store 🏥</span>
                </div>
                <div class="menu-separator"></div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('recent')">
                    <span>Recent Coffee Breaks ☕</span>
                    <span class="submenu-arrow">▶</span>
                </div>
                <div class="menu-separator"></div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('force-quit')">
                    <span>Force Quit Procrastination 💪</span>
                </div>
                <div class="menu-separator"></div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('sleep')">
                    <span>Power Nap Mode 😴</span>
                </div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('restart')">
                    <span>Restart Creative Genius 🧠</span>
                </div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('shutdown')">
                    <span>Log Off Work Day 🏠</span>
                </div>
                <div class="menu-separator"></div>
                <div class="apple-menu-item" onclick="MenuBarManager.appleMenuAction('logout')">
                    <span>Log Out Kevin Plumlee 👋</span>
                </div>
            </div>
        `;
    },
    
    // Update detailed time display
    updateDetailedTime() {
        const timeEl = document.getElementById('detailed-time');
        const dateEl = document.getElementById('detailed-date');
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
    },
    
    // Update calendar
    updateCalendar() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        document.getElementById('calendar-month-year').textContent = 
            now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        this.renderCalendar(year, month);
        
        // Setup month navigation
        document.getElementById('prev-month').onclick = () => {
            const newDate = new Date(year, month - 1);
            this.renderCalendar(newDate.getFullYear(), newDate.getMonth());
        };
        
        document.getElementById('next-month').onclick = () => {
            const newDate = new Date(year, month + 1);
            this.renderCalendar(newDate.getFullYear(), newDate.getMonth());
        };
    },
    
    // Render calendar grid
    renderCalendar(year, month) {
        const grid = document.getElementById('calendar-grid');
        if (!grid) return;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        let html = '<div class="calendar-row">';
        ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
            html += `<div class="calendar-day-header">${day}</div>`;
        });
        html += '</div>';
        
        html += '<div class="calendar-row">';
        let dayCount = 0;
        
        // Empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            html += '<div class="calendar-day empty"></div>';
            dayCount++;
        }
        
        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            if (dayCount % 7 === 0 && dayCount > 0) {
                html += '</div><div class="calendar-row">';
            }
            
            const isToday = today.getFullYear() === year && 
                           today.getMonth() === month && 
                           today.getDate() === day;
            
            html += `<div class="calendar-day ${isToday ? 'today' : ''}">${day}</div>`;
            dayCount++;
        }
        
        html += '</div>';
        grid.innerHTML = html;
    },
    
    // Enhanced alert with visual effects
    showCoolAlert(message, icon = '💡') {
        // Create custom modal with macOS styling
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
            max-width: 480px;
            max-height: 70vh;
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
                <div style="font-size: 48px; margin-bottom: 8px;">${icon}</div>
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
                " onmouseover="this.style.background='rgba(0, 122, 255, 1)'" onmouseout="this.style.background='rgba(0, 122, 255, 0.8)'">
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
    
    // macOS-style confirmation dialog
    showMacConfirm(message, icon = '❓', onConfirm = null, onCancel = null) {
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
            max-width: 420px;
            max-height: 70vh;
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
        
        const cancelBtn = document.createElement('button');
        cancelBtn.innerHTML = 'Cancel';
        cancelBtn.style.cssText = `
            background: rgba(108, 108, 112, 0.8);
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
            margin-right: 12px;
        `;
        
        const confirmBtn = document.createElement('button');
        confirmBtn.innerHTML = 'OK';
        confirmBtn.style.cssText = `
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
        `;
        
        cancelBtn.onmouseover = () => cancelBtn.style.background = 'rgba(108, 108, 112, 1)';
        cancelBtn.onmouseout = () => cancelBtn.style.background = 'rgba(108, 108, 112, 0.8)';
        confirmBtn.onmouseover = () => confirmBtn.style.background = 'rgba(0, 122, 255, 1)';
        confirmBtn.onmouseout = () => confirmBtn.style.background = 'rgba(0, 122, 255, 0.8)';
        
        cancelBtn.onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
        
        confirmBtn.onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };
        
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 8px;">${icon}</div>
            </div>
            <div style="
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
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
            <div style="text-align: center; margin-top: 24px;" class="button-container">
            </div>
        `;
        
        content.querySelector('.button-container').appendChild(cancelBtn);
        content.querySelector('.button-container').appendChild(confirmBtn);
        
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
        `;
        document.head.appendChild(style);
        
        return modal;
    },
    
    // Fun WiFi connection function
    connectToWifi(networkName) {
        if (networkName === 'KevinPlumlee_5G') {
            this.showCoolAlert('Already connected to the fastest network in Columbia, MD! 🚀\n\nThis premium network features:\n• Unlimited healthcare marketing bandwidth\n• Coffee-grade connection stability\n• Built-in inspiration boost\n• Zero lag on brilliant ideas', '📶');
        } else if (networkName === 'FBI Surveillance Van') {
            this.showCoolAlert('Connection failed. 🕵️\n\nError Code: EMBARRASSING_BROWSER_HISTORY\n\nYour search history includes:\n• "How to make healthcare marketing fun"\n• "Is too much coffee bad for you" (47 searches)\n• "Kevin Plumlee awesome" (daily searches)\n\nAccess denied for your own protection. 😄', '🚫');
        } else if (networkName === '404_Network_Unavailable') {
            this.showCoolAlert('Error 404: Humor Not Found 😄\n\nWe searched everywhere for this network:\n• Under the couch cushions\n• In Kevin\'s coffee mug\n• Between lines of code\n• Inside healthcare marketing strategies\n\nPlease try again with more coffee. ☕', '🔍');
        } else if (networkName === 'Pretty_Fly_For_A_WiFi') {
            this.showCoolAlert('🎵 Connection Status: Pretty Fly 🎵\n\n"Give it to me baby, uh-huh, uh-huh!"\n\nThis network is too cool for you right now.\n\nRequired credentials:\n• Must know all lyrics to The Offspring\n• Minimum 90s nostalgia level\n• Certificate in being awesome\n\nConnection denied. 🎸', '🎵');
        } else if (networkName === 'Loading...') {
            this.showCoolAlert('Still loading... please wait... 💫\n\nProgress: ████████░░ 80%\n\nEstimated time remaining: ∞ minutes\n\nThis network is powered by the same servers that handle Kevin\'s limitless creativity. Please stand by while we process your healthcare marketing potential...', '⏳');
        } else {
            this.showCoolAlert(`Connecting to "${networkName}"... 😉\n\nJust kidding! This is Kevin\'s portfolio, not your network settings.\n\nBut if it were real, this network would probably have:\n• Blazing fast healthcare marketing speeds\n• Built-in coffee delivery service\n• Automatic LinkedIn post optimization\n• 24/7 Kevin consultation hotline`, '📡');
        }
    },
    
    // Toggle battery saver mode
    toggleBatterySaver() {
        const button = event.target;
        if (button.textContent === 'Enable Procrastination Mode') {
            button.textContent = 'Disable Procrastination Mode';
            this.showCoolAlert('Procrastination Mode Enabled! ⏰\n\nAll productivity has been suspended:\n• Marketing deadlines: Snoozed\n• Coffee breaks: Extended indefinitely\n• Creative thinking: Set to "maybe later"\n• To-do lists: Archived\n\nEnjoy your guilt-free downtime! 😴', '🦥');
        } else {
            button.textContent = 'Enable Procrastination Mode';
            this.showCoolAlert('Back to work! ⚡\n\nProcrastination Mode disabled:\n• Your battery is now 23% more motivated\n• Productivity circuits: Reactivated\n• Coffee dependency: Acknowledged\n• Healthcare marketing genius: Unleashed\n\nTime to make some digital magic happen! 💪', '🔋');
        }
    },
    
    // Handle Apple menu actions
    appleMenuAction(action) {
        this.closeAllDropdowns();
        
        // Array of funny responses for more variety
        const responses = {
            about: [
                'About This Kevin™\n\nModel: Kevin Plumlee (VP Performance Marketing Edition)\nProcessor: Healthcare Marketing Expertise 3.0 GHz\nMemory: 15+ Years of Experience RAM\nStorage: Unlimited Creative Ideas SSD\nOperating System: KevinOS v2024 "Columbia MD"\nGraphics: Pure CSS Magic with Healthcare Focus\n\nSerial Number: UNLOCK-HEALTH-VP001\nWarranty: Lifetime of Excellence 🚀\n\n*Coffee-powered since 2008*',
                'About This Kevin™ - PREMIUM EDITION\n\nProcessor: Healthcare Marketing Genius M1 Pro\nMemory: Infinite Healthcare Knowledge\nStorage: 15+ Years of Epic Wins\nBattery: Powered by Dark Roast Coffee ☕\nDisplay: Visionary Healthcare Strategist\nWiFi: Always Connected to Innovation\n\nSpecial Features:\n• Built-in SEO Optimizer\n• Patient Acquisition Accelerator\n• HIPAA Compliance Detector\n• Conversion Rate Maximizer 📊',
                'Kevin™ System Information\n\n🧠 Brain: Healthcare Marketing Supercomputer\n☕ Fuel: Premium Colombian Coffee Beans\n🎯 Focus: Healthcare Digital Domination\n💡 Creativity: Infinite Loop Algorithm\n🚀 Speed: Faster than competitor analysis\n📈 Results: Always trending upward\n\nLast Updated: Every sip of coffee\nNext Reboot: Never (runs 24/7)'
            ],
            'kevin-preferences': [
                'Kevin Preferences™ - ULTIMATE SETTINGS\n\n☕ Coffee Requirement: MAXIMUM (Non-negotiable)\n🎯 Marketing Focus: Healthcare Excellence Only\n📍 Base Station: Columbia, MD Command Center\n⚡ Energy Level: Over 9000!\n🧠 Creativity Mode: BEAST MODE ACTIVATED\n💡 Innovation Setting: Revolutionary\n🎪 Fun Level: Dad Jokes Enabled\n📊 Analytics Obsession: CRITICAL\n\n*Warning: Reducing coffee intake may cause system malfunction*',
                'Kevin™ Advanced Configuration\n\n🏥 Healthcare Radar: Always Scanning\n📱 LinkedIn Networking: Aggressive Mode\n🎨 Design Standards: Pixel Perfect\n📈 ROI Expectations: Astronomical\n🚀 Project Velocity: Ludicrous Speed\n☕ Coffee Buffer: Never Empty\n💪 Motivation Level: Unstoppable Force\n\n[Save Settings] [Cancel] [Add More Coffee]',
                'System Preferences - Kevin Edition\n\n🔧 Default Browser: Healthcare Marketing Opportunities\n🎵 Startup Sound: "Cha-ching" (conversion sound)\n🖱️ Click Speed: Faster than market changes\n⌨️ Typing Speed: 120 WPM (Words Per Marketing-idea)\n📊 Dashboard: Always show ROI metrics\n🎯 Target Audience: Healthcare Heroes\n\n*Some settings require admin privileges (ask my wife)*'
            ],
            'healthcare-store': [
                'Welcome to the Kevin Plumlee Healthcare Store! 🏥✨\n\n🎯 SEO Wizardry Package - $PRICELESS\n📊 Performance Marketing Magic - $GUARANTEED-RESULTS\n💊 Healthcare Expertise Capsules - $DOCTOR-APPROVED\n🚀 Digital Transformation Rocket - $TO-THE-MOON\n☕ Coffee-Powered Solutions - $ENERGIZING\n🧠 Strategy Consulting Brain - $MIND-BLOWING\n📈 ROI Multiplication Formula - $LEGENDARY\n\n*All solutions come with a 15+ year warranty and unlimited coffee refills*\n\n[Add to Cart] [Bulk Discount Available] [Talk to Kevin]',
                '🛒 Healthcare Marketing Marketplace\n\nFEATURED ITEMS:\n🏆 "The Kevin Special" - Complete digital makeover\n🎪 Conversion Rate Circus - Where boring becomes AMAZING\n🔮 SEO Crystal Ball - See the future of search\n💎 Premium Lead Generation Gems - Rare quality\n🎭 Brand Personality Makeover - From bland to GRAND\n\n💳 Payment Options: Results, References, or Referrals\n🚚 Shipping: Faster than your competition\n📞 Customer Service: Kevin personally answers!',
                'Kevin\'s Healthcare Marketing Emporium 🎪\n\n🌟 TODAY\'S SPECIALS:\n- Buy 1 Website, Get Infinite Updates FREE\n- SEO Package includes complimentary mind-reading\n- Social Media Management with built-in humor\n- Analytics Dashboard that actually makes sense\n\n🎁 BONUS: Every purchase includes a personal Kevin pep talk!\n\n"If it doesn\'t convert, it\'s not from Kevin\'s store!"'
            ],
            recent: [
                'Recent Coffee Breaks ☕ - PREMIUM LOG\n\n• Double Espresso Strategy Session (2 mins ago) 💡\n• Healthcare Trend Analysis Latte (47 mins ago) 📈\n• LinkedIn Networking Cappuccino (1 hour ago) 🤝\n• Morning SEO Audit Americano (2 hours ago) 🔍\n• Unlock Health Team Sync Macchiato (Yesterday) 🏥\n• Client Victory Celebration Mocha (Yesterday) 🎉\n• Weekend Family Coffee + Idea Brainstorm (Sunday) ☀️\n\n*Each coffee break generates minimum 3 breakthrough ideas*\n\n[Export to Calendar] [Schedule Next Break]',
                'Kevin\'s Coffee-Powered Achievement Log ☕\n\n🏆 RECENT VICTORIES:\n• Crushed Q4 goals while sipping Colombian blend\n• Generated 847 leads during morning coffee ritual\n• Had brilliant healthcare campaign idea in line at Starbucks\n• Solved client\'s conversion problem between coffee sips\n• Networked with 12 healthcare executives over lattes\n\n☕ Coffee-to-Success Ratio: 1:∞\n📊 Productivity Correlation: +9000% with caffeine',
                'Coffee Break Analytics Dashboard ☕📊\n\nTODAY\'S STATS:\n• Cups Consumed: 6 (and counting)\n• Ideas Generated: 23 breakthrough concepts\n• Problems Solved: 8 major, 15 minor\n• Healthcare Connections Made: 4 new prospects\n• "Aha!" Moments: 12 (personal record)\n\nCURRENT STATUS: Caffeinated Genius Mode ACTIVE ⚡\n\n[Refill Coffee] [Share Success Story] [Schedule Power Nap]'
            ],
            'force-quit': [
                'Force Quit Procrastination 💪 - SYSTEM CLEANER\n\nTerminating processes...\n• Social media scrolling... ❌ ELIMINATED\n• Email perfectionism... ❌ DESTROYED\n• Analysis paralysis... ❌ OBLITERATED\n• Imposter syndrome... ❌ BANISHED FOREVER\n• Netflix temptation... ❌ BLOCKED\n• Perfectionist tendencies... ❌ OPTIMIZED\n\n✅ PRODUCTIVITY BEAST MODE: ACTIVATED! 🚀\n✅ Healthcare marketing domination: INITIATED!\n✅ Coffee addiction: Still running (by design)\n\nKevin is now operating at MAXIMUM EFFICIENCY! 💻⚡',
                'KEVIN.EXE - Task Manager 💻\n\nFORCE QUITTING:\n❌ "Maybe later" syndrome - TERMINATED\n❌ Overthinking simple tasks - KILLED\n❌ Comparison with others - DELETED\n❌ Fear of failure - UNINSTALLED\n❌ Boring marketing ideas - PURGED\n\n✅ LAUNCHING NEW PROCESSES:\n🚀 Unstoppable creativity - RUNNING\n💡 Breakthrough thinking - ACTIVE\n🎯 Laser focus - ENGAGED\n☕ Coffee optimization - PRIORITY 1\n\nSystem Status: LEGENDARY MODE ENABLED! 🏆',
                '🔧 Kevin System Maintenance Complete!\n\nCLEANED UP:\n• 847 MB of self-doubt\n• 12 GB of overthinking files\n• 99 unnecessary worry processes\n• Entire "what if" directory\n\nINSTALLED UPDATES:\n• Confidence.exe v10.5\n• Innovation.dll (latest)\n• Healthcare-Genius.sys\n• Unlimited-Energy.bat\n\nRESTART COMPLETE: Welcome to Kevin 2.0! 🚀\n*Now with 300% more awesome*'
            ]
        };
        
        switch(action) {
            case 'about':
                if (window.PortfolioApp && typeof window.PortfolioApp.openApplication === 'function') {
                    window.PortfolioApp.openApplication('about');
                } else {
                    const randomResponse = responses.about[Math.floor(Math.random() * responses.about.length)];
                    this.showCoolAlert(randomResponse, '🖥️');
                }
                break;
                
            case 'kevin-preferences':
                const prefResponse = responses['kevin-preferences'][Math.floor(Math.random() * responses['kevin-preferences'].length)];
                this.showCoolAlert(prefResponse, '⚙️');
                break;
                
            case 'healthcare-store':
                const storeResponse = responses['healthcare-store'][Math.floor(Math.random() * responses['healthcare-store'].length)];
                this.showCoolAlert(storeResponse, '🏪');
                break;
                
            case 'recent':
                const recentResponse = responses.recent[Math.floor(Math.random() * responses.recent.length)];
                this.showCoolAlert(recentResponse, '☕');
                break;
                
            case 'force-quit':
                const forceResponse = responses['force-quit'][Math.floor(Math.random() * responses['force-quit'].length)];
                this.showCoolAlert(forceResponse, '💪');
                this.addScreenEffect('force-quit');
                break;
                
            case 'sleep':
                this.powerNapMode();
                break;
                
            case 'restart':
                this.restartCreativeGenius();
                break;
                
            case 'shutdown':
                this.logOffWorkDay();
                break;
                
            case 'logout':
                this.logoutKevin();
                break;
        }
    },
    
    // Enhanced power nap mode
    powerNapMode() {
        const messages = [
            'Initiating Power Nap Protocol 😴\n\nEven healthcare marketing superheroes need rest...\n\nDimming screen for optimal nap conditions...',
            'Entering Sleep Mode 🌙\n\nKevin.exe is taking a well-deserved break...\n\nDreaming of conversion rates and patient acquisition...',
            'Power Nap Commencing 💤\n\nRecharging creative batteries...\nProcessing today\'s healthcare marketing wins...\nPreparing for next burst of genius...'
        ];
        
        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showCoolAlert(message, '😴');
        
        document.body.style.filter = 'brightness(0.2) blur(2px)';
        document.body.style.transition = 'filter 2s ease';
        
        setTimeout(() => {
            document.body.style.filter = '';
            const wakeUpMessages = [
                'Power Nap Complete! 🌟\n\nKevin.exe has been refreshed:\n• Creativity: +500% boost ⚡\n• Energy: Fully recharged 🔋\n• Marketing ideas: Overflowing 💡\n• Coffee requirement: URGENT ☕\n• Healthcare domination: Ready! 🚀\n\nLet\'s revolutionize some patient experiences!',
                'WAKE UP SUCCESSFUL! ☀️\n\nSystem Reboot Complete:\n✅ Brain defragmented\n✅ Inspiration cache cleared\n✅ Creative processes optimized\n✅ Healthcare radar recalibrated\n✅ Coffee dependency acknowledged\n\nStatus: SUPERHUMAN MODE ACTIVATED! 💪',
                'Rise and Shine, Marketing Genius! 🌅\n\nNap Analytics:\n• REM cycles: 3 perfect rounds\n• Dreams about ROI: 7 epic visions\n• Subconscious problem-solving: 12 breakthroughs\n• Energy restoration: 1000% complete\n\nReady to make healthcare marketing magic! ✨'
            ];
            const wakeMessage = wakeUpMessages[Math.floor(Math.random() * wakeUpMessages.length)];
            this.showCoolAlert(wakeMessage, '⚡');
        }, 4000);
    },
    
    // Enhanced restart function
    restartCreativeGenius() {
        const confirmMessages = [
            'Are you sure you want to restart Kevin\'s Creative Genius? 🧠\n\n⚠️ WARNING: This will temporarily pause all innovative healthcare marketing ideas and might cause withdrawal symptoms in nearby colleagues.',
            'Restart Creative Engine? 🚀\n\n⚠️ CAUTION: During restart, the healthcare marketing universe may experience a brief moment of decreased awesome. Proceed?',
            'Reboot Kevin\'s Brain? 🔄\n\n⚠️ ALERT: All currently running brilliant ideas will be saved to cloud. New ideas may be 47% more amazing after restart.'
        ];
        
        const confirmMessage = confirmMessages[Math.floor(Math.random() * confirmMessages.length)];
        
        this.showMacConfirm(confirmMessage, '🔄', () => {
            const restartMessages = [
                'Restarting Creative Genius... 🔄\n\n🧠 Backing up 15+ years of healthcare marketing wisdom...\n☕ Flushing coffee buffer...\n💡 Defragmenting idea database...\n🎯 Recalibrating target audience sensors...\n🚀 Loading next-level awesome protocols...',
                'Kevin.exe Restart Initiated 💻\n\n⚡ Shutting down current processes...\n🔄 Running creativity diagnostics...\n📊 Optimizing ROI calculation algorithms...\n🏥 Refreshing healthcare knowledge base...\n☕ Preheating coffee dependency systems...',
                'SYSTEM REBOOT IN PROGRESS... 🔧\n\n🧠 Neural networks: Rebooting...\n💡 Inspiration engine: Restarting...\n🎨 Design cortex: Refreshing...\n📈 Analytics brain: Recalibrating...\n☕ Coffee interface: Always online...'
            ];
            
            const restartMessage = restartMessages[Math.floor(Math.random() * restartMessages.length)];
            this.showCoolAlert(restartMessage, '🔄');
            
            setTimeout(() => {
                location.reload();
            }, 3000);
        });
    },
    
    // Enhanced shutdown function  
    logOffWorkDay() {
        const shutdownMessages = [
            'Are you sure you want to Log Off Work Day? 🏠\n\n⚠️ WARNING: Kevin\'s marketing genius will temporarily go offline, which may cause a noticeable decrease in healthcare marketing excellence across the internet.',
            'End Work Session? 🌅\n\n⚠️ NOTICE: Logging off will pause all healthcare marketing domination activities. The competition might catch up by 0.001%.',
            'Shut Down Kevin OS? 💤\n\n⚠️ ALERT: Work day termination will activate rest mode. Kevin\'s brain will continue processing healthcare strategies in the background.'
        ];
        
        const shutdownMessage = shutdownMessages[Math.floor(Math.random() * shutdownMessages.length)];
        
        this.showMacConfirm(shutdownMessage, '🌅', () => {
            const messages = [
                'Logging off work day... 🌅\n\n💾 Saving all brilliant ideas to secure cloud...\n📅 Scheduling tomorrow\'s healthcare marketing domination...\n☕ Setting coffee alarm for 6:00 AM...\n🏆 Backing up today\'s victories...\n\nThanks for visiting Kevin\'s digital workspace! 👋',
                'Work Day Shutdown Sequence... 💻\n\n✅ Daily goals: CRUSHED\n✅ Client expectations: EXCEEDED\n✅ Healthcare marketing: REVOLUTIONIZED\n✅ Coffee quota: ACHIEVED\n✅ Tomorrow\'s plan: READY\n\nKevin OS will resume excellence in 16 hours! ⏰',
                'End of Day Protocol Active... 🌆\n\n📊 Today\'s Stats:\n• Problems solved: 23\n• Minds blown: 47\n• Conversions improved: ∞%\n• Coffee consumed: Optimal\n• Fun level: Maximum\n\nSee you tomorrow for more marketing magic! ✨'
            ];
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.showCoolAlert(message, '🌅');
            
            setTimeout(() => {
                document.body.innerHTML = `
                    <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:#fff;font-family:system-ui;text-align:center;">
                        <div>
                            <div style="font-size: 80px; margin-bottom: 30px;">🌟</div>
                            <h1 style="font-size:3em;margin-bottom:20px;">Work Day Complete!</h1>
                            <p style="font-size:1.2em;margin-bottom:30px;">Kevin Plumlee has logged off for the day</p>
                            <p style="opacity:0.8;">Healthcare marketing excellence will resume tomorrow ☕</p>
                            <p style="margin-top:30px;opacity:0.6;">Thanks for exploring the digital workspace!</p>
                            <div style="margin-top: 40px;">
                                <button onclick="location.reload()" style="background:rgba(255,255,255,0.2);border:2px solid rgba(255,255,255,0.3);color:white;padding:15px 30px;border-radius:10px;cursor:pointer;font-size:16px;">
                                    Restart Kevin 🚀
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }, 2000);
        });
    },
    
    // Enhanced logout function
    logoutKevin() {
        const logoutMessages = [
            'Are you sure you want to log out Kevin Plumlee? 👋\n\n⚠️ NOTICE: This will end your healthcare marketing session and may cause severe FOMO (Fear of Missing Out on awesome marketing insights).',
            'Log Out Kevin OS? 📱\n\n⚠️ WARNING: Ending session will disconnect you from the Kevin Plumlee experience. Side effects may include: missing his expertise, wanting to hire him immediately.',
            'Terminate Kevin Connection? 🔌\n\n⚠️ ALERT: Logging out will stop the flow of healthcare marketing wisdom. Your conversion rates may experience temporary sadness.'
        ];
        
        const logoutMessage = logoutMessages[Math.floor(Math.random() * logoutMessages.length)];
        
        this.showMacConfirm(logoutMessage, '👋', () => {
            const messages = [
                'Logging out Kevin Plumlee... 📱\n\nSession Summary:\n• Healthcare marketing excellence: ✅ DELIVERED\n• Creative ideas shared: ∞ COUNTLESS\n• Professional connections: 🤝 AVAILABLE 24/7\n• Coffee consumed: ☕ OPTIMAL AMOUNT\n• Mind-blowing moments: 🤯 TOO MANY TO COUNT\n\nCome back anytime for more marketing genius!',
                'Kevin OS Logout Successful! 👋\n\n📊 Your Visit Stats:\n• Inspiration gained: MAXIMUM LEVEL\n• Healthcare insights: OVERFLOWING\n• Fun moments: LEGENDARY\n• Professional envy: UNDERSTANDABLE\n• Desire to work with Kevin: INEVITABLE\n\nThanks for experiencing the Kevin difference! 🚀',
                'Session Terminated Successfully! ⚡\n\n🎯 Mission Accomplished:\n• Portfolio viewed: ✅\n• Kevin\'s awesomeness: CONFIRMED\n• Healthcare marketing potential: RECOGNIZED\n• Coffee appreciation: MUTUAL\n• Future collaboration: HIGHLY PROBABLE\n\nKevin\'s digital door is always open! 🚪'
            ];
            
            const message = messages[Math.floor(Math.random() * messages.length)];
            this.showCoolAlert(message, '👋');
            
            setTimeout(() => {
                const emails = [
                    'mailto:kevin@kevinplumlee.com?subject=Your Portfolio Blew My Mind! 🤯 - Let\'s Connect!&body=Hi Kevin,%0A%0AI just explored your incredible portfolio website and I\'m seriously impressed! Your healthcare marketing expertise is exactly what we need. The apple menu was hilarious by the way! 😄%0A%0ALet\'s chat about:%0A• Healthcare marketing opportunities%0A• Digital transformation projects%0A• SEO and conversion optimization%0A• Or just coffee and marketing strategy%0A%0ABest regards,',
                    'mailto:kevin@kevinplumlee.com?subject=That Apple Menu Though! 😂 - Hire This Man!&body=Kevin,%0A%0AYour portfolio site is AMAZING! I spent way too much time clicking that apple menu and laughing at your responses. But seriously, your healthcare marketing background is impressive.%0A%0AWe should definitely talk about working together. Anyone who can make system preferences funny can definitely make our marketing better!%0A%0ACall me! ☕',
                    'mailto:kevin@kevinplumlee.com?subject=Kevin OS > Apple OS 🚀 - Let\'s Talk Business&body=Hi Kevin,%0A%0AJust wanted to say your portfolio site is brilliant! The personalized apple menu responses had me cracking up, and your healthcare marketing expertise is exactly what our organization needs.%0A%0ALet\'s schedule a coffee break (I see you\'re properly caffeinated) to discuss potential collaboration.%0A%0ACheers!'
                ];
                
                const randomEmail = emails[Math.floor(Math.random() * emails.length)];
                window.location.href = randomEmail;
            }, 2000);
        });
    },
    
    // Update time display
    updateTime() {
        const timeElement = Utils.dom.get('current-time');
        if (timeElement) {
            timeElement.textContent = Utils.time.formatTime();
        }
        
        // Update detailed time if dropdown is open
        if (this.activeDropdown === 'time') {
            this.updateDetailedTime();
        }
    },
    
    // Start clock updates
    startClock() {
        setInterval(() => {
            this.updateTime();
        }, 1000);
    },
    
    // Manual test function to force show Apple dropdown
    forceShowAppleDropdown() {
        console.log('🧪 MANUAL TEST: Forcing Apple dropdown to show...');
        
        // First, ensure dropdown exists
        let appleDropdown = document.getElementById('apple-dropdown');
        if (!appleDropdown) {
            console.log('Creating Apple dropdown...');
            this.createDropdowns();
            appleDropdown = document.getElementById('apple-dropdown');
        }
        
        if (appleDropdown) {
            console.log('Found Apple dropdown, forcing it to show...');
            
            // Force all styles to make it visible
            appleDropdown.style.display = 'block';
            appleDropdown.style.visibility = 'visible';
            appleDropdown.style.opacity = '1';
            appleDropdown.style.position = 'absolute';
            appleDropdown.style.top = '24px';
            appleDropdown.style.left = '0px';
            appleDropdown.style.zIndex = '9999';
            appleDropdown.style.background = 'rgba(30, 30, 30, 0.95)';
            appleDropdown.style.borderRadius = '8px';
            appleDropdown.style.minWidth = '240px';
            appleDropdown.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
            appleDropdown.style.border = '1px solid rgba(255, 255, 255, 0.15)';
            
            console.log('✅ Apple dropdown forced to show with inline styles');
            console.log('📋 Dropdown HTML content:', appleDropdown.innerHTML);
            
            return true;
        } else {
            console.error('❌ Could not create Apple dropdown');
            return false;
        }
    },
    
    // Add special visual effects
    addScreenEffect(type) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 9999;
        `;
        
        if (type === 'force-quit') {
            effect.style.background = 'linear-gradient(45deg, #ff0000, #00ff00, #0000ff, #ffff00)';
            effect.style.opacity = '0.1';
            effect.style.animation = 'rainbow 2s ease-in-out';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes rainbow {
                    0%, 100% { opacity: 0; }
                    50% { opacity: 0.3; }
                }
            `;
            document.head.appendChild(style);
            
            setTimeout(() => {
                effect.remove();
                style.remove();
            }, 2000);
        }
        
        document.body.appendChild(effect);
    }
};

// Global access
window.MenuBarManager = MenuBarManager;

// Add global test functions for easy debugging
window.testAppleMenu = () => {
    console.log('🧪 Testing Apple menu from global function...');
    if (window.MenuBarManager) {
        return MenuBarManager.forceShowAppleDropdown();
    } else {
        console.error('MenuBarManager not available');
        return false;
    }
};

window.clickAppleMenu = () => {
            console.log('🧪 Simulating Plum menu click...');
            const appleElement = document.querySelector('.plum-icon.menu-icon');
    if (appleElement) {
        appleElement.click();
        return true;
    } else {
        console.error('Plum icon not found');
        return false;
    }
};

window.debugMenuBar = () => {
    console.log('🔍 Menu Bar Debug Info:');
    console.log('- MenuBarManager:', window.MenuBarManager);
            console.log('- Plum icon:', document.querySelector('.plum-icon.menu-icon'));
    console.log('- Apple dropdown:', document.getElementById('apple-dropdown'));
    console.log('- All dropdowns:', document.querySelectorAll('.menu-dropdown'));
    console.log('- Active dropdown:', window.MenuBarManager?.activeDropdown);
}; 