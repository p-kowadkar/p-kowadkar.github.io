// Netflix-inspired main JavaScript for portfolio website

// Add this at the beginning of your file or in the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', function() {
    // Get the logo animation element and audio element
    const logoAnimation = document.querySelector('.netflix-logo-animation');
    const introSound = document.getElementById('netflix-intro-sound');
    
    // Show the animation
    logoAnimation.classList.add('active');
    
    // Add a small delay before playing the sound to sync with animation
    setTimeout(function() {
        // Play the sound (this will only work after user interaction)
        introSound.play().catch(error => {
            console.log('Audio playback was prevented:', error);
        });
    }, 300); // Small delay to sync with animation start
    
    // Hide animation and show content after animation completes
    setTimeout(function() {
        logoAnimation.classList.remove('active');
        document.body.classList.add('content-visible');
    }, 4000); // Match this to your animation duration
    
    // Add a click event to the document to enable sound on first user interaction
    document.addEventListener('click', function() {
        introSound.play().catch(e => console.log('Audio play error:', e));
    }, { once: true }); // This ensures it only triggers once
});

// Header scroll effect
const header = document.querySelector('.netflix-header');
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const mobileToggle = document.querySelector('.mobile-toggle');
const navList = document.querySelector('.netflix-nav-list');

if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
        navList.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (navList && navList.classList.contains('active') && !event.target.closest('.netflix-nav-list') && !event.target.closest('.mobile-toggle')) {
        navList.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Horizontal slider functionality
const sliders = document.querySelectorAll('.netflix-slider');
sliders.forEach(slider => {
  let isDown = false,
      startX, scrollLeft;
  slider.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    slider.classList.add('active');
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });
  slider.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 2; // adjust speed if needed
  });
});

// Card hover effect with preview
const cards = document.querySelectorAll('.netflix-card');

cards.forEach(card => {
    let hoverTimeout;
    
    card.addEventListener('mouseenter', () => {
        hoverTimeout = setTimeout(() => {
            card.classList.add('hover-expanded');
            
            // Find video preview if exists
            const videoPreview = card.querySelector('video');
            if (videoPreview) {
                videoPreview.play().catch(error => {
                    console.log('Auto-play prevented by browser:', error);
                });
            }
        }, 800); // Delay before expansion
    });
    
    card.addEventListener('mouseleave', () => {
        clearTimeout(hoverTimeout);
        card.classList.remove('hover-expanded');
        
        // Find video preview if exists
        const videoPreview = card.querySelector('video');
        if (videoPreview) {
            videoPreview.pause();
            videoPreview.currentTime = 0;
        }
    });
    
    // Note: Card click handler is now in enhanced-ux.js
});

// Animate elements when they come into view
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementPosition < windowHeight - 100) {
            const animationClass = element.getAttribute('data-animation') || 'fade-in';
            element.classList.add(animationClass);
        }
    });
};

// Initial check for elements in view
animateOnScroll();

// Check for elements on scroll
window.addEventListener('scroll', animateOnScroll);
