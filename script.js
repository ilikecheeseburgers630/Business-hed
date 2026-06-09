'use strict';

const navbar = document.getElementById('navbar');
function handleNavbarScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();

const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let animFrame, particles = [], mouse = { x: null, y: null, radius: 160 }, W, H;

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', () => { resize(); buildParticles(); }, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function buildParticles() {
    const count = Math.min(Math.floor((W * H) / 12000), 120);
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35, r: Math.random()*1.5+0.4, alpha: Math.random()*0.55+0.1 });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < mouse.radius) { const force = (mouse.radius-dist)/mouse.radius; p.vx += (dx/dist)*force*0.04; p.vy += (dy/dist)*force*0.04; }
      }
      p.vx *= 0.98; p.vy *= 0.98;
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(0,200,255,${p.alpha})`; ctx.fill();
      for (let j = i+1; j < particles.length; j++) {
        const q = particles[j], dx = p.x-q.x, dy = p.y-q.y, d2 = dx*dx+dy*dy;
        if (d2 < 14400) { ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y); ctx.strokeStyle=`rgba(0,200,255,${(1-d2/14400)*0.18})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
    }
    animFrame = requestAnimationFrame(tick);
  }

  resize(); buildParticles(); tick();

  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { if (!animFrame) tick(); }
        else { cancelAnimationFrame(animFrame); animFrame = null; }
      });
    }, { threshold: 0 }).observe(heroSection);
  }
})();

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;
new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(el => {
        const text = el.textContent.trim();
        if (text === '5.0') {
          const start = performance.now();
          (function update(now) {
            const p = Math.min((now-start)/1200,1), e = 1-Math.pow(1-p,3);
            el.textContent = (e*5).toFixed(1);
            if (p < 1) requestAnimationFrame(update);
          })(performance.now());
        } else if (text === '100%') {
          const start = performance.now();
          (function update(now) {
            const p = Math.min((now-start)/1200,1), e = 1-Math.pow(1-p,3);
            el.textContent = Math.round(e*100)+'%';
            if (p < 1) requestAnimationFrame(update);
          })(performance.now());
        }
      });
    }
  });
}, { threshold: 0.5 }).observe(statNumbers[0]?.closest('.hero-stats') || document.body);

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

function showError(id, errId, msg) { const i=document.getElementById(id),e=document.getElementById(errId); if(i&&e){i.classList.add('error');e.textContent=msg;} }
function clearError(id, errId) { const i=document.getElementById(id),e=document.getElementById(errId); if(i&&e){i.classList.remove('error');e.textContent='';} }

if (contactForm) {
  ['name','phone','email','service'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.addEventListener('input', () => clearError(id, id+'Error')); el.addEventListener('change', () => clearError(id, id+'Error')); }
  });
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    const name = document.getElementById('name').value.trim();
    if (!name || name.length < 2) { showError('name','nameError','Please enter your full name.'); valid=false; } else clearError('name','nameError');
    const phone = document.getElementById('phone').value.trim();
    if (!phone || !/[\d\s\(\)\-\+]{7,}/.test(phone)) { showError('phone','phoneError','Please enter a valid phone number.'); valid=false; } else clearError('phone','phoneError');
    const email = document.getElementById('email').value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email','emailError','Please enter a valid email address.'); valid=false; } else clearError('email','emailError');
    const service = document.getElementById('service').value;
    if (!service) { showError('service','serviceError','Please select a service.'); valid=false; } else clearError('service','serviceError');
    if (!valid) return;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    setTimeout(() => {
      formSuccess.classList.add('visible');
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send My Quote Request';
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1400);
  });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); const offset = 72; const top = target.getBoundingClientRect().top + window.scrollY - offset; window.scrollTo({ top, behavior: 'smooth' }); }
  });
});

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-card:not(.cta-card), .step-card, .review-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width/2) / (rect.width/2);
      const dy = (e.clientY - rect.top - rect.height/2) / (rect.height/2);
      card.style.transform = `perspective(800px) rotateX(${-dy*4}deg) rotateY(${dx*4}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}
