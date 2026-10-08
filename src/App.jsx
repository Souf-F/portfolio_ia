import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import SpotlightCard from './components/SpotlightCard';
import Threads from './components/Threads';
import BlurText from './components/BlurText';
import ScrollVelocity from './components/ScrollVelocity';
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

/* ── Hero ── */
function Hero() {
  const roles = ['Cybersecurity Developer', 'Penetration Tester', 'AI-Augmented Dev', 'Full Stack & Sec'];
  const [display, setDisplay] = useState('');
  const state = useRef({ idx: 0, char: 0, del: false });

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });

  // Vidéo : défile 40% plus lentement que le scroll → effet parallaxe
  const videoY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  // Contenu : monte légèrement plus vite
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '-18%']);
  // Overlay s'assombrit en scrollant
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 1.8]);

  useEffect(() => {
    let t;
    const tick = () => {
      const { idx, char, del } = state.current;
      const word = roles[idx];
      if (!del) {
        setDisplay(word.slice(0, char + 1));
        if (char + 1 === word.length) {
          state.current.del = true;
          t = setTimeout(tick, 1800);
        } else {
          state.current.char++;
          t = setTimeout(tick, 60);
        }
      } else {
        setDisplay(word.slice(0, char - 1));
        if (char - 1 === 0) {
          state.current = { idx: (idx + 1) % roles.length, char: 0, del: false };
          t = setTimeout(tick, 400);
        } else {
          state.current.char--;
          t = setTimeout(tick, 28);
        }
      }
    };
    t = setTimeout(tick, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="hero" className="hero" ref={heroRef}>
      <motion.video
        className="hero-video"
        autoPlay muted loop playsInline
        src="/hero.mp4"
        style={{ y: videoY }}
      />
      <div className="hero-overlay" />
      <div className="scanline" aria-hidden="true" />

      <motion.div className="hero-content" style={{ y: contentY }}>
        <motion.p
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          HOLBERTON SCHOOL · TOULOUSE · RNCP NIV.6
        </motion.p>

        <h1 className="hero-name">
          <BlurText text="Soufiane" delay={0.3} className="hero-line" />
          <BlurText text="Filali" delay={0.55} className="hero-line hero-line--accent" />
        </h1>

        <p className="hero-role" aria-live="polite">
          <span>{display}</span>
          <span className="cursor-blink" aria-hidden="true">|</span>
        </p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
          <a href="#projects" className="btn btn-primary">Accéder aux projets</a>
          <a href="#contact" className="btn btn-ghost">Établir un contact</a>
        </motion.div>
      </motion.div>

      <a href="#about" className="scroll-hint" aria-label="Défiler">
        <span className="scroll-line" />
        <span>scroll</span>
      </a>
    </section>
  );
}

/* ── About ── */
function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section id="about" className="section" ref={ref} style={{ overflow: 'hidden' }}>
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, x: -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span className="section-num">01</span>
          <h2 className="section-title">À propos</h2>
        </motion.div>

        <div className="about-grid">
          <motion.div
            className="about-text"
            style={{ y: bgY }}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="about-lead">
              Je m'appelle Soufiane. J'ai choisi la cybersécurité en regardant le monde accélérer.
            </p>
            <p>
              La course à l'IA est devenue trop importante pour que quiconque veuille ralentir, au risque de laisser la sécurité informatique sur le bord de la route. C'est l'une des vulnérabilités les plus sous-estimées de notre époque : des systèmes de plus en plus puissants, de plus en plus interconnectés, et de moins en moins audités.
            </p>
            <p>
              J'ai choisi cette voie parce que je préfère agir en amont. Comprendre les systèmes, cartographier les menaces, construire des défenses solides, avant que les failles deviennent des catastrophes.
            </p>
            <p>
              En formation à Holberton School Toulouse, je développe une expertise large : OSINT, tests d'intrusion, sécurité réseau, analyse défensive. La cybersécurité n'est pas qu'un métier pour moi. C'est une réponse à quelque chose qui me semble urgent.
            </p>
            <div className="about-meta">
              <div className="meta-item">
                <span className="meta-key">Formation</span>
                <span className="meta-val">Holberton School Toulouse</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">Niveau</span>
                <span className="meta-val">RNCP Niveau 6</span>
              </div>
              <div className="meta-item">
                <span className="meta-key">Disponibilité</span>
                <span className="meta-val meta-val--green">Alternance 2026</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about-video-wrap"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <video
              className="about-video"
              autoPlay
              muted
              loop
              playsInline
              src="/cyber-anim.mp4"
              onContextMenu={e => e.preventDefault()}
              controlsList="nodownload"
            />
          </motion.div>
        </div>
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
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  // translate X de 0% → -(100% * (n-1)/n) pour faire défiler toutes les cards
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${(PROJECTS.length - 1) * 100 / PROJECTS.length}%`]);
  const smoothX = useSpring(x, { stiffness: 280, damping: 40, mass: 0.5 });

  return (
    <section id="projects" className="proj-track-section" ref={trackRef}>
      {/* Fond Threads fixe */}
      <div className="proj-threads-bg">
        <Threads color={[0.0, 0.65, 0.20]} amplitude={0.9} distance={0.2} />
      </div>

      {/* Sticky viewport */}
      <div className="proj-sticky">
        {/* Header en haut à gauche */}
        <div className="proj-sticky-header">
          <span className="section-num">03</span>
          <h2 className="section-title">Projets</h2>
          <p className="proj-scroll-hint">scroll →</p>
        </div>

        {/* Piste horizontale */}
        <div className="proj-rail-wrap">
          <motion.div className="proj-rail" style={{ x: smoothX, willChange: 'transform' }}>
            {PROJECTS.map((p, i) => (
              <motion.div
                key={p.no}
                className="proj-slide"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              >
                <SpotlightCard>
                  {p.video && (
                    <div className="proj-video-wrap">
                      <video className="proj-video" src={p.video} autoPlay muted loop playsInline onContextMenu={e => e.preventDefault()} controlsList="nodownload" />
                      <div className="proj-video-fade" />
                    </div>
                  )}
                  <div className="scard-body">
                    <div className="proj-top">
                      <span className="proj-no">{p.no}</span>
                      <span className="proj-year">{p.year}</span>
                    </div>
                    <h3 className="proj-title">{p.title}</h3>
                    <p className="proj-desc">{p.desc}</p>
                    <div className="proj-links">
                      <button className="proj-link proj-link--more" onClick={() => navigate(`/projects/${p.id}`)}>
                        <InfoIcon /> En savoir plus
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Barre de progression */}
        <div className="proj-progress-bar">
          <motion.div className="proj-progress-fill" style={{ scaleX: scrollYProgress, transformOrigin: 'left' }} />
        </div>
      </div>
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

        <div className="contact-grid">
          <motion.div
            className="contact-left"
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="contact-intro">Recruteur, collaboration technique ou offre d'alternance en cybersécurité, je suis disponible.</p>
            <div className="contact-socials">
              <a href="https://github.com/Souf-F" target="_blank" rel="noopener noreferrer" className="social-link">
                <GithubIcon /> GitHub
              </a>
              <a href="https://linkedin.com/in/soufiane-filali-dev/" target="_blank" rel="noopener noreferrer" className="social-link">
                <LinkedinIcon /> LinkedIn
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="social-link">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>
                </svg>
                {CONTACT_EMAIL}
              </a>
            </div>
          </motion.div>

          <motion.form
            className="contact-form"
            onSubmit={onSubmit}
            initial={{ opacity: 0, x: 28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
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
      <a href="#hero" className="skip">Aller au contenu</a>
      <Nav />
      <main>
        <Hero />
        <ScrollVelocity
          velocity={90}
          texts={[
            '⬤ 1 CYBERATTAQUE TOUTES LES 39 SECONDES EN FRANCE  ·  RANSOMWARE EN HAUSSE DE 255% EN 3 ANS  ·  80% DES ENTREPRISES CIBLÉES  ·  831 INCIDENTS MAJEURS RECENSÉS PAR L\'ANSSI  ·',
            '⬤ COÛT MOYEN D\'UNE BRÈCHE DE DONNÉES : 4,2M€  ·  1 HÔPITAL ATTAQUÉ PAR SEMAINE  ·  PHISHING EN HAUSSE DE 300%  ·  3,5M POSTES NON POURVUS DANS LA CYBER  ·',
          ]}
        />
        <About />
        <Expertise />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
