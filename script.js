/* ==========================================
   EYAN CONSULTANCY - MAIN SCRIPT
   ========================================== */

/* ==========================================
   1. DOM ELEMENTS
   ========================================== */
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const backToTop = document.getElementById('backToTop');
const loader = document.getElementById('loader');
const contactForm = document.getElementById('contactForm');
const statCards = document.querySelectorAll('.stat-card');

/* ==========================================
   2. NAVBAR FUNCTIONALITY
   ========================================== */

// Hamburger menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when a link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active nav link based on scroll position
window.addEventListener('scroll', () => {
    updateActiveNavLink();
});

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[data-section="${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

/* ==========================================
   3. SMOOTH SCROLLING
   ========================================== */

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

/* ==========================================
   4. BACK TO TOP BUTTON
   ========================================== */

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ==========================================
   5. ANIMATED COUNTERS
   ========================================== */

// Start counters when they come into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statCards.forEach(card => {
    const numberElement = card.querySelector('.stat-number');
    if (numberElement && numberElement.dataset.target) {
        counterObserver.observe(numberElement);
    }
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 30; // Duration: 30 frames
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 50);
}

/* ==========================================
   6. SCROLL REVEAL ANIMATIONS
   ========================================== */

function revealOnScroll() {
    const reveals = document.querySelectorAll('[data-aos]');

    reveals.forEach(reveal => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;

        if (revealTop < windowHeight - revealPoint) {
            reveal.style.opacity = '1';
            reveal.style.transform = 'translateY(0)';
        }
    });
}

// Initial check on page load
window.addEventListener('load', revealOnScroll);

// Check on scroll
window.addEventListener('scroll', revealOnScroll);

/* ==========================================
   7. FORM VALIDATION & SUBMISSION
   ========================================== */

// Contact form validation
function validateForm(formData) {
    const errors = [];

    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('Please enter a valid name (at least 2 characters)');
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.push('Please enter a valid email address');
    }

    // Validate phone (optional but if provided, must be valid)
    if (formData.phone && !/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        errors.push('Please enter a valid phone number');
    }

    // Validate message
    if (!formData.message || formData.message.trim().length < 10) {
        errors.push('Please enter a message (at least 10 characters)');
    }

    return errors;
}

// Form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };

    const errors = validateForm(formData);

    if (errors.length > 0) {
        showFormMessage(errors.join('\n'), 'error');
    } else {
        // Simulate form submission
        submitForm(formData);
    }
});

function submitForm(formData) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Create WhatsApp message
    const whatsappMessage = `Hello, I'm interested in your consultancy services.%0A%0A` +
        `Name: ${encodeURIComponent(formData.name)}%0A` +
        `Email: ${encodeURIComponent(formData.email)}%0A` +
        `Phone: ${encodeURIComponent(formData.phone || 'Not provided')}%0A%0A` +
        `Message: ${encodeURIComponent(formData.message)}`;
    
    // WhatsApp phone number (without + or spaces)
    const whatsappPhone = '918433556944';
    
    // Simulate API call (in real implementation, send to backend)
    setTimeout(() => {
        // Reset form
        contactForm.reset();
        showFormMessage('Thank you for your message! Opening WhatsApp...', 'success');
        
        // Open WhatsApp after a short delay
        setTimeout(() => {
            window.open(`https://wa.me/${whatsappPhone}?text=${whatsappMessage}`, '_blank');
        }, 500);

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showFormMessage(message, type) {
    // Remove existing message if any
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.style.cssText = `
        padding: 15px;
        margin: 15px 0;
        border-radius: 5px;
        font-size: 14px;
        animation: slideInUp 0.3s ease-out;
    `;

    if (type === 'success') {
        messageEl.style.background = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
    } else {
        messageEl.style.background = '#f8d7da';
        messageEl.style.color = '#721c24';
        messageEl.style.border = '1px solid #f5c6cb';
    }

    messageEl.textContent = message;
    contactForm.insertBefore(messageEl, contactForm.querySelector('button'));

    // Remove message after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

/* ==========================================
   8. INTERSECTION OBSERVER FOR ANIMATIONS
   ========================================== */

// Observe service cards
const serviceCards = document.querySelectorAll('.service-card');
const projectCards = document.querySelectorAll('.project-card');
const featureItems = document.querySelectorAll('.feature-item');
const testimonialCards = document.querySelectorAll('.testimonial-card');

const elementsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

[...serviceCards, ...projectCards, ...featureItems, ...testimonialCards].forEach(element => {
    elementsObserver.observe(element);
});

/* ==========================================
   9. PARALLAX EFFECT (Optional Enhancement)
   ========================================== */

window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector('.hero');
    
    if (heroSection) {
        // Subtle parallax effect
        heroSection.style.backgroundPosition = `center ${scrolled * 0.5}px`;
    }
});

/* ==========================================
   10. PAGE LOAD ANIMATION
   ========================================== */

window.addEventListener('load', () => {
    // Hide loader after initial animations
    setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
    }, 2000);

    // Initialize active nav link
    updateActiveNavLink();
});

/* ==========================================
   11. UTILITY FUNCTIONS
   ========================================== */

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* ==========================================
   12. KEYBOARD NAVIGATION
   ========================================== */

document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Keyboard shortcuts for navigation
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        // Could add command palette functionality here
    }
});

/* ==========================================
   13. PREFERS REDUCED MOTION
   ========================================== */

// Respect user's motion preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Disable animations if user prefers reduced motion
    const style = document.createElement('style');
    style.textContent = `
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================
   14. PERFORMANCE OPTIMIZATION
   ========================================== */

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

/* ==========================================
   15. MOBILE TOUCH OPTIMIZATION
   ========================================== */

// Add touch-friendly improvements
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    lastTouchEnd = Date.now();
}, false);

document.addEventListener('click', (e) => {
    // Prevent double-tap zoom on buttons
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        if (Date.now() - lastTouchEnd < 300) {
            e.preventDefault();
        }
    }
}, false);

/* ==========================================
   16. DYNAMIC YEAR IN FOOTER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const footerText = document.querySelector('.footer-bottom p');
    if (footerText) {
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} Eyan Consultancy. All rights reserved.`;
    }
});

/* ==========================================
   17. SERVICE WORKER REGISTRATION (Optional)
   ========================================== */

// Uncomment to enable service worker for PWA functionality
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}
*/

/* ==========================================
   18. ANALYTICS & TRACKING (Optional)
   ========================================== */

// Simple page view tracking
function trackPageView() {
    const pageView = {
        timestamp: new Date().toISOString(),
        path: window.location.pathname,
        referrer: document.referrer
    };
    // Send to analytics endpoint if configured
}

window.addEventListener('load', trackPageView);

/* ==========================================
   19. ERROR HANDLING
   ========================================== */

window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // In production, send error to error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, send error to error tracking service
});

/* ==========================================
   20. CONSOLE WELCOME MESSAGE
   ========================================== */

console.log(
    '%cEyan Consultancy - Engineering & Project Consultancy',
    'color: #d4af37; font-size: 16px; font-weight: bold;'
);
console.log(
    '%c15+ Years of Excellence in Engineering & Project Consultancy',
    'color: #1e3a8a; font-size: 14px;'
);
console.log('%c✓ Website built with modern HTML5, CSS3, and JavaScript', 'color: #1e3a8a;');
