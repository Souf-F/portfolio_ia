# Portfolio — Soufiane Filali

Personal portfolio built with React + Vite. Covers cybersecurity projects, fullstack work, and AI/automation experiments.

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 18 + Vite |
| Animations | Framer Motion — scroll parallax, entrance effects |
| 3D / WebGL | ogl — animated threads background |
| Routing | React Router DOM |
| Scroll | Lenis — smooth scroll |
| Contact | Web3Forms |

## Sections

```
Hero
 └─ WebGL animated background, intro text

About
 └─ Background, path, focus areas

Projects
 └─ Cards with individual detail pages (React Router)

Contact
 └─ Form via Web3Forms
```

## Run locally

```bash
npm install
npm run dev
```



## Build

```bash
npm run build
```

## Structure

```
src/
├── App.jsx                   # Main layout, all sections
├── App.css                   # Global styles
├── components/               # CustomCursor, Threads, SpotlightCard, ScrollVelocity, BlurText
├── pages/
│   └── ProjectDetail.jsx     # Individual project page
└── data/
    └── projects.js           # Project content
public/
├── hero.mp4
└── cyber-anim.mp4
```

---

Soufiane Filali · Holberton School France
