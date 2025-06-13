// Enhanced Dock Manager Module - macOS Style Magnification
const DockManager = {
    state: {
        isHovered: false,
        mouseX: 0,
        items: [],
        maxScale: 1.8,
        baseScale: 1,
        influence: 150, // Distance of influence in pixels
        scalingSpeed: 0.15 // Animation smoothing factor
    },

    // Initialize dock functionality
    init() {
        this.setupDockItems();
        this.setupMagnificationEvents();
        this.setupHoverEffects();
        this.startAnimationLoop();
        Utils.logger.debug('Enhanced Dock Manager initialized');
    },

    // Setup dock items array for efficient management
    setupDockItems() {
        const dockItems = Utils.dom.queryAll('.dock-item');
        this.state.items = Array.from(dockItems).map(item => ({
            element: item,
            originalRect: null,
            currentScale: 1,
            targetScale: 1,
            centerX: 0
        }));
        
        this.updateItemPositions();
    },

    // Update item center positions
    updateItemPositions() {
        const dock = Utils.dom.get('dock');
        if (!dock) return;
        
        const dockRect = dock.getBoundingClientRect();
        
        this.state.items.forEach(item => {
            const rect = item.element.getBoundingClientRect();
            item.centerX = rect.left + rect.width / 2 - dockRect.left;
            item.originalRect = {
                width: rect.width,
                height: rect.height
            };
        });
    },

    // Setup magnification event listeners
    setupMagnificationEvents() {
        const dock = Utils.dom.get('dock');
        if (!dock) return;
        
        // Mouse enter dock
        Utils.dom.on(dock, 'mouseenter', (e) => {
            this.state.isHovered = true;
            dock.classList.add('dock-magnification');
        });
        
        // Mouse move within dock
        Utils.dom.on(dock, 'mousemove', (e) => {
            this.handleMouseMove(e);
        });
        
        // Mouse leave dock
        Utils.dom.on(dock, 'mouseleave', () => {
            this.state.isHovered = false;
            dock.classList.remove('dock-magnification');
            this.resetMagnification();
        });

        // Handle window resize
        Utils.dom.on(window, 'resize', () => {
            this.updateItemPositions();
        });
    },

    // Handle mouse movement for magnification
    handleMouseMove(e) {
        if (!this.state.isHovered) return;
        
        const dock = e.currentTarget;
        const dockRect = dock.getBoundingClientRect();
        this.state.mouseX = e.clientX - dockRect.left;
        
        this.calculateMagnification();
    },

    // Calculate magnification scales for all items
    calculateMagnification() {
        this.state.items.forEach(item => {
            const distance = Math.abs(this.state.mouseX - item.centerX);
            
            // Calculate scale based on distance with smooth curve
            let scale = this.state.baseScale;
            
            if (distance <= this.state.influence) {
                // Use a smooth easing curve for natural magnification
                const normalizedDistance = distance / this.state.influence;
                const easedDistance = 1 - Math.pow(normalizedDistance, 1.5);
                scale = this.state.baseScale + (this.state.maxScale - this.state.baseScale) * easedDistance;
            }
            
            item.targetScale = Math.max(this.state.baseScale, Math.min(this.state.maxScale, scale));
        });
    },

    // Animation loop for smooth scaling
    startAnimationLoop() {
        const animate = () => {
            let hasChanges = false;
            
            this.state.items.forEach((item, index) => {
                // Smooth animation towards target scale
                const diff = item.targetScale - item.currentScale;
                
                if (Math.abs(diff) > 0.001) {
                    item.currentScale += diff * this.state.scalingSpeed;
                    hasChanges = true;
                    
                    // Apply transform with improved spacing
                    this.applyItemTransform(item, index);
                }
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    },

    // Apply transform to individual dock item
    applyItemTransform(item, index) {
        const scale = item.currentScale;
        
        // Calculate spacing adjustment to prevent overlap
        const spacing = this.calculateSpacing(index, scale);
        
        // Apply combined transform
        const transform = `translateX(${spacing}px) translateY(${-Math.max(0, (scale - 1) * 8)}px) scale(${scale})`;
        item.element.style.transform = transform;
        
        // Adjust z-index for proper layering
        item.element.style.zIndex = Math.round(scale * 100);
    },

    // Calculate spacing adjustment to prevent overlapping
    calculateSpacing(index, scale) {
        let spacing = 0;
        const items = this.state.items;
        
        // Calculate cumulative spacing from items to the left
        for (let i = 0; i < index; i++) {
            const leftItemScale = items[i].currentScale;
            const extraSpace = (leftItemScale - 1) * 24; // Adjust multiplier as needed
            spacing += extraSpace;
        }
        
        return spacing;
    },

    // Reset magnification to normal state
    resetMagnification() {
        this.state.items.forEach(item => {
            item.targetScale = this.state.baseScale;
        });
    },

    // Setup hover effects for individual items
    setupHoverEffects() {
        this.state.items.forEach(item => {
            Utils.dom.on(item.element, 'mouseenter', () => {
                item.element.classList.add('hover');
                
                // Add subtle bounce effect
                if (!this.state.isHovered) {
                    item.element.style.transform = 'translateY(-4px) scale(1.1)';
                }
            });
            
            Utils.dom.on(item.element, 'mouseleave', () => {
                item.element.classList.remove('hover');
                
                // Reset if not in magnification mode
                if (!this.state.isHovered) {
                    item.element.style.transform = 'scale(1)';
                    item.element.style.zIndex = '';
                }
            });
            
            // Add click feedback
            Utils.dom.on(item.element, 'click', (e) => {
                this.showClickFeedback(item.element);
            });
        });
    },

    // Show visual feedback when dock item is clicked
    showClickFeedback(element) {
        // Add click effect class
        element.classList.add('dock-click-feedback');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'dock-ripple';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = rect.width / 2 - size / 2 + 'px';
        ripple.style.top = rect.height / 2 - size / 2 + 'px';
        
        element.appendChild(ripple);
        
        // Remove effects after animation
        setTimeout(() => {
            element.classList.remove('dock-click-feedback');
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 300);
    },

    // Enhanced feedback for specific actions
    showToggleCloseFeedback(appName) {
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (!dockItem) return;
        
        // Special animation for closing
        dockItem.style.transform = 'scale(0.85) rotate(5deg)';
        dockItem.style.transition = 'all 0.15s ease-out';
        
        setTimeout(() => {
            dockItem.style.transform = '';
            dockItem.style.transition = '';
        }, 150);
    },

    // Enhanced feedback for opening apps
    showOpenFeedback(appName) {
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (!dockItem) return;
        
        // Bounce animation for opening
        dockItem.style.animation = 'dockBounce 0.4s ease-in-out';
        
        setTimeout(() => {
            dockItem.style.animation = '';
        }, 400);
    },

    // Public API methods
    setMagnificationLevel(level) {
        this.state.maxScale = Math.max(1, Math.min(3, level));
    },

    setInfluenceRadius(radius) {
        this.state.influence = Math.max(50, Math.min(300, radius));
    },

    setAnimationSpeed(speed) {
        this.state.scalingSpeed = Math.max(0.05, Math.min(0.5, speed));
    },

    // Add new dock item dynamically
    addDockItem(element) {
        const newItem = {
            element: element,
            originalRect: null,
            currentScale: 1,
            targetScale: 1,
            centerX: 0
        };
        
        this.state.items.push(newItem);
        this.updateItemPositions();
        this.setupHoverEffects();
    },

    // Debug info
    getDebugInfo() {
        return {
            isHovered: this.state.isHovered,
            mouseX: this.state.mouseX,
            itemCount: this.state.items.length,
            maxScale: this.state.maxScale,
            influence: this.state.influence
        };
    }
};

// Global access and testing functions
window.DockManager = DockManager;

// Testing utilities
window.testDockMagnification = function(maxScale = 1.8, influence = 150, speed = 0.15) {
    DockManager.setMagnificationLevel(maxScale);
    DockManager.setInfluenceRadius(influence);
    DockManager.setAnimationSpeed(speed);
    console.log('🎯 Dock magnification updated:', { maxScale, influence, speed });
};

window.getDockDebug = function() {
    console.log('🔍 Dock Debug Info:', DockManager.getDebugInfo());
}; 