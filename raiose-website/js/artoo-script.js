document.addEventListener('DOMContentLoaded', function() {
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

    // Hamburger menu (side drawer)
    const hamburger = document.querySelector('.hamburger');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            // Create side drawer if not exists
            let sideDrawer = document.querySelector('.side-drawer');
            if (!sideDrawer) {
                sideDrawer = document.createElement('div');
                sideDrawer.className = 'side-drawer';
                sideDrawer.innerHTML = `
                    <div class="drawer-overlay"></div>
                    <div class="drawer-content">
                        <button class="drawer-close">&times;</button>
                        <nav class="drawer-nav">
                            <a href="#home">ホーム</a>
                            <a href="#about">私たちについて</a>
                            <a href="#company">会社情報</a>
                            <a href="#contact">お問い合わせ</a>
                        </nav>
                    </div>
                `;
                document.body.appendChild(sideDrawer);

                // Add close handlers
                const drawerClose = sideDrawer.querySelector('.drawer-close');
                const drawerOverlay = sideDrawer.querySelector('.drawer-overlay');

                drawerClose.addEventListener('click', function() {
                    sideDrawer.classList.remove('active');
                });

                drawerOverlay.addEventListener('click', function() {
                    sideDrawer.classList.remove('active');
                });

                // Add link click handlers
                sideDrawer.querySelectorAll('.drawer-nav a').forEach(link => {
                    link.addEventListener('click', function() {
                        sideDrawer.classList.remove('active');
                    });
                });
            }

            sideDrawer.classList.add('active');
        });
    }

    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Intro overlay animation
    const introOverlay = document.getElementById('intro-overlay');

    if (introOverlay) {
        // Prevent scroll during intro
        document.body.style.overflow = 'hidden';

        // Hide overlay after animation
        setTimeout(() => {
            introOverlay.classList.add('hidden');
            document.body.style.overflow = '';

            // Trigger entrance animations
            const heroElements = document.querySelectorAll('.hero-index, .hero-visual, .hero-copy');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.style.animationPlayState = 'running';
                }, index * 100);
            });
        }, 1200);
    }
});