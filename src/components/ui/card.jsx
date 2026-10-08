import { forwardRef } from 'react'

export const Card = forwardRef(({ className = '', style, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-white/[0.08] bg-black shadow-2xl ${className}`}
    style={style}
    {...props}
  />
))
Card.displayName = 'Card'
