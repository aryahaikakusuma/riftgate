'use client'
import { DOMAINS } from '@/lib/mock/data'

// SVG-based visual placeholder for card art. Colored by domain, stylized by type.
export default function CardArt({ card, size = 'md' }) {
  const domain = DOMAINS.find(d => d.id === card.domain) || DOMAINS[4]
  const c1 = `#${domain.hex}`

  const initials = (card.legend || card.name).split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="relative w-full h-full overflow-hidden rounded-md">
      <svg viewBox="0 0 200 280" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
        <defs>
          <linearGradient id={`bg-${card.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={c1} stopOpacity="0.85" />
            <stop offset="55%" stopColor="#1a1a1a" stopOpacity="1" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="1" />
          </linearGradient>
          <radialGradient id={`glow-${card.id}`} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c1} stopOpacity="0" />
          </radialGradient>
          <pattern id={`p-${card.id}`} patternUnits="userSpaceOnUse" width="14" height="14" patternTransform="rotate(30)">
            <path d="M0 7 L14 7" stroke={c1} strokeOpacity="0.08" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="200" height="280" fill={`url(#bg-${card.id})`} />
        <rect width="200" height="280" fill={`url(#p-${card.id})`} />
        <circle cx="100" cy="110" r="75" fill={`url(#glow-${card.id})`} />
        {/* rune icon */}
        <g transform="translate(100,105)">
          <polygon points="0,-40 34,-20 34,20 0,40 -34,20 -34,-20" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.7" />
          <polygon points="0,-24 20,-12 20,12 0,24 -20,12 -20,-12" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />
          <text x="0" y="6" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" style={{letterSpacing: '1px'}}>{initials}</text>
        </g>
        {/* footer band with set code accent */}
        <rect x="0" y="245" width="200" height="35" fill="#000" opacity="0.55" />
        <rect x="0" y="245" width="4" height="35" fill="#FF6B00" />
        <text x="14" y="267" fill="#FF6B00" fontSize="10" fontWeight="700" style={{letterSpacing: '2px'}}>{card.setId} · {card.type.toUpperCase()}</text>
      </svg>
    </div>
  )
}
