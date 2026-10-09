import { SplineScene } from './spline-scene'
import { Spotlight } from './spotlight'

export function SplineSceneBasic() {
  return (
    <div className="spline-card">
      <Spotlight size={300} />

      {/* Gauche — bio */}
      <div className="spline-bio">
        <p className="spline-label">À propos</p>

        <h1 className="spline-name">Soufiane Filali</h1>

        <p className="spline-desc">
          Holberton School Toulouse. Je construis des solutions d'automatisation : des agents qui prennent des décisions, exécutent des tâches et livrent un résultat sans qu'on ait à intervenir.
        </p>
        <p className="spline-conviction">
          Je cherche une alternance en 2026. Si tu as un process qui tourne encore à la main, on peut en parler.
        </p>

        <div className="spline-meta">
          {[
            ['Formation', 'Holberton School Toulouse'],
            ['Niveau',    'RNCP Niveau 6'],
            ['Dispo',     'Alternance 2026'],
          ].map(([k, v]) => (
            <div key={k} className="spline-meta-row">
              <span className="spline-meta-key">{k}</span>
              <span className="spline-meta-val">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Droite — robot Spline */}
      <div className="spline-robot">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
