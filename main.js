/* ============================================================
   BABITONGA MATERIAIS DE CONSTRUÇÃO
   JavaScript Principal
   Módulos: Cursor, Preloader, Header, Hero, GSAP ScrollTrigger,
            Contadores, Menu Mobile, Tilt nos Cards
   ============================================================ */

// --- INICIALIZAR ÍCONES LUCIDE ---
lucide.createIcons();

// ============================================================
// CURSOR CUSTOMIZADO (controlado por detecção de mouse real)
// ============================================================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let cx = 0, cy = 0, rx = 0, ry = 0;
let hasMouse = false;

document.addEventListener('mousemove', e => {
  if (!hasMouse && window.innerWidth > 768) {
    hasMouse = true;
    document.body.classList.add('has-mouse');
    requestAnimationFrame(animateRing);
  }
  if (hasMouse) {
    cx = e.clientX; cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
  }
});

function animateRing() {
  if (!hasMouse) return;
  rx += (cx - rx) * 0.12;
  ry += (cy - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}

// Efeito de crescimento do cursor em elementos interativos
document.querySelectorAll('a, button, .card-dif, .gal-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (hasMouse) document.body.classList.add('cursor-grow');
  });
  el.addEventListener('mouseleave', () => {
    if (hasMouse) document.body.classList.remove('cursor-grow');
  });
});

// ============================================================
// BARRA DE PROGRESSO DE ROLAGEM
// ============================================================
const progress = document.getElementById('progress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (docH > 0 ? (scrollTop / docH * 100) : 0) + '%';
}, { passive: true });

// ============================================================
// HEADER COM FUNDO AO ROLAR
// ============================================================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (!menuOpen) header.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ============================================================
// PRELOADER E ANIMAÇÃO DE ENTRADA DO HERO
// ============================================================
const preloaderBar = document.getElementById('preloader-bar');
const preloaderLogo = document.getElementById('preloader-logo');
const preloader = document.getElementById('preloader');

let loadProgress = 0;
const loadInterval = setInterval(() => {
  loadProgress += Math.random() * 18;
  if (loadProgress >= 100) { loadProgress = 100; clearInterval(loadInterval); }
  preloaderBar.style.width = loadProgress + '%';
}, 80);

window.addEventListener('load', () => {
  clearInterval(loadInterval);
  preloaderBar.style.width = '100%';
  gsap.to(preloaderLogo, { opacity: 1, duration: 0.4, ease: 'power2.out' });

  setTimeout(() => {
    gsap.to(preloader, {
      yPercent: -100,
      duration: 1,
      ease: 'expo.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        startHeroAnimations();
      }
    });
  }, 800);
});

function startHeroAnimations() {
  const tl = gsap.timeline();
  tl.to('.hero-eyebrow', { opacity: 1, duration: 0.6, ease: 'power3.out' })
    .to('.hero-title .word', { y: '0%', duration: 1.2, stagger: 0.12, ease: 'expo.out' }, '-=0.3')
    .to('.hero-desc', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7');
}

// ============================================================
// GSAP SCROLL TRIGGER - ANIMAÇÕES POR ROLAGEM
// ============================================================
gsap.registerPlugin(ScrollTrigger);

// Revelar para cima
gsap.utils.toArray('.reveal-up').forEach(el => {
  gsap.fromTo(el,
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    }
  );
});

// Revelar da esquerda
gsap.utils.toArray('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { x: -50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

// Revelar da direita
gsap.utils.toArray('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { x: 50, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

// Cards dos diferenciais
gsap.utils.toArray('.card-dif').forEach(el => {
  gsap.from(el,
    { y: 60, opacity: 0, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

// Itens da galeria
gsap.utils.toArray('.gal-item').forEach(el => {
  gsap.from(el,
    { opacity: 0, scale: 0.95, duration: 1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

// Números com blur
gsap.utils.toArray('.num-reveal').forEach(el => {
  gsap.fromTo(el,
    { y: 40, opacity: 0, filter: 'blur(8px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    }
  );
});

// Parallax no hero
gsap.to('#hero-video-bg', {
  yPercent: 25, ease: 'none',
  scrollTrigger: { trigger: '#inicio', start: 'top top', end: 'bottom top', scrub: true }
});

// Parallax na imagem do sobre
gsap.to('.sobre-img-wrap img', {
  yPercent: -10, ease: 'none',
  scrollTrigger: { trigger: '#sobre', start: 'top bottom', end: 'bottom top', scrub: true }
});

// ============================================================
// CONTADORES ANIMADOS (ativados por IntersectionObserver)
// ============================================================
function runCounter(el) {
  const target = parseFloat(el.dataset.target);
  const startVal = parseFloat(el.dataset.start || 0);
  const duration = 3500;
  let startTime = null;
  const isFloat = !Number.isInteger(target);

  function step(ts) {
    if (!startTime) startTime = ts;
    const p = Math.min((ts - startTime) / duration, 1);
    const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    const currentVal = startVal + (target - startVal) * ease;
    
    if (isFloat) {
      el.textContent = currentVal.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    } else {
      el.textContent = Math.floor(currentVal).toLocaleString('pt-BR');
    }
    
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterSection = document.getElementById('numeros');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.counter-num').forEach(runCounter);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
if (counterSection) counterObs.observe(counterSection);

// ============================================================
// MENU MOBILE COM ANIMAÇÃO GSAP E SWIPE
// ============================================================
let menuOpen = false;

function toggleMobileMenu() {
  menuOpen = !menuOpen;
  const mobileMenu = document.getElementById('mobile-menu');
  const headerEl = document.getElementById('header');
  const b1 = document.getElementById('bar1');
  const b2 = document.getElementById('bar2');
  const b3 = document.getElementById('bar3');

  if (menuOpen) {
    mobileMenu.classList.add('open');
    headerEl.classList.add('menu-open');
    b1.style.transform = 'translateY(6.5px) rotate(45deg)';
    b2.style.opacity = '0';
    b3.style.transform = 'translateY(-6.5px) rotate(-45deg)';
    document.body.style.overflow = 'hidden';

    gsap.to('#mobile-menu a', {
      x: 0, opacity: 1, duration: 0.6,
      stagger: 0.1, ease: 'power3.out', delay: 0.2
    });
  } else {
    closeMobileMenu();
  }
}

function closeMobileMenu() {
  menuOpen = false;
  document.getElementById('mobile-menu').classList.remove('open');
  document.getElementById('header').classList.remove('menu-open');
  document.getElementById('bar1').style.transform = '';
  document.getElementById('bar2').style.opacity = '1';
  document.getElementById('bar3').style.transform = '';
  document.body.style.overflow = '';

  gsap.set('#mobile-menu a', { x: 40, opacity: 0 });
}

// Expor funções para o HTML
window.toggleMobileMenu = toggleMobileMenu;
window.closeMobileMenu = closeMobileMenu;

// Suporte a swipe no mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const swipeThreshold = 50;
  if (touchStartX - touchEndX > swipeThreshold) {
    if (!menuOpen && window.innerWidth <= 768) toggleMobileMenu();
  }
  if (touchEndX - touchStartX > swipeThreshold) {
    if (menuOpen && window.innerWidth <= 768) toggleMobileMenu();
  }
}

// ============================================================
// EFEITO TILT 3D NOS CARDS (somente desktop com mouse)
// ============================================================
document.querySelectorAll('.card-dif').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (!hasMouse) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) / r.width;
    const y = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateZ(10px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
