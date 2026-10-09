import { WorksWheel } from "./works-wheel";

const WORKS = [
  {
    title: "Pennyworth",
    desc: "Majordome numérique : transforme une intention en langage naturel en plan d'actions concrètes. Rien ne s'exécute sans validation humaine, action par action.",
    image: "/projects/pennyworth.jpg",
    href: "https://pennyworth.aeonlabs.fr",
  },
  {
    title: "Oracle : La Taupe",
    desc: "Agent OSINT qui s'infiltre dans les données publiques pour produire du renseignement structuré : DNS, WHOIS, réseaux sociaux, surface d'attaque.",
    image: "/projects/oracle.jpg",
    href: "https://oracle.aeonlabs.fr",
  },
  {
    title: "Sentinel Scanner",
    desc: "Scanner de vulnérabilités web autonome : 24 checks, 30 ports, 46 chemins sensibles, scoring de risque en temps réel via terminal animé.",
    image: "/projects/sentinel.jpg",
    href: "https://cyber-web-scanner.aeonlabs.fr",
  },
  {
    title: "HBntory",
    desc: "Gestionnaire d'inventaire IA pour le campus Holberton. 3 microservices : API, produits et couche IA pour recommandations de réapprovisionnement.",
    image: "/projects/hbntory.jpg",
    href: "https://hbntory.aeonlabs.fr",
  },
  {
    title: "Cyber Cheatsheet",
    desc: "54 fiches interactives de cybersécurité en 12 catégories, 43 badges débloquables et progression par XP. Entièrement en vanilla JS.",
    image: "/projects/cybersheet.jpg",
    href: "https://cyber-cheatsheet.aeonlabs.fr/",
  },
  {
    title: "AERIS",
    desc: "Analyse de risque cyber pour la supply chain aéronautique. Méthode EBIOS Risk Manager, matrice 5x5, 9 actifs réels pré-chargés.",
    image: "/projects/aeris.jpg",
    href: "https://aeris.aeonlabs.fr/",
  },
  {
    title: "ECO-AUDIT",
    desc: "Serious game d'enquête sur la fraude en entreprise. Construit en équipe de 9 en méthode agile : bureau d'auditeur, dossiers confidentiels, indices cachés.",
    image: "/projects/ecoaudit.jpg",
    href: "https://ecoaudit.aeonlabs.fr/",
  },
  {
    title: "Fantôme du Ciel",
    desc: "Expérience de vol immersive et narrative. Animations canvas, transitions fluides, typographie expressive et ambiance aérienne historique.",
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
