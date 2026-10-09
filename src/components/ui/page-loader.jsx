import { useEffect, useRef, useState } from 'react';

const DURATION = 5000; // ms — durée de la vidéo

export default function PageLoader({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const startRef = useRef(null);
  const rafRef  = useRef(null);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setProgress(100);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => onDone(), 700);
    }, 250);
  };

  useEffect(() => {
    // Bloque le scroll pendant le chargement
    document.body.style.overflow = 'hidden';
    startRef.current = performance.now();

    const tick = (now) => {
      const p = Math.min(((now - startRef.current) / DURATION) * 100, 100);
      setProgress(p);
      if (p < 100) rafRef.current = requestAnimationFrame(tick);
      else finish();
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.body.style.overflow = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: '#000',
      opacity: fading ? 0 : 1,
      transition: fading ? 'opacity 0.7s cubic-bezier(0.4,0,0.2,1)' : 'none',
      pointerEvents: fading ? 'none' : 'all',
    }}>
      {/* Vidéo full screen */}
      <video
        src="/loader.mp4"
        autoPlay
        muted
        playsInline
        onEnded={finish}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Barre de chargement — positionnée au niveau du doigt sur la vitre
          Ajuste `top` si besoin après avoir vu la vidéo (valeur actuelle : 64%) */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.55rem',
        pointerEvents: 'none',
        userSelect: 'none',
      }}>
        {/* Label "Chargement" + pourcentage */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '240px',
        }}>
          <span style={{
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}>
            Chargement
          </span>
          <span style={{
            fontFamily: '"JetBrains Mono", "Courier New", monospace',
            fontSize: '0.58rem',
            letterSpacing: '0.08em',
            color: 'rgba(255,255,255,0.3)',
          }}>
            {Math.round(progress)}%
          </span>
        </div>

        {/* Track */}
        <div style={{
          width: '240px',
          height: '2px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '99px',
          overflow: 'hidden',
        }}>
          {/* Fill */}
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'rgba(255,255,255,0.85)',
            borderRadius: '99px',
            boxShadow: '0 0 8px rgba(255,255,255,0.5)',
            transition: 'width 0.08s linear',
          }} />
        </div>
      </div>
    </div>
  );
}
