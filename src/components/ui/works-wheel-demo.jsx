import { WorksWheel } from "./works-wheel";

const WORKS = [
  {
    title: "Pennyworth",
    image: "/projects/pennyworth.jpg",
    href: "https://pennyworth.aeonlabs.fr",
  },
  {
    title: "Oracle — La Taupe",
    image: "/projects/oracle.jpg",
    href: "https://oracle.aeonlabs.fr",
  },
  {
    title: "Sentinel Scanner",
    image: "/projects/sentinel.jpg",
    href: "https://cyber-web-scanner.aeonlabs.fr",
  },
  {
    title: "HBntory",
    image: "/projects/hbntory.jpg",
    href: "https://hbntory.aeonlabs.fr",
  },
  {
    title: "Cyber Cheatsheet",
    image: "/projects/cybersheet.jpg",
    href: "https://cyber-cheatsheet.aeonlabs.fr/",
  },
  {
    title: "AERIS",
    image: "/projects/aeris.jpg",
    href: "https://aeris.aeonlabs.fr/",
  },
  {
    title: "ECO-AUDIT",
    image: "/projects/ecoaudit.jpg",
    href: "https://ecoaudit.aeonlabs.fr/",
  },
  {
    title: "Fantôme du Ciel",
    image: "/projects/fantome.jpg",
    href: "https://fantome-du-ciel.aeonlabs.fr/index.html",
  },
];

export default function WorksWheelDemo() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <WorksWheel items={WORKS} label="Projets" action="Voir" />
    </div>
  );
}
