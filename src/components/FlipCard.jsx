import { useState } from 'react';

/*
  FlipCard — a 3D museum placard that turns on hover (pointer) or
  tap/Enter (touch + keyboard). Recto: biography. Verso: the stack.
  The flip is a real Y-axis rotation with preserved perspective.
*/
export default function FlipCard({ front, back }) {
  const [flipped, setFlipped] = useState(false);

  const toggle = () => setFlipped((v) => !v);
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div
      className={`flipcard ${flipped ? 'is-flipped' : ''}`}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={toggle}
      onKeyDown={onKey}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      aria-label="Carte biographie. Retourner pour voir la stack technique."
      data-cursor="hover"
    >
      <div className="flipcard-inner">
        <div className="flipcard-face flipcard-front">{front}</div>
        <div className="flipcard-face flipcard-back">{back}</div>
      </div>
    </div>
  );
}
