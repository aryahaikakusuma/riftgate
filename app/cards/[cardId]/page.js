'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardArt from '@/components/CardArt'
import PriceChart from '@/components/PriceChart'
import { getCardById, DOMAINS, RARITIES, getSetById, CARDS } from '@/lib/mock/data'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, Store, Palette } from 'lucide-react'
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
          <h1 className="text-2xl font-bold">Kartu tidak ditemukan</h1>
          <Link href="/search" className="text-rift mt-3 inline-block">Cari kartu lain</Link>
        </main>
      </div>
    )
  }

  const domain = DOMAINS.find(d => d.id === card.domain)
  const rarity = RARITIES.find(r => r.id === card.rarity)
  const set = getSetById(card.setId)
  const related = CARDS.filter(c => c.id !== card.id && (c.legend === card.legend || c.setId === card.setId)).slice(0, 6)

  const changeQty = (delta) => {
    const newQty = Math.max(0, qty + delta)
    setInCollection(card.id, newQty)
    setQty(newQty)
    toast.success(newQty > qty ? `+${delta} ditambahkan ke koleksi` : `Dikurangi dari koleksi`, { description: card.name })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8">
        <Link href="/search" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-rift mb-6">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,400px)_1fr] gap-8">
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
            <div className="bg-panel border border-white/5 rounded-lg p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Koleksimu</div>
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
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
                <Link href={`/sets/${set.id}`} className="hover:text-rift">{set.name}</Link> · {card.number}
              </div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">{card.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <Badge label={card.type} />
                {domain && <Badge label={domain.name} dot={domain.color} />}
                <Badge label={rarity.name} bg={rarity.color} />
                {card.legend && <Badge label={`Legend: ${card.legend}`} />}
              </div>
            </div>

            {/* Stats bar */}
            {(card.energy != null || card.power != null || card.hp != null) && (
              <div className="grid grid-cols-3 gap-3">
                {card.energy != null && <Stat label="Energy" value={card.energy} />}
                {card.power != null && <Stat label="Power" value={card.power} />}
                {card.hp != null && <Stat label="HP" value={card.hp} />}
              </div>
            )}

            {/* Text + flavor + keywords */}
            <div className="bg-panel border border-white/5 rounded-lg p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Card Text</div>
              {card.text ? (
                <div className="text-sm">
                  <RulesText text={card.text} />
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">Oracle text tidak tersedia untuk kartu ini.</p>
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
              {card.artist && (
                <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Palette className="w-3.5 h-3.5 text-rift" />
                  <span>Artist:</span>
                  <span className="text-white">{card.artist}</span>
                </div>
              )}
            </div>

            <PriceChart data={card.priceHistory} />

            {/* Listings */}
            <div className="bg-panel border border-white/5 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Store className="w-4 h-4 text-rift" />
                <div className="font-bold">Marketplace Listings</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-panel-hi text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="text-left px-4 py-2">Marketplace</th>
                      <th className="text-left px-4 py-2">Seller</th>
                      <th className="text-left px-4 py-2">Kondisi</th>
                      <th className="text-right px-4 py-2">Stock</th>
                      <th className="text-right px-4 py-2">Harga</th>
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
                          <button className="px-3 py-1 rounded bg-rift text-white text-xs font-semibold hover:opacity-90">Beli</button>
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
                <h2 className="font-bold text-lg mb-3">Kartu Terkait</h2>
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

function Badge({ label, dot, bg }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded border border-white/10 bg-panel" style={bg ? { backgroundColor: bg, borderColor: bg, color: '#fff' } : {}}>
      {dot && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />}
      {label}
    </span>
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
