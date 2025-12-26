/**
 * Portfolio Main JavaScript - VERSION COMPLÈTEMENT CORRIGÉE
 */

(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    if (all) {
      select(el, all).forEach(e => e.addEventListener(type, listener));
    } else {
      select(el, all).addEventListener(type, listener);
    }
  };

  /**
   * Mobile nav toggle 
   */
  const initMobileNav = () => {
    const mobileNavToggle = select('.mobile-nav-toggle');
    const navMenu = select('#navmenu');
    const body = document.body;
    const overlay = select('.mobile-nav-overlay');
    
    if (!mobileNavToggle || !navMenu) {
      console.error('Éléments de navigation mobile non trouvés');
      return;
    }

    // Fonction pour fermer le menu mobile
    const closeMobileNav = () => {
      navMenu.classList.remove('active');
      body.classList.remove('mobile-nav-active');
      mobileNavToggle.classList.remove('active');
      
      if (overlay) {
        overlay.classList.remove('active');
      }
      
      // Rétablir le scroll
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };

    // Fonction pour ouvrir le menu mobile
    const openMobileNav = () => {
      navMenu.classList.add('active');
      body.classList.add('mobile-nav-active');
      mobileNavToggle.classList.add('active');
      
      if (overlay) {
        overlay.classList.add('active');
      }
      
      // Empêcher le scroll
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };

    // Fonction pour basculer l'état du menu
    const toggleMobileNav = () => {
      if (navMenu.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    };

    // Événement sur le bouton hamburger
    mobileNavToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      toggleMobileNav();
    });

    // Fermer le menu en cliquant sur l'overlay
    if (overlay) {
      overlay.addEventListener('click', function(e) {
        e.stopPropagation();
        closeMobileNav();
      });
    }

    // Fermer le menu en cliquant sur un lien
    const navLinks = select('#navmenu a', true);
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Ne pas fermer si c'est un lien externe ou anchor
        if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = select(targetId);
          
          if (targetElement) {
            // Fermer le menu mobile
            closeMobileNav();
            
            // Scroll vers la section cible
            setTimeout(() => {
              const headerHeight = select('#header') ? select('#header').offsetHeight : 90;
              window.scrollTo({
                top: targetElement.offsetTop - headerHeight,
                behavior: 'smooth'
              });
              
              // Mettre à jour l'URL
              if (history.pushState) {
                history.pushState(null, null, targetId);
              }
            }, 300);
          }
        } else {
          // Pour les liens externes, juste fermer le menu
          closeMobileNav();
        }
      });
    });

    // Fermer le menu avec la touche Échap
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });

    // Fermer le menu en redimensionnant la fenêtre au-dessus de 1200px
    window.addEventListener('resize', function() {
      if (window.innerWidth >= 1200 && navMenu.classList.contains('active')) {
        closeMobileNav();
      }
    });
  };

  /**
   * Navigation scroll avec offset
   */
  const initSmoothScroll = () => {
    // Navigation principale
    on('click', '#navmenu a[href^="#"]', function(e) {
      if (select(this.hash)) {
        e.preventDefault();
        
        const target = select(this.hash);
        const headerHeight = select('#header') ? select('#header').offsetHeight : 90;
        
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });
        
        // Mettre à jour l'URL
        if (history.pushState) {
          history.pushState(null, null, this.hash);
        }
      }
    }, true);
    
    // Boutons CTA
    on('click', '.btn-hero[href^="#"]', function(e) {
      if (select(this.hash)) {
        e.preventDefault();
        
        const target = select(this.hash);
        const headerHeight = select('#header') ? select('#header').offsetHeight : 90;
        
        window.scrollTo({
          top: target.offsetTop - headerHeight,
          behavior: 'smooth'
        });
        
        // Mettre à jour l'URL
        if (history.pushState) {
          history.pushState(null, null, this.hash);
        }
      }
    }, true);
  };

  /**
   * Activer le lien actif dans la navigation
   */
  const initActiveNavLink = () => {
    const sections = select('section[id]', true);
    const navLinks = select('#navmenu a[href^="#"]', true);
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
      let scrollPosition = window.scrollY + 100;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  };

  /**
   * Preloader
   */
  const initPreloader = () => {
    let preloader = select('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          preloader.style.transition = 'opacity 0.5s ease';
          preloader.style.opacity = '0';
          setTimeout(() => {
            preloader.remove();
          }, 500);
        }, 300);
      });
    }
  };

  /**
   * Scroll top button
   */
  const initScrollTop = () => {
    let scrollTop = select('.scroll-top');
    if (scrollTop) {
      const toggleScrollTop = function() {
        if (window.scrollY > 300) {
          scrollTop.classList.add('active');
        } else {
          scrollTop.classList.remove('active');
        }
      };
      
      window.addEventListener('load', toggleScrollTop);
      document.addEventListener('scroll', toggleScrollTop);
      
      scrollTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  /**
   * Header scroll class
   */
  const initHeaderScroll = () => {
    let selectHeader = select('#header');
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 50) {
          selectHeader.classList.add('scrolled');
        } else {
          selectHeader.classList.remove('scrolled');
        }
      };
      
      window.addEventListener('load', headerScrolled);
      document.addEventListener('scroll', headerScrolled);
    }
  };

  /**
   * Animation on scroll
   */
  const initAOS = () => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
        delay: 100
      });
    }
  };

  /**
   * Typed.js animation
   */
  const initTyped = () => {
    if (document.querySelector('.typed')) {
      try {
        new Typed('.typed', {
          strings: ['responsive websites', 'user interfaces', 'web applications', 'digital experiences'],
          typeSpeed: 80,
          backSpeed: 40,
          backDelay: 1500,
          startDelay: 500,
          loop: true,
          showCursor: true,
          cursorChar: '|',
          autoInsertCss: true
        });
      } catch (e) {
        console.log('Typed.js not loaded');
      }
    }
  };

  /**
   * Animate statistics counters
   */
  const initCounters = () => {
    const animateCounters = () => {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const suffix = counter.getAttribute('data-count').includes('%') ? '%' : '';
        const duration = 2000; // 2 seconds
        const startTime = Date.now();
        
        const updateCounter = () => {
          const currentTime = Date.now();
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3); // Easing function
          const currentValue = Math.floor(easeProgress * target);
          
          counter.textContent = currentValue + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
          }
        };
        
        requestAnimationFrame(updateCounter);
      });
    };
    
    // Observer pour déclencher l'animation
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(animateCounters, 300);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3, rootMargin: '0px 0px -50px 0px' });
      
      observer.observe(statsSection);
    }
  };

  /**
   * Form submission
   */
  const initContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Afficher l'état de chargement
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
          const formData = new FormData(this);
          const response = await fetch(this.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });
          
          if (response.ok) {
            // Succès
            submitBtn.textContent = 'Message Sent!';
            contactForm.reset();
            
            setTimeout(() => {
              submitBtn.textContent = originalText;
              submitBtn.disabled = false;
            }, 3000);
          } else {
            throw new Error('Form submission failed');
          }
        } catch (error) {
          // Erreur
          submitBtn.textContent = 'Error - Try Again';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 3000);
        }
      });
    }
  };

  /**
   * Set current year in footer
   */
  const setCurrentYear = () => {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  };

  
  /**
   * Initialize everything
   */
  const init = () => {
    // Initialiser toutes les fonctionnalités
    initMobileNav();
    initSmoothScroll();
    initActiveNavLink();
    initPreloader();
    initScrollTop();
    initHeaderScroll();
    initAOS();
    initTyped();
    initCounters();
    initContactForm();
    initPortfolioFilter();
    setCurrentYear();
    
    // Smooth scroll pour les hashs au chargement
    if (window.location.hash) {
      setTimeout(() => {
        const target = select(window.location.hash);
        if (target) {
          const headerHeight = select('#header') ? select('#header').offsetHeight : 90;
          window.scrollTo({
            top: target.offsetTop - headerHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
    
    console.log('Portfolio initialisé avec succès !');
  };

  // Initialiser quand le DOM est chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

