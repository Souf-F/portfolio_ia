---
name: project-portfolio-tech
description: Décisions techniques du portfolio — stack, code-splitting Three.js, contraintes client, Web3Forms
metadata:
  type: project
---

Portfolio perso de Soufiane Filali (étudiant Holberton Toulouse, cyber/dev, alternance 2026). Dossier: racine du projet portfolio_agentic.

## Stack imposée
- React 19 + Vite 8, JSX (**pas** TypeScript), **Vanilla CSS** (pas Tailwind).
- `framer-motion` (scroll/reveals), `three` ^0.186 (3D hero), `lucide-react` dispo mais icônes évitées (direction typographique).

**Why:** Contraintes explicites du client pour rester cohérent avec ses autres projets et sa maîtrise vanilla.

## Composants (src/components/)
- `ThreeScene.jsx` — sculpture hero, **lazy-loaded** via React.lazy + Suspense dans App.jsx.
- `CustomCursor.jsx` — curseur or (ring+dot), désactivé touch/reduced-motion.
- `FlipCard.jsx` — carte 3D bio/stack (hover + tap/Enter, a11y role=button).
- `SpotlightCard.jsx` — export gardé mais devenu **TiltCard** (tilt 3D plinthe, pas glow). Ne pas se fier au nom.
- `BlurText.jsx` — export gardé mais devenu **RevealText** (masque clip slide-up par mot). Importé `as RevealText`.
- `MagneticButton.jsx` — inchangé, restylé via `.btn-gold`.

**How to apply:** Si on réécrit ces composants, garder les noms d'export existants pour ne pas casser les imports.

## Performance
- Three.js code-split: bundle principal 367 kB (116 kB gz), chunk ThreeScene 538 kB (134 kB gz) chargé seulement au hero. Poster CSS peint immédiatement.
- **Why:** Éviter un bundle monolithique 904 kB qui bloquait le LCP.

## Contact
- Web3Forms, access_key `58c39c33-d27a-43fe-8f17-84710bf49a76`, honeypot `botcheck`, fallback mailto sfecom.31000@gmail.com.

## Liens réels (ne pas inventer)
- GitHub github.com/Souf-F · LinkedIn linkedin.com/in/soufiane-filali-dev
- Projets: Sentinel Scanner, Cyber Cheatsheet (cyber-cheatsheet.aeonlabs.fr), AERIS (aeris.aeonlabs.fr), ECO-AUDIT (ecoaudit.aeonlabs.fr).

Voir [[art-direction-musee]] pour le système visuel.
