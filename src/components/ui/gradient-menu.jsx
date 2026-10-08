import { IoPersonOutline, IoFolderOpenOutline, IoCodeSlashOutline, IoMailOutline } from 'react-icons/io5';

const menuItems = [
  { title: 'À propos',        href: '#about',     icon: <IoPersonOutline />,       gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'Projets',         href: '#projects',  icon: <IoFolderOpenOutline />,   gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'Stack',           href: '#expertise', icon: <IoCodeSlashOutline />,    gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { title: 'Contact',         href: '#contact',   icon: <IoMailOutline />,         gradientFrom: '#ffa9c6', gradientTo: '#f434e2' },
];

export default function GradientMenu() {
  return (
    <ul className="gradient-menu">
      {menuItems.map(({ title, href, icon, gradientFrom, gradientTo }) => (
        <li
          key={href}
          className="gradient-menu-item group"
          style={{ '--gf': gradientFrom, '--gt': gradientTo }}
        >
          <a href={href} className="gradient-menu-link">
            {/* Gradient bg on hover */}
            <span className="gradient-menu-bg" />
            {/* Blur glow */}
            <span className="gradient-menu-glow" />
            {/* Icon */}
            <span className="gradient-menu-icon">{icon}</span>
            {/* Label */}
            <span className="gradient-menu-label">{title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
