// Main JavaScript functionality for Vulnerable MCP Project
(function() {
    'use strict';

    // Mobile navigation toggle
    function initMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', function() {
                const expanded = navToggle.getAttribute('aria-expanded') === 'true';
                navToggle.setAttribute('aria-expanded', !expanded);
                navLinks.classList.toggle('show');
            });

            // Close mobile nav when clicking outside
            document.addEventListener('click', function(e) {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close mobile nav when window is resized to desktop size
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    navLinks.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Search functionality
    function initSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        
        if (searchInput && searchButton) {
            function performSearch() {
                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    // Hide all vulnerability cards initially
                    const cards = document.querySelectorAll('.vulnerability-card');
                    cards.forEach(card => {
                        const title = card.querySelector('.issue-title')?.textContent.toLowerCase() || '';
                        const description = card.querySelector('.card-body p')?.textContent.toLowerCase() || '';
                        const tags = card.querySelector('.tags')?.textContent.toLowerCase() || '';
                        
                        if (title.includes(query) || description.includes(query) || tags.includes(query)) {
                            card.style.display = 'block';
                            card.classList.add('fade-in-up');
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Update results count
                    const visibleCards = document.querySelectorAll('.vulnerability-card[style*="block"]').length;
                    updateResultsCount(visibleCards);
                }
            }

            searchButton.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            });

            // Real-time search
            searchInput.addEventListener('input', function() {
                if (this.value.length >= 2) {
                    performSearch();
                } else if (this.value.length === 0) {
                    // Show all cards when search is cleared
                    document.querySelectorAll('.vulnerability-card').forEach(card => {
                        card.style.display = 'block';
                    });
                    updateResultsCount(document.querySelectorAll('.vulnerability-card').length);
                }
            });
        }
    }

    // Filter functionality
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.dataset.filter;
                const cards = document.querySelectorAll('.vulnerability-card');
                
                cards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else {
                        const severity = card.querySelector('.severity-badge')?.textContent.toLowerCase().trim();
                        card.style.display = severity === filterValue ? 'block' : 'none';
                    }
                });
                
                // Update results count
                const visibleCards = document.querySelectorAll('.vulnerability-card[style*="block"]').length;
                updateResultsCount(visibleCards);
            });
        });
    }

    // Update results count
    function updateResultsCount(count) {
        const countElement = document.getElementById('resultsCount');
        if (countElement) {
            countElement.textContent = `${count} vulnerability${count !== 1 ? 'ies' : 'y'} found`;
        }
    }

    // Active navigation highlighting
    function initActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Scroll-based navigation highlighting for single page sections
    function initScrollNav() {
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.security-nav a[href^="#"]');
        
        if (sections.length > 0 && navLinks.length > 0) {
            function highlightCurrentSection() {
                let current = '';
                const scrollPos = window.scrollY + 100; // Offset for header
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    
                    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + current) {
                        link.classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', highlightCurrentSection);
            highlightCurrentSection(); // Initial call
        }
    }

    // Lazy loading for images
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('fade-in-up');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('.image-container img').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Copy code functionality
    function initCodeCopy() {
        document.querySelectorAll('.code-block').forEach(block => {
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-btn';
            copyButton.innerHTML = '📋 Copy';
            copyButton.style.cssText = `
                position: absolute;
                top: 1rem;
                left: 1rem;
                background: rgba(255,255,255,0.1);
                color: white;
                border: none;
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: background 0.3s;
            `;
            
            copyButton.addEventListener('click', async () => {
                const code = block.querySelector('pre').textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    copyButton.innerHTML = '✅ Copied';
                    copyButton.style.background = 'var(--success-color)';
                    setTimeout(() => {
                        copyButton.innerHTML = '📋 Copy';
                        copyButton.style.background = 'rgba(255,255,255,0.1)';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code:', err);
                }
            });
            
            block.style.position = 'relative';
            block.appendChild(copyButton);
        });
    }

    // Back to top functionality
    function initBackToTop() {
        const backToTopBtn = document.createElement('button');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.innerHTML = '↑';
        backToTopBtn.setAttribute('aria-label', 'Back to top');
        backToTopBtn.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(backToTopBtn);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Performance optimization: Debounce function
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

    // Initialize all functionality when DOM is loaded
    function init() {
        initMobileNav();
        initSmoothScrolling();
        initSearch();
        initFilters();
        initActiveNavigation();
        initScrollNav();
        initLazyLoading();
        initCodeCopy();
        initBackToTop();
        
        // Add fade-in animation to sections on scroll
        if ('IntersectionObserver' in window) {
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.section, .vulnerability-card').forEach(section => {
                sectionObserver.observe(section);
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some functions globally if needed
    window.VulnerableMCP = {
        debounce,
        updateResultsCount
    };

})(); 