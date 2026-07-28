'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardGrid from '@/components/CardGrid'
import { getSetById, getCardsBySet, DOMAINS } from '@/lib/mock/data'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function SetDetailPage() {
  const params = useParams()
  const set = getSetById(params.setId)
  const cards = useMemo(() => (set ? getCardsBySet(set.id) : []), [set])
  const [filter, setFilter] = useState('all')

  if (!set) {
    return (
      <div className="min-h-screen"><Navbar />
        <main className="container px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Set tidak ditemukan</h1>
          <Link href="/sets" className="text-rift mt-3 inline-block">Kembali ke Sets</Link>
        </main>
      </div>
    )
  }

  const filtered = filter === 'all' ? cards : cards.filter(c => c.domain === filter)
  const domainCounts = DOMAINS.map(d => ({ ...d, count: cards.filter(c => c.domain === d.id).length }))

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <div className={`relative h-72 bg-gradient-to-br ${set.coverGradient} overflow-hidden`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="container relative h-full px-4 flex flex-col justify-end pb-8">
            <Link href="/sets" className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white mb-4 w-fit">
              <ArrowLeft className="w-4 h-4" /> Semua Sets
            </Link>
            <div className="text-[10px] tracking-[0.3em] uppercase font-bold px-2 py-1 bg-black/60 rounded w-fit mb-2">{set.code}</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-glow-orange">{set.name}</h1>
            <p className="text-white/85 mt-2 max-w-2xl">{set.tagline}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div><span className="text-white/60">Total kartu:</span> <span className="font-bold">{set.totalCards}</span></div>
              <div><span className="text-white/60">Tersedia:</span> <span className="font-bold">{cards.length}</span></div>
              <div><span className="text-white/60">Rilis:</span> <span className="font-bold">{new Date(set.releaseDate).toLocaleDateString('id-ID')}</span></div>
            </div>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => setFilter('all')} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${filter === 'all' ? 'bg-rift border-rift text-white' : 'bg-panel border-white/10 text-muted-foreground'}`}>Semua ({cards.length})</button>
            {domainCounts.filter(d => d.count > 0).map(d => (
              <button key={d.id} onClick={() => setFilter(d.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium border ${filter === d.id ? 'bg-rift border-rift text-white' : 'bg-panel border-white/10 text-muted-foreground'}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />{d.name} ({d.count})
              </button>
            ))}
          </div>
          <CardGrid cards={filtered} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
