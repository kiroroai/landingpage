/**
 * GrooveLab — Dance Workshop & Studio
 * Main JavaScript File
 */

// ==========================================================
// DOM ELEMENTS
// ==========================================================
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const backToTopBtn = document.querySelector('.back-to-top');
const typingText = document.getElementById('typingText');
const faqItems = document.querySelectorAll('.faq-item');
const testimonialTrack = document.querySelector('.testimonials-track');
const testimonialPrev = document.querySelector('.testimonial-prev');
const testimonialNext = document.querySelector('.testimonial-next');
const testimonialDots = document.querySelectorAll('.testimonial-dots span');
const newsletterForm = document.querySelector('.newsletter-form');
const formStatus = document.querySelector('.form-status');

// ==========================================================
// THEME TOGGLE
// ==========================================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Initialize theme on page load
initTheme();

// ==========================================================
// MOBILE MENU
// ==========================================================
if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ==========================================================
// TYPING EFFECT
// ==========================================================
const typingWords = ['Passion', 'Rhythm', 'Style', 'Energy', 'Groove', 'Flow'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    if (!typingText) return;
    
    const currentWord = typingWords[wordIndex];
    
    if (isDeleting) {
        typingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing effect
if (typingText) {
    setTimeout(typeEffect, 1000);
}

// ==========================================================
// SCROLL REVEAL ANIMATIONS
// ==========================================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

initScrollReveal();

// ==========================================================
// BACK TO TOP BUTTON
// ==========================================================
function handleScroll() {
    if (!backToTopBtn) return;
    
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
}

window.addEventListener('scroll', handleScroll);

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================================
// FAQ ACCORDION
// ==========================================================
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    if (question) {
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('open');
            });
            
            // Toggle current item
            if (!isOpen) {
                item.classList.add('open');
            }
        });
    }
});

// ==========================================================
// TESTIMONIALS CAROUSEL
// ==========================================================
let currentSlide = 0;
const totalSlides = 6;

function updateTestimonialCarousel() {
    if (!testimonialTrack) return;
    
    const cardWidth = testimonialTrack.querySelector('.testimonial-card')?.offsetWidth || 0;
    const gap = 20;
    const offset = currentSlide * (cardWidth + gap);
    
    testimonialTrack.style.transform = `translateX(-${offset}px)`;
    
    // Update dots
    testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

if (testimonialPrev) {
    testimonialPrev.addEventListener('click', () => {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : totalSlides - 1;
        updateTestimonialCarousel();
    });
}

if (testimonialNext) {
    testimonialNext.addEventListener('click', () => {
        currentSlide = currentSlide < totalSlides - 1 ? currentSlide + 1 : 0;
        updateTestimonialCarousel();
    });
}

testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        updateTestimonialCarousel();
    });
});

// Auto-slide testimonials
let testimonialInterval = setInterval(() => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateTestimonialCarousel();
}, 5000);

// Pause auto-slide on hover
if (testimonialTrack) {
    testimonialTrack.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });
    
    testimonialTrack.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateTestimonialCarousel();
        }, 5000);
    });
}

// ==========================================================
// NEWSLETTER FORM
// ==========================================================
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const submitBtn = newsletterForm.querySelector('button[type="submit"]');
        
        if (!emailInput || !emailInput.value) return;
        
        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
        
        // Simulate form submission (replace with actual API call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            if (formStatus) {
                formStatus.textContent = '✓ Terima kasih! Anda akan menerima update terbaru.';
                formStatus.className = 'form-status success';
            }
            
            // Reset form
            emailInput.value = '';
        } catch (error) {
            // Show error message
            if (formStatus) {
                formStatus.textContent = '✗ Terjadi kesalahan. Silakan coba lagi.';
                formStatus.className = 'form-status error';
            }
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Subscribe';
            
            // Clear status after 5 seconds
            setTimeout(() => {
                if (formStatus) {
                    formStatus.textContent = '';
                    formStatus.className = 'form-status';
                }
            }, 5000);
        }
    });
}

// ==========================================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            const headerHeight = document.querySelector('header')?.offsetHeight || 68;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==========================================================
// PARSE STATS COUNTER ANIMATION
// ==========================================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                
                // Skip if not a number
                if (!/^\d/.test(text)) return;
                
                const match = text.match(/^(\d+)/);
                if (!match) return;
                
                const target = parseInt(match[1]);
                const suffix = text.replace(/^\d+/, '');
                const duration = 2000;
                const startTime = performance.now();
                
                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing function
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeOut * target);
                    
                    counter.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + suffix;
                    }
                }
                
                requestAnimationFrame(updateCounter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

animateCounters();

// ==========================================================
// INITIALIZE ON DOM READY
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check for back to top button
    handleScroll();
    
    // Initialize testimonial carousel position
    updateTestimonialCarousel();
});

// ==========================================================
// HANDLE WINDOW RESIZE
// ==========================================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateTestimonialCarousel();
    }, 250);
});
