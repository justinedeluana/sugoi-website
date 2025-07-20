document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Script starting...');
    
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

    // ============================================
    // PARALLAX EFFECTS SYSTEM
    // ============================================
    
    let ticking = false;
    const isMobile = window.innerWidth <= 768;
    const parallaxIntensity = isMobile ? 0.5 : 1; // Reduce intensity on mobile
    
    function updateParallax() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        
        // Skip parallax on mobile for better performance
        if (isMobile && scrollTop % 3 !== 0) return; // Throttle on mobile
        
        // Hero section parallax
        const heroSection = safeQuerySelector('.hero-section');
        const videoBg = safeQuerySelector('.video-bg');
        
        if (heroSection && videoBg) {
            const heroRect = heroSection.getBoundingClientRect();
            const heroOffset = scrollTop * 0.5 * parallaxIntensity; // Slower parallax
            videoBg.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
        }
        
        // About section parallax
        const aboutSection = safeQuerySelector('.about-section');
        const aboutBg = safeQuerySelector('.about-background');
        
        if (aboutSection && aboutBg) {
            const aboutRect = aboutSection.getBoundingClientRect();
            if (aboutRect.top < windowHeight && aboutRect.bottom > 0) {
                const aboutOffset = (scrollTop - aboutSection.offsetTop) * 0.3 * parallaxIntensity;
                aboutBg.style.transform = `translate3d(0, ${aboutOffset}px, 0)`;
            }
        }
        
        // Services section parallax - elements moving at different speeds
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const offset = scrollTop * (0.1 + index * 0.05) * parallaxIntensity; // Different speeds
                card.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        
        // Artist section parallax - flip cards with subtle movement
        const artistCards = document.querySelectorAll('.flip-card-container');
        artistCards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const offset = scrollTop * (0.08 + (index % 2) * 0.04) * parallaxIntensity; // Alternating speeds
                card.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        
        // Team section parallax
        const teamMembers = document.querySelectorAll('.team-member');
        teamMembers.forEach((member, index) => {
            const rect = member.getBoundingClientRect();
            if (rect.top < windowHeight && rect.bottom > 0) {
                const offset = scrollTop * (0.06 + (index % 3) * 0.02) * parallaxIntensity; // Varied speeds
                member.style.transform = `translate3d(0, ${offset}px, 0)`;
            }
        });
        
        // Parallax decorative elements (skip on mobile for performance)
        if (!isMobile) {
            const decorations = document.querySelectorAll('.parallax-decoration');
            decorations.forEach((decoration, index) => {
                const rect = decoration.getBoundingClientRect();
                if (rect.top < windowHeight + 200 && rect.bottom > -200) {
                    const speed = 0.15 + (index % 3) * 0.05; // Different speeds for variety
                    const offset = scrollTop * speed * parallaxIntensity;
                    decoration.style.transform = `translate3d(0, ${offset}px, 0)`;
                }
            });
        }
        
        ticking = false;
    }
    
    function requestParallax() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    // Initialize parallax on scroll
    window.addEventListener('scroll', requestParallax, { passive: true });
    
    // Initial parallax setup
    updateParallax();

    // Navbar scroll effect - NEW FUNCTIONALITY
    const navbar = safeQuerySelector('.navbar');
    const heroSection = safeQuerySelector('.hero-section');
    
    function handleNavbarScroll() {
        if (!navbar || !heroSection) return;
        
        const heroHeight = heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        // If we're in the hero section (top of page)
        if (scrollPosition < heroHeight - 100) {
            navbar.classList.add('transparent');
            navbar.classList.remove('scrolled');
        } else {
            // If we've scrolled past the hero section
            navbar.classList.remove('transparent');
            navbar.classList.add('scrolled');
        }
    }
    
    // Initial navbar state
    handleNavbarScroll();
    
    // Update navbar on scroll with throttling for performance
    let navbarScrollTimeout;
    window.addEventListener('scroll', function() {
        if (navbarScrollTimeout) {
            window.cancelAnimationFrame(navbarScrollTimeout);
        }
        navbarScrollTimeout = window.requestAnimationFrame(handleNavbarScroll);
    });

    // ...existing code...

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
    
    // Enhanced smooth scrolling for navigation links - DIRECT APPROACH
    console.log('Setting up navigation event listeners...');
    
    // SIMPLE TEST FIRST - Let's see if basic scrolling works
    window.testScroll = function() {
        console.log('Testing basic scroll...');
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
            console.log('Test scroll executed');
        }
    };
    
    try {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach((anchor, index) => {
            console.log(`Setting up listener for link ${index}:`, anchor.getAttribute('href'));
            
            // Use direct addEventListener instead of safe wrapper
            anchor.addEventListener('click', function(e) {
                console.log('CLICK DETECTED on:', this.getAttribute('href'));
                console.log('Current scroll position:', window.pageYOffset);
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                console.log('Navigation clicked:', targetId);
                
                // Don't scroll for empty or "#" links
                if (targetId === "#" || targetId === "") {
                    console.log('Empty target, returning');
                    return;
                }
                
                const targetElement = document.querySelector(targetId);
                console.log('Target element found:', targetElement); // Debug log
                
                if (targetElement) {
                    console.log('Target element found:', targetElement);
                    console.log('Element offsetTop:', targetElement.offsetTop);
                    
                    // Close mobile menu if open first
                    const navLinksElement = document.querySelector('.nav-links');
                    const mobileMenuBtnElement = document.querySelector('.mobile-menu-btn');
                    
                    if (navLinksElement && navLinksElement.classList.contains('active')) {
                        navLinksElement.classList.remove('active');
                        if (mobileMenuBtnElement) {
                            mobileMenuBtnElement.classList.remove('active'); 
                        }
                        document.body.classList.remove('menu-open');
                    }
                    
                    // SIMPLIFIED SCROLLING - Try multiple methods
                    console.log('Attempting to scroll...');
                    
                    // Method 1: Simple scrollIntoView
                    try {
                        targetElement.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'start' 
                        });
                        console.log('ScrollIntoView method executed');
                    } catch (error) {
                        console.log('ScrollIntoView failed:', error);
                        
                        // Method 2: Manual calculation with window.scrollTo
                        try {
                            const elementTop = targetElement.offsetTop;
                            const navbarHeight = 80; // Fixed navbar height
                            const scrollPosition = elementTop - navbarHeight;
                            
                            console.log('Manual scroll to:', scrollPosition);
                            
                            window.scrollTo({
                                top: scrollPosition,
                                behavior: 'smooth'
                            });
                        } catch (scrollError) {
                            console.log('Manual scroll failed:', scrollError);
                            
                            // Method 3: Instant scroll fallback
                            window.scrollTo(0, targetElement.offsetTop - 80);
                        }
                    }
                    
                    // Add active class to clicked nav item
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');
                } else {
                    console.log('Target element not found for:', targetId);
                }
                
                // Add active class to clicked nav item
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            });
        });
    } catch (e) {
        console.error('Error setting up smooth scrolling:', e);
    }
    
    // ============================================
    // ANIMATION SYSTEM - Scroll-based animations
    // ============================================
    
    function initScrollAnimations() {
        console.log('Initializing scroll animations...');
        
        // Create intersection observer for animations
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Add visible class with a small delay for better effect
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, 100);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of element is visible
            rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
        });
        
        // Observe all elements with animation classes
        const animationSelectors = [
            '.fade-in',
            '.slide-up', 
            '.slide-left',
            '.slide-right',
            '.scale-up',
            '.stagger-item'
        ];
        
        animationSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                animationObserver.observe(element);
            });
        });
        
        console.log('Animation observers set up for', 
            document.querySelectorAll(animationSelectors.join(',')).length, 'elements');
    }
    
    // Hero title animation - immediate on load
    function animateHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            setTimeout(() => {
                heroTitle.classList.add('visible');
            }, 500); // Delay for dramatic effect
        }
    }
    
    // Initialize animations
    initScrollAnimations();
    animateHeroTitle();
    
    // Additional entrance animations for specific elements
    function addEntranceAnimations() {
        // Navbar fade in
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            navbar.style.opacity = '0';
            navbar.style.transform = 'translateY(-20px)';
            navbar.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                navbar.style.opacity = '1';
                navbar.style.transform = 'translateY(0)';
            }, 200);
        }
        
        // Service cards stagger animation enhancement
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach((card, index) => {
            card.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    addEntranceAnimations();
    
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

// Show More Artists functionality
function showMoreArtists() {
    try {
        // Show alert with information about more artists
        alert(`🎵 Discover More Amazing Artists! 🎵\n\nWe work with many talented musicians and bands across different genres:\n\n• Pop & Rock Artists\n• Jazz & Blues Musicians\n• Classical Performers\n• Hip-Hop & R&B Artists\n• Indie & Alternative Bands\n• Electronic Music Producers\n• Folk & Country Artists\n• World Music Performers\n\nContact us to learn more about our artists or to discuss collaboration opportunities!\n\nVisit our Facebook page for the latest updates and artist showcases.`);
        
        // Optional: Redirect to contact or Facebook
        setTimeout(() => {
            if (confirm('Would you like to visit our Facebook page to see more artist showcases?')) {
                window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
            }
        }, 500);
        
        // Optional: Track analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_more_artists', {
                'event_category': 'engagement',
                'event_label': 'artist_discovery'
            });
        }
    } catch (e) {
        console.error('Error in showMoreArtists:', e);
        // Fallback: direct redirect
        window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
    }
}

// Enhanced viewArtist function for individual artists
function viewArtist(artistName) {
    try {
        const artistInfo = {
            'Hawaiian Combo Meal': {
                description: 'A vibrant multi-genre band bringing island vibes to every performance. Known for their energetic live shows and diverse musical repertoire.',
                genres: 'Reggae, Pop, Rock, Island Music',
                experience: '8+ years performing',
                contact: 'Available for events and studio sessions'
            },
            'M-SOUL': {
                description: 'Soulful R&B artist with powerful vocals and heartfelt original compositions. Specializes in contemporary soul and neo-soul music.',
                genres: 'R&B, Soul, Neo-Soul, Contemporary',
                experience: '6+ years professional experience',
                contact: 'Solo performances and collaborations'
            },
            '18FLNCH': {
                description: 'Dynamic hip-hop artist and producer with a unique urban sound. Expert in rap, freestyle, and beat production.',
                genres: 'Hip-Hop, Rap, Urban, Beat Production',
                experience: '5+ years in the scene',
                contact: 'Studio sessions and live performances'
            },
            'The Harmonics': {
                description: 'Rock band with exceptional harmony vocals and original songwriting. Known for their powerful live concerts and album production.',
                genres: 'Rock, Alternative, Pop Rock',
                experience: '10+ years as a band',
                contact: 'Concerts and album recordings'
            },
            'Echo Valley': {
                description: 'Acoustic duo specializing in folk and country music with intimate, heartfelt performances perfect for any venue.',
                genres: 'Folk, Country, Acoustic, Indie',
                experience: '4+ years performing together',
                contact: 'Intimate venues and private events'
            },
            'Neon Pulse': {
                description: 'Electronic music producer and DJ bringing high-energy performances to clubs and festivals. Remix specialist with modern sound.',
                genres: 'Electronic, EDM, House, Techno',
                experience: '7+ years DJing and producing',
                contact: 'Club events and festival bookings'
            }
        };
        
        const artist = artistInfo[artistName];
        if (artist) {
            const message = `🎤 ${artistName} 🎤\n\n${artist.description}\n\n🎵 Genres: ${artist.genres}\n⭐ Experience: ${artist.experience}\n📞 ${artist.contact}\n\nInterested in booking or collaboration? Contact Sugoi Music Studio!`;
            alert(message);
            
            setTimeout(() => {
                if (confirm('Would you like to contact us about this artist?')) {
                    window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
                }
            }, 500);
        } else {
            alert(`Learn more about ${artistName} by contacting Sugoi Music Studio!\n\nVisit our Facebook page for detailed artist information and booking inquiries.`);
            window.open('https://www.facebook.com/sugoimusicstudio', '_blank');
        }
        
        // Optional: Track analytics
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

// ============================================
// CONTACT FORM FUNCTIONALITY
// ============================================

// Initialize contact form when DOM is loaded
function initContactForm() {
    const contactForm = safeQuerySelector('#contactForm');
    const formSuccess = safeQuerySelector('#formSuccess');
    
    if (!contactForm) return; // Exit if not on contact page
    
    safeAddEventListener(contactForm, 'submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // Basic validation
        if (!validateContactForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            if (formSuccess) {
                formSuccess.classList.add('show');
            }
            
            // Optional: Track form submission
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'form_name': 'contact_form',
                    'event_category': 'engagement'
                });
            }
            
            // Reset form after success (optional)
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                if (formSuccess) {
                    formSuccess.classList.remove('show');
                }
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
            
        }, 2000); // Simulate network delay
    });
    
    // Add real-time validation
    const requiredFields = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    requiredFields.forEach(field => {
        safeAddEventListener(field, 'blur', function() {
            validateField(field);
        });
        
        safeAddEventListener(field, 'input', function() {
            if (field.classList.contains('error')) {
                validateField(field);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error styles
    field.classList.remove('error');
    removeFieldError(field);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    if (!isValid) {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    let errorElement = formGroup.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ff6b6b;
        font-size: 0.85rem;
        margin-top: 5px;
        display: block;
    `;
}

// Remove field error
function removeFieldError(field) {
    const formGroup = field.closest('.form-group');
    if (!formGroup) return;
    
    const errorElement = formGroup.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Validate entire contact form
function validateContactForm(data) {
    let isValid = true;
    
    // Check required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    
    requiredFields.forEach(fieldName => {
        if (!data[fieldName] || data[fieldName].trim() === '') {
            isValid = false;
            const field = document.querySelector(`[name="${fieldName}"]`);
            if (field) {
                validateField(field);
            }
        }
    });
    
    // Email validation
    if (data.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            isValid = false;
            const emailField = document.querySelector('[name="email"]');
            if (emailField) {
                validateField(emailField);
            }
        }
    }
    
    return isValid;
}

// Initialize contact form
initContactForm();