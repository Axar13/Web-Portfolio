/* =====================
   CUSTOM CURSOR
   ===================== */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

const hoverTargets = document.querySelectorAll('a, button, .proj-item, .skill-item, .tl-card');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('hovered');
    follower.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('hovered');
    follower.classList.remove('hovered');
  });
});

/* =====================
   NAVBAR SCROLL
   ===================== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* =====================
   STATS COUNTER
   ===================== */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNums = document.querySelectorAll('.stat-num');
      statNums.forEach(el => {
        const target = parseInt(el.dataset.target);
        const isPercent = target === 99.99;
        animateCounter(el, target, isPercent ? '%' : '+');
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* =====================
   SCROLL REVEAL
   ===================== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // stagger siblings
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, idx * 120);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =====================
   SMOOTH ANCHOR LINKS
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* =====================
   TERMINAL TYPING EFFECT (on about section scroll)
   ===================== */
function initTerminalReveal() {
  const lines = document.querySelectorAll('.terminal-body .t-line, .terminal-body .t-output');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(4px)';
    line.style.transition = 'opacity .3s, transform .3s';
  });

  const termObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      lines.forEach((line, i) => {
        setTimeout(() => {
          line.style.opacity = '1';
          line.style.transform = 'translateY(0)';
        }, i * 180);
      });
      termObserver.disconnect();
    }
  }, { threshold: 0.4 });

  const terminal = document.querySelector('.terminal');
  if (terminal) termObserver.observe(terminal);
}

initTerminalReveal();

/* =====================
   PROJECT HOVER ACCENT LINE
   ===================== */
document.querySelectorAll('.proj-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.paddingLeft = '20px';
    item.style.borderLeft = '3px solid var(--accent)';
    item.style.transition = 'padding .2s, border .2s';
  });
  item.addEventListener('mouseleave', () => {
    item.style.paddingLeft = '';
    item.style.borderLeft = '';
  });
});

/* =====================
   PARALLAX HERO (subtle)
   ===================== */
const heroImg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const y = window.scrollY;
  heroImg.style.transform = `scale(1.05) translateY(${y * 0.2}px)`;
}, { passive: true });
