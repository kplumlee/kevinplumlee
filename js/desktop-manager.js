// Desktop Manager Module
const DesktopManager = {
    // Drag state management
    dragState: {
        isDragging: false,
        draggedIcon: null,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        originalPosition: null,
        dragThreshold: 5,
        dragTimeout: null
    },
    
    // Click state management
    clickState: {
        clickTimeout: null,
        clickDelay: 200,
        lastClickedIcon: null
    },
    
    // Grid configuration
    gridConfig: {
        cellWidth: 100,
        cellHeight: 120,
        gap: 10,
        padding: 20
    },
    
    // Initialize desktop functionality
    init() {
        this.setupIconSelection();
        this.setupIconDragging();
        this.setupGridPositioning();
        this.updateGridConfig();
        Utils.logger.debug('Desktop Manager initialized');
    },
    
    // Update grid configuration based on screen size
    updateGridConfig() {
        const desktop = Utils.dom.get('desktop');
        const desktopRect = desktop.getBoundingClientRect();
        
        if (window.innerWidth <= 480) {
            this.gridConfig = { cellWidth: 80, cellHeight: 100, gap: 6, padding: 10 };
        } else if (window.innerWidth <= 768) {
            this.gridConfig = { cellWidth: 90, cellHeight: 110, gap: 8, padding: 15 };
        } else {
            this.gridConfig = { cellWidth: 100, cellHeight: 120, gap: 10, padding: 20 };
        }
        
        // Update CSS custom properties
        document.documentElement.style.setProperty('--grid-cell-width', this.gridConfig.cellWidth + 'px');
        document.documentElement.style.setProperty('--grid-cell-height', this.gridConfig.cellHeight + 'px');
        document.documentElement.style.setProperty('--grid-gap', this.gridConfig.gap + 'px');
    },
    
    // Set up icon selection
    setupIconSelection() {
        Utils.dom.queryAll('.desktop-icon').forEach(icon => {
            Utils.dom.on(icon, 'click', (e) => {
                e.stopPropagation();
                this.handleIconClick(icon);
            });
            
            // Double-click to open (existing functionality)
            Utils.dom.on(icon, 'dblclick', (e) => {
                e.stopPropagation();
                e.preventDefault();
                
                // Clear any pending single click
                if (this.clickState.clickTimeout) {
                    clearTimeout(this.clickState.clickTimeout);
                    this.clickState.clickTimeout = null;
                }
                
                const appName = icon.dataset.app;
                if (window.PortfolioApp && typeof window.PortfolioApp.openApplication === 'function') {
                    window.PortfolioApp.openApplication(appName);
                }
            });
        });
        
        Utils.dom.on(Utils.dom.get('desktop'), 'click', () => {
            this.deselectAll();
        });
    },
    
    // Handle icon click with delay to distinguish from double-click
    handleIconClick(icon) {
        // Clear any existing timeout
        if (this.clickState.clickTimeout) {
            clearTimeout(this.clickState.clickTimeout);
            this.clickState.clickTimeout = null;
        }
        
        // Set timeout for single click action
        this.clickState.clickTimeout = setTimeout(() => {
            this.selectIcon(icon);
            this.clickState.clickTimeout = null;
        }, this.clickState.clickDelay);
        
        this.clickState.lastClickedIcon = icon;
    },
    
    // Set up icon dragging
    setupIconDragging() {
        Utils.dom.queryAll('.desktop-icon').forEach(icon => {
            Utils.dom.on(icon, 'mousedown', this.startDrag.bind(this));
        });
        
        Utils.dom.on(document, 'mousemove', this.handleDrag.bind(this));
        Utils.dom.on(document, 'mouseup', this.stopDrag.bind(this));
        
        // Touch events for mobile
        Utils.dom.queryAll('.desktop-icon').forEach(icon => {
            Utils.dom.on(icon, 'touchstart', this.startDrag.bind(this), { passive: false });
        });
        
        Utils.dom.on(document, 'touchmove', this.handleDrag.bind(this), { passive: false });
        Utils.dom.on(document, 'touchend', this.stopDrag.bind(this));
    },
    
    // Start dragging an icon
    startDrag(e) {
        const icon = e.currentTarget;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Store initial position for drag detection
        this.dragState.startX = clientX;
        this.dragState.startY = clientY;
        this.dragState.draggedIcon = icon;
        
        const rect = icon.getBoundingClientRect();
        this.dragState.offsetX = clientX - rect.left;
        this.dragState.offsetY = clientY - rect.top;
        
        // Store original grid position
        this.dragState.originalPosition = {
            column: icon.style.gridColumn || getComputedStyle(icon).gridColumn,
            row: icon.style.gridRow || getComputedStyle(icon).gridRow
        };
        
        // Set a timeout to start dragging - this allows clicks to work
        this.dragState.dragTimeout = setTimeout(() => {
            if (!this.dragState.isDragging && this.dragState.draggedIcon === icon) {
                this.beginDrag(icon, rect);
            }
        }, 150);
        
        // Prevent text selection during potential drag
        e.preventDefault();
    },
    
    // Begin the actual drag operation
    beginDrag(icon, rect) {
        this.dragState.isDragging = true;
        
        // Add dragging class and make it float
        icon.classList.add('dragging');
        icon.style.left = rect.left + 'px';
        icon.style.top = rect.top + 'px';
        
        // Select the icon being dragged
        this.selectIcon(icon);
        
        // Prevent text selection
        document.body.style.userSelect = 'none';
        
        Utils.logger.debug('Started dragging icon:', icon.dataset.app);
    },
    
    // Handle drag movement
    handleDrag(e) {
        if (!this.dragState.draggedIcon) return;
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Check if we've moved enough to start dragging
        const deltaX = Math.abs(clientX - this.dragState.startX);
        const deltaY = Math.abs(clientY - this.dragState.startY);
        
        if (!this.dragState.isDragging && (deltaX > this.dragState.dragThreshold || deltaY > this.dragState.dragThreshold)) {
            // Clear the drag timeout and start dragging immediately
            if (this.dragState.dragTimeout) {
                clearTimeout(this.dragState.dragTimeout);
                this.dragState.dragTimeout = null;
            }
            
            const rect = this.dragState.draggedIcon.getBoundingClientRect();
            this.beginDrag(this.dragState.draggedIcon, rect);
        }
        
        if (!this.dragState.isDragging) return;
        
        e.preventDefault();
        
        const icon = this.dragState.draggedIcon;
        const newX = clientX - this.dragState.offsetX;
        const newY = clientY - this.dragState.offsetY;
        
        // Update icon position
        icon.style.left = newX + 'px';
        icon.style.top = newY + 'px';
        
        // Show grid position hints
        this.showGridHints(clientX, clientY);
    },
    
    // Stop dragging
    stopDrag(e) {
        // Clear drag timeout if it exists
        if (this.dragState.dragTimeout) {
            clearTimeout(this.dragState.dragTimeout);
            this.dragState.dragTimeout = null;
        }
        
        if (!this.dragState.isDragging) {
            // If we weren't dragging, just reset the drag state
            this.dragState.draggedIcon = null;
            return;
        }
        
        const icon = this.dragState.draggedIcon;
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        
        // Calculate grid position
        const gridPosition = this.getGridPosition(clientX, clientY);
        
        // Check if position is valid and not occupied
        if (this.isValidGridPosition(gridPosition) && !this.isGridPositionOccupied(gridPosition, icon)) {
            // Snap to grid
            this.snapToGrid(icon, gridPosition);
            Utils.logger.debug('Icon snapped to grid:', gridPosition);
        } else {
            // Revert to original position
            this.revertToOriginalPosition(icon);
            Utils.logger.debug('Icon reverted to original position');
        }
        
        // Clean up
        icon.classList.remove('dragging');
        icon.style.left = '';
        icon.style.top = '';
        this.hideGridHints();
        document.body.style.userSelect = '';
        
        // Reset drag state
        this.dragState.isDragging = false;
        this.dragState.draggedIcon = null;
        
        Utils.logger.debug('Stopped dragging icon');
    },
    
    // Get grid position from mouse coordinates
    getGridPosition(clientX, clientY) {
        const desktop = Utils.dom.get('desktop');
        const desktopRect = desktop.getBoundingClientRect();
        
        const relativeX = clientX - desktopRect.left - this.gridConfig.padding;
        const relativeY = clientY - desktopRect.top - this.gridConfig.padding;
        
        const column = Math.max(1, Math.floor(relativeX / (this.gridConfig.cellWidth + this.gridConfig.gap)) + 1);
        const row = Math.max(1, Math.floor(relativeY / (this.gridConfig.cellHeight + this.gridConfig.gap)) + 1);
        
        return { column, row };
    },
    
    // Check if grid position is valid
    isValidGridPosition(position) {
        const desktop = Utils.dom.get('desktop');
        const desktopRect = desktop.getBoundingClientRect();
        
        const maxColumns = Math.floor((desktopRect.width - this.gridConfig.padding * 2) / (this.gridConfig.cellWidth + this.gridConfig.gap));
        const maxRows = Math.floor((desktopRect.height - this.gridConfig.padding * 2) / (this.gridConfig.cellHeight + this.gridConfig.gap));
        
        return position.column >= 1 && position.column <= maxColumns && 
               position.row >= 1 && position.row <= maxRows;
    },
    
    // Check if grid position is occupied by another icon
    isGridPositionOccupied(position, excludeIcon) {
        const icons = Utils.dom.queryAll('.desktop-icon');
        
        for (let icon of icons) {
            if (icon === excludeIcon) continue;
            
            const iconColumn = parseInt(icon.style.gridColumn || getComputedStyle(icon).gridColumn);
            const iconRow = parseInt(icon.style.gridRow || getComputedStyle(icon).gridRow);
            
            if (iconColumn === position.column && iconRow === position.row) {
                return true;
            }
        }
        
        return false;
    },
    
    // Snap icon to grid position
    snapToGrid(icon, position) {
        icon.style.gridColumn = position.column;
        icon.style.gridRow = position.row;
        
        // Store position in localStorage for persistence
        this.saveIconPosition(icon.dataset.app, position);
    },
    
    // Revert icon to original position
    revertToOriginalPosition(icon) {
        if (this.dragState.originalPosition) {
            icon.style.gridColumn = this.dragState.originalPosition.column;
            icon.style.gridRow = this.dragState.originalPosition.row;
        }
    },
    
    // Show grid positioning hints
    showGridHints(clientX, clientY) {
        // Remove existing hints
        this.hideGridHints();
        
        const position = this.getGridPosition(clientX, clientY);
        
        if (this.isValidGridPosition(position) && !this.isGridPositionOccupied(position, this.dragState.draggedIcon)) {
            // Create visual hint
            const hint = Utils.dom.create('div', {
                className: 'desktop-grid-cell highlight',
                style: `
                    position: absolute;
                    left: ${this.gridConfig.padding + (position.column - 1) * (this.gridConfig.cellWidth + this.gridConfig.gap)}px;
                    top: ${this.gridConfig.padding + (position.row - 1) * (this.gridConfig.cellHeight + this.gridConfig.gap)}px;
                    width: ${this.gridConfig.cellWidth}px;
                    height: ${this.gridConfig.cellHeight}px;
                    z-index: 5;
                `
            });
            
            Utils.dom.get('desktop').appendChild(hint);
        }
    },
    
    // Hide grid positioning hints
    hideGridHints() {
        Utils.dom.queryAll('.desktop-grid-cell').forEach(hint => {
            hint.remove();
        });
    },
    
    // Set up grid positioning system
    setupGridPositioning() {
        // Load saved positions
        this.loadIconPositions();
        
        // Handle window resize
        Utils.dom.on(window, 'resize', Utils.time.debounce(() => {
            this.updateGridConfig();
        }, 250));
    },
    
    // Save icon position to localStorage
    saveIconPosition(appName, position) {
        const positions = Utils.storage.get('desktop_icon_positions', {});
        positions[appName] = position;
        Utils.storage.set('desktop_icon_positions', positions);
    },
    
    // Load icon positions from localStorage
    loadIconPositions() {
        const positions = Utils.storage.get('desktop_icon_positions', {});
        
        Object.entries(positions).forEach(([appName, position]) => {
            const icon = Utils.dom.query(`.desktop-icon[data-app="${appName}"]`);
            if (icon && this.isValidGridPosition(position)) {
                icon.style.gridColumn = position.column;
                icon.style.gridRow = position.row;
            }
        });
    },
    
    // Select icon
    selectIcon(icon) {
        this.deselectAll();
        icon.classList.add('selected');
    },
    
    // Deselect all icons
    deselectAll() {
        Utils.dom.queryAll('.desktop-icon').forEach(icon => {
            icon.classList.remove('selected');
        });
    }
};

// Global access
window.DesktopManager = DesktopManager; 