<div align="center">

```
- the future -
of thinking
```

# Soufiane Filali
### portfolio full stack agentic & automatisation

[![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=flat&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Spline](https://img.shields.io/badge/Spline_3D-000000?style=flat&logo=spline&logoColor=white)](https://spline.design)
[![Déploiement](https://img.shields.io/badge/aeonlabs.fr-online-00C853?style=flat)](https://aeonlabs.fr)

**[Voir le site](https://aeonlabs.fr)**

</div>

---

## Ce qu'il se passe sur le site

### Hero
Robot IA plein écran. Texte animé lettre par lettre qui apparait derrière le robot, cycle de 20 secondes. Le texte est rendu visible à travers les zones sombres de la vidéo via `mix-blend-mode: screen`.

```
"- the future -"    [apparait à 800ms, lettre par lettre]
"of thinking"       [aparait à 1882ms, lettre par lettre]
[disparition douce à 14.5s, nouveau cycle à 20s]
```

### Page loader
Vidéo robot 5 secondes avec barre de progression au niveau du doigt qui touche l'écran. Le scroll est bloqué pendant le chargement.

### About
Scene Spline 3D interactive. Bio défilable manuellement en 5 lignes.

### Expertise
Grille de compétences par catégorie sur un background de fils WebGL animés (ogl).

### Projets
Carrousel 3D rotatif (WorksWheel). 8 projets en anneau, zoom x1.4 sur le projet actif. Snap automatique quand on scroll vite pour ne jamais rater la section.

### Contact
Formulaire Web3Forms, liens GitHub et LinkedIn.

---

## Effets techniques

| Effet | Fichier | Technique |
|-------|---------|-----------|
| Texte derrière le robot | `App.jsx` + `App.css` | Vidéo z-index 2, `mix-blend-mode: screen`, texte z-index 1 |
| Robot hero | `public/hero-v2.webm` | Vidéo WebM/MP4 en boucle, `object-fit: fill` |
| Carrousel 3D projets | `works-wheel.jsx` | Transformation CSS 3D, lerp, RAF |
| Lecteur musique | `music-player.jsx` | Autoplay déclenché sur premier clic/touch |
| Page loader | `page-loader.jsx` | RAF timer 5000ms, `requestAnimationFrame` |
| Menu 4 boutons | `gradient-menu.jsx` | Gradients CSS, 2 taps mobile |
| Texte défilant | `ScrollVelocity.jsx` | Framer Motion `useScroll` + `useVelocity` |
| Fond animé | `Threads.jsx` | WebGL avec ogl, courbes de Bézier |
| Robot 3D about | `spline-demo.jsx` | Scene Spline `.splinecode` locale |
| Curseur custom | `CustomCursor.jsx` | `mousemove` natif, lag CSS |

---

## Projets dans le carrousel

| # | Projet | Lien |
|---|--------|------|
| 1 | **Pennyworth** : agent qui transforme une intention en plan d'actions validées étape par étape | [pennyworth.aeonlabs.fr](https://pennyworth.aeonlabs.fr) |
| 2 | **Oracle : La Taupe** : agent OSINT, DNS, WHOIS, réseaux sociaux, surface d'attaque | [oracle.aeonlabs.fr](https://oracle.aeonlabs.fr) |
| 3 | **Sentinel Scanner** : 24 checks, 30 ports, 46 chemins sensibles, terminal animé | [cyber-web-scanner.aeonlabs.fr](https://cyber-web-scanner.aeonlabs.fr) |
| 4 | **HBntory** : gestionnaire d'inventaire IA pour Holberton, 3 microservices | [hbntory.aeonlabs.fr](https://hbntory.aeonlabs.fr) |
| 5 | **Cyber Cheatsheet** : 54 fiches, 43 badges, progression XP en vanilla JS | [cyber-cheatsheet.aeonlabs.fr](https://cyber-cheatsheet.aeonlabs.fr) |
| 6 | **AERIS** : analyse de risque EBIOS pour supply chain aéronautique | [aeris.aeonlabs.fr](https://aeris.aeonlabs.fr) |
| 7 | **ECO-AUDIT** : serious game anti-corruption, équipe de 9, méthode agile | [ecoaudit.aeonlabs.fr](https://ecoaudit.aeonlabs.fr) |
| 8 | **Fantôme du Ciel** : expérience de vol immersive, animations canvas | [fantome-du-ciel.aeonlabs.fr](https://fantome-du-ciel.aeonlabs.fr/index.html) |

---

## Stack

```
React 19 + Vite          Framework principal
Framer Motion            Animations scroll, parallax, entrées
Spline                   Robot 3D interactif (section About)
ogl                      WebGL background Threads
Lenis                    Scroll fluide
React Router DOM         Navigation SPA
Web3Forms                Formulaire de contact
```

---

## Lancer en local

```bash
npm install
npm run dev
# http://localhost:5173
```

```bash
npm run build    # Build production
npm run preview  # Prévisualiser le build
```

---

## Deploiement

VPS Chilemme, Nginx (SPA routing), Cloudflare proxy.

```bash
# Sur le VPS (/tmp/portfolio_ia) :
git fetch origin && git reset --hard origin/main
npm ci && npm run build
rm -rf /var/www/portfolio && cp -r dist /var/www/portfolio
```

> Cloudflare met en cache agressivement. Les vidéos hero sont nommées `hero-v2.webm` / `hero-v2.mp4` pour bypasser un cache invalide.

---

<div align="center">

Soufiane Filali · Holberton School Toulouse · Disponible en alternance 2026

[![GitHub](https://img.shields.io/badge/GitHub-Souf--F-181717?style=flat&logo=github)](https://github.com/Souf-F)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Soufiane_Filali-0A66C2?style=flat&logo=linkedin)](https://linkedin.com/in/soufiane-filali)

</div>
