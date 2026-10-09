import { SplineScene } from './spline-scene'
import { Spotlight } from './spotlight'

const BIO_LINES = [
  "Je m'appelle Soufiane Filali, étudiant développeur à Holberton School Toulouse, en spécialisation cybersécurité.",
  "En 2026, j'ai construit des outils qui font le travail à la place de l'humain.",
  "Sentinel Scanner audite une app web en autonomie : 24 checks, 30 ports, scoring de risque complet, terminal animé en temps réel.",
  "Pennyworth orchestre des conversations avec une IA contextuelle. Pas un chatbot, un vrai interlocuteur qui raisonne et agit.",
  "Oracle infiltre les données publiques et produit du renseignement structuré en quelques secondes, là où un humain mettrait des heures.",
  "Cyber Cheatsheet rassemble 54 fiches interactives de cybersécurité avec un système de progression par XP et 43 badges débloquables.",
  "Je me spécialise dans l'agentic. Pas l'IA comme buzzword. L'IA comme moteur d'exécution.",
  "Des agents qui raisonnent, décident et agissent sans supervision constante. Des pipelines qui transforment une intention en résultat concret.",
  "Le monde de demain tourne sur des systèmes automatisés. Je construis les briques de ce monde.",
  "Disponible en alternance 2026. Si tu as un process qui tourne encore à la main, je peux le rendre autonome.",
];

export function SplineSceneBasic() {
  const content = [...BIO_LINES, ...BIO_LINES];

  return (
    <div className="spline-card">
      <Spotlight size={300} />

      {/* Gauche : bio défilante */}
      <div className="spline-bio">
        <p className="spline-label">À propos</p>
        <h1 className="spline-name">Soufiane Filali</h1>

        <div className="bio-scroll-wrap">
          <div className="bio-scroll-inner">
            {content.map((line, i) => (
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
