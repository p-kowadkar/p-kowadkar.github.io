// Updated EmailJS implementation for contact form with enhanced error handling and user feedback
// This file integrates the contact form with EmailJS to send emails to psk@njit.edu
// and send auto-replies to visitors

// Add the EmailJS modal to the index.html page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init("koacydvEdMPCSJ9jm");
    
    console.log("EmailJS initialized");
    
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
                        <input type="text" id="name" name="name" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="subject" class="form-label">Subject</label>
                        <input type="text" id="subject" name="subject" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="message" class="form-label">Message</label>
                        <textarea id="message" name="message" class="form-control" required></textarea>
                    </div>
                    <button type="submit" class="btn">Send Message</button>
                    <div id="form-status" class="form-message" style="display: none;"></div>
                </form>
            </div>
        </div>`;
        
        // Append modal to body
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer.firstElementChild);
        console.log("Contact modal created and added to DOM");
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
            console.log("Contact modal opened");
        });
    }

    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            contactModal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
            console.log("Contact modal closed");
        });
    }

    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === contactModal) {
            contactModal.style.display = 'none';
            document.body.style.overflow = ''; // Re-enable scrolling
            console.log("Contact modal closed (clicked outside)");
        }
    });

    // Form validation function
    function validateForm(name, email, subject, message) {
        let isValid = true;
        let errorMessage = '';
        
        if (!name.trim()) {
            isValid = false;
            errorMessage = 'Please enter your name.';
        } else if (!email.trim()) {
            isValid = false;
            errorMessage = 'Please enter your email address.';
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        } else if (!subject.trim()) {
            isValid = false;
            errorMessage = 'Please enter a subject.';
        } else if (!message.trim()) {
            isValid = false;
            errorMessage = 'Please enter your message.';
        }
        
        return { isValid, errorMessage };
    }

    // Show form status message
    function showFormStatus(type, message) {
        const formStatus = document.getElementById('form-status');
        if (!formStatus) {
            // Create status element if it doesn't exist
            const statusDiv = document.createElement('div');
            statusDiv.id = 'form-status';
            const form = document.getElementById('contactForm');
            if (form) {
                form.appendChild(statusDiv);
            }
        }
        
        const statusElement = document.getElementById('form-status');
        if (statusElement) {
            statusElement.className = `form-message ${type}`;
            statusElement.textContent = message;
            statusElement.style.display = 'block';
            statusElement.style.marginTop = '10px';
            statusElement.style.padding = '10px';
            statusElement.style.borderRadius = '4px';
            
            if (type === 'error') {
                statusElement.style.backgroundColor = '#ffebee';
                statusElement.style.color = '#c62828';
                statusElement.style.border = '1px solid #ef9a9a';
            } else {
                statusElement.style.backgroundColor = '#e8f5e9';
                statusElement.style.color = '#2e7d32';
                statusElement.style.border = '1px solid #a5d6a7';
            }
            
            // Scroll to the message
            statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    // Form submission handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            
            // Get form data using form elements
            const formElements = e.target.elements;
            const name = formElements.name.value;
            const email = formElements.email.value;
            const subject = formElements.subject.value;
            const message = formElements.message.value;
            
            console.log("Starting form submission process...");
            console.log("Form data:", { name, email, subject, message });
            
            // Validate form
            const { isValid, errorMessage } = validateForm(name, email, subject, message);
            
            if (!isValid) {
                console.log("Form validation failed:", errorMessage);
                showFormStatus('error', errorMessage);
                return;
            }
            
            console.log("Form validation passed");
            
            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            
            // Clear previous status messages
            const formStatus = document.getElementById('form-status');
            if (formStatus) {
                formStatus.style.display = 'none';
            }
            
            // Prepare template parameters for the main email to you
            const templateParams = {
                to_email: 'psk@njit.edu',
                from_name: name,
                from_email: email,
                subject: subject,
                message: message
            };
            
            console.log("Sending email to psk@njit.edu with params:", templateParams);
            
            // Send email to you using EmailJS
            emailjs.send('service_sqsvze5', 'template_t1hipjn', templateParams)
                .then(function(response) {
                    console.log('Email sent successfully to psk@njit.edu:', response);
                    
                    // After successful sending to you, send auto-reply to the visitor
                    const autoReplyParams = {
                        to_name: name,
                        to_email: email
                    };
                    
                    console.log("Sending auto-reply to visitor:", autoReplyParams);
                    
                    return emailjs.send('service_sqsvze5', 'template_p7i4jyg', autoReplyParams);
                })
                .then(function(response) {
                    console.log('Auto-reply sent successfully:', response);
                    
                    // Both emails sent successfully
                    submitButton.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    
                    // Show success message
                    showFormStatus('success', 'Your message has been sent successfully! I will get back to you soon.');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Close modal after delay
                    setTimeout(function() {
                        if (contactModal) {
                            contactModal.style.display = 'none';
                            document.body.style.overflow = ''; // Re-enable scrolling
                        }
                        
                        // Reset form status
                        const formStatus = document.getElementById('form-status');
                        if (formStatus) {
                            formStatus.style.display = 'none';
                        }
                        
                        // Reset button
                        if (submitButton) {
                            submitButton.innerHTML = originalButtonText;
                            submitButton.disabled = false;
                        }
                    }, 3000);
                })
                .catch(function(error) {
                    // Handle error
                    console.error('EmailJS error:', error);
                    submitButton.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
                    
                    // Show detailed error message
                    let errorMsg = 'There was an error sending your message. ';
                    
                    // Add more specific error information if available
                    if (error.text) {
                        errorMsg += `Error details: ${error.text}`;
                    } else {
                        errorMsg += 'Please try again or contact directly at pk.kowadkar@gmail.com';
                    }
                    
                    showFormStatus('error', errorMsg);
                    
                    // Reset button after a delay
                    setTimeout(function() {
                        submitButton.innerHTML = originalButtonText;
                        submitButton.disabled = false;
                    }, 3000);
                });
        });
    }
});
