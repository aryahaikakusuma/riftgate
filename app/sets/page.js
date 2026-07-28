'use client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SetBanner from '@/components/SetBanner'
import { SETS, getCardsBySet } from '@/lib/mock/data'

export default function SetsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight">Semua <span className="text-rift">Set</span></h1>
          <p className="text-sm text-muted-foreground">{SETS.length} set resmi Riftbound TCG.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {SETS.map(s => (
            <div key={s.id} className="space-y-2">
              <SetBanner set={s} />
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Rilis: {new Date(s.releaseDate).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span>{getCardsBySet(s.id).length} kartu tersedia di database</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
