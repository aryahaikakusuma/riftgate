'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Layers, BookmarkCheck, TrendingUp, Hammer, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/search',       label: 'Search',  icon: Search },
  { href: '/sets',         label: 'Sets',    icon: Layers },
  { href: '/collect',      label: 'Collect', icon: BookmarkCheck },
  { href: '/#deals',       label: 'Radar',   icon: TrendingUp },
  { href: '/deck-builder', label: 'Builder', icon: Hammer },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="container flex h-32 items-center justify-between px-[24px]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center group">
            <img src="/logo.png" alt="Riftgate" className="h-28 w-auto object-contain" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href.split('#')[0]) && href !== '/#deals')
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    active ? 'text-white' : 'text-muted-foreground hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {active && <span className="absolute left-2 right-2 -bottom-[9px] h-0.5 bg-rift rounded-full" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/search" className="flex items-center gap-2 px-3 py-2 rounded-md bg-panel border border-white/5 text-sm text-muted-foreground hover:border-rift transition-colors min-w-[220px]">
            <Search className="w-4 h-4" />
            <span>Search cards, champions, sets…</span>
          </Link>
          <Link href="/deck-builder" className="px-4 py-2 rounded-md bg-rift text-white font-semibold text-sm hover:opacity-90 transition">
            Build Deck
          </Link>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-background/95 px-4 py-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="flex items-center gap-2 py-2 text-sm">
              <Icon className="w-4 h-4 text-rift" />{label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
