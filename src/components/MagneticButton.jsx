import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/*
  Cursor magnetism: the element eases toward the pointer within its bounds,
  then springs back on leave. Disabled under reduced-motion.
*/
export default function MagneticButton({
  children,
  as = 'a',
  className = '',
  strength = 0.4,
  ...rest
}) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.a;

  const handleMove = (e) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'translate(0px, 0px)';
  };

  return (
    <Comp
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)', display: 'inline-flex' }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
