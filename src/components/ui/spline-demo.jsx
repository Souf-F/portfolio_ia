import { SplineScene } from './spline-scene'
import { Spotlight } from './spotlight'

const BIO_LINES = [
  "Je m'appelle Soufiane Filali, étudiant développeur à Holberton School Toulouse, en spécialisation full stack agentic & solutions d'automatisation.",
  "En 2026 j'ai construit des outils concrets, des agents autonomes et des pipelines intelligents qui font le travail sans intervention humaine.",
  "Des agents qui raisonnent, décident et agissent sans supervision constante. Des systèmes qui transforment une intention en résultat.",
  "Le monde de demain tourne sur des systèmes automatisés. Je construis les briques de ce monde.",
  "Disponible en alternance 2026. Si tu as un process qui tourne encore à la main, je peux le rendre autonome.",
];

export function SplineSceneBasic() {
  return (
    <div className="spline-card">
      <Spotlight size={300} />

      {/* Gauche : bio */}
      <div className="spline-bio">
        <p className="spline-label">À propos</p>
        <h1 className="spline-name">Soufiane Filali</h1>

        <div className="bio-scroll-wrap">
          <div className="bio-scroll-inner">
            {BIO_LINES.map((line, i) => (
              <p key={i} className="bio-scroll-line">{line}</p>
            ))}
          </div>
        </div>

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

      {/* Droite : robot Spline */}
      <div className="spline-robot">
        <SplineScene
          scene="/robot.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
