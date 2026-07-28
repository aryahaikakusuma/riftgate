'use client'
import Link from 'next/link'
import CardArt from './CardArt'
import { DOMAINS, RARITIES } from '@/lib/mock/data'
import { cn } from '@/lib/utils'

export default function CardThumbnail({ card, showPrice = true, compact = false }) {
  const domain = DOMAINS.find(d => d.id === card.domain)
  const rarity = RARITIES.find(r => r.id === card.rarity) || RARITIES[0]
  const price = card.listings?.[0]?.price ?? card.basePrice

  return (
    <Link href={`/cards/${card.id}`} className="group block">
      <div className="card-hover relative bg-panel rounded-lg overflow-hidden border border-white/5 hover:border-rift">
        <div className="relative aspect-[5/7] w-full">
          <CardArt card={card} />
          {/* rarity badge */}
          <div
            className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider text-white"
            style={{ backgroundColor: rarity.color }}
          >
            {rarity.name}
          </div>
          {/* domain indicator */}
          {domain && (
            <div
              className="absolute top-2 right-2 w-5 h-5 rounded-full border-2 border-black/40 shadow"
              style={{ backgroundColor: domain.color }}
              title={domain.name}
            />
          )}
          {/* energy cost */}
          {typeof card.energy === 'number' && (
            <div className="absolute bottom-14 right-2 w-8 h-8 rounded-full bg-black/70 border border-rift flex items-center justify-center text-rift font-bold text-sm">
              {card.energy}
            </div>
          )}
        </div>
        {!compact && (
          <div className="p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{card.type} · {card.setId}</div>
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
