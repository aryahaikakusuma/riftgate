import Link from 'next/link'
import { Twitter, Youtube, Twitch, DiscIcon as Discord, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-panel mt-24">
      <div className="container px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2">
          <div className="flex items-center mb-3">
            <img src="/logo.png" alt="Riftgate" className="h-14 w-auto object-contain" />
          </div>
          <p className="text-sm text-muted-foreground max-w-md">Marketplace, price tracker, and deck builder for Riftbound TCG. Price data sourced from the community and leading marketplaces.</p>
          <div className="flex items-center gap-3 mt-4">
            {[Twitter, Youtube, Twitch, Github].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 grid place-items-center rounded-md bg-panel-hi text-muted-foreground hover:text-rift hover:border hover:border-rift transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm uppercase tracking-wider text-rift">Explore</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/search" className="hover:text-white">Search Cards</Link></li>
            <li><Link href="/sets" className="hover:text-white">All Sets</Link></li>
            <li><Link href="/collect" className="hover:text-white">My Collection</Link></li>
            <li><Link href="/deck-builder" className="hover:text-white">Deck Builder</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold mb-3 text-sm uppercase tracking-wider text-rift">Resources</div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-white">Rules Reference</a></li>
            <li><a href="#" className="hover:text-white">Meta Reports</a></li>
            <li><a href="#" className="hover:text-white">Tournament Guide</a></li>
            <li><a href="#" className="hover:text-white">API Docs</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <div>© 2026 Riftgate. Fan-made marketplace. Not officially affiliated with Riot Games.</div>
          <div>Riftbound TCG, League of Legends, and related assets are the property of Riot Games, Inc.</div>
        </div>
      </div>
    </footer>
  )
}
