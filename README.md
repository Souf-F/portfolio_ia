# Portfolio agentic : Soufiane Filali

Portfolio personnel construit avec React + Vite. Agents autonomes, pipelines intelligents, full stack agentic.

Site : [aeonlabs.fr](https://aeonlabs.fr)

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Framework | React 19 + Vite |
| Animations | Framer Motion (scroll, parallax, entrées) |
| 3D robot | Spline (scene interactive About) |
| WebGL | ogl (background Threads animé) |
| Routing | React Router DOM |
| Scroll fluide | Lenis |
| Contact | Web3Forms |
| Musique | Lecteur audio intégré (autoplay premier interaction) |

## Sections

```
Hero
 Robot IA plein écran (vidéo WebM/MP4)
 Texte animé lettre par lettre derrière le robot
 Label : "Soufiane Filali / portfolio full stack agentic & automatisation"
 Navigation : GradientMenu (4 boutons)

About
 Scene Spline 3D interactive
 Bio défilable manuellement

Expertise
 Stack technique par catégorie
 Background WebGL animé

Projets
 Carrousel 3D (WorksWheel) avec 8 projets
 Zoom au clic, lien vers chaque projet en ligne

Contact
 Formulaire via Web3Forms
 Liens sociaux (GitHub, LinkedIn)
```

## Projets présentés

| Projet | Description |
|--------|-------------|
| Pennyworth | Agent IA : transforme une intention en plan d'actions validées étape par étape |
| Oracle : La Taupe | Agent OSINT : DNS, WHOIS, réseaux sociaux, surface d'attaque |
| Sentinel Scanner | Scanner de vulnérabilités web : 24 checks, 30 ports, 46 chemins sensibles |
| HBntory | Gestionnaire d'inventaire IA pour le campus Holberton (3 microservices) |
| Cyber Cheatsheet | 54 fiches interactives, 43 badges, progression XP en vanilla JS |
| AERIS | Analyse de risque cyber supply chain aéronautique (EBIOS Risk Manager) |
| ECO-AUDIT | Serious game anti-corruption, équipe de 9, méthode agile |
| Fantôme du Ciel | Expérience de vol immersive, animations canvas, typographie expressive |

## Lancer en local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

## Build production

```bash
npm run build
npm run preview
```

## Structure

```
src/
├── App.jsx                        # Layout principal, toutes les sections
├── App.css                        # Styles globaux
├── components/
│   ├── CustomCursor.jsx
│   ├── Threads.jsx
│   ├── SpotlightCard.jsx
│   ├── ScrollVelocity.jsx
│   └── BlurText.jsx
└── components/ui/
    ├── gradient-menu.jsx          # Navigation 4 boutons (2 taps sur mobile)
    ├── works-wheel.jsx            # Carrousel 3D projets
    ├── works-wheel-demo.jsx       # Données projets
    ├── spline-demo.jsx            # Scene About + bio
    ├── music-player.jsx           # Lecteur audio
    ├── page-loader.jsx            # Écran de chargement vidéo
    └── social-media.jsx           # Liens sociaux avec tooltip

public/
├── hero-v2.webm / hero-v2.mp4    # Vidéo robot hero
├── loader.mp4                     # Vidéo page de chargement
├── og-image.png                   # Image Open Graph (partage LinkedIn)
└── projects/                      # Visuels des projets
```

## Fonctionnalités notables

- **Page loader vidéo** : 5 secondes de vidéo robot avec barre de progression
- **Texte hero animé** : apparition lettre par lettre, cycle de 20 secondes, disparition douce
- **Musique** : autoplay déclenché sur la première interaction utilisateur
- **Carrousel projets** : snap automatique au scroll rapide, zoom 1.4x sur le projet actif
- **Mobile** : menu 2 taps (premier tap affiche le label, second navigue)
- **Open Graph** : titre et image configurés pour le partage LinkedIn

## Deploiement

Le site est déployé automatiquement via Hostinger sur [aeonlabs.fr](https://aeonlabs.fr).

Soufiane Filali · Holberton School Toulouse · Disponible en alternance 2026
