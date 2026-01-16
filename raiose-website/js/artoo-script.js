document.addEventListener('DOMContentLoaded', function() {
    // Page enter animation
    document.body.classList.add('page-entering');
    setTimeout(() => {
        document.body.classList.remove('page-entering');
    }, 600);

    // Create page transition overlay
    const pageTransition = document.createElement('div');
    pageTransition.className = 'page-transition';
    document.body.appendChild(pageTransition);

    // Mobile menu functionality
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.createElement('nav');
    mobileNav.className = 'mobile-nav';

    // Check if we're in a subdirectory
    const isInSubdir = window.location.pathname.includes('/pages/');
    const pathPrefix = isInSubdir ? '../' : '';
    const pagesPrefix = isInSubdir ? '' : 'pages/';

    mobileNav.innerHTML = `
        <button class="mobile-nav-close" aria-label="Close menu"></button>
        <div class="mobile-nav-links">
            <a href="${pathPrefix}index.html">ホーム</a>
            <a href="${pathPrefix}about.html">私たちについて</a>
            <a href="${pathPrefix}${pagesPrefix}company.html">会社情報</a>
            <a href="${pathPrefix}${pagesPrefix}services.html">サービス</a>
            <a href="${pathPrefix}${pagesPrefix}contact.html" class="mobile-cta">お問い合わせ</a>
        </div>
    `;
    document.body.appendChild(mobileNav);

    const closeBtn = mobileNav.querySelector('.mobile-nav-close');

    // Toggle mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            mobileNav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close mobile menu
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Close menu when clicking outside
    mobileNav.addEventListener('click', function(e) {
        if (e.target === mobileNav) {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Header scroll effects
    const header = document.querySelector('.header-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (currentScroll > lastScroll && currentScroll > 300) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for navigation links with highlight effect
    const navLinks = document.querySelectorAll('.nav-link, .index-links a, .btn[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Highlight service card if it's a service link
                    if (targetId.startsWith('svc-')) {
                        const targetCard = document.getElementById(targetId);
                        if (targetCard) {
                            targetCard.classList.add('highlighted');
                            setTimeout(() => {
                                targetCard.classList.remove('highlighted');
                            }, 2000);
                        }
                    }
                }
            }
        });
    });

    // Service page links from home
    const serviceLinks = document.querySelectorAll('.index-links a');
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.includes('#')) {
                // Store the target service in sessionStorage
                const service = href.split('#')[1];
                sessionStorage.setItem('activeService', service);
            }
        });
    });

    // Handle service page tabs
    const tabs = document.querySelectorAll('.svc-tabs .tab');
    const panels = document.querySelectorAll('.svc-panel');

    // Check if we should activate a specific tab from navigation
    const activeService = sessionStorage.getItem('activeService');
    if (activeService && tabs.length > 0) {
        sessionStorage.removeItem('activeService'); // Clear after use

        // Activate the specified tab
        tabs.forEach(t => {
            if (t.dataset.service === activeService) {
                t.classList.add('active');
                t.setAttribute('aria-selected', 'true');
            } else {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            }
        });

        // Show the corresponding panel
        panels.forEach(p => {
            if (p.dataset.service === activeService) {
                p.classList.add('active');
            } else {
                p.classList.remove('active');
            }
        });
    } else if (tabs.length > 0 && !document.querySelector('.svc-tabs .tab.active')) {
        // Initialize first tab as active if none selected
        tabs[0].classList.add('active');
        tabs[0].setAttribute('aria-selected', 'true');
        if (panels[0]) {
            panels[0].classList.add('active');
        }
    }

    // Tab click handlers
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const service = this.dataset.service;

            // Update tabs
            tabs.forEach(t => {
                if (t === this) {
                    t.classList.add('active');
                    t.setAttribute('aria-selected', 'true');
                } else {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                }
            });

            // Update panels
            panels.forEach(panel => {
                if (panel.dataset.service === service) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });


    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // ========================================
    // Scroll Reveal Animations
    // ========================================

    // Find all elements that should animate on scroll
    const scrollRevealElements = document.querySelectorAll(
        '.section-title, .section-subtitle, .service-card, .philosophy-card, ' +
        '.news-card, .partner-item, .strip-card, .company-card, .work-card, ' +
        '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, ' +
        '.scroll-reveal-stagger'
    );

    // Create intersection observer for scroll animations
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optionally unobserve after revealing
                // scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Add initial classes and observe elements
    scrollRevealElements.forEach((el, index) => {
        // Skip elements that already have specific reveal classes
        if (!el.classList.contains('scroll-reveal') &&
            !el.classList.contains('scroll-reveal-left') &&
            !el.classList.contains('scroll-reveal-right') &&
            !el.classList.contains('scroll-reveal-scale') &&
            !el.classList.contains('scroll-reveal-stagger')) {
            el.classList.add('scroll-reveal');
        }

        // Add staggered delay for grid items
        if (el.classList.contains('service-card') ||
            el.classList.contains('philosophy-card') ||
            el.classList.contains('news-card') ||
            el.classList.contains('partner-item') ||
            el.classList.contains('work-card')) {
            el.style.transitionDelay = `${(index % 4) * 100}ms`;
        }

        scrollObserver.observe(el);
    });

    // ========================================
    // Page Transition for Internal Links
    // ========================================

    const internalLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"]):not([href^="mailto"])');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's an anchor link or external
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) {
                return;
            }

            e.preventDefault();

            // Activate page transition
            pageTransition.classList.add('active');

            // Navigate after transition
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        });
    });

    // ========================================
    // Enhanced Card Hover Effects
    // ========================================

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn-cta, .btn-primary, .btn-submit');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                left: ${x}px;
                top: ${y}px;
                width: 100px;
                height: 100px;
                margin-left: -50px;
                margin-top: -50px;
            `;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation style
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ========================================
    // Parallax Effect for Hero Section
    // ========================================

    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;

            if (scrolled < window.innerHeight) {
                heroVisual.style.transform = `translateY(${rate}px)`;
            }
        }, { passive: true });
    }
});