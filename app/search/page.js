'use client'
import { useState, useMemo } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FilterSidebar from '@/components/FilterSidebar'
import CardGrid from '@/components/CardGrid'
import { CARDS } from '@/lib/mock/data'
import { SlidersHorizontal } from 'lucide-react'

export default function SearchPage() {
  const [filters, setFilters] = useState({ q: '', sets: [], domains: [], rarities: [], types: [] })
  const [sort, setSort] = useState('name')
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const perPage = 24

  const filtered = useMemo(() => {
    let list = CARDS.filter(c => {
      if (filters.q && !c.name.toLowerCase().includes(filters.q.toLowerCase())) return false
      if (filters.sets.length && !filters.sets.includes(c.setId)) return false
      if (filters.domains.length && !filters.domains.includes(c.domain)) return false
      if (filters.rarities.length && !filters.rarities.includes(c.rarity)) return false
      if (filters.types.length && !filters.types.includes(c.type)) return false
      return true
    })
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'price-asc') list.sort((a, b) => a.basePrice - b.basePrice)
    else if (sort === 'price-desc') list.sort((a, b) => b.basePrice - a.basePrice)
    return list
  }, [filters, sort])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / perPage))
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black tracking-tight">Search <span className="text-rift">Cards</span></h1>
          <p className="text-sm text-muted-foreground">Search among {CARDS.length} cards from all Riftbound sets.</p>
        </div>

        <div className="flex items-center justify-between mb-4 lg:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-3 py-2 bg-panel border border-white/10 rounded-md text-sm">
            <SlidersHorizontal className="w-4 h-4" /> Filter
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className={showFilters ? '' : 'hidden lg:block'}>
            <FilterSidebar filters={filters} setFilters={(f) => { setFilters(f); setPage(1) }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">{total} results</div>
              <select value={sort} onChange={e => setSort(e.target.value)} className="bg-panel border border-white/10 rounded-md px-3 py-1.5 text-sm focus:border-rift focus:outline-none">
                <option value="name">Sort: Name A-Z</option>
                <option value="price-desc">Highest Price</option>
                <option value="price-asc">Lowest Price</option>
              </select>
            </div>
            <CardGrid cards={paged} />
            {pageCount > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 rounded bg-panel border border-white/10 text-sm disabled:opacity-30">Prev</button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)} className={`px-3 py-1.5 rounded text-sm border ${n === page ? 'bg-rift text-white border-rift' : 'bg-panel border-white/10'}`}>{n}</button>
                ))}
                <button disabled={page === pageCount} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 rounded bg-panel border border-white/10 text-sm disabled:opacity-30">Next</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
