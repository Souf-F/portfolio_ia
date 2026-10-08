# Portfolio — Soufiane Filali

Portfolio personnel développé en React + Vite. Cybersécurité, développement full stack, projets personnels.

## Stack

- React 18 + Vite
- Framer Motion (animations, scroll parallax)
- React Router DOM
- ogl (WebGL threads background)
- Web3Forms (formulaire de contact)
- Lenis (smooth scroll)

## Lancer en local

```bash
npm install
npm run dev
```

Le site sera accessible sur `http://localhost:5173`

## Build

```bash
npm run build
```

## Structure

```
src/
  App.jsx           # Page principale, toutes les sections
  App.css           # Styles globaux
  components/       # CustomCursor, Threads, SpotlightCard, ScrollVelocity, BlurText
  pages/            # ProjectDetail (page projet individuelle)
  data/             # projects.js (contenu des projets)
public/
  hero.mp4          # Video hero
  cyber-anim.mp4    # Video section a propos
  projects/         # Videos des projets
```

## Sections

- Hero avec video parallax et effet typewriter
- A propos avec video cybersec
- Expertise technique (cybersecurite, langages, IA)
- Projets en scroll horizontal (Sentinel Scanner, Cyber Cheatsheet, AERIS, ECO-AUDIT)
- Contact avec formulaire anti-spam

## Contact

soufianefilalipro@gmail.com
