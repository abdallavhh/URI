    (function() {
      'use strict';
      
      // Remove no-js class if JavaScript is enabled
      document.documentElement.classList.remove('no-js');
      
      // Remove no-js class
      document.documentElement.classList.remove('no-js');
      
      // Global error handler
      window.addEventListener('error', function(e) {
        console.warn('Script error:', e.error);
      });

      // Safe localStorage wrapper
      const storage = {
        set: function(key, value) {
          try {
            localStorage.setItem(key, value);
            return true;
          } catch (e) {
            console.warn('LocalStorage not available:', e);
            return false;
          }
        },
        get: function(key) {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            console.warn('LocalStorage not available:', e);
            return null;
          }
        }
      };

      // Theme management
      function toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        
        if (currentTheme === 'dark') {
          body.setAttribute('data-theme', 'light');
          storage.set('theme', 'light');
        } else {
          body.setAttribute('data-theme', 'dark');
          storage.set('theme', 'dark');
        }
      }

      // Load saved theme or detect system preference
      function loadTheme() {
        const savedTheme = storage.get('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
          document.body.setAttribute('data-theme', savedTheme);
        } else if (systemPrefersDark) {
          document.body.setAttribute('data-theme', 'dark');
        } else {
          document.body.setAttribute('data-theme', 'light');
        }
      }

      // Initialize theme
      loadTheme();

      // Listen for system theme changes
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
          if (!storage.get('theme')) {
            document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
          }
        });
      }

      // Mobile menu toggle
      function toggleMenu() {
        const nav = document.getElementById('nav-links');
        const hamburger = document.querySelector('.hamburger');
        
        if (!nav || !hamburger) return;
        
        const isActive = nav.classList.contains('active');
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !isActive);
        
        // Focus management
        if (!isActive) {
          const firstLink = nav.querySelector('a');
          if (firstLink) firstLink.focus();
        }
      }

      // Make functions globally available
      window.toggleTheme = toggleTheme;
      window.toggleMenu = toggleMenu;

      // DOM ready handler
      function domReady(fn) {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', fn);
        } else {
          fn();
        }
      }

      domReady(function() {
        // Close mobile menu when clicking on links
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(function(link) {
          link.addEventListener('click', function() {
            const nav = document.getElementById('nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (nav && hamburger) {
              nav.classList.remove('active');
              hamburger.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
            }
          });
        });

        // Smooth scrolling for anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(function(anchor) {
          anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
              const headerHeight = 80;
              const elementPosition = target.offsetTop;
              const offsetPosition = elementPosition - headerHeight;

              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            }
          });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
          const nav = document.getElementById('nav-links');
          const hamburger = document.querySelector('.hamburger');
          
          if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target)) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
          }
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            const nav = document.getElementById('nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (nav && hamburger && nav.classList.contains('active')) {
              nav.classList.remove('active');
              hamburger.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
              hamburger.focus();
            }
          }
        });

        // Scroll animations with Intersection Observer
        if ('IntersectionObserver' in window) {
          const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          };

          const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible');
              }
            });
          }, observerOptions);

          const fadeInElements = document.querySelectorAll('.fade-in');
          fadeInElements.forEach(function(el) {
            observer.observe(el);
          });
        } else {
          // Fallback for older browsers
          const fadeInElements = document.querySelectorAll('.fade-in');
          fadeInElements.forEach(function(el) {
            el.classList.add('visible');
          });
        }

        // Header scroll effect
        let ticking = false;
        const header = document.querySelector('header');
        
        function updateHeader() {
          if (!header) return;
          
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          
          if (scrollTop > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 200, 81, 0.15)';
          } else {
            header.style.boxShadow = 'none';
          }
          
          ticking = false;
        }

        function requestTick() {
          if (!ticking) {
            if (window.requestAnimationFrame) {
              requestAnimationFrame(updateHeader);
            } else {
              setTimeout(updateHeader, 16);
            }
            ticking = true;
          }
        }

        window.addEventListener('scroll', requestTick, { passive: true });

        // Handle window resize
        window.addEventListener('resize', function() {
          if (window.innerWidth > 768) {
            const nav = document.getElementById('nav-links');
            const hamburger = document.querySelector('.hamburger');
            if (nav && hamburger) {
              nav.classList.remove('active');
              hamburger.classList.remove('active');
              hamburger.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Error handling for external links
        const externalLinks = document.querySelectorAll('a[target="_blank"]');
        externalLinks.forEach(function(link) {
          link.addEventListener('click', function(e) {
            try {
              // Track external link clicks if analytics is available
              if (typeof gtag !== 'undefined') {
                gtag('event', 'click', {
                  'event_category': 'outbound',
                  'event_label': this.href
                });
              }
            } catch (error) {
              console.warn('Analytics tracking failed:', error);
            }
          });
        });

        // Image error handling
        const images = document.querySelectorAll('img');
        images.forEach(function(img) {
          img.addEventListener('error', function() {
            this.style.display = 'none';
            console.warn('Image failed to load:', this.src);
          });
        });
      });

      // Performance monitoring
      if ('performance' in window && 'PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver(function(list) {
            const entries = list.getEntries();
            entries.forEach(function(entry) {
              if (entry.loadEventEnd - entry.loadEventStart > 3000) {
                console.warn('Page load took longer than expected');
              }
            });
          });
          observer.observe({ entryTypes: ['navigation'] });
        } catch (e) {
          // Performance Observer not supported
        }
      }
    })();