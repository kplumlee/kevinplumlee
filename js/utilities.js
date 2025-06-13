// Utility Functions
const Utils = {
    // DOM utilities
    dom: {
        // Get element by ID
        get: (id) => document.getElementById(id),
        
        // Get elements by class name
        getByClass: (className) => document.getElementsByClassName(className),
        
        // Query selector
        query: (selector) => document.querySelector(selector),
        
        // Query selector all
        queryAll: (selector) => document.querySelectorAll(selector),
        
        // Create element with attributes
        create: (tag, attributes = {}, content = '') => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'innerHTML') {
                    element.innerHTML = value;
                } else {
                    element.setAttribute(key, value);
                }
            });
            if (content) element.textContent = content;
            return element;
        },
        
        // Add event listener with cleanup
        on: (element, event, handler, options = {}) => {
            element.addEventListener(event, handler, options);
            return () => element.removeEventListener(event, handler, options);
        },
        
        // Remove all children
        empty: (element) => {
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
        },
        
        // Check if element is visible
        isVisible: (element) => {
            return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
        },
        
        // Get element position
        getPosition: (element) => {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + window.scrollX,
                y: rect.top + window.scrollY,
                width: rect.width,
                height: rect.height
            };
        }
    },
    
    // Animation utilities
    animation: {
        // Animate element
        animate: (element, keyframes, options = {}) => {
            const defaultOptions = {
                duration: 300,
                easing: 'ease-out',
                fill: 'forwards'
            };
            return element.animate(keyframes, { ...defaultOptions, ...options });
        },
        
        // Fade in
        fadeIn: (element, duration = 300) => {
            return Utils.animation.animate(element, [
                { opacity: 0 },
                { opacity: 1 }
            ], { duration });
        },
        
        // Fade out
        fadeOut: (element, duration = 300) => {
            return Utils.animation.animate(element, [
                { opacity: 1 },
                { opacity: 0 }
            ], { duration });
        },
        
        // Slide in from bottom
        slideInUp: (element, duration = 600) => {
            return Utils.animation.animate(element, [
                { transform: 'translateY(30px)', opacity: 0 },
                { transform: 'translateY(0)', opacity: 1 }
            ], { duration, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' });
        },
        
        // Bounce animation
        bounce: (element, duration = 600) => {
            return Utils.animation.animate(element, [
                { transform: 'translateY(0)' },
                { transform: 'translateY(-20px)', offset: 0.4 },
                { transform: 'translateY(0)', offset: 0.6 },
                { transform: 'translateY(-10px)', offset: 0.8 },
                { transform: 'translateY(0)' }
            ], { duration });
        },
        
        // Scale animation
        scale: (element, fromScale = 0.5, toScale = 1, duration = 300) => {
            return Utils.animation.animate(element, [
                { transform: `scale(${fromScale})`, opacity: 0 },
                { transform: `scale(${toScale})`, opacity: 1 }
            ], { duration });
        }
    },
    
    // Math utilities
    math: {
        // Clamp value between min and max
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),
        
        // Linear interpolation
        lerp: (start, end, factor) => start + (end - start) * factor,
        
        // Distance between two points
        distance: (x1, y1, x2, y2) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        
        // Random number between min and max
        random: (min, max) => Math.random() * (max - min) + min,
        
        // Random integer between min and max
        randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
        
        // Easing functions
        easing: {
            easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeOut: (t) => t * (2 - t),
            easeIn: (t) => t * t,
            bounce: (t) => {
                if (t < 1/2.75) return 7.5625 * t * t;
                else if (t < 2/2.75) return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
                else if (t < 2.5/2.75) return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
                else return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
            }
        }
    },
    
    // Time utilities
    time: {
        // Debounce function
        debounce: (func, wait, immediate = false) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        
        // Throttle function
        throttle: (func, limit) => {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },
        
        // Wait for a specified time
        wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
        
        // Format time
        formatTime: (date = new Date()) => {
            return date.toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
        },
        
        // Get time of day greeting
        getGreeting: () => {
            const hour = new Date().getHours();
            if (hour < 12) return 'Good morning';
            if (hour < 18) return 'Good afternoon';
            return 'Good evening';
        }
    },
    
    // Storage utilities
    storage: {
        // Set item in localStorage
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.warn('Failed to save to localStorage:', e);
                return false;
            }
        },
        
        // Get item from localStorage
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('Failed to load from localStorage:', e);
                return defaultValue;
            }
        },
        
        // Remove item from localStorage
        remove: (key) => {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Failed to remove from localStorage:', e);
                return false;
            }
        },
        
        // Clear all localStorage
        clear: () => {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.warn('Failed to clear localStorage:', e);
                return false;
            }
        }
    },
    
    // String utilities
    string: {
        // Capitalize first letter
        capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
        
        // Convert to kebab-case
        kebabCase: (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`),
        
        // Convert to camelCase
        camelCase: (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase()),
        
        // Truncate string
        truncate: (str, length, suffix = '...') => {
            return str.length > length ? str.substring(0, length) + suffix : str;
        },
        
        // Generate random string
        random: (length = 8) => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        }
    },
    
    // Event utilities
    event: {
        // Custom event emitter
        emitter: () => {
            const events = {};
            return {
                on: (event, callback) => {
                    if (!events[event]) events[event] = [];
                    events[event].push(callback);
                },
                off: (event, callback) => {
                    if (events[event]) {
                        events[event] = events[event].filter(cb => cb !== callback);
                    }
                },
                emit: (event, ...args) => {
                    if (events[event]) {
                        events[event].forEach(callback => callback(...args));
                    }
                }
            };
        },
        
        // Prevent default and stop propagation
        stop: (e) => {
            e.preventDefault();
            e.stopPropagation();
        },
        
        // Check if key combination matches
        matchKey: (e, combo) => {
            const keys = combo.toLowerCase().split('+');
            const hasCtrl = keys.includes('ctrl') && (e.ctrlKey || e.metaKey);
            const hasShift = keys.includes('shift') && e.shiftKey;
            const hasAlt = keys.includes('alt') && e.altKey;
            const keyPressed = e.key.toLowerCase();
            
            const mainKey = keys.find(k => !['ctrl', 'cmd', 'shift', 'alt'].includes(k));
            
            return (!keys.includes('ctrl') || hasCtrl) &&
                   (!keys.includes('shift') || hasShift) &&
                   (!keys.includes('alt') || hasAlt) &&
                   (keyPressed === mainKey);
        }
    },
    
    // Device utilities
    device: {
        // Check if mobile device
        isMobile: () => window.innerWidth <= Config.breakpoints.mobile,
        
        // Check if tablet device
        isTablet: () => window.innerWidth <= Config.breakpoints.tablet && window.innerWidth > Config.breakpoints.mobile,
        
        // Check if desktop device
        isDesktop: () => window.innerWidth > Config.breakpoints.tablet,
        
        // Check if touch device
        isTouch: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        
        // Get device info
        getInfo: () => ({
            width: window.innerWidth,
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            userAgent: navigator.userAgent,
            isMobile: Utils.device.isMobile(),
            isTablet: Utils.device.isTablet(),
            isDesktop: Utils.device.isDesktop(),
            isTouch: Utils.device.isTouch()
        })
    },
    
    // Performance utilities
    performance: {
        // Request animation frame with fallback
        raf: (callback) => {
            return (window.requestAnimationFrame || 
                    window.webkitRequestAnimationFrame || 
                    window.mozRequestAnimationFrame || 
                    ((cb) => setTimeout(cb, 16)))(callback);
        },
        
        // Cancel animation frame
        cancelRaf: (id) => {
            return (window.cancelAnimationFrame || 
                    window.webkitCancelAnimationFrame || 
                    window.mozCancelAnimationFrame || 
                    clearTimeout)(id);
        },
        
        // Measure performance
        measure: (name, fn) => {
            const start = performance.now();
            const result = fn();
            const end = performance.now();
            console.log(`${name} took ${end - start} milliseconds.`);
            return result;
        }
    },
    
    // Logger utility
    logger: {
        debug: (...args) => Config.debug.enabled && console.debug('[DEBUG]', ...args),
        info: (...args) => Config.debug.enabled && console.info('[INFO]', ...args),
        warn: (...args) => console.warn('[WARN]', ...args),
        error: (...args) => console.error('[ERROR]', ...args)
    }
};

// Progressive Image Loading for Performance
class ProgressiveImageLoader {
    static createPlaceholder(width, height, color = '#f0f0f0') {
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='${width}' height='${height}' fill='${color}'/%3E%3C/svg%3E`;
    }

    static loadImageProgressive(img, highResSrc, options = {}) {
        const { 
            lowResSrc = null,
            onProgress = null,
            onComplete = null,
            onError = null 
        } = options;

        // Start with placeholder or low-res version
        if (lowResSrc) {
            img.src = lowResSrc;
            img.style.filter = 'blur(2px)';
        }

        // Load high-res image
        const highResImg = new Image();
        
        highResImg.onload = () => {
            img.src = highResSrc;
            img.style.filter = 'none';
            img.style.transition = 'filter 0.3s ease';
            
            if (onComplete) onComplete(img);
        };

        highResImg.onerror = () => {
            if (onError) onError(img);
        };

        // Report progress if supported
        if (onProgress && 'loading' in HTMLImageElement.prototype) {
            img.addEventListener('progress', onProgress);
        }

        highResImg.src = highResSrc;
    }

    static optimizeForViewport(imageSrc, maxWidth = window.innerWidth) {
        // For very large images, we could implement different sizes
        // This is a placeholder for future optimization
        return imageSrc;
    }
}

// Network Performance Monitor
class NetworkMonitor {
    static getConnectionType() {
        if ('connection' in navigator) {
            return navigator.connection.effectiveType || 'unknown';
        }
        return 'unknown';
    }

    static shouldUseHighQualityImages() {
        const connection = this.getConnectionType();
        const isSlowConnection = ['slow-2g', '2g'].includes(connection);
        const reducedData = window.matchMedia('(prefers-reduced-data: reduce)').matches;
        
        return !isSlowConnection && !reducedData;
    }

    static getOptimalImageFormat() {
        // Check WebP support
        const canvas = document.createElement('canvas');
        const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        
        return webpSupported ? 'webp' : 'jpg';
    }
}

// Add to Utils namespace
Utils.ProgressiveImageLoader = ProgressiveImageLoader;
Utils.NetworkMonitor = NetworkMonitor;

// Global utilities access
window.Utils = Utils; 