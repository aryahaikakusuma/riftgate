'use client'
import { SETS, DOMAINS, RARITIES, CARD_TYPES } from '@/lib/mock/data'
import { Search, X } from 'lucide-react'

function toggle(arr, v) {
  return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]
}

export default function FilterSidebar({ filters, setFilters }) {
  const reset = () => setFilters({ q: '', sets: [], domains: [], rarities: [], types: [] })
  const active = filters.sets.length + filters.domains.length + filters.rarities.length + filters.types.length + (filters.q ? 1 : 0)

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Filter</h3>
          {active > 0 && (
            <button onClick={reset} className="text-xs text-rift flex items-center gap-1 hover:underline">
              <X className="w-3 h-3" />Reset ({active})
            </button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={filters.q}
            onChange={e => setFilters({ ...filters, q: e.target.value })}
            placeholder="Cari nama kartu…"
            className="w-full pl-9 pr-3 py-2 bg-panel border border-white/10 rounded-md text-sm focus:outline-none focus:border-rift transition"
          />
        </div>
      </div>

      <Section title="Set">
        {SETS.map(s => (
          <Chk key={s.id} label={s.name} checked={filters.sets.includes(s.id)} onChange={() => setFilters({ ...filters, sets: toggle(filters.sets, s.id) })} />
        ))}
      </Section>

      <Section title="Domain">
        <div className="grid grid-cols-3 gap-2">
          {DOMAINS.map(d => {
            const on = filters.domains.includes(d.id)
            return (
              <button
                key={d.id}
                onClick={() => setFilters({ ...filters, domains: toggle(filters.domains, d.id) })}
                className={`px-2 py-2 rounded-md text-xs font-medium border transition ${on ? 'border-rift bg-rift/10 text-white' : 'border-white/10 text-muted-foreground hover:text-white'}`}
              >
                <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: d.color }} />
                {d.name}
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Rarity">
        {RARITIES.map(r => (
          <Chk key={r.id} label={r.name} checked={filters.rarities.includes(r.id)} onChange={() => setFilters({ ...filters, rarities: toggle(filters.rarities, r.id) })} dot={r.color} />
        ))}
      </Section>

      <Section title="Tipe Kartu">
        {CARD_TYPES.map(t => (
          <Chk key={t} label={t} checked={filters.types.includes(t)} onChange={() => setFilters({ ...filters, types: toggle(filters.types, t) })} />
        ))}
      </Section>
    </aside>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="font-bold uppercase tracking-wider text-[11px] text-muted-foreground mb-2">{title}</div>
      <div className="space-y-1">{children}</div>
    </div>
  )
}
function Chk({ label, checked, onChange, dot }) {
  return (
    <label className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-panel cursor-pointer text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="accent-orange-500 w-4 h-4" />
      {dot && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dot }} />}
      <span className={checked ? 'text-white' : 'text-muted-foreground'}>{label}</span>
    </label>
  )
}
