'use client'
import { DOMAINS } from '@/lib/mock/data'
import { Zap, Swords, RotateCw } from 'lucide-react'

// Renders Riftbound oracle text tokens like :rb_energy_1:, :rb_rune_fury:, [Keyword], (reminder text)
// Source: riftscribe.gg descriptions.

const DOMAIN_MAP = Object.fromEntries(DOMAINS.map(d => [d.id, d.color]))

function TokenIcon({ token }) {
  // :rb_energy_N:
  const em = token.match(/^:rb_energy_(\d+):$/)
  if (em) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black border border-rift text-rift text-[11px] font-black align-middle mx-0.5">
        {em[1]}
      </span>
    )
  }
  // :rb_rune_xxx:
  const rm = token.match(/^:rb_rune_(body|mind|chaos|order|fury|calm|rainbow):$/)
  if (rm) {
    const color = rm[1] === 'rainbow' ? 'conic-gradient(from 0deg, #E63946, #F4C542, #3EDC81, #4CA5FF, #B02BFF, #FF6B00, #E63946)' : null
    return (
      <span
        className="inline-block w-4 h-4 rounded-full border border-black/50 align-middle mx-0.5"
        style={color ? { background: color } : { backgroundColor: DOMAIN_MAP[rm[1]] || '#888' }}
        title={`Rune ${rm[1]}`}
      />
    )
  }
  if (token === ':rb_might:') {
    return <Swords className="inline-block w-3.5 h-3.5 text-rift align-middle mx-0.5" />
  }
  if (token === ':rb_exhaust:') {
    return <RotateCw className="inline-block w-3.5 h-3.5 text-rift align-middle mx-0.5" />
  }
  // fallback
  return <span className="text-rift font-mono text-xs">{token}</span>
}

const TOKEN_REGEX = /:rb_[a-z0-9_]+:/g

function renderInlineTokens(text, keyPrefix = 't') {
  if (!text) return null
  const parts = text.split(/(:rb_[a-z0-9_]+:)/g)
  return parts.map((p, i) => {
    if (!p) return null
    if (p.startsWith(':rb_')) return <TokenIcon key={`${keyPrefix}-${i}`} token={p} />
    return <span key={`${keyPrefix}-${i}`}>{p}</span>
  })
}

export default function RulesText({ text, className = '' }) {
  if (!text) return null
  // Segments: [Keyword] | (reminder text) | plain text (which may contain :rb_...: tokens)
  const regex = /(\[[^\]]+\]|\([^)]+\))/g
  const parts = text.split(regex)

  return (
    <span className={`leading-relaxed ${className}`}>
      {parts.map((p, i) => {
        if (!p) return null
        if (p.startsWith('[') && p.endsWith(']')) {
          return (
            <span key={i} className="inline-block px-1.5 py-0.5 mx-0.5 text-[11px] font-bold uppercase tracking-wider bg-rift/15 text-rift rounded border border-rift/30 align-middle">
              {p.slice(1, -1)}
            </span>
          )
        }
        if (p.startsWith('(') && p.endsWith(')')) {
          return (
            <em key={i} className="text-muted-foreground italic">
              {renderInlineTokens(p, `r-${i}`)}
            </em>
          )
        }
        // Plain segment — may contain :rb_...: tokens
        return <span key={i}>{renderInlineTokens(p, `p-${i}`)}</span>
      })}
    </span>
  )
}
