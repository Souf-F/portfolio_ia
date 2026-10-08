import { useRef, useCallback } from 'react';

const DEPTHS = [60, 0, 40, 20]; // Z offset per card index — creates layering illusion

export default function ParallaxDepth({ children }) {
  const plateRef = useRef(null);
  const raf = useRef(null);
  const current = useRef({ rx: 0, ry: 0 });
  const target = useRef({ rx: 0, ry: 0 });

  const onMove = useCallback((e) => {
    const el = plateRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const nx = (e.clientX - cx) / (r.width / 2);   // -1 → +1
    const ny = (e.clientY - cy) / (r.height / 2);  // -1 → +1
    target.current = { rx: -ny * 9, ry: nx * 9 };  // max 9deg tilt
  }, []);

  const onLeave = useCallback(() => {
    target.current = { rx: 0, ry: 0 };
  }, []);

  const startLoop = useCallback(() => {
    if (raf.current) return;
    const loop = () => {
      const c = current.current;
      const t = target.current;
      c.rx += (t.rx - c.rx) * 0.08;
      c.ry += (t.ry - c.ry) * 0.08;
      if (plateRef.current) {
        plateRef.current.style.transform =
          `perspective(1100px) rotateX(${c.rx}deg) rotateY(${c.ry}deg)`;
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  }, []);

  const stopLoop = useCallback(() => {
    if (raf.current) { cancelAnimationFrame(raf.current); raf.current = null; }
  }, []);

  return (
    <div
      className="pd-scene"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={startLoop}
      onMouseOut={stopLoop}
    >
      <div className="pd-plate" ref={plateRef}>
        {Array.isArray(children)
          ? children.map((child, i) => (
              <div
                key={i}
                className="pd-card"
                style={{ '--z': `${DEPTHS[i] ?? 0}px` }}
              >
                {child}
              </div>
            ))
          : <div className="pd-card" style={{ '--z': '0px' }}>{children}</div>
        }
      </div>
    </div>
  );
}
