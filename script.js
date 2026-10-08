/* ============================================
   Theme — init from localStorage / system pref
   ============================================ */
(function () {
  const stored = localStorage.getItem('theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  if (stored === 'light' || (!stored && prefersLight)) {
    document.documentElement.classList.add('light');
  }
})();

/* ============================================
   Nav
   ============================================ */
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
  navLinks.classList.remove('open');
}));

/* ============================================
   Theme toggle — circle reveal via View Transitions API
   ============================================ */
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const rect = themeToggle.getBoundingClientRect();
  const cx = ((rect.left + rect.right) / 2 / window.innerWidth * 100).toFixed(2) + '%';
  const cy = ((rect.top + rect.bottom) / 2 / window.innerHeight * 100).toFixed(2) + '%';
  document.documentElement.style.setProperty('--vt-x', cx);
  document.documentElement.style.setProperty('--vt-y', cy);

  const applyToggle = () => {
    const isLight = document.documentElement.classList.toggle('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  };

  if (document.startViewTransition) {
    document.startViewTransition(applyToggle);
  } else {
    applyToggle();
  }
});

/* ============================================
   Utilitaire
   ============================================ */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ============================================
   VideoText — canvas mask
   ============================================ */
(function initVideoText() {
  const video  = document.getElementById('vt-src');
  const canvas = document.getElementById('vt-canvas');
  if (!video || !canvas) return;

  const ctx  = canvas.getContext('2d');
  const TEXT = 'Soufiane Filali';
  let rafId  = null;

  function setSize() {
    const size = Math.min(window.innerWidth * 0.85, 900);
    const H    = Math.round(size * 0.18);
    canvas.width  = size;
    canvas.height = H;
  }

  function drawFrame() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    /* 1. Vidéo en plein (déjà chargée et en cours de lecture) */
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(video, 0, 0, W, H);

    /* 2. Masque : garde uniquement les pixels sous le texte */
    ctx.globalCompositeOperation = 'destination-in';
    const fs = Math.round(H * 0.82);
    ctx.font         = `800 ${fs}px "Space Grotesk", sans-serif`;
    ctx.textBaseline = 'middle';
    ctx.fillStyle    = '#fff';
    ctx.fillText(TEXT, 0, H / 2);

    ctx.globalCompositeOperation = 'source-over';
    rafId = requestAnimationFrame(drawFrame);
  }

  function start() {
    if (rafId) return;
    setSize();
    drawFrame();
  }

  /* La vidéo bg est déjà lancée — on démarre dès qu'elle a des données */
  if (video.readyState >= 2) {
    start();
  } else {
    video.addEventListener('loadeddata', start, { once: true });
  }

  window.addEventListener('resize', () => {
    setSize();
  });
})();

/* ============================================
   BlurInUp — character animation
   ============================================ */
const BU_SELECTORS = [
  '.section-title',
  '.about-tagline',
  '.contact-title',
];

(function initBlurInUp() {
  document.querySelectorAll(BU_SELECTORS.join(',')).forEach(el => {
    if (el.dataset.buReady) return;
    el.dataset.buReady = '1';

    /* Walk text nodes, wrap each character */
    (function wrapChars(node) {
      if (node.nodeType === 3) {
        const frag = document.createDocumentFragment();
        for (const ch of node.textContent) {
          if (ch === '\n') { frag.appendChild(document.createTextNode('\n')); continue; }
          const s = document.createElement('span');
          s.className = 'bu-char';
          s.textContent = ch === ' ' ? ' ' : ch;
          frag.appendChild(s);
        }
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT') {
        Array.from(node.childNodes).forEach(wrapChars);
      }
    })(el);
  });
})();

function revealBlur(container, baseDelay = 0) {
  const chars = container.querySelectorAll('.bu-char:not(.bu-go)');
  chars.forEach((ch, i) => {
    ch.style.animationDelay = `${baseDelay + i * 22}ms`;
    ch.classList.add('bu-go');
  });
}

function resetBlur(container) {
  container.querySelectorAll('.bu-char').forEach(ch => {
    ch.classList.remove('bu-go');
    ch.style.animationDelay = '';
  });
}

/* aliases used by slide system */
function revealWords(section) { revealBlur(section, 80); }
function hideWords(section)   { resetBlur(section); }

/* ============================================
   Slide system
   ============================================ */
(function initSlides() {
  const hero     = document.querySelector('.hero');
  const sections = Array.from(document.querySelectorAll('.section'));
  const slides   = [hero, ...sections];
  const dots     = Array.from(document.querySelectorAll('.progress-dot'));

  let currentIdx    = 0;
  let isTransitioning = false;
  const DURATION    = 680;

  /* Set initial state */
  slides.forEach((s, i) => {
    s.style.opacity   = i === 0 ? '1' : '0';
    s.style.zIndex    = i === 0 ? '10' : '2';
    s.style.transform = 'scale(1)';
    s.style.filter    = 'blur(0)';
    s.style.pointerEvents = i === 0 ? 'all' : 'none';
    if (i === 0) s.classList.add('is-active');
  });

  /* Trigger blurInUp on hero immediately */
  setTimeout(() => revealBlur(slides[0], 120), 200);

  navbar.classList.remove('scrolled');

  /* ---- Transition ---- */
  function goTo(nextIdx) {
    if (isTransitioning) return;
    if (nextIdx === currentIdx) return;
    if (nextIdx < 0 || nextIdx >= slides.length) return;

    isTransitioning = true;
    const leaving  = slides[currentIdx];
    const entering = slides[nextIdx];
    const easing   = 'cubic-bezier(0.4, 0, 0.2, 1)';
    const trans    = `transform ${DURATION}ms ${easing}, opacity ${Math.round(DURATION * 0.82)}ms ease, filter ${Math.round(DURATION * 0.82)}ms ease`;

    /* Prepare entering without animation */
    entering.style.transition   = 'none';
    entering.style.opacity      = '0';
    entering.style.transform    = 'scale(0.93)';
    entering.style.filter       = 'blur(7px)';
    entering.style.zIndex       = '9';
    entering.style.pointerEvents = 'none';

    /* Force reflow so the initial state is painted */
    entering.getBoundingClientRect();

    /* Animate leaving */
    leaving.style.transition    = trans;
    leaving.style.zIndex        = '11';
    leaving.style.transform     = 'scale(1.1)';
    leaving.style.opacity       = '0';
    leaving.style.filter        = 'blur(5px)';

    /* Animate entering */
    entering.style.transition   = trans;
    entering.style.transform    = 'scale(1)';
    entering.style.opacity      = '1';
    entering.style.filter       = 'blur(0)';

    setTimeout(() => {
      leaving.classList.remove('is-active');
      leaving.style.transition    = 'none';
      leaving.style.opacity       = '0';
      leaving.style.transform     = 'scale(1)';
      leaving.style.filter        = 'blur(0)';
      leaving.style.zIndex        = '2';
      leaving.style.pointerEvents = 'none';
      hideWords(leaving);

      entering.classList.add('is-active');
      entering.style.zIndex        = '10';
      entering.style.pointerEvents = 'all';

      currentIdx = nextIdx;
      isTransitioning = false;

      updateDots();
      updateNavbar();
      revealWords(entering);
    }, DURATION + 30);
  }

  /* ---- Dots ---- */
  function updateDots() {
    dots.forEach((d, i) => d.classList.toggle('active', i === currentIdx));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => goTo(Number(dot.dataset.idx)));
  });

  /* ---- Navbar ---- */
  function updateNavbar() {
    navbar.classList.toggle('scrolled', currentIdx > 0);
  }

  /* ---- All internal anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = href === '#home' ? hero : document.querySelector(href);
      if (!target) return;
      const idx = slides.indexOf(target);
      if (idx === -1) return;
      e.preventDefault();
      goTo(idx);
    });
  });

  /* ---- Wheel ---- */
  let wheelAcc    = 0;
  let wheelTimer  = null;
  let lastGoTime  = 0;
  const COOLDOWN  = DURATION + 300; // ignore wheel for this long after each transition

  window.addEventListener('wheel', e => {

    e.preventDefault();

    /* Scroller manuellement un élément interne si le curseur est dessus */
    const inner = e.target.closest('.about-left');
    if (inner && inner.scrollHeight > inner.clientHeight) {
      const atTop    = inner.scrollTop <= 0;
      const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 2;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
        inner.scrollTop += e.deltaY;
        wheelAcc = 0; // reset pour éviter que la section change dès qu'on atteint la limite
        return;
      }
      // On vient de toucher la limite — reset pour forcer un nouvel effort de scroll
      wheelAcc = 0;
    }

    /* Déléguer au carousel si section projects active + scroll horizontal */
    const projActive = sections[currentIdx] && sections[currentIdx].id === 'projects';
    if (projActive && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (window._carouselWheel) window._carouselWheel(e.deltaX);
      return;
    }

    /* Block during cooldown */
    if (Date.now() - lastGoTime < COOLDOWN) return;

    /* Normalize deltaY across deltaMode */
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 32;
    if (e.deltaMode === 2) delta *= 800;

    wheelAcc += delta;
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAcc = 0; }, 600);

    if (Math.abs(wheelAcc) > 180) {
      const dir = wheelAcc > 0 ? 1 : -1;
      wheelAcc  = 0;
      lastGoTime = Date.now();
      goTo(currentIdx + dir);
    }
  }, { passive: false });

  /* ---- Touch ---- */
  let touchY = 0, touchX = 0;
  window.addEventListener('touchstart', e => {
    touchY = e.touches[0].clientY;
    touchX = e.touches[0].clientX;
  }, { passive: true });
  window.addEventListener('touchend', e => {
    const dy = touchY - e.changedTouches[0].clientY;
    const dx = touchX - e.changedTouches[0].clientX;
    const projActive = sections[currentIdx] && sections[currentIdx].id === 'projects';
    if (projActive && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (window._carouselSwipe) window._carouselSwipe(dx > 0 ? 1 : -1);
      return;
    }
    if (Math.abs(dy) > 70) goTo(currentIdx + (dy > 0 ? 1 : -1));
  }, { passive: true });

  /* ---- Keyboard ---- */
  window.addEventListener('keydown', e => {
    const projActive = sections[currentIdx] && sections[currentIdx].id === 'projects';
    if (projActive && e.key === 'ArrowRight') { e.preventDefault(); if (window._carouselSwipe) window._carouselSwipe(1);  return; }
    if (projActive && e.key === 'ArrowLeft')  { e.preventDefault(); if (window._carouselSwipe) window._carouselSwipe(-1); return; }
    if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(currentIdx + 1); }
    if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) { e.preventDefault(); goTo(currentIdx - 1); }
  });

  /* Reveal words for hero section on first load (if any) */
  revealWords(hero);
})();

/* ============================================
   Texte rôle — typewriter
   ============================================ */
const roleEl    = document.getElementById('hero-role');
const roleTexts = ['Développeur Full Stack', 'Spécialité Cybersécurité'];
let   roleIdx   = 0;

async function typeText(text) {
  for (let i = 0; i <= text.length; i++) {
    roleEl.textContent = text.slice(0, i);
    await wait(55);
  }
}

async function deleteText() {
  const current = roleEl.textContent;
  for (let i = current.length; i >= 0; i--) {
    roleEl.textContent = current.slice(0, i);
    await wait(28);
  }
}

async function cycleRoles() {
  await wait(1500);
  while (true) {
    await typeText(roleTexts[roleIdx % roleTexts.length]);
    await wait(2800);
    await deleteText();
    await wait(400);
    roleIdx++;
  }
}

cycleRoles();

/* ============================================
   Projects — draggable auto-scroll belt
   ============================================ */
/* ============================================
   Projects — carousel
   ============================================ */
(function initProjCarousel() {
  const track    = document.getElementById('ps-track');
  const viewport = document.getElementById('ps-viewport');
  const prevBtn  = document.getElementById('ps-prev');
  const nextBtn  = document.getElementById('ps-next');
  const dotsEl   = document.getElementById('ps-dots');
  const counter  = document.getElementById('ps-counter');
  const section  = document.getElementById('projects');
  if (!track || !viewport) return;

  const cards  = Array.from(track.querySelectorAll('.proj-card'));
  const total  = cards.length;
  let   idx    = 0;
  const GAP    = 24;

  /* ── Dots ── */
  const dots = cards.map((_, i) => {
    const d = document.createElement('button');
    d.className = 'ps-dot';
    d.setAttribute('aria-label', `Projet ${i + 1}`);
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
    return d;
  });

  /* ── Calcul offset centré ── */
  function offset(i) {
    const vpW   = viewport.offsetWidth;
    const cardW = cards[0].offsetWidth;
    return (vpW / 2) - (cardW / 2) - i * (cardW + GAP);
  }

  /* ── Aller à l'index i ── */
  function goTo(i) {
    idx = Math.max(0, Math.min(total - 1, i));
    track.style.transform = `translateX(${offset(idx)}px)`;

    cards.forEach((c, k) => {
      c.classList.toggle('ps-active',   k === idx);
      c.classList.toggle('ps-inactive', k !== idx);
    });

    dots.forEach((d, k) => d.classList.toggle('active', k === idx));
    counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === total - 1;
  }

  /* ── Init ── */
  function init() {
    goTo(0);
  }

  /* ── Boutons ── */
  prevBtn && prevBtn.addEventListener('click', () => goTo(idx - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(idx + 1));

  /* ── Wheel horizontal (exposé globalement) ── */
  let wheelAcc = 0, wTimer = null;
  window._carouselWheel = function(deltaX) {
    wheelAcc += deltaX;
    clearTimeout(wTimer);
    wTimer = setTimeout(() => { wheelAcc = 0; }, 500);
    if (Math.abs(wheelAcc) > 120) {
      goTo(idx + (wheelAcc > 0 ? 1 : -1));
      wheelAcc = 0;
    }
  };

  /* ── Swipe touch / flèches clavier (exposé globalement) ── */
  window._carouselSwipe = function(dir) { goTo(idx + dir); };

  /* ── Drag souris ── */
  let dragging = false, dragStartX = 0, dragBaseIdx = 0;
  track.addEventListener('mousedown', e => {
    dragging = true; dragStartX = e.clientX; dragBaseIdx = idx;
    track.style.transition = 'none';
    e.preventDefault();
  });
  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX;
    const cardW = cards[0].offsetWidth;
    track.style.transform = `translateX(${offset(dragBaseIdx) + dx}px)`;
  });
  window.addEventListener('mouseup', e => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = '';
    const dx = e.clientX - dragStartX;
    if      (dx < -60) goTo(dragBaseIdx + 1);
    else if (dx >  60) goTo(dragBaseIdx - 1);
    else               goTo(dragBaseIdx);
  });

  /* ── Lancer quand section devient active ── */
  new MutationObserver(() => {
    if (section.classList.contains('is-active')) {
      requestAnimationFrame(() => init());
    }
  }).observe(section, { attributeFilter: ['class'] });

  window.addEventListener('resize', () => {
    if (section.classList.contains('is-active')) goTo(idx);
  });
})();

/* ============================================
   Projects — terminal canvas background
   ============================================ */
(function initProjParticles() {
  const canvas  = document.getElementById('proj-canvas');
  const section = document.getElementById('projects');
  if (!canvas || !section) return;
  const ctx = canvas.getContext('2d');

  const N        = 200;   /* nombre de particules */
  const FOV      = 400;   /* perspective */
  const LINK_D   = 240;   /* distance max 2D pour tracer une ligne */
  const SPEED    = 0.65;
  const DEPTH    = 900;   /* profondeur Z */

  let pts = [], animId = null, running = false, W = 0, H = 0;

  /* Pulses qui voyagent le long des arêtes */
  const pulses = [];

  function makePoint() {
    /* spread sur toute la surface projetée, avec marge */
    const spread = Math.max(W, H) * 1.1;
    return {
      x  : (Math.random() - 0.5) * spread * 2,
      y  : (Math.random() - 0.5) * spread,
      z  : Math.random() * DEPTH,
      vx : (Math.random() - 0.5) * SPEED,
      vy : (Math.random() - 0.5) * SPEED,
      vz : (Math.random() - 0.5) * SPEED * 0.4,
      glowPhase : Math.random() * Math.PI * 2,
      glowSpeed : 0.015 + Math.random() * 0.025,
    };
  }

  function project(p) {
    const scale = FOV / (FOV + p.z);
    return { sx: W / 2 + p.x * scale, sy: H / 2 + p.y * scale, scale };
  }

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function init() {
    pts = Array.from({ length: N }, makePoint);
  }

  function spawnPulse(i, j) {
    if (pulses.length > 18) return;
    pulses.push({ i, j, t: 0 });
  }

  let frame = 0;
  function draw() {
    frame++;
    ctx.clearRect(0, 0, W, H);

    /* ── Mise à jour positions ── */
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.z += p.vz;
      p.glowPhase += p.glowSpeed;
      /* rebond sur les bords selon la taille réelle */
      const bx = W * 1.1, by = H * 1.1;
      if (Math.abs(p.x) > bx) p.vx *= -1;
      if (Math.abs(p.y) > by) p.vy *= -1;
      if (p.z < 0 || p.z > DEPTH) p.vz *= -1;
    });

    /* ── Projections 2D ── */
    const proj = pts.map(project);

    /* ── Lignes entre voisins ── */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = proj[i].sx - proj[j].sx;
        const dy = proj[i].sy - proj[j].sy;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d > LINK_D) continue;

        const alpha = (1 - d / LINK_D) * 0.38 * Math.min(proj[i].scale, proj[j].scale) * 2.5;
        ctx.globalAlpha = Math.min(alpha, 0.55);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth   = 0.7;
        ctx.beginPath();
        ctx.moveTo(proj[i].sx, proj[i].sy);
        ctx.lineTo(proj[j].sx, proj[j].sy);
        ctx.stroke();

        /* Spawn aléatoire de pulse */
        if (frame % 90 === 0 && Math.random() < 0.04) spawnPulse(i, j);
      }
    }

    /* ── Pulses voyageurs ── */
    for (let k = pulses.length - 1; k >= 0; k--) {
      const pu = pulses[k];
      pu.t += 0.025;
      if (pu.t >= 1) { pulses.splice(k, 1); continue; }
      const px = proj[pu.i].sx + (proj[pu.j].sx - proj[pu.i].sx) * pu.t;
      const py = proj[pu.i].sy + (proj[pu.j].sy - proj[pu.i].sy) * pu.t;
      const pr = 3.5 * Math.min(proj[pu.i].scale + proj[pu.j].scale, 1.6);
      const grad = ctx.createRadialGradient(px, py, 0, px, py, pr * 3);
      grad.addColorStop(0,   'rgba(147,197,253,0.9)');
      grad.addColorStop(0.4, 'rgba(59,130,246,0.5)');
      grad.addColorStop(1,   'rgba(59,130,246,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle   = grad;
      ctx.beginPath();
      ctx.arc(px, py, pr * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ── Nœuds ── */
    pts.forEach((p, i) => {
      const { sx, sy, scale } = proj[i];
      const glow = 0.5 + 0.5 * Math.sin(p.glowPhase);
      const r    = (3 + scale * 7);
      const a    = 0.35 + glow * 0.55;

      /* Halo */
      if (glow > 0.6) {
        const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5);
        halo.addColorStop(0,   `rgba(59,130,246,${(glow - 0.6) * 0.35})`);
        halo.addColorStop(1,   'rgba(59,130,246,0)');
        ctx.globalAlpha = 1;
        ctx.fillStyle   = halo;
        ctx.beginPath();
        ctx.arc(sx, sy, r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* Point */
      ctx.globalAlpha = a;
      ctx.fillStyle   = glow > 0.75 ? '#93c5fd' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (running) animId = requestAnimationFrame(draw);
  }

  new MutationObserver(() => {
    if (section.classList.contains('is-active')) {
      if (!running) { running = true; resize(); init(); draw(); }
    } else {
      running = false;
      cancelAnimationFrame(animId);
    }
  }).observe(section, { attributeFilter: ['class'] });

  window.addEventListener('resize', () => { if (running) resize(); });
})();

/* ============================================
   Stack — Vanta clouds background
   ============================================ */
(function initVantaClouds() {
  const section = document.getElementById('stack');
  if (!section) return;

  let vantaEffect = null;

  function start() {
    if (vantaEffect || typeof VANTA === 'undefined') return;
    vantaEffect = VANTA.FOG({
      el: section,
      THREE: THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      highlightColor: 0x4700ff,
      midtoneColor: 0x9500ff,
      lowlightColor: 0xeb8a00,
      baseColor: 0x0,
    });
  }

  function stop() {
    if (vantaEffect) { vantaEffect.destroy(); vantaEffect = null; }
  }

  new MutationObserver(() => {
    if (section.classList.contains('is-active')) start();
    else stop();
  }).observe(section, { attributeFilter: ['class'] });
})();

/* ============================================
   About — starfield background (canvas)
   ============================================ */
(function initAboutCanvas() {
  const section = document.getElementById('about');

  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';

  const wrap = document.createElement('div');
  wrap.style.cssText = 'position:relative;z-index:1;width:100%;';
  [...section.childNodes].forEach(n => wrap.appendChild(n));

  section.appendChild(canvas);
  section.appendChild(wrap);

  const ctx   = canvas.getContext('2d');
  const COUNT = 160;
  let W, H, pts, rafId;

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function initPts() {
    pts = Array.from({ length: COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r:  Math.random() * 1.3 + 0.2,
      a:  0.2 + Math.random() * 0.75,
      da: (Math.random() - 0.5) * 0.009,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      p.a += p.da;
      if (p.a > 0.9 || p.a < 0.1) p.da *= -1;

      const isLight = document.documentElement.classList.contains('light');
      ctx.globalAlpha = p.a;
      ctx.fillStyle   = isLight ? '#1e3a5f' : '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    if (section.classList.contains('is-active')) {
      rafId = requestAnimationFrame(draw);
    } else {
      rafId = null;
    }
  }

  function startCanvas() {
    if (rafId) return;
    resize(); initPts(); draw();
  }

  new MutationObserver(() => {
    if (section.classList.contains('is-active')) startCanvas();
    else { cancelAnimationFrame(rafId); rafId = null; }
  }).observe(section, { attributeFilter: ['class'] });

  new ResizeObserver(resize).observe(section);
  resize();
})();

/* ============================================
   Globe — cyber attack map (simulated)
   ============================================ */
(function initGlobe() {
  const container = document.getElementById('globe-container');
  const countEl   = document.getElementById('globe-count');
  const feedEl    = document.getElementById('globe-feed');
  if (!container) return;

  const COUNTRIES = [
    { name: 'Chine',         lat: 35.86,  lng: 104.19 },
    { name: 'USA',           lat: 37.09,  lng: -95.71 },
    { name: 'Russie',        lat: 61.52,  lng: 105.31 },
    { name: 'Allemagne',     lat: 51.16,  lng: 10.45  },
    { name: 'Brésil',        lat: -14.23, lng: -51.93 },
    { name: 'Inde',          lat: 20.59,  lng: 78.96  },
    { name: 'Royaume-Uni',   lat: 55.37,  lng: -3.43  },
    { name: 'France',        lat: 46.23,  lng: 2.21   },
    { name: 'Japon',         lat: 36.20,  lng: 138.25 },
    { name: 'Corée du Sud',  lat: 35.90,  lng: 127.76 },
    { name: 'Corée du Nord', lat: 40.33,  lng: 127.51 },
    { name: 'Iran',          lat: 32.43,  lng: 53.68  },
    { name: 'Ukraine',       lat: 48.38,  lng: 31.16  },
    { name: 'Pays-Bas',      lat: 52.13,  lng: 5.29   },
    { name: 'Singapour',     lat: 1.35,   lng: 103.82 },
    { name: 'Australie',     lat: -25.27, lng: 133.77 },
    { name: 'Canada',        lat: 56.13,  lng: -106.35},
    { name: 'Mexique',       lat: 23.63,  lng: -102.55},
    { name: 'Roumanie',      lat: 45.94,  lng: 24.96  },
    { name: 'Nigéria',       lat: 9.08,   lng: 8.67   },
    { name: 'Israël',        lat: 31.05,  lng: 34.85  },
    { name: 'Pakistan',      lat: 30.38,  lng: 69.35  },
  ];

  const TYPES = [
    { type: 'DDoS',     color: '#ef4444' },
    { type: 'Malware',  color: '#f97316' },
    { type: 'Exploit',  color: '#a855f7' },
    { type: 'Scan',     color: '#06b6d4' },
    { type: 'Phishing', color: '#eab308' },
  ];

  const top10El   = document.getElementById('top10-list');
  const hitCount  = {
    'France':       18000,
    'USA':          15000,
    'Russie':       12000,
    'Iran':          8500,
    'Israël':        6500,
    'Allemagne':     5000,
    'Royaume-Uni':   3800,
    'Ukraine':       3000,
    'Chine':         2400,
    'Japon':         1800,
  };

  let globe       = null;
  let ready       = false;
  let arcs        = [];
  let rings       = [];
  let total       = 0;
  let attackTimer = null;

  function buildGlobe() {
    if (ready || typeof Globe === 'undefined') return;
    ready = true;

    const W = container.clientWidth  || 500;
    const H = container.clientHeight || 460;

    globe = Globe({ animateIn: false })
      .width(W).height(H)
      .backgroundColor('rgba(0,0,0,0)')
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
      .atmosphereColor('#00d4ff')
      .atmosphereAltitude(0.18)
      .arcsData([])
      .arcStartLat('startLat').arcStartLng('startLng')
      .arcEndLat('endLat').arcEndLng('endLng')
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(0.15)
      .arcDashAnimateTime(2200)
      .arcStroke(0.5)
      .arcAltitude(0.28)
      .ringsData([])
      .ringColor(d => d.color)
      .ringMaxRadius(4)
      .ringPropagationSpeed(2.5)
      .ringRepeatPeriod(1000)
      .labelsData(COUNTRIES)
      .labelLat('lat')
      .labelLng('lng')
      .labelText('name')
      .labelColor(() => 'rgba(180, 215, 255, 0.62)')
      .labelSize(0.42)
      .labelDotRadius(0.28)
      .labelAltitude(0.01)
      .labelResolution(3)
      (container);

    const ctrl = globe.controls();
    ctrl.autoRotate      = true;
    ctrl.autoRotateSpeed = 0.9;
    ctrl.enableZoom      = false;
    ctrl.enablePan       = false;
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });
  }

  function spawnBatch() {
    if (!ready) return;
    const now       = Date.now();
    const batchSize = 2 + Math.floor(Math.random() * 2); // 2-3 simultaneous
    let   feedEntry = null;

    for (let i = 0; i < batchSize; i++) {
      const src = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
      let dst;
      do { dst = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]; } while (dst === src);
      const t = TYPES[Math.floor(Math.random() * TYPES.length)];

      if (i === 0) feedEntry = { t, src, dst };

      hitCount[dst.name] = (hitCount[dst.name] || 0) + 1;

      arcs.push({
        startLat: src.lat, startLng: src.lng,
        endLat:   dst.lat, endLng:   dst.lng,
        color: [t.color, t.color + '00'],
        expires: now + 2200,
      });
      rings.push({ lat: dst.lat, lng: dst.lng, color: t.color, expires: now + 2200 });
      total++;
    }

    /* Purge expired arcs on every tick — no individual setTimeouts needed */
    arcs  = arcs.filter(a => a.expires > now);
    rings = rings.filter(r => r.expires > now);

    globe.arcsData([...arcs]).ringsData([...rings]);
    if (countEl) countEl.textContent = total.toLocaleString();

    if (feedEl && feedEntry) {
      const el = document.createElement('div');
      el.className = 'feed-item';
      el.style.setProperty('--feed-color', feedEntry.t.color);
      el.textContent = `${feedEntry.t.type} · ${feedEntry.src.name} → ${feedEntry.dst.name}`;
      feedEl.prepend(el);
      while (feedEl.children.length > 5) feedEl.removeChild(feedEl.lastChild);
    }

    updateTop10();
  }

  function updateTop10() {
    if (!top10El) return;
    const sorted = Object.entries(hitCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    top10El.innerHTML = sorted.map(([name, count], i) =>
      `<li><span class="top10-rank">${i + 1}.</span><span class="top10-name">${name}</span><span class="top10-count">${count.toLocaleString()}</span></li>`
    ).join('');
  }

  function startAttacks() {
    if (attackTimer) return;
    /* ~2-3 attacks × 1000/180ms = ~15 attacks/sec */
    const tick = () => {
      spawnBatch();
      attackTimer = setTimeout(tick, 150 + Math.random() * 100);
    };
    tick();
  }

  function stopAttacks() {
    clearTimeout(attackTimer);
    attackTimer = null;
  }

  const about = document.getElementById('about');
  updateTop10();

  new MutationObserver(() => {
    if (about.classList.contains('is-active')) {
      buildGlobe();
      startAttacks();
    } else {
      stopAttacks();
    }
  }).observe(about, { attributeFilter: ['class'] });

  window.addEventListener('resize', () => {
    if (globe && ready) globe.width(container.clientWidth).height(container.clientHeight);
  });
})();

/* ============================================
   Contact — aurora waves background
   ============================================ */
(function initContactAurora() {
  const canvas  = document.getElementById('contact-canvas');
  const section = document.getElementById('contact');
  if (!canvas || !section) return;

  const ctx = canvas.getContext('2d');

  const PALETTE = ['#ff0080','#7928ca','#0070f3','#38bdf8','#ffb700','#00d4aa'];

  let W = 0, H = 0, animId = null, running = false, t = 0;

  /* Chaque vague : paramètres fixes + phase qui évolue */
  let waves = [];

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }

  function initWaves() {
    waves = [];
    const N = 9; /* nombre de vagues */
    for (let i = 0; i < N; i++) {
      waves.push({
        yBase    : H * (0.08 + (i / (N - 1)) * 0.84), /* répartition verticale */
        amp      : 28 + Math.random() * 55,            /* amplitude sinusoïdale */
        freq     : 0.003 + Math.random() * 0.004,      /* fréquence spatiale */
        speed    : (0.008 + Math.random() * 0.012) * (Math.random() > 0.5 ? 1 : -1),
        phase    : Math.random() * Math.PI * 2,
        color    : PALETTE[i % PALETTE.length],
        width    : 18 + Math.random() * 30,            /* épaisseur de la vague */
        alpha    : 0.35 + Math.random() * 0.45,
      });
    }
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.5;

    /* Flou doux via filtre canvas */
    ctx.filter = 'blur(18px)';

    waves.forEach(w => {
      w.phase += w.speed;

      /* Dégradé vertical centré sur la vague */
      const grad = ctx.createLinearGradient(0, w.yBase - w.width, 0, w.yBase + w.width);
      grad.addColorStop(0,   w.color + '00');
      grad.addColorStop(0.5, w.color);
      grad.addColorStop(1,   w.color + '00');

      ctx.globalAlpha = w.alpha;
      ctx.strokeStyle = grad;
      ctx.lineWidth   = w.width * 1.6;
      ctx.lineJoin    = 'round';
      ctx.lineCap     = 'round';

      ctx.beginPath();
      for (let x = 0; x <= W; x += 4) {
        const y = w.yBase + Math.sin(x * w.freq + w.phase) * w.amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    });

    ctx.filter      = 'none';
    ctx.globalAlpha = 1;
    if (running) animId = requestAnimationFrame(drawFrame);
  }

  new MutationObserver(() => {
    if (section.classList.contains('is-active')) {
      if (!running) { running = true; resize(); initWaves(); drawFrame(); }
    } else {
      running = false;
      cancelAnimationFrame(animId);
    }
  }).observe(section, { attributeFilter: ['class'] });

  window.addEventListener('resize', () => { if (running) { resize(); initWaves(); } });
})();

/* ============================================
   Contact — orbit animation
   ============================================ */
(function initOrbit() {
  const wrap    = document.getElementById('orbit-wrap');
  const contact = document.getElementById('contact');
  if (!wrap || !contact) return;

  const bubbles = [
    document.getElementById('ob-github'),
    document.getElementById('ob-linkedin'),
    document.getElementById('ob-mail'),
  ];

  const RX = 115;   /* rayon horizontal */
  const RY = 62;    /* rayon vertical (ellipse) */
  const SPEED = 0.35; /* degrés par frame */

  let angles = bubbles.map((_, i) => (i / bubbles.length) * 360);
  let rafId  = null;
  let running = false;

  function tick() {
    angles = angles.map(a => (a + SPEED) % 360);
    bubbles.forEach((el, i) => {
      if (!el) return;
      const rad = angles[i] * Math.PI / 180;
      const x   = Math.cos(rad) * RX;
      const y   = Math.sin(rad) * RY;
      /* left/top = 50% via CSS, on déplace depuis le centre */
      el.style.left = `calc(50% + ${x}px)`;
      el.style.top  = `calc(50% + ${y}px)`;
      /* z-index selon profondeur (bas = devant) */
      el.style.zIndex = Math.round(y + 100);
      /* légère variation de taille pour effet 3D */
      const depthScale = 0.75 + 0.25 * ((y + RY) / (RY * 2));
      el.style.opacity = 0.65 + 0.35 * ((y + RY) / (RY * 2));
      if (!el.matches(':hover')) {
        el.style.transform = `translate(-50%, -50%) scale(${depthScale})`;
      }
    });
    if (running) rafId = requestAnimationFrame(tick);
  }

  new MutationObserver(() => {
    if (contact.classList.contains('is-active')) {
      if (!running) { running = true; tick(); }
    } else {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }).observe(contact, { attributeFilter: ['class'] });
})();

/* ============================================
   Contact — form submission via Web3Forms
   ============================================ */
(function initContactForm() {
  const form      = document.getElementById('contact-form');
  const status    = document.getElementById('cf-status');
  if (!form || !status) return;

  const LOAD_TIME    = Date.now();
  const RATE_KEY     = '_cf_last';
  const MIN_DELAY_MS = 4000;   // moins de 4s = bot
  const RATE_LIMIT   = 60000;  // 1 envoi max par minute

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.cf-submit');

    // Protection timing : un humain met au moins 4 secondes à remplir le formulaire
    if (Date.now() - LOAD_TIME < MIN_DELAY_MS) {
      form.reset();
      status.className = 'cf-status ok';
      status.textContent = 'Message envoyé — merci !';
      return;
    }

    // Rate limiting : 1 envoi par minute max
    const lastSend = parseInt(localStorage.getItem(RATE_KEY) || '0', 10);
    if (Date.now() - lastSend < RATE_LIMIT) {
      status.className = 'cf-status err';
      status.textContent = 'Merci d\'attendre avant d\'envoyer un autre message.';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Envoi…';
    status.className = 'cf-status';
    status.textContent = '';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method : 'POST',
        body   : new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const json = await res.json();

      if (json.success) {
        localStorage.setItem(RATE_KEY, String(Date.now()));
        status.className = 'cf-status ok';
        status.textContent = 'Message envoyé — merci !';
        form.reset();
      } else {
        throw new Error(json.message || 'Erreur serveur');
      }
    } catch {
      status.className = 'cf-status err';
      status.textContent = 'Échec de l\'envoi, réessaie.';
    } finally {
      btn.disabled = false;
      btn.textContent = 'Envoyer →';
    }
  });
})();
