import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const ringRef = useRef(null);

  useEffect(() => {
    const fine   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    const ring = ringRef.current;
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    const onOver = (e) => { if (e.target.closest('a,button,[data-hover]')) ring.classList.add('is-hover'); };
    const onOut  = (e) => { if (e.target.closest('a,button,[data-hover]')) ring.classList.remove('is-hover'); };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver);
    document.addEventListener('pointerout', onOut);

    let raf;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
    };
    loop();
    document.body.classList.add('has-cursor');

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerout', onOut);
      document.body.classList.remove('has-cursor');
    };
  }, []);

  return <div ref={ringRef} className="c-ring" aria-hidden="true" />;
}
