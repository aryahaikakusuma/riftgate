'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HeroCarousel from '@/components/HeroCarousel'
import CardThumbnail from '@/components/CardThumbnail'
import SetBanner from '@/components/SetBanner'
import { CARDS, SETS } from '@/lib/mock/data'
import Link from 'next/link'
import { TrendingUp, Flame, Zap, Trophy, ChevronRight, Hammer } from 'lucide-react'

export default function HomePage() {
  const deals = [...CARDS].sort((a, b) => b.basePrice - a.basePrice).slice(0, 12)
  const trending = [...CARDS].sort(() => Math.random() - 0.5).slice(0, 12)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8 space-y-16">
        <HeroCarousel />

        {/* Deals section */}
        <section id="deals">
          <SectionHeader
            icon={<Flame className="w-5 h-5 text-rift" />}
            title="Deals — Turun Harga Hari Ini"
            sub="Kartu yang harganya lagi drop. Buruan sebelum naik lagi."
            href="/search"
          />
          <HorizontalCards cards={deals} />
        </section>

        {/* Feature spotlight */}
        <section className="grid md:grid-cols-3 gap-4">
          <FeatureCard
            icon={<Hammer className="w-6 h-6" />}
            title="Deck Builder"
            body="Rakit deck dari koleksimu. Pilih Legend, susun 40 kartu, export list ke turnamen."
            cta="Mulai Build"
            href="/deck-builder"
            primary
          />
          <FeatureCard
            icon={<TrendingUp className="w-6 h-6" />}
            title="Price Radar"
            body="Chart 60 hari, alert perubahan harga, dan estimasi total value koleksi otomatis."
            cta="Cek Harga"
            href="/search"
          />
          <FeatureCard
            icon={<Trophy className="w-6 h-6" />}
            title="Collection Tracker"
            body="Simpan kartu yang kamu punya, lihat progress checklist per set, ekspor CSV."
            cta="Buka Collection"
            href="/collect"
          />
        </section>

        {/* Trending */}
        <section>
          <SectionHeader
            icon={<Zap className="w-5 h-5 text-rift" />}
            title="Trending — Meta Watch"
            sub="Kartu yang lagi banyak dipakai di turnamen minggu ini."
            href="/search"
          />
          <HorizontalCards cards={trending} />
        </section>

        {/* Sets */}
        <section>
          <SectionHeader
            icon={<Trophy className="w-5 h-5 text-rift" />}
            title="Semua Set Riftbound"
            sub="Dari Origins sampai Vendetta."
            href="/sets"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SETS.slice(0, 3).map(s => <SetBanner key={s.id} set={s} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function SectionHeader({ icon, title, sub, href }) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">{icon}<h2 className="text-xl md:text-2xl font-black tracking-tight">{title}</h2></div>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
      {href && (
        <Link href={href} className="hidden md:inline-flex items-center gap-1 text-sm text-rift font-semibold hover:underline">
          Lihat semua <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  )
}

function HorizontalCards({ cards }) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4">
      {cards.map(c => (
        <div key={c.id} className="w-40 sm:w-48 shrink-0"><CardThumbnail card={c} /></div>
      ))}
    </div>
  )
}

function FeatureCard({ icon, title, body, cta, href, primary }) {
  return (
    <Link href={href} className={`relative block p-6 rounded-xl border card-hover ${primary ? 'bg-gradient-rift border-transparent text-white' : 'bg-panel border-white/5 hover:border-rift'}`}>
      <div className={`w-12 h-12 rounded-lg grid place-items-center mb-4 ${primary ? 'bg-white/20' : 'bg-rift/10 text-rift'}`}>{icon}</div>
      <div className={`text-lg font-bold mb-2 ${primary ? 'text-white' : ''}`}>{title}</div>
      <p className={`text-sm mb-4 ${primary ? 'text-white/85' : 'text-muted-foreground'}`}>{body}</p>
      <div className={`inline-flex items-center gap-1 text-sm font-semibold ${primary ? 'text-white' : 'text-rift'}`}>
        {cta} <ChevronRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
