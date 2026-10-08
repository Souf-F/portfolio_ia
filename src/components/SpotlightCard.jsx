import { useRef } from 'react';

export default function SpotlightCard({ children, className = '', color = 'rgba(0,200,83,0.14)' }) {
  const ref = useRef(null);
  const raf = useRef(0);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', `${e.clientX - r.left}px`);
      el.style.setProperty('--sy', `${e.clientY - r.top}px`);
    });
  };

  const onEnter = () => ref.current?.style.setProperty('--so', '1');
  const onLeave = () => ref.current?.style.setProperty('--so', '0');

  return (
    <div
      ref={ref}
      className={`scard ${className}`}
      style={{ '--sc': color }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="scard-glow" aria-hidden="true" />
      <div className="scard-body">{children}</div>
    </div>
  );
}
