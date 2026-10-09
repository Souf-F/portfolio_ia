"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const CARD_H = 0.38;
const CARD_MAX_W = 0.34;
const CARD_RATIO = 1.45;
const STEP = 40;
const DRUM = 2.22;
const LENS = 2.7;
const RING_R = 1.14;
const BOW = 1.82;
const TITLE = 0.124;
const INDEX = 0.04;
const CULL = 1.6;
const WHEEL_UNITS = 900;
const DRAG_UNITS = 420;
const SETTLE = 140;
const EASE = 0.12;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rad = (deg) => (deg * Math.PI) / 180;
const bowAt = (drumDeg, bow) => -bow * (1 - Math.cos(rad(drumDeg)));

function place(ringDeg, drumDeg, ringR, drumR, bow, m) {
  return (
    `translateX(${m * bowAt(drumDeg, bow)}px)` +
    ` rotateZ(${(1 - m) * ringDeg}deg) translateY(${-(1 - m) * ringR}px)` +
    ` rotateX(${m * drumDeg}deg) translateZ(${m * drumR}px)`
  );
}

export function WorksWheel({ items, label = "Works '26", action = "View", className, ...props }) {
  const stageRef = React.useRef(null);
  const wheelRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const labelRef = React.useRef(null);
  const titleRef = React.useRef(null);

  const turn = React.useRef(0);
  const target = React.useRef(0);
  const [active, setActive] = React.useState(0);
  const [stage, setStage] = React.useState({ w: 0, h: 0 });

  const count = items.length;
  const last = Math.max(count - 1, 0);

  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const read = () => setStage({ w: el.clientWidth, h: el.clientHeight });
    read();
    const ro = new ResizeObserver(read);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const metrics = React.useMemo(() => {
    const { w, h } = stage;
    const cardW = Math.min(h * CARD_H * CARD_RATIO, w * CARD_MAX_W);
    const cardH = cardW / CARD_RATIO;
    const drumR = cardH * DRUM;
    const ringR = cardH * RING_R;
    const ringScale = count
      ? clamp((((2 * Math.PI * ringR) / count) * 0.82) / (cardW || 1), 0.16, 1)
      : 1;
    return { cardW, cardH, ringR, ringScale, drumR, bow: cardH * BOW, depth: cardH * LENS, title: cardH * TITLE, index: cardH * INDEX };
  }, [stage, count]);

  React.useEffect(() => {
    if (!stage.h) return;
    let frame = 0;
    const { ringR, ringScale, drumR, bow } = metrics;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const gap = target.current - turn.current;
      if (Math.abs(gap) < 0.0005) turn.current = target.current;
      else turn.current += gap * (reduced ? 1 : EASE);
      const t = turn.current;
      const m = clamp(t, 0, 1);
      const pos = Math.max(0, t - 1);
      if (wheelRef.current) wheelRef.current.style.transform = `translateZ(${-m * drumR}px)`;
      for (let i = 0; i < count; i++) {
        const d = i - pos;
        const drumDeg = d * STEP;
        const card = cardRefs.current[i];
        if (card) {
          card.style.transform = place(d * (360 / count), drumDeg, ringR, drumR, bow, m);
          card.style.opacity = m > 0.5 && Math.abs(d) > CULL ? "0" : "1";
          card.style.zIndex = String(Math.round(100 - Math.abs(d) * 2));
        }
        const face = card?.firstElementChild;
        if (face) face.style.transform = `scale(${lerp(ringScale, 1.4, m)})`;
      }
      if (labelRef.current) labelRef.current.style.opacity = String(1 - m);
      if (titleRef.current) titleRef.current.style.opacity = String(m);
      const near = clamp(Math.round(pos), 0, last);
      setActive((prev) => (prev === near ? prev : near));
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [metrics, stage.h, count, last, reduced]);

  const to = React.useCallback((next) => { target.current = clamp(next, 0, last + 1); }, [last]);

  const snapping = React.useRef(false);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onWheel = (event) => {
      // Pendant un snap en cours : bloquer le scroll page
      if (snapping.current) { event.preventDefault(); return; }

      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;

      // Section totalement hors vue : laisser la page scroller librement
      if (rect.bottom < 0 || rect.top > vh) return;

      // Section arrive par le bas en scrollant vers le bas : snap pour l'ancrer en haut
      if (rect.top > 4 && event.deltaY > 0) {
        event.preventDefault();
        snapping.current = true;
        window.scrollTo({ top: window.scrollY + rect.top, behavior: 'smooth' });
        setTimeout(() => { snapping.current = false; }, 900);
        return;
      }

      // Section ancrée (top ≈ 0) ou carousel en cours
      const inProgress = turn.current > 0.05 || target.current > 0.05;
      if (rect.top > -8 || inProgress) {
        if (target.current <= 0.05 && event.deltaY < 0) return;
        if (target.current >= last + 0.95 && event.deltaY > 0) return;
        const next = target.current + event.deltaY / WHEEL_UNITS;
        if (next > 0 && next < last + 1) event.preventDefault();
        to(next);
        window.clearTimeout(settling.current);
        settling.current = window.setTimeout(() => to(Math.round(target.current)), SETTLE);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => { window.removeEventListener('wheel', onWheel); window.clearTimeout(settling.current); };
  }, [to, last]);

  const drag = React.useRef(null);
  const dragStart = React.useRef(null);
  const touchStartY = React.useRef(null);
  const lastTouchY = React.useRef(null);
  const settling = React.useRef(0);

  // Mobile : verrouille le scroll page pendant la navigation carousel
  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
      lastTouchY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      const rect = el.getBoundingClientRect();
      const vh   = window.innerHeight;
      if (rect.bottom < 0 || rect.top > vh) return;
      const inProgress = turn.current > 0.05 || target.current > 0.05;
      if (rect.top > 8 && !inProgress) return;
      const dy = touchStartY.current !== null ? touchStartY.current - e.touches[0].clientY : 0;
      if (target.current <= 0.05 && dy < 0) return;
      if (target.current >= last + 0.95 && dy > 0) return;
      e.preventDefault();
      if (lastTouchY.current !== null) {
        const delta = lastTouchY.current - e.touches[0].clientY;
        to(target.current + delta / DRAG_UNITS);
      }
      lastTouchY.current = e.touches[0].clientY;
    };
    const onTouchEnd = () => {
      lastTouchY.current = null;
      window.clearTimeout(settling.current);
      settling.current = window.setTimeout(() => to(Math.round(target.current)), SETTLE);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [last]);

  return (
    <section
      aria-label={label}
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: '24rem', overflow: 'hidden', userSelect: 'none', background: '#000', color: 'var(--fg)' }}
      {...props}
    >
      <div
        ref={stageRef}
        tabIndex={0}
        role="listbox"
        aria-label={label}
        aria-activedescendant={`works-wheel-${active}`}
        style={{ position: 'absolute', inset: 0, outline: 'none', perspective: `${metrics.depth}px`, cursor: 'grab' }}
        onPointerDown={(e) => { drag.current = e.clientY; dragStart.current = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); e.currentTarget.style.cursor = 'grabbing'; }}
        onPointerMove={(e) => { if (drag.current === null) return; to(target.current + (drag.current - e.clientY) / DRAG_UNITS); drag.current = e.clientY; }}
        onPointerUp={(e) => {
          const moved = Math.abs(e.clientY - (dragStart.current ?? e.clientY));
          if (moved < 5 && items[active]?.href) window.open(items[active].href, '_blank', 'noopener,noreferrer');
          drag.current = null; dragStart.current = null;
          if (target.current > 1) to(Math.round(target.current));
          e.currentTarget.style.cursor = 'grab';
        }}
        onKeyDown={(e) => { if (e.key === "ArrowDown") to(Math.round(target.current) + 1); else if (e.key === "ArrowUp") to(Math.round(target.current) - 1); else return; e.preventDefault(); }}
      >
        <div ref={wheelRef} style={{ position: 'absolute', top: '50%', left: '50%', transformStyle: 'preserve-3d' }}>
          {items.map((item, i) => {
            const Tag = item.href ? "a" : "div";
            return (
              <React.Fragment key={item.title}>
                <Tag
                  id={`works-wheel-${i}`}
                  role="option"
                  aria-selected={i === active}
                  href={item.href}
                  target={item.href ? "_blank" : undefined}
                  rel={item.href ? "noopener noreferrer" : undefined}
                  ref={(node) => { cardRefs.current[i] = node; }}
                  style={{
                    position: 'absolute',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    width: metrics.cardW,
                    height: metrics.cardH,
                    marginLeft: -metrics.cardW / 2,
                    marginTop: -metrics.cardH / 2,
                    textDecoration: 'none',
                  }}
                >
                  <span style={{
                    position: 'relative', display: 'block', width: '100%', height: '100%',
                    overflow: 'hidden', borderRadius: 10,
                    boxShadow: '0 18px 40px -18px rgba(0,0,0,0.4)',
                    background: '#111',
                  }}>
                    {item.video ? (
                      <video src={item.video} autoPlay muted loop playsInline draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }} />
                    ) : (
                      <img src={item.image} alt={item.title} draggable={false} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#0a0a0a' }} />
                    )}
                    {action && item.href ? (
                      <span style={{
                        position: 'absolute', right: 10, bottom: 10,
                        display: 'flex', alignItems: 'center', gap: 4,
                        background: 'rgba(0,0,0,0.75)', color: '#fff',
                        borderRadius: 999, padding: '4px 10px', fontSize: '0.68rem',
                        backdropFilter: 'blur(6px)',
                      }}>
                        <svg viewBox="0 0 12 12" style={{ width: 10, height: 10 }} aria-hidden="true">
                          <path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {action}
                      </span>
                    ) : null}
                  </span>
                </Tag>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div ref={labelRef} style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: metrics.title, letterSpacing: '-0.02em', pointerEvents: 'none', color: 'var(--fg)' }}>
        {label}
      </div>
      <div ref={titleRef} style={{ position: 'absolute', bottom: '8%', left: '8%', pointerEvents: 'none', opacity: 0, maxWidth: '38%' }}>
        <div style={{ fontSize: Math.max(metrics.title, 15), letterSpacing: '-0.02em', fontWeight: 600, color: 'var(--fg)', lineHeight: 1.2 }}>
          {items[active]?.title}
        </div>
        {items[active]?.desc && (
          <div style={{ fontSize: Math.max(metrics.title * 0.52, 11), color: 'rgba(255,255,255,0.5)', marginTop: '0.45em', lineHeight: 1.45 }}>
            {items[active].desc}
          </div>
        )}
      </div>

      <ol className="ww-index" style={{ position: 'absolute', top: '7.5%', right: '2.5%', textAlign: 'right', lineHeight: 1.75, fontSize: metrics.index, listStyle: 'none', margin: 0, padding: 0, color: 'var(--muted-fg, #555)' }}>
        {items.map((item, i) => (
          <li key={item.title}>
            <button type="button" onClick={() => to(i + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: i === active ? 600 : 400, color: i === active ? 'var(--fg)' : 'inherit', outline: 'none', fontSize: 'inherit' }}>
              {item.title}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WorksWheel;
