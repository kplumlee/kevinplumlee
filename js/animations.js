// Animations Manager Module
const AnimationsManager = {
    activeAnimations: new Set(),
    
    // Initialize animations system
    init() {
        this.setupAnimationHelpers();
        Utils.logger.debug('Animations Manager initialized');
    },
    
    // Set up animation helpers
    setupAnimationHelpers() {
        // Track active animations
        this.interceptAnimations();
    },
    
    // Intercept and track animations
    interceptAnimations() {
        const originalAnimate = Element.prototype.animate;
        
        Element.prototype.animate = function(keyframes, options) {
            const animation = originalAnimate.call(this, keyframes, options);
            
            AnimationsManager.activeAnimations.add(animation);
            
            animation.addEventListener('finish', () => {
                AnimationsManager.activeAnimations.delete(animation);
            });
            
            animation.addEventListener('cancel', () => {
                AnimationsManager.activeAnimations.delete(animation);
            });
            
            return animation;
        };
    },
    
    // Cancel all animations
    cancelAll() {
        this.activeAnimations.forEach(animation => {
            animation.cancel();
        });
        this.activeAnimations.clear();
    },
    
    // Get active animation count
    getActiveCount() {
        return this.activeAnimations.size;
    }
};

// Global access
window.AnimationsManager = AnimationsManager; 