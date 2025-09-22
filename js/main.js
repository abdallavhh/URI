   // Theme management
    function toggleTheme() {
      const body = document.body;
      const currentTheme = body.getAttribute('data-theme');
      
      if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'light');
        try {
          localStorage.setItem('theme', 'light');
        } catch (e) {
          console.warn('LocalStorage not available');
        }
      } else {
        body.setAttribute('data-theme', 'dark');
        try {
          localStorage.setItem('theme', 'dark');
        } catch (e) {
          console.warn('LocalStorage not available');
        }
      }
    }

    // Load saved theme or detect system preference
    function loadTheme() {
      let savedTheme = null;
      try {
        savedTheme = localStorage.getItem('theme');
      } catch (e) {
        console.warn('LocalStorage not available');
      }
      
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
        document.body.setAttribute('data-theme', savedTheme);
      } else if (systemPrefersDark) {
        document.body.setAttribute('data-theme', 'dark');
      } else {
        document.body.setAttribute('data-theme', 'light');
      }
    }

    // Initialize theme on page load
    loadTheme();

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
        let hasStoredTheme = false;
        try {
          hasStoredTheme = !!localStorage.getItem('theme');
        } catch (err) {
          // localStorage not available
        }
        
        if (!hasStoredTheme) {
          document.body.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
      });
    }

    // Mobile menu toggle
    function toggleMenu() {
      const nav = document.getElementById('nav-links');
      const hamburger = document.querySelector('.hamburger');
      if (nav && hamburger) {
        nav.classList.toggle('active');
        hamburger.classList.toggle('active');
      }
    }

    // Add keyboard support for hamburger
    document.addEventListener('DOMContentLoaded', function() {
      const hamburger = document.querySelector('.hamburger');
      if (hamburger) {
        hamburger.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
          }
        });
      }
    });

    // Close mobile menu when clicking on a link
    document.addEventListener('DOMContentLoaded', function() {
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          const nav = document.getElementById('nav-links');
          const hamburger = document.querySelector('.hamburger');
          if (nav && hamburger) {
            nav.classList.remove('active');
            hamburger.classList.remove('active');
          }
        });
      });
    });

    // Smooth scrolling for anchor links
    document.addEventListener('DOMContentLoaded', function() {
      const anchorLinks = document.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const target = document.querySelector(targetId);
          if (target) {
            const headerHeight = 100;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerHeight;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const nav = document.getElementById('nav-links');
      const hamburger = document.querySelector('.hamburger');
      
      if (nav && hamburger && !nav.contains(event.target) && !hamburger.contains(event.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        const nav = document.getElementById('nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (nav && hamburger) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });

    // Scroll animations with Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);

      // Observe all fade-in elements when DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(function(el) {
          observer.observe(el);
        });
      });
    } else {
      // Fallback for older browsers
      document.addEventListener('DOMContentLoaded', function() {
        const fadeInElements = document.querySelectorAll('.fade-in');
        fadeInElements.forEach(function(el) {
          el.classList.add('visible');
        });
      });
    }

    // Header scroll effect with performance optimization
    let ticking = false;
    const header = document.querySelector('header');
    
    function updateHeader() {
      if (!header) return;
      
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 100) {
        header.style.background = 'var(--header-bg)'.replace('0.95', '0.98');
        header.style.boxShadow = '0 2px 20px rgba(0, 200, 81, 0.15)';
      } else {
        header.style.background = 'var(--header-bg)';
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

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const nav = document.getElementById('nav-links');
        const hamburger = document.querySelector('.hamburger');
        if (nav && hamburger) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });

    // Error handling for external links
    document.addEventListener('DOMContentLoaded', function() {
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
    });