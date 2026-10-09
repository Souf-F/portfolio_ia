import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import SpotlightCard from './components/SpotlightCard';
import Threads from './components/Threads';
import ScrollVelocity from './components/ScrollVelocity';
import WorksWheelDemo from './components/ui/works-wheel-demo';
import { SplineSceneBasic } from './components/ui/spline-demo';
import { MusicPlayer } from './components/ui/music-player';
import GradientMenu from './components/ui/gradient-menu';
import SocialTooltip from './components/ui/social-media';
import { IoLogoLinkedin } from 'react-icons/io5';
import './App.css';

/* ── EMAIL (obfusqué pour les scrapers) ── */
const _e = ['soufianefilalipro', 'gmail', 'com'];
const CONTACT_EMAIL = `${_e[0]}@${_e[1]}.${_e[2]}`;

/* ── DATA ── */
const NAV = [
  { label: 'À propos',  href: '#about' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'Projets',   href: '#projects' },
];

const STACK = [
  { group: 'Cybersécurité', items: ['Nmap', 'Kali Linux', 'TryHackMe', 'Dorking', 'Medusa'] },
  { group: 'Langages',   items: ['Python', 'Vanilla JS', 'C', 'Bash', 'SQL'] },
  { group: 'Web & Dev',  items: ['React', 'Flask', 'Node.js', 'Docker', 'Git'] },
  { group: 'IA',         items: ['Claude AI', 'MCP Protocol', 'Obsidian', 'GPT', 'Gemini'] },
];

const PROJECTS = [
  { no: '01', id: 'sentinel-scanner', title: 'Sentinel Scanner', year: '2026', domain: 'Sécurité offensive', desc: 'Scanner de vulnérabilités web piloté par agent. 24 contrôles automatisés, 30 ports scannés, 46 chemins sensibles. Terminal animé en temps réel, scoring de risque complet.', tags: ['Python', 'Flask', 'Security', 'Agentic'], gh: 'https://github.com/Souf-F', live: null, video: '/projects/sentinel.mov' },
  { no: '02', id: 'cyber-cheatsheet', title: 'Cyber Cheatsheet', year: '2026', domain: "Plateforme d'apprentissage", desc: "54 fiches interactives, 43 badges débloquables, progression par expérience. Une bibliothèque vivante pour apprendre la cybersécurité. Entièrement vanilla JS.", tags: ['Vanilla JS', 'UX', 'Gamification'], gh: 'https://github.com/Souf-F', live: 'https://cyber-cheatsheet.aeonlabs.fr/', video: '/projects/cybersheet.mov' },
  { no: '03', id: 'aeris', title: 'AERIS', year: '2026', domain: 'Gestion des risques', desc: "Analyse de risque cyber pour la supply chain aéronautique. Scoring EBIOS Risk Manager, matrice 5×5, 9 actifs pré-chargés — Thales, Airbus D&S, Safran.", tags: ['HTML', 'CSS', 'JS', 'EBIOS RM'], gh: 'https://github.com/Souf-F/aeris-risk-assessment', live: 'https://aeris.aeonlabs.fr/', video: '/projects/aeris.mov' },
  { no: '04', id: 'eco-audit', title: 'ECO-AUDIT', year: '2026', domain: 'Serious Game — équipe de 9', desc: "Jeu sérieux d'enquête anti-corruption dans une entreprise fictive. Organigramme interactif, timer, dossiers confidentiels. Construit avec une équipe de 9 étudiants.", tags: ['HTML', 'CSS', 'JS', 'Teamwork'], gh: 'https://github.com/Souf-F/ecoauditv3', live: 'https://ecoaudit.aeonlabs.fr/', video: '/projects/ecoaudit.mov' },
];

/* ── Icons ── */
function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z"/>
    </svg>
  );
}
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5V8h3v11zM6.5 6.7a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zM19 19h-3v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V19h-3V8h2.9v1.5h.04a3.2 3.2 0 0 1 2.9-1.6c3.1 0 3.7 2 3.7 4.7V19z"/>
    </svg>
  );
}

/* ── Nav ── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--solid' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo" aria-label="Accueil">
          <span className="logo-mark">SF</span>
        </a>
        <ul className={`nav-links ${open ? 'is-open' : ''}`}>
          {NAV.map(n => (
            <li key={n.href}>
              <a href={n.href} onClick={() => setOpen(false)}>{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-right">
          <a href="#contact" className="nav-cta">Me contacter</a>
          <button className={`burger ${open ? 'is-open' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
      </div>
    </nav>
  );
}

const L1 = '- the future -';
const L2 = 'of thinking';
const CHAR_MS   = 62;    // délai entre chaque lettre
const L1_START  = 800;   // ms après début de cycle → apparition L1
const L2_START  = L1_START + L1.replace(/ /g, '').length * CHAR_MS + 400;
const HIDE_AT   = 14500; // ms → début disparition (avant fin des 20s)
const CYCLE     = 20000; // durée totale du cycle (= durée ping-pong)

const LABEL_NAME = 'Soufiane Filali';
const LABEL_SUB  = 'portfolio full stack agentic & automatisation';
const LCHAR_MS   = 55;
const LSUB_DELAY = LABEL_NAME.length * LCHAR_MS + 300;

/* ── Hero ── */
function Hero() {
  const titleRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    let timers = [];
    let cycleTimer = null;

    function runCycle() {
      const el = titleRef.current;
      if (!el) return;
      const allSpans = Array.from(el.querySelectorAll('.char'));
      const l1Spans  = Array.from(el.querySelectorAll('.hero-title-l1 .char'));
      const l2Spans  = Array.from(el.querySelectorAll('.hero-title-l2 .char'));

      // Reset toutes les lettres
      allSpans.forEach(s => { s.classList.remove('char--on', 'char--off'); });

      // Apparition L1 lettre par lettre
      l1Spans.forEach((s, i) => {
        timers.push(setTimeout(() => s.classList.add('char--on'), L1_START + i * CHAR_MS));
      });
      // Apparition L2 lettre par lettre
      l2Spans.forEach((s, i) => {
        timers.push(setTimeout(() => s.classList.add('char--on'), L2_START + i * CHAR_MS));
      });
      // Disparition simultanée
      timers.push(setTimeout(() => {
        allSpans.forEach(s => { s.classList.remove('char--on'); s.classList.add('char--off'); });
      }, HIDE_AT));

      // Boucle suivante
      cycleTimer = setTimeout(() => { timers = []; runCycle(); }, CYCLE);
    }

    runCycle();
    return () => { timers.forEach(clearTimeout); clearTimeout(cycleTimer); };
  }, []);

  useEffect(() => {
    const el = labelRef.current;
    if (!el) return;
    const timers = [];
    const nameSpans = el.querySelectorAll('.lname .lchar');
    const subSpans  = el.querySelectorAll('.lsub .lchar');
    nameSpans.forEach((s, i) => {
      timers.push(setTimeout(() => s.classList.add('lchar--on'), 400 + i * LCHAR_MS));
    });
    subSpans.forEach((s, i) => {
      timers.push(setTimeout(() => s.classList.add('lchar--on'), 400 + LSUB_DELAY + i * LCHAR_MS));
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section id="hero" className="hero">
      <div className="gradient-menu-wrapper">
        <GradientMenu />
      </div>
      <div className="hero-label" ref={labelRef}>
        <span className="hero-label-name lname">
          {[...LABEL_NAME].map((ch, i) =>
            ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i} className="lchar">{ch}</span>
          )}
        </span>
        <span className="hero-label-sub lsub">
          {[...LABEL_SUB].map((ch, i) =>
            ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i} className="lchar">{ch}</span>
          )}
        </span>
      </div>
      <div className="stage">
        <div ref={titleRef} className="hero-title" aria-label={`${L1} ${L2}`}>
          <span className="hero-title-l1">
            {[...L1].map((ch, i) => ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i} className="char">{ch}</span>)}
          </span>
          <span className="hero-title-l2">
            {[...L2].map((ch, i) => ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i} className="char">{ch}</span>)}
          </span>
        </div>
        <video autoPlay muted loop playsInline preload="auto" className="stage-video">
          <source src="/hero-v2.webm" type="video/webm" />
          <source src="/hero-v2.mp4" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

/* ── About ── */
function About() {
  return (
    <section id="about" style={{ width: '100%', minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="about-inner">
        <SplineSceneBasic />
      </div>
    </section>
  );
}

/* ── Expertise ── */
function Expertise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="expertise" className="section section--threads" ref={ref}>
      <Threads color={[0.0, 0.78, 0.25]} amplitude={1.2} distance={0.3} enableMouseInteraction />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-num">02</span>
          <h2 className="section-title">Expertise</h2>
        </motion.div>

        <div className="stack-grid">
          {STACK.map((col, i) => (
            <motion.div
              key={col.group}
              className="stack-col"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <p className="stack-group">{col.group}</p>
              <ul className="stack-list">
                {col.items.map(item => (
                  <li key={item} className="stack-item">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ── Projects ── */
function Projects() {
  return (
    <section id="projects" style={{ height: '100vh', width: '100%' }}>
      <WorksWheelDemo />
    </section>
  );
}

/* ── Contact ── */
function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [status, setStatus] = useState('idle');
  const [cooldown, setCooldown] = useState(0);
  const submitCount = useRef(0);
  const formStart = useRef(Date.now());

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending' || cooldown > 0) return;
    if (Date.now() - formStart.current < 3000) return; // soumission trop rapide = bot
    submitCount.current += 1;
    if (submitCount.current > 3) { setCooldown(300); return; } // trop d'envois
    setStatus('sending');
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(e.target) });
      setStatus(res.ok ? 'ok' : 'error');
      if (res.ok) { e.target.reset(); setCooldown(60); }
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section" ref={ref}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-num">04</span>
          <h2 className="section-title">Contact</h2>
        </motion.div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}>
          <motion.p
            className="contact-intro"
            style={{ textAlign: 'center', maxWidth: 480 }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Recruteur, collaboration technique ou offre d'alternance, je suis disponible.
          </motion.p>

          <motion.form
            className="contact-form"
            onSubmit={onSubmit}
            style={{ width: '100%', maxWidth: 560 }}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <input type="hidden" name="access_key" value="58c39c33-d27a-43fe-8f17-84710bf49a76" />
            <input type="hidden" name="subject" value="Portfolio — nouveau message de Soufiane Filali" />
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />
            <div className="cf-row">
              <div className="cf-field">
                <label>Nom</label>
                <input name="name" type="text" placeholder="Votre nom" required maxLength={100} />
              </div>
              <div className="cf-field">
                <label>Email</label>
                <input name="email" type="email" placeholder="votre@email.com" required maxLength={254} />
              </div>
            </div>
            <div className="cf-field">
              <label>Message</label>
              <textarea name="message" rows={5} placeholder="Votre message…" required maxLength={2000} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={status === 'sending' || cooldown > 0}>
              {status === 'sending' ? 'Envoi…' : cooldown > 0 ? `Patienter ${cooldown}s` : 'Envoyer →'}
            </button>
            {status === 'ok'    && <p className="cf-ok">Message envoyé ✓</p>}
            {status === 'error' && <p className="cf-err">Erreur — écris-moi directement par email.</p>}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <SocialTooltip items={[
              {
                href: 'https://github.com/Souf-F',
                ariaLabel: 'GitHub',
                tooltip: 'GitHub',
                color: '#ffffff',
                svgUrl: 'https://cdn.simpleicons.org/github/ffffff',
              },
              {
                href: 'https://www.linkedin.com/in/soufiane-filali-dev/',
                ariaLabel: 'LinkedIn',
                tooltip: 'LinkedIn',
                color: '#0077b5',
                icon: <IoLogoLinkedin />,
                iconColor: '#0077b5',
              },
              {
                href: `mailto:${CONTACT_EMAIL}`,
                ariaLabel: 'Email',
                tooltip: 'Email',
                color: '#ea4335',
                svgUrl: 'https://cdn.simpleicons.org/gmail/ea4335',
                keepColor: true,
              },
            ]} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 Soufiane Filali</span>
      <a href="https://github.com/Souf-F" target="_blank" rel="noopener noreferrer">
        <GithubIcon /> Souf-F
      </a>
    </footer>
  );
}

/* ── App ── */
export default function App() {
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
        <ScrollVelocity
          velocity={90}
          texts={[
            '⬤ ORCHESTRATION AGENTS IA  ·  MCP PROTOCOL  ·  AUTOMATISATION  ·  PIPELINES INTELLIGENTS  ·  FULL STACK AGENTIC  ·  CLAUDE AI  ·',
            '⬤ PYTHON  ·  REACT  ·  FASTAPI  ·  DOCKER  ·  CYBERSÉCURITÉ  ·  HOLBERTON SCHOOL  ·  AEONLABS  ·',
          ]}
        />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <MusicPlayer />
    </>
  );
}