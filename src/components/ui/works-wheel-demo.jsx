import { WorksWheel } from "./works-wheel";

const WORKS = [
  {
    title: "Pennyworth",
    desc: "Agent de gestion financière — analyse et catégorise tes dépenses automatiquement.",
    image: "/projects/pennyworth.jpg",
    href: "https://pennyworth.aeonlabs.fr",
  },
  {
    title: "Oracle — La Taupe",
    desc: "Jeu de déduction multijoueur avec IA intégrée comme joueur adversaire.",
    image: "/projects/oracle.jpg",
    href: "https://oracle.aeonlabs.fr",
  },
  {
    title: "Sentinel Scanner",
    desc: "Scanner de vulnérabilités web : 24 checks, 30 ports, terminal animé avec scoring.",
    image: "/projects/sentinel.jpg",
    href: "https://cyber-web-scanner.aeonlabs.fr",
  },
  {
    title: "HBntory",
    desc: "Gestionnaire d'inventaire interne pour le campus Holberton Toulouse.",
    image: "/projects/hbntory.jpg",
    href: "https://hbntory.aeonlabs.fr",
  },
  {
    title: "Cyber Cheatsheet",
    desc: "54 fiches techniques de cybersécurité interactives avec 43 badges de progression.",
    image: "/projects/cybersheet.jpg",
    href: "https://cyber-cheatsheet.aeonlabs.fr/",
  },
  {
    title: "AERIS",
    desc: "Assistant météo intelligent — analyse les conditions et génère des recommandations automatisées.",
    image: "/projects/aeris.jpg",
    href: "https://aeris.aeonlabs.fr/",
  },
  {
    title: "ECO-AUDIT",
    desc: "Outil d'audit environnemental automatisé pour identifier l'empreinte carbone d'une entreprise.",
    image: "/projects/ecoaudit.jpg",
    href: "https://ecoaudit.aeonlabs.fr/",
  },
  {
    title: "Fantôme du Ciel",
    desc: "Simulation de vol historique — incarnez un pilote fantôme de la Seconde Guerre mondiale.",
    image: "/projects/fantome.jpg",
    href: "https://fantome-du-ciel.aeonlabs.fr/index.html",
  },
];

export default function WorksWheelDemo() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <WorksWheel items={WORKS} label="Projets" action="Voir le projet" />
    </div>
  );
}
