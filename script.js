/* ═══════════════════════════════════════════
   BROTHERS INSULATION — SCRIPTS
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── LUCIDE ICONS ───
  if (window.lucide) lucide.createIcons();

  // ─── MOBILE MENU ───
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon   = document.getElementById('menu-icon');

  menuToggle?.addEventListener('click', () => {
    const isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', isOpen);
    menuIcon.setAttribute('data-lucide', isOpen ? 'menu' : 'x');
    lucide.createIcons();
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.setAttribute('data-lucide', 'menu');
      lucide.createIcons();
    });
  });

  // ─── NAVBAR SCROLL STYLE ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.querySelector('.glass-nav').style.background = 'rgba(6,10,20,0.92)';
    } else {
      navbar.querySelector('.glass-nav').style.background = '';
    }
  }, { passive: true });

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ─── SCROLL REVEAL ───
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ───
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);

      const el      = entry.target;
      const target  = parseFloat(el.dataset.target);
      const decimals = parseInt(el.dataset.decimals || '0');
      const suffix  = el.dataset.suffix || '';
      const duration = 1800;
      const start   = performance.now();

      const animate = (now) => {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        const value    = target * ease;
        el.textContent = value.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter-num').forEach(el => counterObserver.observe(el));

  // ─── CONTACT FORM ───
  const form      = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText   = document.getElementById('btn-text');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const fname   = form.fname.value.trim();
    const email   = form.email.value.trim();
    const service = form.service.value;

    if (!fname || !email || !service) {
      showFormError('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    // Simulate submission
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    submitBtn.style.opacity = '0.7';

    await new Promise(r => setTimeout(r, 1400));

    // Success state
    submitBtn.style.opacity = '1';
    submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    submitBtn.style.boxShadow = '0 4px 20px rgba(5,150,105,0.4)';
    btnText.textContent = 'Quote Request Sent!';

    // Replace icon
    submitBtn.querySelector('[data-lucide]')?.setAttribute('data-lucide', 'check-circle-2');
    lucide.createIcons();

    form.reset();

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
      btnText.textContent = 'Send My Free Quote Request';
      submitBtn.querySelector('[data-lucide]')?.setAttribute('data-lucide', 'send');
      lucide.createIcons();
    }, 4000);
  });

  function showFormError(msg) {
    let err = document.getElementById('form-error');
    if (!err) {
      err = document.createElement('p');
      err.id = 'form-error';
      err.className = 'text-red-400 text-sm mt-3 text-center';
      form.appendChild(err);
    }
    err.textContent = msg;
    setTimeout(() => err.remove(), 4000);
  }

  // ─── ACTIVE NAV LINK ON SCROLL ───
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'text-white',
            link.getAttribute('href') === '#' + entry.target.id
          );
          link.classList.toggle(
            'text-slate-300',
            link.getAttribute('href') !== '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => activeObserver.observe(s));

});
