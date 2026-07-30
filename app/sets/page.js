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
          <h1 className="text-3xl font-black tracking-tight">All <span className="text-rift">Sets</span></h1>
          <p className="text-sm text-muted-foreground">{SETS.length} official Riftbound TCG sets.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {SETS.map(s => (
            <div key={s.id} className="space-y-2">
              <SetBanner set={s} />
              <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                <span>Released: {new Date(s.releaseDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                <span>{getCardsBySet(s.id).length} cards available in database</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
