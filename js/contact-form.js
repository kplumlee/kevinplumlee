// Contact Form Handler
const ContactFormHandler = {
    // Initialize form handling
    init() {
        const form = Utils.dom.get('contact-form');
        if (!form) return;
        
        // Set up form submission
        Utils.dom.on(form, 'submit', this.handleSubmit.bind(this));
        
        // Set up real-time validation
        this.setupValidation(form);
        
        // Set up character counter
        this.setupCharacterCounter();
        
        Utils.logger.debug('Contact form initialized');
    },
    
    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(data)) {
            this.showMessage('Please fix the errors above.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await Utils.time.wait(Config.contact.submitDelay);
            
            // Show success
            this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
            // Reset character counter
            const charCount = Utils.dom.get('char-count');
            if (charCount) charCount.textContent = '0';
            
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
            Utils.logger.error('Form submission error:', error);
        } finally {
            // Reset button
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }
    },
    
    // Set up form validation
    setupValidation(form) {
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Validate on blur
            Utils.dom.on(input, 'blur', () => {
                this.validateField(input);
            });
            
            // Clear errors on input
            Utils.dom.on(input, 'input', () => {
                this.clearFieldError(input);
            });
        });
    },
    
    // Set up character counter
    setupCharacterCounter() {
        const messageField = Utils.dom.get('message');
        const charCount = Utils.dom.get('char-count');
        
        if (messageField && charCount) {
            Utils.dom.on(messageField, 'input', () => {
                const length = messageField.value.length;
                charCount.textContent = length;
                
                const counter = charCount.parentElement;
                counter.classList.remove('warning', 'error');
                
                if (length > Config.contact.maxMessageLength * 0.8) {
                    counter.classList.add('warning');
                }
                if (length > Config.contact.maxMessageLength * 0.95) {
                    counter.classList.add('error');
                }
            });
        }
    },
    
    // Validate entire form
    validateForm(data) {
        let isValid = true;
        
        // Validate name
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Please enter your full name');
            isValid = false;
        }
        
        // Validate email
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }
        
        // Validate subject
        if (!data.subject || data.subject.trim().length < 3) {
            this.showFieldError('subject', 'Please enter a subject');
            isValid = false;
        }
        
        // Validate message
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Please enter a message (at least 10 characters)');
            isValid = false;
        }
        
        if (data.message && data.message.length > Config.contact.maxMessageLength) {
            this.showFieldError('message', `Message too long (max ${Config.contact.maxMessageLength} characters)`);
            isValid = false;
        }
        
        return isValid;
    },
    
    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        
        switch (field.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field.id, 'Please enter a valid email address');
                    return false;
                }
                break;
            default:
                if (field.required && !value) {
                    this.showFieldError(field.id, 'This field is required');
                    return false;
                }
        }
        
        this.clearFieldError(field);
        return true;
    },
    
    // Show field error
    showFieldError(fieldId, message) {
        const field = Utils.dom.get(fieldId);
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    },
    
    // Clear field error
    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        formGroup.classList.remove('error');
    },
    
    // Show form message
    showMessage(message, type) {
        // Remove existing message
        const existingMessage = Utils.dom.query('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageElement = Utils.dom.create('div', {
            className: `form-message ${type}`
        }, message);
        
        // Insert at top of form
        const form = Utils.dom.get('contact-form');
        form.insertBefore(messageElement, form.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                Utils.animation.fadeOut(messageElement, 300).addEventListener('finish', () => {
                    messageElement.remove();
                });
            }
        }, 5000);
    },
    
    // Email validation
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
};

// Global access
window.ContactFormHandler = ContactFormHandler; 