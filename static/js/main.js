// Console Anime/Hacker Easter Egg
console.log("%c⚔️ Welcome, traveler.", "color: crimson; font-size: 20px; font-weight: bold;");
console.log("%c🧠 You've unlocked... *The Hidden Skill Tree.*", "color: green; font-size: 14px; font-weight: bold;");
console.log("%cOnly the curious ever reach this place. The others? Still stuck on page 1 of the résumé.", "color: green; font-size: 14px; font-weight: bold;");
console.log("%c💬 P.S. Try asking the AI bot about 'easter eggs' — but be warned, it's got an attitude...", "color: green; font-size: 14px; font-weight: bold;");
console.log("%cP.P.S. You weren't supposed to find this… but since you're here, drop a 🔥 on LinkedIn 😉", "color: green; font-size: 16px; font-weight: bold;");

// Enhanced Main JavaScript for Portfolio Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
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
        if (navMenu && navMenu.classList.contains('active') && !event.target.closest('.nav-menu') && !event.target.closest('.mobile-menu-btn')) {
            navMenu.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add active class to current page in navigation
    const currentLocation = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentLocation.includes(linkPath) && linkPath !== 'index.html') {
            link.classList.add('active');
        } else if ((currentLocation.endsWith('/') || currentLocation.endsWith('index.html')) && linkPath === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // Animate elements on scroll
    const animateOnScroll = function() {
        // Animate section titles
        document.querySelectorAll('.section-title').forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate');
            }
        });
        
        // Animate skill categories
        document.querySelectorAll('.skill-category').forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 100); // Staggered animation
            }
        });
        
        // Animate education items
        document.querySelectorAll('.education-item').forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 150); // Staggered animation
            }
        });
        
        // Animate timeline items
        document.querySelectorAll('.timeline-item').forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 200); // Staggered animation
            }
        });
        
        // Animate project cards
        document.querySelectorAll('.project-card').forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                setTimeout(() => {
                    element.classList.add('animate');
                }, index * 150); // Staggered animation
            }
        });
    };
    
    // Header scroll effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        });
    }
    
    // Typing effect for hero subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        let i = 0;
        const typeWriter = function() {
            if (i < text.length) {
                heroSubtitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        typeWriter();
    }
    
    // Initialize the animation on scroll
    window.addEventListener('scroll', animateOnScroll);
    // Run once to animate elements that are already in view
    animateOnScroll();
    
    // Add CSS class for CSS animations on page load
    document.body.classList.add('loaded');
});
