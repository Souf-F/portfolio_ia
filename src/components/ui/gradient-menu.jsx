import { useState, useEffect } from 'react';
import { IoPersonOutline, IoFolderOpenOutline, IoCodeSlashOutline, IoMailOutline } from 'react-icons/io5';

const menuItems = [
  { title: 'À propos',  href: '#about',     icon: <IoPersonOutline />,     gradientFrom: '#a955ff', gradientTo: '#ea51ff' },
  { title: 'Projets',   href: '#projects',  icon: <IoFolderOpenOutline />, gradientFrom: '#56CCF2', gradientTo: '#2F80ED' },
  { title: 'Stack',     href: '#expertise', icon: <IoCodeSlashOutline />,  gradientFrom: '#80FF72', gradientTo: '#7EE8FA' },
  { title: 'Contact',   href: '#contact',   icon: <IoMailOutline />,       gradientFrom: '#ffa9c6', gradientTo: '#f434e2' },
];

export default function GradientMenu() {
  const [openIdx, setOpenIdx] = useState(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  const handleClick = (e, idx) => {
    if (!isTouch) return;
    if (openIdx !== idx) {
      e.preventDefault();
      setOpenIdx(idx);
    }
    // second tap: openIdx === idx → navigate normalement
  };

  // Ferme si on tape en dehors du menu
  useEffect(() => {
    if (openIdx === null || !isTouch) return;
    const close = (e) => {
      if (!e.target.closest('.gradient-menu')) setOpenIdx(null);
    };
    const t = setTimeout(() => document.addEventListener('touchstart', close), 50);
    return () => { clearTimeout(t); document.removeEventListener('touchstart', close); };
  }, [openIdx, isTouch]);

  return (
    <ul className="gradient-menu">
      {menuItems.map(({ title, href, icon, gradientFrom, gradientTo }, idx) => (
        <li
          key={href}
          className={`gradient-menu-item group${openIdx === idx ? ' touch-open' : ''}`}
          style={{ '--gf': gradientFrom, '--gt': gradientTo }}
        >
          <a
            href={href}
            className="gradient-menu-link"
            onClick={(e) => handleClick(e, idx)}
          >
            <span className="gradient-menu-bg" />
            <span className="gradient-menu-glow" />
            <span className="gradient-menu-icon">{icon}</span>
            <span className="gradient-menu-label">{title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
