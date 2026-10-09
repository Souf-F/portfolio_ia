import { useState, useRef, useEffect, useCallback } from 'react';

const TRACKS = [
  { title: 'Neural Drift', src: '/music/musique3.mp3' },
  { title: 'Midnight Compile', src: '/music/musique0.mp3' },
  { title: 'Late Night Deploy', src: '/music/musique1.mp3' },
  { title: 'Quiet Loop', src: '/music/musique4.mp3' },
];

function IconPlay() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <polygon points="3,1 13,7 3,13" />
    </svg>
  );
}
function IconPause() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
      <rect x="2" y="1" width="4" height="12" rx="1" />
      <rect x="8" y="1" width="4" height="12" rx="1" />
    </svg>
  );
}
function IconPrev() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <polygon points="11,1 4,6 11,11" />
      <rect x="1" y="1" width="2" height="10" rx="1" />
    </svg>
  );
}
function IconNext() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
      <polygon points="1,1 8,6 1,11" />
      <rect x="9" y="1" width="2" height="10" rx="1" />
    </svg>
  );
}
function IconMusic() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function MusicPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [idx, setIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const pendingPlay = useRef(false);

  const tracks = TRACKS;
  const hasTrack = tracks.length > 0;

  const tick = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(a.currentTime);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (playing) rafRef.current = requestAnimationFrame(tick);
    else cancelAnimationFrame(rafRef.current);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, tick]);

  // Autoplay au démarrage — tente immédiatement, sinon attend le premier clic
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !hasTrack) return;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        const resume = () => {
          a.play().then(() => setPlaying(true)).catch(() => {});
        };
        document.addEventListener('click', resume, { once: true });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Quand idx change : on attend que React ait mis à jour src, puis on recharge + joue
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setDuration(0);
    a.load();
    if (pendingPlay.current) {
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      pendingPlay.current = false;
    }
  }, [idx]);

  const toggle = () => {
    if (!hasTrack) return;
    const a = audioRef.current;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const changeTrack = (n) => {
    pendingPlay.current = playing;
    setIdx(n);
    setProgress(0);
  };

  const prev = () => changeTrack((idx - 1 + tracks.length) % tracks.length);
  const next = () => changeTrack((idx + 1) % tracks.length);

  const seek = (e) => {
    const a = audioRef.current;
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    a.currentTime = x * duration;
    setProgress(a.currentTime);
  };

  const pct = duration ? (progress / duration) * 100 : 0;
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <>
      {hasTrack && (
        <audio
          ref={audioRef}
          src={tracks[idx]?.src}
          onLoadedMetadata={(e) => setDuration(e.target.duration)}
          onEnded={next}
        />
      )}

      <div style={{
        position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem',
      }}>
        {open && (
          <div style={{
            background: 'rgba(10,10,10,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '14px',
            padding: '1rem 1.1rem',
            width: '220px',
            display: 'flex', flexDirection: 'column', gap: '0.75rem',
          }}>
            {/* Titre */}
            <div style={{ overflow: 'hidden' }}>
              <div style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.65rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '0.2rem',
              }}>
                {playing ? 'En lecture' : 'En pause'}
              </div>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 500,
                color: '#f0f0f0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {hasTrack ? tracks[idx]?.title : 'Aucune piste'}
              </div>
            </div>

            {/* Progress bar */}
            <div
              onClick={seek}
              style={{
                height: '3px', background: 'rgba(255,255,255,0.1)',
                borderRadius: '99px', cursor: 'pointer', position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute', left: 0, top: 0, height: '100%',
                width: `${pct}%`, background: 'rgba(255,255,255,0.7)',
                borderRadius: '99px', transition: 'width 0.1s linear',
              }} />
            </div>

            {/* Temps */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono, monospace)' }}>
              <span>{fmt(progress)}</span>
              <span>{fmt(duration)}</span>
            </div>

            {/* Contrôles : prev — play/pause — next */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              {tracks.length > 1 && (
                <button onClick={prev} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                  <IconPrev />
                </button>
              )}
              <button
                onClick={toggle}
                disabled={!hasTrack}
                style={{
                  background: 'rgba(255,255,255,0.9)', color: '#000',
                  border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: hasTrack ? 'pointer' : 'not-allowed',
                  opacity: hasTrack ? 1 : 0.3,
                  flexShrink: 0,
                }}
              >
                {playing ? <IconPause /> : <IconPlay />}
              </button>
              {tracks.length > 1 && (
                <button onClick={next} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                  <IconNext />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bouton flottant */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            background: open ? 'rgba(255,255,255,0.15)' : 'rgba(30,30,30,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: `1px solid ${playing ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)'}`,
            borderRadius: '50%',
            width: '42px', height: '42px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: playing ? '#fff' : 'rgba(255,255,255,0.75)',
            boxShadow: playing ? '0 0 16px rgba(255,255,255,0.12)' : '0 2px 12px rgba(0,0,0,0.6)',
            transition: 'all 0.2s ease',
          }}
        >
          <IconMusic />
        </button>
      </div>
    </>
  );
}
