document.addEventListener('DOMContentLoaded', function() {
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
                            targetCard.classList.add('highlight');
                            setTimeout(() => {
                                targetCard.classList.remove('highlight');
                            }, 1600);
                        }
                    }
                    
                    // Update active state
                    document.querySelectorAll('.nav-link').forEach(navLink => {
                        navLink.classList.remove('active');
                    });
                    
                    const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(navLink => {
            navLink.classList.remove('active');
            if (navLink.getAttribute('href') === `#${current}`) {
                navLink.classList.add('active');
            }
        });
    });
    
    // Search modal
    const searchTrigger = document.querySelector('.search-trigger');
    const searchModal = document.getElementById('search-modal');
    const modalClose = document.querySelector('.modal-close');
    const searchInput = document.querySelector('.search-input');
    
    if (searchTrigger && searchModal) {
        searchTrigger.addEventListener('click', function() {
            searchModal.classList.add('active');
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        });
        
        modalClose.addEventListener('click', function() {
            searchModal.classList.remove('active');
        });
        
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
            }
        });
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
            }
        });
    }
    
    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const headerMenu = document.querySelector('.header-menu');
    const headerActions = document.querySelector('.header-actions');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile menu if not exists
            let mobileMenu = document.querySelector('.mobile-menu');
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                mobileMenu.innerHTML = `
                    <nav class="mobile-nav">
                        <a href="#home" class="mobile-nav-link">ホーム</a>
                        <a href="#about" class="mobile-nav-link">私たちについて</a>
                        <a href="#company" class="mobile-nav-link">会社情報</a>
                        <a href="#contact" class="mobile-nav-link">お問い合わせ</a>
                    </nav>
                `;
                document.body.appendChild(mobileMenu);
                
                // Add click handlers
                mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
                    link.addEventListener('click', function() {
                        mobileMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    });
                });
            }
            
            mobileMenu.classList.toggle('active');
        });
    }
    
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
    
    // Service chips for mobile
    const serviceChips = document.querySelectorAll('.chip');
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const service = this.dataset.service;
            
            // Update active chip
            serviceChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide cards on mobile
            if (window.innerWidth <= 768) {
                serviceCards.forEach(card => {
                    if (card.dataset.service === service) {
                        card.classList.add('visible');
                        card.style.display = 'block';
                    } else {
                        card.classList.remove('visible');
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Show first service by default on mobile
    if (window.innerWidth <= 768 && serviceCards.length > 0) {
        serviceCards.forEach((card, index) => {
            if (index === 0) {
                card.classList.add('visible');
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Form submission with thanks message
    const contactForm = document.getElementById('contact-form');
    const formWrapper = document.getElementById('contact-form-wrapper');
    const thanksMessage = document.getElementById('contact-thanks');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = '送信中...';
            submitBtn.disabled = true;
            
            // Simulate submission and show thanks
            setTimeout(() => {
                contactForm.reset();
                if (formWrapper && thanksMessage) {
                    formWrapper.style.display = 'none';
                    thanksMessage.style.display = 'block';
                }
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for grid items
                if (entry.target.classList.contains('services-grid')) {
                    const cards = entry.target.querySelectorAll('.service-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 100);
                    });
                }
                
                if (entry.target.classList.contains('strip-container')) {
                    const cards = entry.target.querySelectorAll('.strip-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);
    
    // Observe sections for animations
    const animatedSections = document.querySelectorAll('.services, .about, .company, .contact');
    animatedSections.forEach(section => {
        observer.observe(section);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .mobile-menu {
            display: none;
            position: fixed;
            top: 72px;
            left: 0;
            right: 0;
            background: var(--bg-1);
            border-bottom: 1px solid var(--line-0);
            z-index: 998;
            transform: translateY(-100%);
            transition: transform var(--transition-base);
        }
        
        .mobile-menu.active {
            display: block;
            transform: translateY(0);
        }
        
        .mobile-nav {
            padding: var(--spacing-lg);
        }
        
        .mobile-nav-link {
            display: block;
            padding: var(--spacing-md) 0;
            color: var(--ink-1);
            text-decoration: none;
            font-size: 16px;
            transition: var(--transition-fast);
            border-bottom: 1px solid var(--line-0);
        }
        
        .mobile-nav-link:hover {
            color: var(--ink-0);
        }
        
        .mobile-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .side-drawer {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1001;
            display: none;
        }
        
        .side-drawer.active {
            display: block;
        }
        
        .drawer-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
            animation: fadeIn var(--transition-fast) forwards;
        }
        
        .drawer-content {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 320px;
            background: var(--bg-1);
            transform: translateX(-100%);
            animation: slideIn var(--transition-base) forwards;
        }
        
        @keyframes fadeIn {
            to {
                opacity: 1;
            }
        }
        
        @keyframes slideIn {
            to {
                transform: translateX(0);
            }
        }
        
        .drawer-close {
            position: absolute;
            top: var(--spacing-lg);
            right: var(--spacing-lg);
            background: transparent;
            border: none;
            color: var(--ink-1);
            font-size: 32px;
            cursor: pointer;
            transition: var(--transition-fast);
        }
        
        .drawer-close:hover {
            color: var(--ink-0);
        }
        
        .drawer-nav {
            padding: 80px var(--spacing-2xl) var(--spacing-2xl);
        }
        
        .drawer-nav a {
            display: block;
            padding: var(--spacing-md) 0;
            color: var(--ink-1);
            text-decoration: none;
            font-size: 18px;
            font-weight: 500;
            transition: var(--transition-fast);
            border-bottom: 1px solid var(--line-0);
        }
        
        .drawer-nav a:hover {
            color: var(--ink-0);
            padding-left: var(--spacing-md);
        }
        
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .services-grid .service-card,
        .strip-container .strip-card {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity var(--transition-base), transform var(--transition-base);
        }
        
        .services-grid .service-card.visible,
        .strip-container .strip-card.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        body.keyboard-nav *:focus {
            outline: 2px solid var(--cta-0);
            outline-offset: 2px;
        }
        
        body:not(.keyboard-nav) *:focus {
            outline: none;
        }
    `;
    document.head.appendChild(style);
    
    // Scroll to top function
    window.scrollToTop = function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
    // Accessibility: Focus visible
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-nav');
    });
    
    console.log('Artoo Raiose Site Initialized');
});