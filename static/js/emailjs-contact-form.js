// EmailJS implementation for contact form
// This file integrates the contact form with EmailJS to send emails to psk@njit.edu
// and send auto-replies to visitors

// Add the EmailJS modal to the index.html page
document.addEventListener('DOMContentLoaded', function() {
    // Create modal container if it doesn't exist
    if (!document.getElementById('contact-modal')) {
        const modalHTML = `
        <div id="contact-modal" class="modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2>Let's Connect</h2>
                </div>
                <form id="contactForm">
                    <div class="form-group">
                        <label for="name" class="form-label">Name</label>
                        <input type="text" id="name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="subject" class="form-label">Subject</label>
                        <input type="text" id="subject" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="message" class="form-label">Message</label>
                        <textarea id="message" class="form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn">Send Message</button>
                </form>
            </div>
        </div>`;
        
        // Append modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
    }

    // Load EmailJS SDK
    if (typeof emailjs === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        document.head.appendChild(script);
        
        script.onload = function() {
            emailjs.init("koacydvEdMPCSJ9jm"); // This is a placeholder, EmailJS will work with public keys
        };
    }

    // Modal functionality
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeModal = document.querySelector('.close-modal');

    // Open modal when contact button is clicked
    if (contactBtn) {
        contactBtn.addEventListener('click', function(e) {
            e.preventDefault();
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

    // Form submission handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Prepare template parameters for the main email to you
            const templateParams = {
                to_email: 'psk@njit.edu',
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };
            
            // Send email to you using EmailJS
            emailjs.send('service_sqsvze5', 'template_t1hipjn', templateParams)
                .then(function() {
                    // After successful sending to you, send auto-reply to the visitor
                    const autoReplyParams = {
                        to_name: name,
                        to_email: email
                    };
                    
                    return emailjs.send('service_sqsvze5', 'template_p7i4jyg', autoReplyParams);
                })
                .then(function() {
                    // Both emails sent successfully
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Show success message and close modal after delay
                    setTimeout(function() {
                        contactModal.style.display = 'none';
                        document.body.style.overflow = ''; // Re-enable scrolling
                        alert('Thank you for your message! I will get back to you soon.');
                    }, 2000);
                })
                .catch(function(error) {
                    // Handle error
                    console.error('EmailJS error:', error);
                    submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
                    
                    // Show error message
                    alert('Sorry, there was an error sending your message. Please try again or contact directly at pk.kowadkar@gmail.com');
                    
                    // Reset button after a delay
                    setTimeout(function() {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }, 3000);
                });
        });
    }
});
