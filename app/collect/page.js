'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CardThumbnail from '@/components/CardThumbnail'
import { useEffect, useState, useMemo } from 'react'
import { readCollection, setInCollection } from '@/lib/collectionStore'
import { CARDS, SETS } from '@/lib/mock/data'
import { Plus, Minus, Trophy, DollarSign, Layers, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CollectPage() {
  const [col, setCol] = useState({})
  const [ready, setReady] = useState(false)
  const [filterSet, setFilterSet] = useState('all')

  useEffect(() => { setCol(readCollection()); setReady(true) }, [])

  const owned = useMemo(() => {
    return CARDS.filter(c => (col[c.id] || 0) > 0).map(c => ({ ...c, qty: col[c.id] }))
  }, [col])

  const filtered = filterSet === 'all' ? owned : owned.filter(c => c.setId === filterSet)

  const totalValue = owned.reduce((sum, c) => sum + c.basePrice * c.qty, 0)
  const uniqueCount = owned.length
  const totalQty = owned.reduce((s, c) => s + c.qty, 0)

  const update = (id, delta) => {
    const next = Math.max(0, (col[id] || 0) + delta)
    setInCollection(id, next)
    setCol({ ...col, [id]: next })
    if (next === 0) { const c = { ...col }; delete c[id]; setCol(c) }
  }
  const removeAll = () => {
    if (!confirm('Hapus seluruh koleksi?')) return
    localStorage.removeItem('riftgate.collection.v1')
    setCol({})
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">My <span className="text-rift">Collection</span></h1>
            <p className="text-sm text-muted-foreground">Kartu yang kamu miliki (tersimpan lokal di browser).</p>
          </div>
          {owned.length > 0 && (
            <button onClick={removeAll} className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-400 border border-red-400/30 rounded-md hover:bg-red-500/10">
              <Trash2 className="w-4 h-4" /> Hapus semua
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
          <StatCard icon={<Layers />} label="Kartu Unik" value={uniqueCount} />
          <StatCard icon={<Trophy />} label="Total Kartu" value={totalQty} />
          <StatCard icon={<DollarSign />} label="Est. Value" value={`$${totalValue.toFixed(2)}`} highlight />
        </div>

        {ready && owned.length === 0 && (
          <div className="text-center py-24 bg-panel rounded-xl border border-white/5">
            <div className="text-4xl mb-2">📜</div>
            <div className="text-lg font-bold">Koleksimu masih kosong</div>
            <p className="text-sm text-muted-foreground mt-1">Cari kartu dan tambahkan ke koleksi.</p>
            <Link href="/search" className="inline-flex mt-4 px-4 py-2 bg-rift text-white rounded-md font-semibold text-sm">Mulai cari kartu</Link>
          </div>
        )}

        {owned.length > 0 && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              <FBtn active={filterSet === 'all'} onClick={() => setFilterSet('all')}>Semua Set ({owned.length})</FBtn>
              {SETS.map(s => {
                const n = owned.filter(c => c.setId === s.id).length
                if (!n) return null
                return <FBtn key={s.id} active={filterSet === s.id} onClick={() => setFilterSet(s.id)}>{s.name} ({n})</FBtn>
              })}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map(c => (
                <div key={c.id} className="relative">
                  <CardThumbnail card={c} />
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur border border-rift rounded-md p-0.5">
                    <button onClick={() => update(c.id, -1)} className="w-6 h-6 grid place-items-center hover:text-rift"><Minus className="w-3 h-3" /></button>
                    <div className="px-1 text-xs font-bold text-rift">×{c.qty}</div>
                    <button onClick={() => update(c.id, 1)} className="w-6 h-6 grid place-items-center hover:text-rift"><Plus className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}

function StatCard({ icon, label, value, highlight }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-gradient-rift border-transparent text-white' : 'bg-panel border-white/5'}`}>
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">{icon} {label}</div>
      <div className={`text-2xl md:text-3xl font-black mt-2 ${highlight ? '' : 'text-rift'}`}>{value}</div>
    </div>
  )
}
function FBtn({ active, onClick, children }) {
  return (
    <button onClick={onClick} className={`px-3 py-1.5 rounded-md text-sm font-medium border ${active ? 'bg-rift border-rift text-white' : 'bg-panel border-white/10 text-muted-foreground hover:text-white'}`}>{children}</button>
  )
}
