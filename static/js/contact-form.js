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
    
    // Form submission using EmailJS
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state on the button
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Send email using EmailJS - replace with your actual service ID and template ID
            emailjs.send('service_sqsvze5', 'template_ojrvbu1', {
                from_name: name,
                reply_to: email,
                subject: subject,
                message: message
            })
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showFormMessage('success', 'Message sent successfully! I\'ll get back to you soon.');
                contactForm.reset();
            })
            .catch(function(error) {
                console.log('FAILED...', error);
                showFormMessage('error', 'Oops! There was a problem sending your message. Please try again.');
            })
            .finally(function() {
                // Reset button state
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
    
    function showFormMessage(type, message) {
        // Remove any existing message
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Insert message after form
        contactForm.insertAdjacentElement('afterend', messageElement);
        
        // Auto remove message after 5 seconds
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 500);
        }, 5000);
    }
});