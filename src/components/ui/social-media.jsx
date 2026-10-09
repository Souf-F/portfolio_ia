import React from 'react';

const SocialTooltip = React.forwardRef(({ className = '', items = [], ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2.5rem' }}
      {...props}
    >
      {items.map((item, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {item.tooltip}
          </span>
          <div style={{ position: 'relative' }} className="social-tooltip-item">
            <a
              href={item.href}
              aria-label={item.ariaLabel}
              target={item.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#1a1a1a',
                border: '1px solid rgba(255,255,255,0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
                textDecoration: 'none',
              }}
              className={`social-tooltip-link${item.keepColor ? ' social-keep-color' : ''}`}
            >
              <span
                className="social-tooltip-fill"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: 0,
                  backgroundColor: item.color,
                  transition: 'height 0.3s ease',
                }}
              />
              {item.icon ? (
                <span className="social-tooltip-icon" style={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, color: item.iconColor || '#fff',
                  transition: 'color 0.3s ease',
                }}>
                  {item.icon}
                </span>
              ) : (
                <img
                  src={item.svgUrl}
                  alt={item.ariaLabel}
                  style={{
                    position: 'relative', zIndex: 1,
                    width: 28, height: 28, objectFit: 'contain',
                    filter: item.keepColor ? 'none' : 'brightness(0) invert(1)',
                    transition: 'filter 0.3s ease',
                  }}
                  className="social-tooltip-icon"
                />
              )}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
});

SocialTooltip.displayName = 'SocialTooltip';
export { SocialTooltip };
export default SocialTooltip;
