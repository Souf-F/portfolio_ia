---
name: art-direction-musee
description: Direction artistique "Le Musée Filali" — palette ivoire/or, Cormorant Garamond, sculpture 3D, motion museum
metadata:
  type: project
---

Le portfolio de Soufiane Filali a été rebooté en direction artistique "musée de luxe" (Louvre × Loewe/Hermès). Remplace l'ancien thème dark/indigo.

**Why:** Le client voulait un effet "wow" immédiat, des piliers/salles de musée, typo ancienne mais chic, 3D dramatique. Niveau visé Awwwards SOTD.

**How to apply:** Tout nouveau composant/section doit respecter ce système. Ne jamais réintroduire de dark theme ou d'indigo.

## Palette (tokens dans src/index.css)
- `--ivory #FAF8F3` fond dominant, `--parchment #F2EDE4` surface secondaire
- `--surface #FFFFFF` panneaux surélevés (plinthes, cartes)
- `--ink #1A1814` texte (near-black chaud, jamais #000), `--ink-soft`, `--ink-faint`
- `--gold #C9A96E` accent UNIQUE (traits, soulignés, chiffres, rims), `--gold-deep #A8894E` hover
- `--line #E4DCCE` hairlines. Ombres longues/chaudes: `--shadow-plinth/raise/lift`

## Typographie
- Display/titres: **Cormorant Garamond** (weight 300, souvent italic). Nom hero en `clamp(4.2rem,15vw,17rem)`.
- Corps: **DM Sans**. Labels/mono/eyebrows: **Inconsolata** (uppercase, letter-spacing .2-.28em, gold).
- Classe `.eyebrow` = label mono doré réutilisable.

## 3D (src/components/ThreeScene.jsx)
- Icosaèdre facetté marbre `#F6F2EA` flatShading + edges dorés (LineSegments opacity .35).
- Lumière: key chaude dorée `0xffdca8`, rim froid `0xdfe6f0`, ACESFilmic, exposure 1.05, PCFSoftShadow.
- Rotation lente, parallax caméra vers pointer, IntersectionObserver pause hors-écran, DPR cap 2.
- Dégrade en poster CSS (`.hero-poster` radial gold) sous reduced-motion / no-WebGL.

## Motion
- Easing museum `cubic-bezier(0.16,1,0.3,1)`. Reveals texte = masque clip + slide-up par mot ([[project-portfolio-tech]] RevealText).
- Curseur or custom (ring + dot), grossit sur `[data-cursor="hover"]`, a, button.
- Chiffres de salle romains (I-IV) en filigrane Cormorant italic 30vw opacity .04, parallax scroll.
- Cartes projets = plinthes tilt 3D (perspective 1400px), colonnes staggerées (asymétrie éditoriale).

## Structure
Hero → 4 "Salles" (I À propos + FlipCard bio/stack, II Métier/stack éditorial, III Œuvres/projets tilt, IV Contact). Dividers `.room-divider` avec segment doré. Header monogramme "SF" + nav Cormorant, shrink au scroll.
