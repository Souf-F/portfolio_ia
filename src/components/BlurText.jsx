import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/*
  RevealText — a fresco unveiling. Each word rises from behind a
  clip mask as it enters view, like text emerging on gallery stone.
  Exported as default (name kept for existing imports).

  Props:
    text     — string to reveal
    as       — wrapper element (span | h1 | h2 | p ...)
    delay    — start offset (s)
    stagger  — per-word delay (s)
    duration — per-word duration (s)
*/
export default function BlurText({
  text = '',
  delay = 0,
  stagger = 0.05,
  duration = 0.9,
  className = '',
  once = true,
  as = 'span',
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: '-60px' });
  const reduce = useReducedMotion();
  const words = text.split(' ');

  const Wrapper = motion[as] || motion.span;

  if (reduce) {
    return <span ref={ref} className={className}>{text}</span>;
  }

  return (
    <Wrapper ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
        >
          <motion.span
            style={{ display: 'inline-block', marginRight: '0.26em', willChange: 'transform' }}
            initial={{ y: '110%' }}
            animate={inView ? { y: '0%' } : {}}
            transition={{
              duration,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}
