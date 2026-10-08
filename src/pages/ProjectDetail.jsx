import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PROJECTS_DETAIL } from '../data/projects';
import '../pages/ProjectDetail.css';

function ArrowLeft() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS_DETAIL.find(p => p.id === id);

  if (!project) {
    return (
      <div className="pd-not-found">
        <p>Projet introuvable.</p>
        <button onClick={() => navigate('/')}>Retour</button>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <motion.button
        className="pd-back"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ArrowLeft /> Retour
      </motion.button>

      {/* Titre + vidéo côte à côte */}
      <div className="pd-hero">
        <motion.div
          className="pd-meta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="pd-num">{project.no}</span>
          <h1 className="pd-title">{project.title}</h1>
          <p className="pd-domain">{project.domain}</p>
          <div className="pd-tags">
            {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
          <div className="pd-links">
            {project.gh && (
              <a href={project.gh} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                GitHub
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Voir le site
              </a>
            )}
          </div>
        </motion.div>

        {project.video && (
          <motion.div
            className="pd-preview"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <video
              className="pd-video"
              src={project.video}
              autoPlay
              muted
              loop
              playsInline
              onContextMenu={e => e.preventDefault()}
              controlsList="nodownload"
            />
          </motion.div>
        )}
      </div>

      {/* Textes */}
      <div className="pd-body">
        <motion.section
          className="pd-section"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="pd-section-num">01</span>
          <h2>L'idée</h2>
          <p>{project.idea}</p>
        </motion.section>

        <motion.section
          className="pd-section"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <span className="pd-section-num">02</span>
          <h2>Comment je l'ai construit</h2>
          <p>{project.how}</p>
        </motion.section>

        <motion.section
          className="pd-section"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="pd-section-num">03</span>
          <h2>Ce que ca apporte</h2>
          <p>{project.impact}</p>
        </motion.section>
      </div>
    </div>
  );
}
