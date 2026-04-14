/* ========================================
   MAIN.JS - Familias Seguras
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Popup --- */
  const popupOverlay = document.getElementById('popup-overlay');
  const popupClose = document.getElementById('popup-close');

  if (popupOverlay) {
    setTimeout(() => popupOverlay.classList.add('active'), 5000);

    popupClose?.addEventListener('click', () => {
      popupOverlay.classList.remove('active');
    });

    popupOverlay.addEventListener('click', (e) => {
      if (e.target === popupOverlay) {
        popupOverlay.classList.remove('active');
      }
    });
  }

  /* --- Header scroll effect --- */
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  /* --- Mobile nav (hamburger) --- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      nav.classList.toggle('mobile-open');
    });

    nav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('mobile-open');
      });
    });
  }

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  /* --- Testimonials Carousel --- */
  const track = document.getElementById('carousel-track');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const dotsContainer = document.getElementById('carousel-dots');

  if (track && prevBtn && nextBtn && dotsContainer) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();

    function getCardsPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getTotalPages() {
      return Math.max(1, cards.length - cardsPerView + 1);
    }

    function createDots() {
      dotsContainer.innerHTML = '';
      const totalPages = getTotalPages();
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    function goToSlide(index) {
      const totalPages = getTotalPages();
      currentIndex = Math.max(0, Math.min(index, totalPages - 1));
      const cardWidth = cards[0].offsetWidth + 24; // card + gap
      track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
      updateDots();
    }

    prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto-play
    let autoPlay = setInterval(() => {
      const totalPages = getTotalPages();
      goToSlide(currentIndex >= totalPages - 1 ? 0 : currentIndex + 1);
    }, 5000);

    track.addEventListener('mouseenter', () => clearInterval(autoPlay));
    track.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const totalPages = getTotalPages();
        goToSlide(currentIndex >= totalPages - 1 ? 0 : currentIndex + 1);
      }, 5000);
    });

    // Responsive
    window.addEventListener('resize', () => {
      cardsPerView = getCardsPerView();
      createDots();
      goToSlide(0);
    });

    createDots();
  }

  /* --- Scroll to top button --- */
  const scrollTopBtn = document.getElementById('scroll-top');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* --- Form validation helpers --- */

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const digits = phone.replace(/[\s\-\+\(\)]/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }

  function showFieldError(input, message) {
    input.style.borderColor = '#e74c3c';
    let errorEl = input.parentElement.querySelector('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('span');
      errorEl.className = 'field-error';
      errorEl.style.cssText = 'color:#e74c3c;font-size:.8rem;margin-top:.25rem;display:block';
      input.parentElement.appendChild(errorEl);
    }
    errorEl.textContent = message;
  }

  function clearFieldError(input) {
    input.style.borderColor = '';
    const errorEl = input.parentElement.querySelector('.field-error');
    if (errorEl) errorEl.remove();
  }

  function clearAllErrors(form) {
    form.querySelectorAll('.field-error').forEach(el => el.remove());
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.style.borderColor = '';
    });
  }

  // Clear errors on input
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => clearFieldError(input));
    input.addEventListener('change', () => clearFieldError(input));
  });

  /* --- Form handlers --- */

  window.handlePopupSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    clearAllErrors(form);

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    let valid = true;

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'Ingresa tu nombre');
      valid = false;
    }
    if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Ingresa un correo valido');
      valid = false;
    }

    if (!valid) return;

    alert(`Gracias ${nameInput.value.trim()}! Te enviaremos la guia a tu correo.`);
    form.reset();
    popupOverlay?.classList.remove('active');
  };

  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    clearAllErrors(form);

    const nameInput = form.querySelector('input[type="text"]');
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const selectInput = form.querySelector('select');
    let valid = true;

    if (!nameInput.value.trim()) {
      showFieldError(nameInput, 'Ingresa tu nombre completo');
      valid = false;
    }
    if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Ingresa un correo valido');
      valid = false;
    }
    if (!validatePhone(phoneInput.value)) {
      showFieldError(phoneInput, 'Ingresa un numero de telefono valido');
      valid = false;
    }
    if (!selectInput.value) {
      showFieldError(selectInput, 'Selecciona un tipo de seguro');
      valid = false;
    }

    if (!valid) return;

    alert(`Gracias ${nameInput.value.trim()}! Nos pondremos en contacto contigo en menos de 24 horas.`);
    form.reset();
  };

  window.handleNewsletterSubmit = function(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    clearAllErrors(form);

    if (!validateEmail(emailInput.value)) {
      showFieldError(emailInput, 'Ingresa un correo valido');
      return;
    }

    alert('Te has suscrito exitosamente al newsletter!');
    form.reset();
  };

});
