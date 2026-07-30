'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardArt from '@/components/CardArt'
import { CARDS, DOMAINS, LEGENDS, getCardById } from '@/lib/mock/data'
import { useEffect, useState, useMemo } from 'react'
import { readDeck, writeDeck } from '@/lib/collectionStore'
import { Search, Plus, Minus, X, Sparkles, Download, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

const DECK_TARGET = 40

export default function DeckBuilderPage() {
  const [deck, setDeck] = useState({ legend: null, cards: {} })
  const [q, setQ] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')

  useEffect(() => { setDeck(readDeck()) }, [])
  useEffect(() => { writeDeck(deck) }, [deck])

  const legendCards = CARDS.filter(c => c.type === 'Legend')
  const legendCard = deck.legend ? getCardById(deck.legend) : null

  const filtered = useMemo(() => {
    return CARDS.filter(c => {
      if (c.type === 'Legend') return false
      if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false
      if (domainFilter !== 'all' && c.domain !== domainFilter) return false
      return true
    })
  }, [q, domainFilter])

  const deckCards = useMemo(() => {
    return Object.entries(deck.cards).map(([id, qty]) => ({ card: getCardById(id), qty })).filter(x => x.card)
  }, [deck])

  const totalCards = deckCards.reduce((s, x) => s + x.qty, 0)
  const estValue = deckCards.reduce((s, x) => s + x.card.basePrice * x.qty, (legendCard?.basePrice || 0))

  const domainSpread = useMemo(() => {
    const spread = {}
    deckCards.forEach(x => { spread[x.card.domain] = (spread[x.card.domain] || 0) + x.qty })
    return spread
  }, [deckCards])

  const setLegend = (id) => setDeck(d => ({ ...d, legend: id }))
  const addCard = (id) => {
    setDeck(d => {
      const cur = d.cards[id] || 0
      if (cur >= 3) { toast.error('Max 3 copies per card'); return d }
      if (totalCards >= DECK_TARGET) { toast.error('Deck already has 40 cards'); return d }
      return { ...d, cards: { ...d.cards, [id]: cur + 1 } }
    })
  }
  const removeCard = (id) => {
    setDeck(d => {
      const cur = d.cards[id] || 0
      const cards = { ...d.cards }
      if (cur <= 1) delete cards[id]
      else cards[id] = cur - 1
      return { ...d, cards }
    })
  }
  const resetDeck = () => { if (confirm('Reset deck?')) setDeck({ legend: null, cards: {} }) }
  const exportDeck = () => {
    const lines = []
    if (legendCard) lines.push(`Legend: ${legendCard.name}`)
    lines.push(`# Main Deck (${totalCards}/${DECK_TARGET})`)
    deckCards.forEach(x => lines.push(`${x.qty}x ${x.card.name} [${x.card.setId}]`))
    navigator.clipboard.writeText(lines.join('\n'))
    toast.success('Deck list copied to clipboard!')
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-rift" />
              <div className="text-xs uppercase tracking-widest text-rift font-bold">Exclusive Feature</div>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Deck <span className="text-rift">Builder</span></h1>
            <p className="text-sm text-muted-foreground">Pick a Legend, assemble your 40 main deck cards. Your build is saved locally.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDeck} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-white/10 rounded-md hover:border-rift"><RotateCcw className="w-4 h-4" />Reset</button>
            <button onClick={exportDeck} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-rift text-white rounded-md font-semibold hover:opacity-90"><Download className="w-4 h-4" />Export</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* LEFT: card selection */}
          <div>
            {/* Legend picker */}
            <div className="mb-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">1. Pick a Legend</div>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {legendCards.map(c => (
                  <button key={c.id} onClick={() => setLegend(c.id)} className={`relative rounded-lg overflow-hidden border-2 transition ${deck.legend === c.id ? 'border-rift glow-orange' : 'border-white/10 hover:border-white/30'}`}>
                    <div className="aspect-[5/7] bg-black">
                      {c.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                      ) : (
                        <CardArt card={c} />
                      )}
                    </div>
                    <div className="px-2 py-1.5 text-[11px] font-semibold text-center truncate bg-panel">{c.legend || c.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Card selection */}
            <div className="mb-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">2. Add cards (click to +1)</div>
              <div className="flex gap-2 mb-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search cards…" className="w-full pl-9 pr-3 py-2 bg-panel border border-white/10 rounded-md text-sm focus:border-rift focus:outline-none" />
                </div>
                <select value={domainFilter} onChange={e => setDomainFilter(e.target.value)} className="bg-panel border border-white/10 rounded-md px-3 py-2 text-sm focus:border-rift focus:outline-none">
                  <option value="all">All Domains</option>
                  {DOMAINS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[70vh] overflow-y-auto pr-1">
                {filtered.map(c => {
                  const owned = deck.cards[c.id] || 0
                  return (
                    <button key={c.id} onClick={() => addCard(c.id)} className="relative group text-left">
                      <div className="aspect-[5/7] rounded-md overflow-hidden border border-white/10 group-hover:border-rift transition bg-black">
                        {c.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={c.image} alt={c.name} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <CardArt card={c} />
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition rounded-md grid place-items-center opacity-0 group-hover:opacity-100">
                        <div className="px-3 py-1 bg-rift text-white rounded-md font-bold text-xs flex items-center gap-1"><Plus className="w-3 h-3" />Add</div>
                      </div>
                      {owned > 0 && (
                        <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-rift text-white text-xs font-bold grid place-items-center border-2 border-black">{owned}</div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: deck sidebar */}
          <aside className="lg:sticky lg:top-20 h-fit space-y-4">
            <div className="bg-panel border border-white/5 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-gradient-rift text-white">
                <div className="text-[10px] uppercase tracking-widest opacity-80">Your Deck</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-black">{totalCards}<span className="text-white/70 text-lg">/{DECK_TARGET}</span></div>
                  <div className="text-xs ml-auto opacity-80">~${estValue.toFixed(2)}</div>
                </div>
                <div className="mt-2 h-1.5 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white/90 transition-all" style={{ width: `${Math.min(100, (totalCards / DECK_TARGET) * 100)}%` }} />
                </div>
              </div>

              {legendCard ? (
                <div className="p-3 border-b border-white/5 flex items-center gap-3">
                  <div className="w-14 aspect-[5/7] rounded overflow-hidden shrink-0 bg-black">
                    {legendCard.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={legendCard.image} alt={legendCard.name} className="w-full h-full object-cover" />
                    ) : (
                      <CardArt card={legendCard} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-rift font-bold">Legend</div>
                    <div className="font-bold truncate">{legendCard.name}</div>
                  </div>
                  <button onClick={() => setLegend(null)} className="text-muted-foreground hover:text-red-400"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <div className="p-4 border-b border-white/5 text-sm text-muted-foreground text-center">Pick a Legend on the left panel</div>
              )}

              {/* Domain spread */}
              {deckCards.length > 0 && (
                <div className="px-3 pt-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Domain Spread</div>
                  <div className="flex h-2 rounded-full overflow-hidden mb-3">
                    {DOMAINS.map(d => {
                      const n = domainSpread[d.id] || 0
                      if (!n) return null
                      return <div key={d.id} className="h-full" style={{ width: `${(n / totalCards) * 100}%`, backgroundColor: d.color }} title={`${d.name}: ${n}`} />
                    })}
                  </div>
                </div>
              )}

              <div className="max-h-[50vh] overflow-y-auto">
                {deckCards.length === 0 && (
                  <div className="p-6 text-center text-sm text-muted-foreground">Deck is empty. Click a card on the left to add it.</div>
                )}
                {deckCards.map(({ card, qty }) => {
                  const d = DOMAINS.find(x => x.id === card.domain)
                  return (
                    <div key={card.id} className="flex items-center gap-2 px-3 py-2 border-t border-white/5 hover:bg-panel-hi group">
                      <div className="w-1 h-8 rounded" style={{ backgroundColor: d?.color }} />
                      <Link href={`/cards/${card.id}`} className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{card.name}</div>
                        <div className="text-[10px] text-muted-foreground">{card.type} · {card.energy != null ? `${card.energy}⬡` : ''} · ${card.basePrice.toFixed(2)}</div>
                      </Link>
                      <div className="flex items-center gap-1">
                        <button onClick={() => removeCard(card.id)} className="w-6 h-6 grid place-items-center rounded hover:bg-panel-hi"><Minus className="w-3 h-3" /></button>
                        <div className="w-6 text-center text-sm font-bold text-rift">{qty}</div>
                        <button onClick={() => addCard(card.id)} className="w-6 h-6 grid place-items-center rounded hover:bg-panel-hi"><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}
