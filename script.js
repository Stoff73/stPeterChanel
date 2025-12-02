/**
 * St Peter Chanel Catholic Primary School
 * Main JavaScript File
 * Squarespace Compatible
 */

(function() {
    'use strict';

    // ===================================
    // DOM Ready Handler
    // ===================================
    document.addEventListener('DOMContentLoaded', function() {
        initCookieConsent();
        initMobileMenu();
        initNavigation();
        initBackToTop();
        initAccessibility();
        initContactForm();
        initAlertBanner();
        initOEmbed();
        initSmoothScroll();
    });

    // ===================================
    // Cookie Consent System
    // ===================================
    function initCookieConsent() {
        const cookieConsent = document.getElementById('cookie-consent');
        const acceptAllBtn = document.getElementById('cookie-accept-all');
        const acceptSelectedBtn = document.getElementById('cookie-accept-selected');
        const rejectBtn = document.getElementById('cookie-reject');
        const cookieSettingsLink = document.getElementById('cookie-settings-link');

        // Check if user has already made a choice
        const consentStatus = getCookie('cookie_consent');

        if (!consentStatus && cookieConsent) {
            // Show cookie banner after a short delay
            setTimeout(function() {
                cookieConsent.classList.add('active');
            }, 1000);
        }

        // Accept All
        if (acceptAllBtn) {
            acceptAllBtn.addEventListener('click', function() {
                setCookiePreferences({
                    essential: true,
                    analytics: true,
                    marketing: true
                });
                hideCookieConsent();
            });
        }

        // Accept Selected
        if (acceptSelectedBtn) {
            acceptSelectedBtn.addEventListener('click', function() {
                const analytics = document.getElementById('cookie-analytics');
                const marketing = document.getElementById('cookie-marketing');

                setCookiePreferences({
                    essential: true,
                    analytics: analytics ? analytics.checked : false,
                    marketing: marketing ? marketing.checked : false
                });
                hideCookieConsent();
            });
        }

        // Reject Non-Essential
        if (rejectBtn) {
            rejectBtn.addEventListener('click', function() {
                setCookiePreferences({
                    essential: true,
                    analytics: false,
                    marketing: false
                });
                hideCookieConsent();
            });
        }

        // Cookie Settings Link (Footer)
        if (cookieSettingsLink) {
            cookieSettingsLink.addEventListener('click', function(e) {
                e.preventDefault();
                if (cookieConsent) {
                    cookieConsent.classList.add('active');
                    // Restore previous selections
                    const prefs = getCookiePreferences();
                    const analytics = document.getElementById('cookie-analytics');
                    const marketing = document.getElementById('cookie-marketing');
                    if (analytics) analytics.checked = prefs.analytics;
                    if (marketing) marketing.checked = prefs.marketing;
                }
            });
        }

        function hideCookieConsent() {
            if (cookieConsent) {
                cookieConsent.classList.remove('active');
            }
        }

        function setCookiePreferences(prefs) {
            setCookie('cookie_consent', 'true', 365);
            setCookie('cookie_preferences', JSON.stringify(prefs), 365);

            // Trigger events based on preferences
            if (prefs.analytics) {
                enableAnalytics();
            }
            if (prefs.marketing) {
                enableMarketing();
            }
        }

        function getCookiePreferences() {
            const prefs = getCookie('cookie_preferences');
            if (prefs) {
                try {
                    return JSON.parse(prefs);
                } catch (e) {
                    return { essential: true, analytics: false, marketing: false };
                }
            }
            return { essential: true, analytics: false, marketing: false };
        }

        function enableAnalytics() {
            // Placeholder for analytics initialization (e.g., Google Analytics)
            console.log('Analytics cookies enabled');
            // window.dataLayer = window.dataLayer || [];
            // function gtag(){dataLayer.push(arguments);}
            // gtag('js', new Date());
            // gtag('config', 'GA_MEASUREMENT_ID');
        }

        function enableMarketing() {
            // Placeholder for marketing cookies initialization
            console.log('Marketing cookies enabled');
        }
    }

    // Cookie Helper Functions
    function setCookie(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/; SameSite=Lax';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // ===================================
    // Mobile Menu
    // ===================================
    function initMobileMenu() {
        const toggle = document.getElementById('mobile-menu-toggle');
        const nav = document.getElementById('main-nav');
        const body = document.body;

        if (toggle && nav) {
            toggle.addEventListener('click', function() {
                toggle.classList.toggle('active');
                nav.classList.toggle('active');
                body.classList.toggle('menu-open');

                // Update ARIA attributes
                const isExpanded = toggle.classList.contains('active');
                toggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (nav.classList.contains('active') &&
                    !nav.contains(e.target) &&
                    !toggle.contains(e.target)) {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                    body.classList.remove('menu-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && nav.classList.contains('active')) {
                    toggle.classList.remove('active');
                    nav.classList.remove('active');
                    body.classList.remove('menu-open');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // ===================================
    // Navigation (Submenu handling)
    // ===================================
    function initNavigation() {
        const navItems = document.querySelectorAll('.nav-item.has-submenu');

        navItems.forEach(function(item) {
            const link = item.querySelector('.nav-link');
            const submenu = item.querySelector('.submenu');

            if (link && submenu) {
                // Mobile: Toggle submenu on click
                link.addEventListener('click', function(e) {
                    if (window.innerWidth <= 992) {
                        e.preventDefault();
                        item.classList.toggle('active');

                        // Close other open submenus
                        navItems.forEach(function(otherItem) {
                            if (otherItem !== item) {
                                otherItem.classList.remove('active');
                            }
                        });
                    }
                });

                // Keyboard navigation
                link.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.classList.toggle('active');
                    }
                    if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        const firstLink = submenu.querySelector('a');
                        if (firstLink) firstLink.focus();
                    }
                });

                // Submenu keyboard navigation
                const submenuLinks = submenu.querySelectorAll('a');
                submenuLinks.forEach(function(subLink, index) {
                    subLink.addEventListener('keydown', function(e) {
                        if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            const next = submenuLinks[index + 1];
                            if (next) next.focus();
                        }
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            const prev = submenuLinks[index - 1];
                            if (prev) {
                                prev.focus();
                            } else {
                                link.focus();
                            }
                        }
                        if (e.key === 'Escape') {
                            item.classList.remove('active');
                            link.focus();
                        }
                    });
                });
            }
        });

        // Highlight current page in navigation
        highlightCurrentPage();
    }

    function highlightCurrentPage() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .submenu a');

        navLinks.forEach(function(link) {
            const href = link.getAttribute('href');
            if (href && (currentPath.endsWith(href) || currentPath.includes(href.replace('.html', '')))) {
                link.classList.add('active');
                // Also highlight parent nav item
                const parentItem = link.closest('.nav-item');
                if (parentItem) {
                    const parentLink = parentItem.querySelector('.nav-link');
                    if (parentLink && parentLink !== link) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });
    }

    // ===================================
    // Back to Top Button
    // ===================================
    function initBackToTop() {
        const backToTop = document.getElementById('back-to-top');

        if (backToTop) {
            // Show/hide based on scroll position
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            // Scroll to top on click
            backToTop.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    // ===================================
    // Accessibility Features
    // ===================================
    function initAccessibility() {
        const highContrastToggle = document.getElementById('high-contrast-toggle');
        const fontIncrease = document.getElementById('font-size-increase');
        const fontDecrease = document.getElementById('font-size-decrease');

        // Load saved preferences
        const savedContrast = localStorage.getItem('highContrast');
        const savedFontSize = localStorage.getItem('fontSize');

        if (savedContrast === 'true') {
            document.body.classList.add('high-contrast');
        }

        if (savedFontSize) {
            document.body.classList.add(savedFontSize);
        }

        // High contrast toggle
        if (highContrastToggle) {
            highContrastToggle.addEventListener('click', function() {
                document.body.classList.toggle('high-contrast');
                const isHighContrast = document.body.classList.contains('high-contrast');
                localStorage.setItem('highContrast', isHighContrast);
            });
        }

        // Font size controls
        let currentFontSize = 0; // 0 = normal, 1 = large, 2 = larger

        if (savedFontSize === 'font-size-large') currentFontSize = 1;
        if (savedFontSize === 'font-size-larger') currentFontSize = 2;

        if (fontIncrease) {
            fontIncrease.addEventListener('click', function() {
                changeFontSize(1);
            });
        }

        if (fontDecrease) {
            fontDecrease.addEventListener('click', function() {
                changeFontSize(-1);
            });
        }

        function changeFontSize(direction) {
            // Remove current font size class
            document.body.classList.remove('font-size-large', 'font-size-larger');

            currentFontSize += direction;
            if (currentFontSize < 0) currentFontSize = 0;
            if (currentFontSize > 2) currentFontSize = 2;

            let className = '';
            if (currentFontSize === 1) className = 'font-size-large';
            if (currentFontSize === 2) className = 'font-size-larger';

            if (className) {
                document.body.classList.add(className);
            }

            localStorage.setItem('fontSize', className);
        }
    }

    // ===================================
    // Contact Form
    // ===================================
    function initContactForm() {
        const form = document.getElementById('contact-form-element');

        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();

                // Basic validation
                const name = document.getElementById('contact-name');
                const email = document.getElementById('contact-email');
                const subject = document.getElementById('contact-subject');
                const message = document.getElementById('contact-message');
                const consent = document.getElementById('contact-consent');

                let isValid = true;
                const errors = [];

                // Clear previous errors
                form.querySelectorAll('.error-message').forEach(el => el.remove());
                form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

                if (!name.value.trim()) {
                    showError(name, 'Please enter your name');
                    isValid = false;
                }

                if (!email.value.trim() || !isValidEmail(email.value)) {
                    showError(email, 'Please enter a valid email address');
                    isValid = false;
                }

                if (!subject.value) {
                    showError(subject, 'Please select a subject');
                    isValid = false;
                }

                if (!message.value.trim()) {
                    showError(message, 'Please enter your message');
                    isValid = false;
                }

                if (!consent.checked) {
                    showError(consent, 'Please confirm you consent to us storing your information');
                    isValid = false;
                }

                if (isValid) {
                    // Collect form data
                    const formData = {
                        name: name.value,
                        email: email.value,
                        phone: document.getElementById('contact-phone').value,
                        subject: subject.value,
                        message: message.value
                    };

                    // Show success message (in production, this would send to server)
                    showFormSuccess(form);

                    // Reset form
                    form.reset();

                    console.log('Form submitted:', formData);
                }
            });
        }

        function showError(input, message) {
            input.classList.add('error');
            const errorEl = document.createElement('span');
            errorEl.className = 'error-message';
            errorEl.textContent = message;
            errorEl.style.color = 'var(--color-danger)';
            errorEl.style.fontSize = 'var(--font-size-sm)';
            errorEl.style.display = 'block';
            errorEl.style.marginTop = '4px';
            input.parentNode.appendChild(errorEl);
        }

        function showFormSuccess(form) {
            const successEl = document.createElement('div');
            successEl.className = 'form-success';
            successEl.innerHTML = `
                <div style="background: var(--color-success); color: white; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-check-circle"></i>
                    Thank you for your message. We will get back to you soon.
                </div>
            `;
            form.insertBefore(successEl, form.firstChild);

            setTimeout(function() {
                successEl.remove();
            }, 5000);
        }

        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    }

    // ===================================
    // Alert Banner
    // ===================================
    function initAlertBanner() {
        const alertBanner = document.getElementById('alert-banner');
        const alertClose = document.getElementById('alert-close');
        const alertMessage = document.getElementById('alert-message');

        // Check for stored alerts or fetch from server
        // For demo, we'll use a localStorage check
        const alertDismissed = sessionStorage.getItem('alertDismissed');

        // Example: Show alert if not dismissed
        // Uncomment below to test alert banner
        /*
        if (!alertDismissed && alertBanner) {
            alertMessage.textContent = 'Important: School will be closed on Friday for staff training.';
            alertBanner.style.display = 'block';
        }
        */

        if (alertClose) {
            alertClose.addEventListener('click', function() {
                alertBanner.style.display = 'none';
                sessionStorage.setItem('alertDismissed', 'true');
            });
        }
    }

    // Public function to show alerts programmatically
    window.showAlert = function(message) {
        const alertBanner = document.getElementById('alert-banner');
        const alertMessage = document.getElementById('alert-message');

        if (alertBanner && alertMessage) {
            alertMessage.textContent = message;
            alertBanner.style.display = 'block';
        }
    };

    // ===================================
    // oEmbed Integration
    // ===================================
    function initOEmbed() {
        const oembedItems = document.querySelectorAll('.oembed-item[data-oembed-url]');

        oembedItems.forEach(function(item) {
            const url = item.getAttribute('data-oembed-url');

            // For oEmbed content, you would typically fetch from an oEmbed endpoint
            // Since Twitter/Instagram require authentication, we show placeholder with link

            // Example oEmbed fetch (would need CORS proxy or server-side implementation)
            /*
            fetch(`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`)
                .then(response => response.json())
                .then(data => {
                    item.innerHTML = data.html;
                })
                .catch(error => {
                    console.log('oEmbed fetch failed:', error);
                });
            */
        });
    }

    // ===================================
    // Smooth Scroll
    // ===================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                if (href !== '#' && href !== '#0') {
                    const target = document.querySelector(href);

                    if (target) {
                        e.preventDefault();
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Update URL without jumping
                        history.pushState(null, null, href);
                    }
                }
            });
        });
    }

    // ===================================
    // Utility Functions
    // ===================================

    // Debounce function for scroll/resize events
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

    // ===================================
    // Sticky Header (Optional enhancement)
    // ===================================
    let lastScrollTop = 0;
    const header = document.querySelector('.main-header');

    if (header) {
        window.addEventListener('scroll', throttle(function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollTop = scrollTop;
        }, 10));
    }

    // ===================================
    // Image Lazy Loading (for when images are added)
    // ===================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const lazyImages = document.querySelectorAll('img[data-src]');

            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        }
    }

    // Initialize lazy loading
    initLazyLoading();

    // ===================================
    // Print Functionality
    // ===================================
    window.printPage = function() {
        window.print();
    };

    // ===================================
    // Calendar Widget (Basic)
    // ===================================
    window.initCalendar = function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const now = new Date();
        let currentMonth = now.getMonth();
        let currentYear = now.getFullYear();

        renderCalendar();

        function renderCalendar() {
            const months = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];

            const firstDay = new Date(currentYear, currentMonth, 1).getDay();
            const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

            let html = `
                <div class="calendar-container">
                    <div class="calendar-header">
                        <button class="cal-prev" onclick="calendarNav(-1)">&lt;</button>
                        <h3>${months[currentMonth]} ${currentYear}</h3>
                        <button class="cal-next" onclick="calendarNav(1)">&gt;</button>
                    </div>
                    <div class="calendar-grid">
                        <div class="cal-day-header">Sun</div>
                        <div class="cal-day-header">Mon</div>
                        <div class="cal-day-header">Tue</div>
                        <div class="cal-day-header">Wed</div>
                        <div class="cal-day-header">Thu</div>
                        <div class="cal-day-header">Fri</div>
                        <div class="cal-day-header">Sat</div>
            `;

            // Empty cells for days before first of month
            for (let i = 0; i < firstDay; i++) {
                html += '<div class="cal-day empty"></div>';
            }

            // Days of the month
            for (let day = 1; day <= daysInMonth; day++) {
                const isToday = day === now.getDate() &&
                               currentMonth === now.getMonth() &&
                               currentYear === now.getFullYear();
                html += `<div class="cal-day ${isToday ? 'today' : ''}">${day}</div>`;
            }

            html += '</div></div>';
            container.innerHTML = html;
        }

        window.calendarNav = function(direction) {
            currentMonth += direction;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        };
    };

})();

// ===================================
// oEmbed Discovery Support
// ===================================
// This provides oEmbed metadata for the site
const oEmbedConfig = {
    version: "1.0",
    type: "rich",
    provider_name: "St Peter Chanel Catholic Primary School",
    provider_url: "https://st-peterchanel.bexley.sch.uk",
    title: "St Peter Chanel Catholic Primary School and Preschool",
    description: "Inspire, Challenge & Empower so through Christ we make a difference",
    width: 600,
    height: 400
};

// Make available for external scripts
window.spcOEmbedConfig = oEmbedConfig;
