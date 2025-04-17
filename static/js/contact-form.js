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
            // IMPORTANT: Do NOT prevent default for FormSubmit to work
            // e.preventDefault(); - This line was preventing the form from submitting
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // FormSubmit will handle the actual submission and redirect
            // No need to reset the form or button as the page will redirect
        });
    }
});