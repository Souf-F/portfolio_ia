import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const spring = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({ imageSrc, altText = '', captionText = '', children, onClick }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), spring);
  const rotateY = useSpring(useMotionValue(0), spring);
  const scale = useSpring(1, spring);
  const opacity = useSpring(0);
  const [lastY, setLastY] = useState(0);
  const rotateFigcaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });

  function handleMouse(e) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const ox = e.clientX - rect.left - rect.width / 2;
    const oy = e.clientY - rect.top - rect.height / 2;
    rotateX.set((oy / (rect.height / 2)) * -10);
    rotateY.set((ox / (rect.width / 2)) * 10);
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
    rotateFigcaption.set(-(oy - lastY) * 0.6);
    setLastY(oy);
  }

  function handleEnter() { scale.set(1.04); opacity.set(1); }
  function handleLeave() {
    opacity.set(0); scale.set(1);
    rotateX.set(0); rotateY.set(0); rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="tc-figure"
      onMouseMove={handleMouse}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <motion.div
        className="tc-inner"
        style={{ rotateX, rotateY, scale }}
      >
        {imageSrc && (
          <div className="tc-img-wrap">
            <img src={imageSrc} alt={altText} className="tc-img" />
            <div className="tc-img-overlay" />
          </div>
        )}
        <div className="tc-content">{children}</div>
      </motion.div>

      {captionText && (
        <motion.figcaption className="tc-caption" style={{ x, y, opacity, rotate: rotateFigcaption }}>
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
