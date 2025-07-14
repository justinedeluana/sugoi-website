document.addEventListener('DOMContentLoaded', function() {
    // Add global error handling
    window.onerror = function(msg, url, line, col, error) {
        console.log('Caught error:', msg, 'at', url, 'line', line);
        return false; 
    };

    // Helper function to safely query elements (prevents null errors)
    function safeQuerySelector(selector) {
        const element = document.querySelector(selector);
        if (!element) {
            console.warn(`Element not found: ${selector}`);
        }
        return element;
    }

    // Helper function to safely add event listeners
    function safeAddEventListener(element, eventType, callback) {
        if (element) {
            element.addEventListener(eventType, callback);
        }
    }

    // Mobile menu functionality
    const mobileMenuBtn = safeQuerySelector('.mobile-menu-btn');
    const navLinks = safeQuerySelector('.nav-links');
    const bookNowBtn = safeQuerySelector('.nav-btn');
    
    if (mobileMenuBtn && navLinks) {
        safeAddEventListener(mobileMenuBtn, 'click', function() {
            navLinks.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active'); 
            document.body.classList.toggle('menu-open'); 
        });
        
        // Close menu when clicking a menu item
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active'); 
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (navLinks.classList.contains('active') && 
                !navLinks.contains(event.target) && 
                !mobileMenuBtn.contains(event.target)) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Enhanced smooth scrolling for navigation links
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            safeAddEventListener(anchor, 'click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                
                // Don't scroll for empty or "#" links
                if (targetId === "#" || targetId === "") {
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        mobileMenuBtn.classList.remove('active'); 
                        document.body.classList.remove('menu-open');
                    }
                    
                    // Adjust scroll position to account for fixed header
                    const headerOffset = 10; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                    
                    // Add active class to clicked nav item
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                }
            });
        });
    } catch (e) {
        console.error('Error setting up smooth scrolling:', e);
    }
    
    // Enhanced scroll animation for service cards, team section and other elements
    try {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        // Add staggered animation delay for service cards
                        if (entry.target.classList.contains('service-card')) {
                            const serviceCards = document.querySelectorAll('.service-card');
                            const cardIndex = Array.from(serviceCards).indexOf(entry.target);
                            const delay = cardIndex * 150; // 150ms delay between each card
                            setTimeout(() => {
                                entry.target.classList.add('fade-in');
                            }, delay);
                        } 
                        // Add staggered animation for team members
                        else if (entry.target.classList.contains('team-member')) {
                            const teamMembers = document.querySelectorAll('.team-member');
                            const memberIndex = Array.from(teamMembers).indexOf(entry.target);
                            const delay = memberIndex * 200; // 200ms delay between each team member
                            setTimeout(() => {
                                entry.target.classList.add('fade-in');
                            }, delay);
                        }
                        // Immediate animation for main founder
                        else if (entry.target.classList.contains('main-founder')) {
                            entry.target.classList.add('fade-in');
                        }
                        // Standard animation for other elements
                        else {
                            entry.target.classList.add('fade-in');
                        }
                        
                        // Stop observing once animated
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            // Observe elements to animate - including team elements
            const elementsToAnimate = document.querySelectorAll('.about-content, .circular-image, .service-card, .main-founder, .team-member, .fb-page-container');
            if (elementsToAnimate.length > 0) {
                elementsToAnimate.forEach(element => {
                    observer.observe(element);
                });
            }
        }
    } catch (e) {
        console.error('Error setting up intersection observer:', e);
        // Fallback for browsers without IntersectionObserver
        document.querySelectorAll('.about-content, .circular-image, .service-card, .main-founder, .team-member').forEach(el => {
            el.classList.add('fade-in');
        });
    }
    
    // Highlight active section in navigation
    const sections = document.querySelectorAll('section[id]');
    
    function highlightActiveSection() {
        if (!sections || sections.length === 0) return;
        
        try {
            const scrollPosition = window.scrollY;
            
            sections.forEach(section => {
                if (!section) return;
                
                const sectionTop = section.offsetTop - 100; 
                const sectionHeight = section.clientHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Error in highlightActiveSection:', e);
        }
    }
    
    // Initial highlight on page load
    highlightActiveSection();
    
    // Update highlight on scroll (with debounce for performance)
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(function() {
            highlightActiveSection();
        });
    });
    
    // Parallax effect for hero section
    try {
        const heroSection = safeQuerySelector('.hero-section');
        const heroContent = safeQuerySelector('.hero-content');
        
        if (heroSection && heroContent) {
            window.addEventListener('scroll', function() {
                const scrollValue = window.scrollY;
                if (scrollValue < heroSection.clientHeight) {
                    heroContent.style.transform = `translateY(${scrollValue * 0.3}px)`;
                }
            });
        }
    } catch (e) {
        console.error('Error setting up parallax effect:', e);
    }
    
    // Add back-to-top button functionality
    try {
        const createBackToTopButton = function() {
            const backToTopBtn = document.createElement('button');
            backToTopBtn.innerHTML = '↑';
            backToTopBtn.classList.add('back-to-top');
            backToTopBtn.setAttribute('aria-label', 'Back to top');
            document.body.appendChild(backToTopBtn);
            
            safeAddEventListener(backToTopBtn, 'click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
            
            // Show/hide button based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });
        };
        
        createBackToTopButton();
    } catch (e) {
        console.error('Error creating back to top button:', e);
    }
    
    // Add preloader functionality
    try {
        const preloader = safeQuerySelector('.preloader');
        if (preloader) {
            window.addEventListener('load', function() {
                preloader.classList.add('fade-out');
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            });
        }
    } catch (e) {
        console.error('Error with preloader:', e);
    }
    
    // Enhanced service card hover animations
    try {
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            safeAddEventListener(card, 'mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            safeAddEventListener(card, 'mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add staggered entrance animation
            card.style.animationDelay = `${index * 0.1}s`;
        });
    } catch (e) {
        console.error('Error setting up service card animations:', e);
    }
    
    // Enhanced team member hover animations
    try {
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach(member => {
            safeAddEventListener(member, 'mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            });
            
            safeAddEventListener(member, 'mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Main founder hover effect
        const mainFounder = safeQuerySelector('.main-founder');
        if (mainFounder) {
            safeAddEventListener(mainFounder, 'mouseenter', function() {
                const founderInfo = this.querySelector('.founder-info');
                if (founderInfo) {
                    founderInfo.style.transform = 'translateY(-5px) scale(1.01)';
                    founderInfo.style.transition = 'all 0.3s ease';
                }
            });
            
            safeAddEventListener(mainFounder, 'mouseleave', function() {
                const founderInfo = this.querySelector('.founder-info');
                if (founderInfo) {
                    founderInfo.style.transform = 'translateY(0) scale(1)';
                }
            });
        }
    } catch (e) {
        console.error('Error setting up team member animations:', e);
    }
    
    // Handle window resize to reset mobile menu
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navLinks) {
            navLinks.classList.remove('active');
            if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
});

// Artist Carousel Functionality
let currentSlide = 0;
const totalSlides = 5; // Adjust based on number of artists

function updateCarousel() {
    try {
        const artistCards = document.querySelectorAll('.artist-card');
        const indicators = document.querySelectorAll('.indicator');
        
        // Remove active class from all cards and indicators
        artistCards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide
        if (artistCards[currentSlide]) {
            artistCards[currentSlide].classList.add('active');
        }
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
        
        // Center the active card
        const carousel = document.querySelector('.artist-carousel');
        if (carousel && artistCards[currentSlide]) {
            const cardWidth = artistCards[0].offsetWidth + 30; // width + margin
            const offset = (carousel.offsetWidth / 2) - (cardWidth / 2) - (currentSlide * cardWidth);
            carousel.style.transform = `translateX(${offset}px)`;
        }
    } catch (e) {
        console.error('Error updating carousel:', e);
    }
}

function nextArtist() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevArtist() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Auto-advance carousel
let carouselInterval;
function startCarousel() {
    carouselInterval = setInterval(nextArtist, 5000); // Change slide every 5 seconds
}

function stopCarousel() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
}

// Initialize carousel when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateCarousel();
        startCarousel();
    }, 1000);
    
    // Pause carousel on hover
    const carousel = document.querySelector('.artist-carousel-container');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);
    }
});

// Service booking functionality
function bookService(serviceName) {
    try {
        // Show booking confirmation
        const confirmMessage = `Would you like to book "${serviceName}"? You will be redirected to our Facebook page to complete your booking.`;
        
        if (confirm(confirmMessage)) {
            // Redirect to Facebook page
            window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
            
            // Optional: Track booking attempt (for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'book_service', {
                    'service_name': serviceName,
                    'event_category': 'engagement'
                });
            }
        }
    } catch (e) {
        console.error('Error in bookService:', e);
        // Fallback: direct redirect
        window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
    }
}

// Show other offers functionality
function showOtherOffers() {
    try {
        alert('Contact us for custom packages and special offers!\n\nCall us or visit our Facebook page for more information about:\n• Group discounts\n• Long-term studio rentals\n• Custom recording packages\n• Event coverage\n• And much more!');
        
        // Optional: Redirect to contact or Facebook
        setTimeout(() => {
            window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
        }, 1000);
    } catch (e) {
        console.error('Error in showOtherOffers:', e);
    }
}

// View artist functionality
function viewArtist(artistName) {
    try {
        alert(`Learn more about ${artistName}!\n\nVisit our Facebook page to see their latest work and upcoming sessions.`);
        
        // Redirect to Facebook page
        setTimeout(() => {
            window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
        }, 500);
        
        // Optional: Track artist view (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_artist', {
                'artist_name': artistName,
                'event_category': 'engagement'
            });
        }
    } catch (e) {
        console.error('Error in viewArtist:', e);
        // Fallback: direct redirect
        window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
    }
}

// Contact Us functionality
function contactUs() {
    try {
        // Create a more detailed contact modal
        const contactInfo = `Contact Sugoi Music Studio
        
📍 Address:
17 Finland Street, Don Bosco, Parañaque, Philippines

📱 Social Media:
• Facebook: facebook.com/sugoimusicstudio
• Instagram: @sugoimusicstudio
• TikTok: @sugoi.music.studio
• YouTube: @sugoimusicstudio

🎵 Services Available:
• Studio Rehearsal
• Live Video Performance
• Social Media Live Stream
• Multitrack Recording
• Podcast Recording
• Live Mix Recording

Would you like to visit our Facebook page for more information?`;

        if (confirm(contactInfo)) {
            window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
        }
        
        // Optional: Track contact attempt (for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'contact_click', {
                'event_category': 'engagement',
                'event_label': 'contact_us_button'
            });
        }
    } catch (e) {
        console.error('Error in contactUs:', e);
        // Fallback: direct redirect
        window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
    }
}

// Enhanced scroll behavior for all animated elements
document.addEventListener('scroll', function() {
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .main-founder, .artist-card');
    const windowHeight = window.innerHeight;
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = elementTop < windowHeight - 100;
        
        if (elementVisible && !element.classList.contains('fade-in')) {
            element.classList.add('fade-in');
        }
    });
});

// Add particle effect for sections (optional enhancement)
function createParticleEffect(sectionSelector) {
    try {
        const section = document.querySelector(sectionSelector);
        if (!section) return;
        
        // Create floating particles for enhanced visual appeal
        for (let i = 0; i < 3; i++) {
            const particle = document.createElement('div');
            particle.className = 'floating-particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(186, 109, 47, 0.3);
                border-radius: 50%;
                animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 1;
                pointer-events: none;
            `;
            section.appendChild(particle);
        }
        
        // Add floating animation keyframes if not already present
        if (!document.querySelector('#floating-keyframes')) {
            const style = document.createElement('style');
            style.id = 'floating-keyframes';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
                }
            `;
            document.head.appendChild(style);
        }
    } catch (e) {
        console.error('Error creating particle effect:', e);
    }
}

// Initialize particle effects after page load
window.addEventListener('load', function() {
    setTimeout(() => {
        createParticleEffect('.team-section');
        createParticleEffect('.artist-section');
        createParticleEffect('.news-section');
    }, 2000);
});

// Touch/swipe functionality for mobile carousel
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        // Swipe left - next slide
        nextArtist();
    }
    if (touchEndX > touchStartX + 50) {
        // Swipe right - previous slide
        prevArtist();
    }
}

// Add touch event listeners to carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.artist-carousel');
    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
});

// Keyboard navigation for carousel
document.addEventListener('keydown', function(e) {
    if (document.querySelector('.artist-section:hover')) {
        switch(e.key) {
            case 'ArrowLeft':
                prevArtist();
                break;
            case 'ArrowRight':
                nextArtist();
                break;
            case ' ': // Spacebar
                e.preventDefault();
                nextArtist();
                break;
        }
    }
});

// Performance optimization: Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add smooth transitions for page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        stopCarousel();
    } else {
        startCarousel();
    }
});

// Add error handling for missing images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Failed to load image:', this.src);
        });
    });
});