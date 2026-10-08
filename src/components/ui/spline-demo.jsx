import { SplineScene } from './spline-scene'
import { Spotlight } from './spotlight'

export function SplineSceneBasic() {
  return (
    <div style={{
      width: '100%', height: '100%',
      borderRadius: 12,
      border: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(0,0,0,0.96)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
    }}>
      <Spotlight size={300} />

      {/* Gauche — bio */}
      <div style={{
        flex: 1,
        padding: '3rem 3.5rem',
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '1rem',
        }}>
          01 — À propos
        </p>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)',
          fontWeight: 700,
          lineHeight: 1.08,
          color: '#f5f5f5',
          marginBottom: '1.3rem',
          letterSpacing: '-0.01em',
        }}>
          Soufiane Filali
        </h1>

        <p style={{ color: '#a1a1aa', lineHeight: 1.75, maxWidth: 380, marginBottom: '0.8rem', fontSize: '0.9rem' }}>
          Holberton School Toulouse. Je construis des solutions d'automatisation — des agents qui prennent des décisions, exécutent des tâches et livrent un résultat sans qu'on ait à intervenir.
        </p>
        <p style={{ color: '#52525b', lineHeight: 1.75, maxWidth: 380, fontSize: '0.9rem', marginBottom: '2rem' }}>
          Je cherche une alternance en 2026. Si tu as un process qui tourne encore à la main, on peut en parler.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            ['Formation', 'Holberton School Toulouse'],
            ['Niveau',    'RNCP Niveau 6'],
            ['Dispo',     'Alternance 2026'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem' }}>
              <span style={{ color: '#3f3f46', minWidth: 72, fontFamily: 'var(--font-mono)' }}>{k}</span>
              <span style={{ color: '#e4e4e7' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Droite — robot Spline */}
      <div style={{ flex: 1, position: 'relative', filter: 'brightness(1.35) contrast(1.05)' }}>
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
