'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardArt from '@/components/CardArt'
import PriceChart from '@/components/PriceChart'
import { getCardById, DOMAINS, RARITIES, getSetById, CARDS } from '@/lib/mock/data'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, Store } from 'lucide-react'
import { useEffect, useState } from 'react'
import { readCollection, setInCollection } from '@/lib/collectionStore'
import { toast } from 'sonner'
import CardThumbnail from '@/components/CardThumbnail'
import RulesText from '@/components/RulesText'

export default function CardDetailPage() {
  const params = useParams()
  const card = getCardById(params.cardId)
  const [qty, setQty] = useState(0)

  useEffect(() => {
    if (!card) return
    const c = readCollection()
    setQty(c[card.id] || 0)
  }, [card])

  if (!card) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Card not found</h1>
          <Link href="/search" className="text-rift mt-3 inline-block">Search other cards</Link>
        </main>
      </div>
    )
  }

  const domain = DOMAINS.find(d => d.id === card.domain)
  const rarity = RARITIES.find(r => r.id === card.rarity)
  const set = getSetById(card.setId)
  const related = CARDS.filter(c => c.id !== card.id && (c.legend === card.legend || c.setId === card.setId)).slice(0, 6)
  const year = set?.releaseDate ? new Date(set.releaseDate).getFullYear() : '—'
  const cheapest = card.listings?.length ? Math.min(...card.listings.map(l => l.price)) : null
  const lastSale = card.priceHistory?.length ? card.priceHistory[card.priceHistory.length - 1] : null

  const changeQty = (delta) => {
    const newQty = Math.max(0, qty + delta)
    setInCollection(card.id, newQty)
    setQty(newQty)
    toast.success(newQty > qty ? `+${delta} added to collection` : `Removed from collection`, { description: card.name })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-[28px] py-8">
        <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-rift mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,400px)_1fr] gap-10">
          {/* Big card art — real image from RiftScribe CDN */}
          <div className="space-y-4">
            <div className="aspect-[5/7] rounded-xl overflow-hidden ring-2 glow-orange bg-black" style={{ '--tw-ring-color': domain?.color }}>
              {card.imageLarge ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={card.imageLarge} alt={card.name} className="w-full h-full object-cover" />
              ) : (
                <CardArt card={card} />
              )}
            </div>
            <div className="flex items-center gap-2">
              <button className="w-16 aspect-[5/7] rounded-md overflow-hidden ring-1 ring-rift bg-black shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
              </button>
              <span className="text-xs text-muted-foreground">{card.orientation === 'landscape' ? 'Landscape' : 'Portrait'} · hover to zoom</span>
            </div>

            <div className="bg-panel border border-white/5 rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Your Collection</div>
              <div className="flex items-center gap-3">
                <button onClick={() => changeQty(-1)} disabled={qty <= 0} className="w-10 h-10 rounded-md bg-panel-hi border border-white/10 grid place-items-center disabled:opacity-30 hover:border-rift"><Minus className="w-4 h-4" /></button>
                <div className="flex-1 text-center text-2xl font-black text-rift">{qty}</div>
                <button onClick={() => changeQty(1)} className="w-10 h-10 rounded-md bg-panel-hi border border-white/10 grid place-items-center hover:border-rift"><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-rift mb-2">
                {domain && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: domain.color }} />}
                {domain?.name || card.type}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{card.name}</h1>
              <div className="text-sm text-muted-foreground mt-1">
                <Link href={`/sets/${set.id}`} className="hover:text-rift">{set.name}</Link> · {card.number} · {year}
              </div>
            </div>

            {/* Legality / status strip */}
            <div className={`rounded-lg border p-4 ${card.isBanned ? 'border-destructive/40 bg-destructive/10' : 'border-white/5 bg-panel'}`}>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{card.isBanned ? 'Banned' : 'Legal'}</div>
              <div className="text-sm">
                {card.isBanned ? 'This card is currently banned from Standard play.' : 'This card is legal for tournament play.'}
              </div>
            </div>

            {/* Stat boxes */}
            <div className="grid grid-cols-3 gap-3">
              <PriceStat label="Market Est." value={card.basePrice != null ? `$${card.basePrice.toFixed(2)}` : '—'} />
              <PriceStat label="Cheapest Listing" value={cheapest != null ? `$${cheapest.toFixed(2)}` : '—'} />
              <PriceStat label="Last Sale" value={lastSale ? `$${lastSale.price.toFixed(2)}` : '—'} />
            </div>

            {/* Card Details — grading-relevant metadata */}
            <div className="bg-panel border border-white/5 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="font-bold">Card Details</div>
                <div className="text-[11px] text-muted-foreground">from RiftScribe</div>
              </div>
              <dl className="divide-y divide-white/5 text-sm">
                <DetailRow label="Set">{set.name} ({set.code})</DetailRow>
                <DetailRow label="Card Number">{card.number}</DetailRow>
                <DetailRow label="Release Year">{year}</DetailRow>
                <DetailRow label="Rarity"><span className="font-semibold" style={{ color: rarity?.color }}>{rarity?.name}</span></DetailRow>
                <DetailRow label="Domain">{domain?.name || '—'}</DetailRow>
                <DetailRow label="Card Type">{card.type}</DetailRow>
                {card.legend && <DetailRow label="Legend">{card.legend}</DetailRow>}
                {card.variant && <DetailRow label="Variant">{card.variant}</DetailRow>}
                <DetailRow label="Orientation">{card.orientation === 'landscape' ? 'Landscape' : 'Portrait'}</DetailRow>
                <DetailRow label="Card ID"><span className="font-mono text-xs">{card.id}</span></DetailRow>
                {card.artist && <DetailRow label="Artist">{card.artist}</DetailRow>}
              </dl>
            </div>

            {/* Text + flavor + keywords */}
            <div className="bg-panel border border-white/5 rounded-lg p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Card Text</div>
              {card.text ? (
                <div className="text-sm">
                  <RulesText text={card.text} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Oracle text is not available for this card.</p>
              )}
              {card.keywords && card.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                  {card.keywords.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-rift/10 text-rift rounded border border-rift/30">
                      {k}
                    </span>
                  ))}
                </div>
              )}
              {card.flavorText && (
                <div className="pt-2 border-t border-white/5">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Flavor</div>
                  <p className="text-sm italic text-muted-foreground">&ldquo;{card.flavorText}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Stats bar */}
            {(card.energy != null || card.power != null || card.hp != null) && (
              <div className="grid grid-cols-3 gap-3">
                {card.energy != null && <Stat label="Energy" value={card.energy} />}
                {card.power != null && <Stat label="Power" value={card.power} />}
                {card.hp != null && <Stat label="HP" value={card.hp} />}
              </div>
            )}

            <div>
              <h2 className="font-bold text-lg mb-3">Price History</h2>
              <PriceChart data={card.priceHistory} />
            </div>

            {/* Listings — indexed history style */}
            <div className="bg-panel border border-white/5 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Store className="w-4 h-4 text-rift" />
                <div className="font-bold">Marketplace Listings</div>
                <span className="ml-auto text-xs text-muted-foreground">{card.listings.length} listings</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-panel-hi text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">Marketplace</th>
                      <th className="text-left px-4 py-2">Seller</th>
                      <th className="text-left px-4 py-2">Condition</th>
                      <th className="text-right px-4 py-2">Stock</th>
                      <th className="text-right px-4 py-2">Price</th>
                      <th className="px-4 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {card.listings.map((l, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-panel-hi">
                        <td className="px-4 py-3 font-semibold">{l.market}</td>
                        <td className="px-4 py-3 text-muted-foreground">{l.seller}</td>
                        <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs bg-panel-hi border border-white/10 rounded">{l.condition}</span></td>
                        <td className="px-4 py-3 text-right">{l.stock}</td>
                        <td className="px-4 py-3 text-right font-bold text-rift">${l.price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          <button className="px-3 py-1 rounded bg-rift text-white text-xs font-semibold hover:opacity-90">Buy</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 className="font-bold text-lg mb-3">Related Cards</h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {related.map(c => <CardThumbnail key={c.id} card={c} compact />)}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="bg-panel border border-white/5 rounded-lg p-3 text-center">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-2xl font-black text-rift">{value}</div>
    </div>
  )
}
function PriceStat({ label, value }) {
  return (
    <div className="bg-panel border border-white/5 rounded-lg p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <div className="text-lg font-black">{value}</div>
    </div>
  )
}
function DetailRow({ label, children }) {
  return (
    <div className="grid grid-cols-2 px-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  )
}
