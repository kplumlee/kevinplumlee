// Window Manager Module - Extended functionality
const WindowManager = {
    dragState: {
        isDragging: false,
        element: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0
    },
    
    // Initialize advanced window features
    init() {
        this.setupWindowDragging();
        this.setupWindowResizing();
        this.setupResizeObserver();
        Utils.logger.debug('Window Manager initialized');
    },
    
    // Set up resize observer for automatic layout recalculation
    setupResizeObserver() {
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    const window = entry.target;
                    if (window.classList.contains('window') && window.classList.contains('active')) {
                        setTimeout(() => {
                            this.recalculateWindowLayout(window);
                        }, 10);
                    }
                });
            });
            
            // Observe all windows
            Utils.dom.queryAll('.window').forEach(window => {
                resizeObserver.observe(window);
            });
        }
        
        // Fallback for browsers without ResizeObserver
        Utils.dom.on(window, 'resize', Utils.time.debounce(() => {
            Utils.dom.queryAll('.window.active').forEach(window => {
                this.recalculateWindowLayout(window);
            });
        }, 250));
    },
    
    // Recalculate window layout for proper scrolling
    recalculateWindowLayout(window) {
        const content = window.querySelector('.window-content');
        if (!content) return;
        
        // Get actual dimensions
        const windowRect = window.getBoundingClientRect();
        const header = window.querySelector('.window-header');
        const headerHeight = header ? header.offsetHeight : 36;
        
        // Calculate available content height
        const availableHeight = windowRect.height - headerHeight;
        
        // Update content height
        content.style.height = availableHeight + 'px';
        
        // Force scroll state recalculation
        if (content.scrollHeight > content.clientHeight) {
            content.style.overflowY = 'auto';
        } else {
            content.style.overflowY = 'hidden';
        }
        
        // Trigger scroll event to update scrollbar visibility
        content.dispatchEvent(new Event('scroll'));
    },
    
    // Set up window dragging
    setupWindowDragging() {
        Utils.dom.queryAll('.window-header').forEach(header => {
            Utils.dom.on(header, 'mousedown', this.startDrag.bind(this));
        });
        
        Utils.dom.on(document, 'mousemove', this.handleDrag.bind(this));
        Utils.dom.on(document, 'mouseup', this.stopDrag.bind(this));
    },
    
    // Set up window resizing
    setupWindowResizing() {
        Utils.dom.queryAll('.window').forEach(window => {
            this.addResizeHandle(window);
        });
    },
    
    // Start dragging
    startDrag(e) {
        const window = e.currentTarget.closest('.window');
        if (!window || window.classList.contains('maximized')) return;
        
        // Bring window to front when starting to drag
        const appName = window.dataset.app;
        if (appName && window.PortfolioApp) {
            window.PortfolioApp.bringWindowToFront(appName);
        }
        
        this.dragState.isDragging = true;
        this.dragState.element = window;
        this.dragState.startX = e.clientX;
        this.dragState.startY = e.clientY;
        
        const rect = window.getBoundingClientRect();
        this.dragState.offsetX = e.clientX - rect.left;
        this.dragState.offsetY = e.clientY - rect.top;
        
        window.style.cursor = 'grabbing';
        window.classList.add('dragging');
        
        // Prevent event bubbling to avoid conflicts with click handlers
        e.stopPropagation();
    },
    
    // Handle dragging
    handleDrag(e) {
        if (!this.dragState.isDragging) return;
        
        const window = this.dragState.element;
        const newX = e.clientX - this.dragState.offsetX;
        const newY = e.clientY - this.dragState.offsetY;
        
        window.style.left = Math.max(0, newX) + 'px';
        window.style.top = Math.max(0, newY) + 'px';
    },
    
    // Stop dragging
    stopDrag() {
        if (this.dragState.isDragging) {
            this.dragState.element.style.cursor = 'default';
            this.dragState.element.classList.remove('dragging');
            this.dragState.isDragging = false;
            this.dragState.element = null;
        }
    },
    
    // Add resize handle to window
    addResizeHandle(window) {
        const resizeHandle = Utils.dom.create('div', {
            className: 'resize-handle',
            style: 'position: absolute; bottom: 0; right: 0; width: 20px; height: 20px; cursor: se-resize;'
        });
        
        window.appendChild(resizeHandle);
        
        let isResizing = false;
        
        Utils.dom.on(resizeHandle, 'mousedown', (e) => {
            isResizing = true;
            e.stopPropagation();
            window.classList.add('resizing');
        });
        
        Utils.dom.on(document, 'mousemove', (e) => {
            if (!isResizing) return;
            
            const rect = window.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;
            
            window.style.width = Math.max(Config.windows.minWidth, newWidth) + 'px';
            window.style.height = Math.max(Config.windows.minHeight, newHeight) + 'px';
            
            // Recalculate layout during resize
            this.recalculateWindowLayout(window);
        });
        
        Utils.dom.on(document, 'mouseup', () => {
            if (isResizing) {
                window.classList.remove('resizing');
                // Final layout recalculation after resize
                setTimeout(() => {
                    this.recalculateWindowLayout(window);
                }, 50);
            }
            isResizing = false;
        });
    }
};

// Global access
window.WindowManager = WindowManager; 