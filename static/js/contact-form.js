document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModal = document.querySelector('.close-modal');
    
    // Open modal when contact button is clicked
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            contactModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        });
    }
    
    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            contactModal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    });
    
    // Form submission handling for FormSubmit
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            // Don't prevent default - let the form submit naturally to FormSubmit
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Reset button after form submission (in case the page doesn't redirect)
            setTimeout(function() {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            }, 3000);
            
            // We'll let FormSubmit handle the actual submission
        });
    }
});