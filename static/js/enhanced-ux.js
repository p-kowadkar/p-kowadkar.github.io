// Enhanced UX JavaScript for Netflix-inspired Portfolio

document.addEventListener('DOMContentLoaded', function() {
    // Loading animation
    const showLoading = function() {
        const loadingElement = document.createElement('div');
        loadingElement.className = 'netflix-loading';
        loadingElement.innerHTML = '<div class="loading-spinner"></div>';
        document.body.appendChild(loadingElement);
        
        // Hide loading after content is loaded
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingElement.classList.add('loaded');
                setTimeout(function() {
                    loadingElement.remove();
                }, 500);
            }, 1000);
        });
    };
    
    // Show loading animation
    showLoading();
    
    // Scroll to top button
    const createScrollTopButton = function() {
        const scrollTopButton = document.createElement('div');
        scrollTopButton.className = 'scroll-top';
        scrollTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(scrollTopButton);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('active');
            } else {
                scrollTopButton.classList.remove('active');
            }
        });
        
        // Scroll to top when clicked
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    
    // Create scroll to top button
    createScrollTopButton();
    
    // Parallax effect for billboard section
    const billboard = document.querySelector('.netflix-billboard');
    if (billboard) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            billboard.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.netflix-nav-link, .footer-link a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply to hash links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const navList = document.querySelector('.netflix-nav-list');
                    if (navList && navList.classList.contains('active')) {
                        navList.classList.remove('active');
                        const mobileToggle = document.querySelector('.mobile-toggle');
                        if (mobileToggle) {
                            const icon = mobileToggle.querySelector('i');
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                    
                    // Scroll to target
                    const headerHeight = document.querySelector('.netflix-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const highlightActiveNavLink = function() {
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('.netflix-nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to current link
                const activeLink = document.querySelector(`.netflix-nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    };
    
    // Initial highlight and on scroll
    highlightActiveNavLink();
    window.addEventListener('scroll', highlightActiveNavLink);
    
    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const formInputs = contactForm.querySelectorAll('input, textarea');
            
            formInputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message
                const formContainer = contactForm.parentElement;
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success';
                successMessage.innerHTML = `
                    <i class="fas fa-check-circle"></i>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. I'll get back to you soon.</p>
                `;
                
                // Replace form with success message
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
                
                // Add animation
                successMessage.classList.add('fade-in');
            }
        });
        
        // Real-time validation feedback
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.classList.remove('error');
                }
            });
        });
    }
    
    // Enhanced card hover effect with preview
    const enhanceCards = function() {
        const cards = document.querySelectorAll('.netflix-card');
        
        cards.forEach(card => {
            // Create expanded content for cards
            const overlay = card.querySelector('.netflix-card-overlay');
            if (overlay) {
                const title = overlay.querySelector('.netflix-card-title');
                const info = overlay.querySelector('.netflix-card-info');
                
                if (title && info) {
                    const expandedContent = document.createElement('div');
                    expandedContent.className = 'expanded-content';
                    expandedContent.innerHTML = `
                        <p class="expanded-description">Click to view details</p>
                        <div class="expanded-buttons">
                            <button class="netflix-button netflix-button-small">
                                <i class="fas fa-info-circle"></i> More Info
                            </button>
                        </div>
                    `;
                    
                    overlay.appendChild(expandedContent);
                }
            }
        });
    };
    
    // Enhance cards
    enhanceCards();
    
    // Netflix-style volume control for intro sound
    const createVolumeControl = function() {
        // Comment out or remove this entire function to disable the volume control
        /*
        const introSound = document.getElementById('netflix-intro-sound');
        if (introSound) {
            const volumeControl = document.createElement('div');
            volumeControl.className = 'volume-control';
            volumeControl.innerHTML = '<i class="fas fa-volume-up"></i>';
            document.body.appendChild(volumeControl);
            
            // Toggle mute/unmute
            volumeControl.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (introSound.muted) {
                    introSound.muted = false;
                    icon.className = 'fas fa-volume-up';
                } else {
                    introSound.muted = true;
                    icon.className = 'fas fa-volume-mute';
                }
            });
            
            // Hide after 5 seconds
            setTimeout(function() {
                volumeControl.classList.add('fade-out');
            }, 5000);
        }
        */
    };
    
    // Create volume control
    // Comment out this line to prevent the volume control from being created
    // createVolumeControl();
    
    // Add CSS for enhanced UX elements
    const addEnhancedStyles = function() {
        const style = document.createElement('style');
        style.textContent = `
            .form-success {
                text-align: center;
                padding: 2rem;
            }
            
            .form-success i {
                font-size: 3rem;
                color: #4BB543;
                margin-bottom: 1rem;
            }
            
            .form-success h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .form-control.error {
                border-color: #E50914;
                box-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
            }
            
            .expanded-content {
                margin-top: 0.5rem;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .netflix-card.expanded .expanded-content {
                opacity: 1;
            }
            
            .expanded-description {
                font-size: 0.8rem;
                margin-bottom: 0.5rem;
            }
            
            .expanded-buttons {
                display: flex;
                gap: 0.5rem;
            }
            
            .netflix-button-small {
                padding: 0.4rem 0.8rem;
                font-size: 0.8rem;
            }
            
            .volume-control {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(0, 0, 0, 0.7);
                color: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                transition: all 0.3s ease;
            }
            
            .volume-control:hover {
                background-color: rgba(229, 9, 20, 0.7);
            }
            
            .volume-control.fade-out {
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Add enhanced styles
    addEnhancedStyles();
});

// Add slider navigation controls to Netflix sliders
document.addEventListener('DOMContentLoaded', function() {
    // Get all slider containers
    const sliders = document.querySelectorAll('.netflix-slider');
    
    sliders.forEach(slider => {
        // Create navigation buttons
        const prevButton = document.createElement('button');
        prevButton.className = 'slider-nav slider-prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const nextButton = document.createElement('button');
        nextButton.className = 'slider-nav slider-next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        // Add navigation buttons to slider
        slider.appendChild(prevButton);
        slider.appendChild(nextButton);
        
        // Get the slider inner element
        const sliderInner = slider.querySelector('.netflix-slider-inner');
        
        // Set initial position
        let position = 0;
        
        // Calculate how many cards to scroll based on viewport width
        const getScrollAmount = () => {
            const cardWidth = slider.querySelector('.netflix-card').offsetWidth;
            const visibleWidth = slider.offsetWidth;
            return Math.floor(visibleWidth / cardWidth) || 1;
        };
        
        // Handle next button click
        nextButton.addEventListener('click', () => {
            const cards = slider.querySelectorAll('.netflix-card');
            const scrollAmount = getScrollAmount();
            
            // Calculate max position
            const maxPosition = Math.max(0, cards.length - scrollAmount);
            
            // Update position
            position = Math.min(position + scrollAmount, maxPosition);
            
            // Scroll to new position
            const cardWidth = cards[0].offsetWidth;
            const scrollOffset = position * cardWidth;
            sliderInner.style.transform = `translateX(-${scrollOffset}px)`;
        });
        
        // Handle previous button click
        prevButton.addEventListener('click', () => {
            const scrollAmount = getScrollAmount();
            
            // Update position
            position = Math.max(position - scrollAmount, 0);
            
            // Scroll to new position
            const cardWidth = slider.querySelector('.netflix-card').offsetWidth;
            const scrollOffset = position * cardWidth;
            sliderInner.style.transform = `translateX(-${scrollOffset}px)`;
        });
        
        // Update on window resize
        window.addEventListener('resize', () => {
            // Reset position on resize
            position = 0;
            sliderInner.style.transform = 'translateX(0)';
        });
    });
    
    // Remove "See All" links since we're using slider navigation
    const seeAllLinks = document.querySelectorAll('.see-all');
    seeAllLinks.forEach(link => {
        link.style.display = 'none';
    });
});

// Card expansion functionality
// Netflix-style full-page detail view
document.addEventListener('DOMContentLoaded', function() {
    // Get all cards that can be expanded
    const cards = document.querySelectorAll('.netflix-card');
    
    // Add click event to each card
    cards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the detail ID from the card
            const detailId = this.getAttribute('data-detail-id');
            const detailElement = document.getElementById(detailId);
            
            // Skip expansion for Skills and Contact sections
            const cardSection = this.closest('section');
            if (cardSection && (cardSection.id === 'skills' || cardSection.id === 'contact')) {
                return; // Don't apply expansion effect to Skills and Contact cards
            }
            
            if (detailElement) {
                // Get card position for animation
                const cardRect = this.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Create full-page detail container with initial position matching the card
                const fullPageDetail = document.createElement('div');
                fullPageDetail.className = 'netflix-full-page-detail';
                fullPageDetail.style.top = (cardRect.top + scrollTop) + 'px';
                fullPageDetail.style.left = cardRect.left + 'px';
                fullPageDetail.style.width = cardRect.width + 'px';
                fullPageDetail.style.height = cardRect.height + 'px';
                fullPageDetail.style.borderRadius = '8px';
                
                // Clone the detail content
                const detailContent = detailElement.querySelector('.detail-content').cloneNode(true);
                
                // Create header with back button
                const detailHeader = document.createElement('div');
                detailHeader.className = 'detail-header';
                detailHeader.style.opacity = '0';
                
                const backButton = document.createElement('button');
                backButton.className = 'back-button';
                backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back';
                
                detailHeader.appendChild(backButton);
                
                // Add header and content to full-page container
                fullPageDetail.appendChild(detailHeader);
                fullPageDetail.appendChild(detailContent);
                
                // Initially hide content
                detailContent.style.opacity = '0';
                
                // Add to body
                document.body.appendChild(fullPageDetail);
                
                // Prevent scrolling on main content
                document.body.classList.add('detail-page-open');
                
                // Animate expansion
                setTimeout(() => {
                    fullPageDetail.style.transition = 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)';
                    fullPageDetail.style.top = '0';
                    fullPageDetail.style.left = '0';
                    fullPageDetail.style.width = '100%';
                    fullPageDetail.style.height = '100%';
                    fullPageDetail.style.borderRadius = '0';
                    
                    // Fade in content after expansion
                    setTimeout(() => {
                        detailHeader.style.transition = 'opacity 0.3s ease';
                        detailHeader.style.opacity = '1';
                        
                        detailContent.style.transition = 'opacity 0.3s ease';
                        detailContent.style.opacity = '1';
                        
                        fullPageDetail.classList.add('active');
                    }, 500);
                }, 10);
                
                // Handle back button click with reverse animation
                backButton.addEventListener('click', function() {
                    // Fade out content first
                    detailHeader.style.opacity = '0';
                    detailContent.style.opacity = '0';
                    
                    setTimeout(() => {
                        // Animate back to original card size and position
                        fullPageDetail.style.top = (cardRect.top + scrollTop) + 'px';
                        fullPageDetail.style.left = cardRect.left + 'px';
                        fullPageDetail.style.width = cardRect.width + 'px';
                        fullPageDetail.style.height = cardRect.height + 'px';
                        fullPageDetail.style.borderRadius = '8px';
                        fullPageDetail.classList.remove('active');
                        
                        // Remove after animation completes
                        setTimeout(() => {
                            fullPageDetail.remove();
                            document.body.classList.remove('detail-page-open');
                        }, 500);
                    }, 300);
                });
            }
        });
    });
});
