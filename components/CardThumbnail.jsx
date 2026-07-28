'use client'
import Link from 'next/link'
import { useState } from 'react'
import { DOMAINS, RARITIES } from '@/lib/mock/data'

// Card thumbnail: shows the REAL card art from RiftScribe CDN with blur placeholder + fallback.
export default function CardThumbnail({ card, showPrice = true, compact = false, priority = false }) {
  const domain = DOMAINS.find(d => d.id === card.domain)
  const rarity = RARITIES.find(r => r.id === card.rarity) || RARITIES[0]
  const price = card.listings?.[0]?.price ?? card.basePrice
  const [err, setErr] = useState(false)

  return (
    <Link href={`/cards/${card.id}`} className="group block">
      <div className="card-hover relative bg-panel rounded-lg overflow-hidden border border-white/5 hover:border-rift">
        <div
          className="relative aspect-[5/7] w-full bg-black bg-cover bg-center"
          style={card.imageBlur ? { backgroundImage: `url(${card.imageBlur})` } : {}}
        >
          {!err && card.image && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={card.image}
              alt={card.name}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => setErr(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {err && (
            <div className="absolute inset-0 grid place-items-center text-center p-3" style={{ background: `linear-gradient(135deg, ${domain?.color}66, #0a0a0a)` }}>
              <div className="text-xs font-semibold">{card.name}</div>
            </div>
          )}

          {/* rarity badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider text-white shadow-lg z-10"
            style={{ backgroundColor: rarity.color }}
          >
            {rarity.name}
          </div>
          {/* domain indicator */}
          {domain && (
            <div
              className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-black/60 shadow-lg z-10"
              style={{ backgroundColor: domain.color }}
              title={domain.name}
            />
          )}
          {/* energy cost */}
          {typeof card.energy === 'number' && card.energy !== null && (
            <div className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/85 border-2 border-rift flex items-center justify-center text-rift font-black text-sm shadow-lg z-10">
              {card.energy}
            </div>
          )}
        </div>
        {!compact && (
          <div className="p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{card.type} · {card.setId}</div>
                <div className="text-sm font-semibold truncate">{card.name}</div>
              </div>
              {showPrice && (
                <div className="text-sm font-bold text-rift whitespace-nowrap">${price.toFixed(2)}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
