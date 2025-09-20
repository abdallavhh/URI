    function toggleMenu() {
      const nav = document.getElementById('nav-links');
      nav.classList.toggle('active');
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', () => {
        const nav = document.getElementById('nav-links');
        nav.classList.remove('active');
      });
    });

    // Smooth scrolling for anchor links
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

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      const nav = document.getElementById('nav-links');
      const hamburger = document.querySelector('.hamburger');
      
      if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
        nav.classList.remove('active');
      }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        const nav = document.getElementById('nav-links');
        nav.classList.remove('active');
      }
    });