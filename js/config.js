// Configuration and Constants
const Config = {
    // Animation settings
    animations: {
        windowOpenDuration: 300,
        windowCloseDuration: 200,
        minimizeDuration: 300,
        dockHoverScale: 1.2,
        dockHoverDistance: 100,
        transitionEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
    },
    
    // Window settings
    windows: {
        defaultWidth: 1200,
        defaultHeight: 800,
        minWidth: 1000,
        minHeight: 700,
        maxZIndex: 9999,
        snapDistance: 20,
        resizeHandleSize: 20
    },
    
    // Dock settings
    dock: {
        autoHide: false,
        magnification: true,
        position: 'bottom',
        items: [
            { id: 'about', icon: 'fas fa-user-circle', title: 'About Me' },
            { id: 'projects', icon: 'fas fa-folder', title: 'Projects' },
            { id: 'resume', icon: 'fas fa-file-alt', title: 'Resume' },
            { id: 'contact', icon: 'fas fa-envelope', title: 'Contact' },
            { type: 'separator' },
            { id: 'finder', icon: 'fas fa-search', title: 'Finder' },
            { id: 'settings', icon: 'fas fa-cog', title: 'Settings' },
            { id: 'trash', icon: 'fas fa-trash', title: 'Trash' }
        ]
    },
    
    // Desktop settings
    desktop: {
        iconGrid: {
            width: 80,
            height: 100,
            spacing: 20
        },
        wallpaper: {
            type: 'gradient',
            colors: ['#667eea', '#764ba2'],
            animated: true
        }
    },
    
    // Contact form settings
    contact: {
        maxNameLength: 50,
        maxEmailLength: 100,
        maxMessageLength: 1000,
        validationDelay: 500,
        submitDelay: 1500
    },
    
    // Content loading settings
    content: {
        loadingDelay: 200,
        errorRetryAttempts: 3,
        cacheTimeout: 300000 // 5 minutes
    },
    
    // Debug settings
    debug: {
        enabled: false,
        logLevel: 'info', // 'debug', 'info', 'warn', 'error'
        showFPS: false,
        enableConsoleCommands: true
    },
    
    // Responsive breakpoints
    breakpoints: {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        largeDesktop: 1440
    },
    
    // Theme settings
    theme: {
        primaryColor: '#007AFF',
        secondaryColor: '#667eea',
        accentColor: '#764ba2',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        textColor: '#1d1d1f',
        borderRadius: 12,
        backdropBlur: 20
    },
    
    // Performance settings
    performance: {
        enableGPUAcceleration: true,
        enableAnimations: true,
        enableBackdropFilter: true,
        enableShadows: true,
        maxConcurrentAnimations: 5
    },
    
    // Keyboard shortcuts
    shortcuts: {
        closeWindow: ['cmd+w', 'ctrl+w'],
        minimizeWindow: ['cmd+m', 'ctrl+m'],
        maximizeWindow: ['cmd+shift+f', 'ctrl+shift+f'],
        openAbout: ['cmd+1', 'ctrl+1'],
        openProjects: ['cmd+2', 'ctrl+2'],
        openResume: ['cmd+3', 'ctrl+3'],
        openContact: ['cmd+4', 'ctrl+4']
    },
    
    // API endpoints (if needed)
    api: {
        baseUrl: '',
        endpoints: {
            contact: '/api/contact',
            analytics: '/api/analytics'
        },
        timeout: 10000
    },
    
    // Local storage keys
    storage: {
        windowPositions: 'macos_portfolio_window_positions',
        preferences: 'macos_portfolio_preferences',
        theme: 'macos_portfolio_theme',
        lastVisit: 'macos_portfolio_last_visit'
    },
    
    // Social links
    social: {
        github: 'https://github.com/kevinplumlee',
        linkedin: 'https://linkedin.com/in/kevinplumlee',
        twitter: 'https://twitter.com/kevinplumlee'
    },
    
    // Analytics settings
    analytics: {
        trackWindowOpens: true,
        trackTimeSpent: true,
        trackInteractions: true,
        sendInterval: 60000 // 1 minute
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Config;
}

// Global configuration access
window.PortfolioConfig = Config; 