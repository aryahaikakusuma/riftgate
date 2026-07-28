'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function SetBanner({ set }) {
  return (
    <Link href={`/sets/${set.id}`} className="group block">
      <div className={`relative h-56 rounded-xl overflow-hidden border border-white/5 bg-gradient-to-br ${set.coverGradient} card-hover`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.15) 12px, rgba(0,0,0,0.15) 24px)' }} />
        <div className="relative h-full p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="text-[10px] tracking-[0.3em] uppercase font-bold px-2 py-1 bg-black/60 backdrop-blur rounded">{set.code}</div>
            <div className="text-xs text-white/80 bg-black/40 px-2 py-1 rounded backdrop-blur">{set.totalCards} kartu</div>
          </div>
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white text-glow-orange">{set.name}</h3>
            <p className="text-sm text-white/80 mt-1 line-clamp-2">{set.tagline}</p>
            <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-white group-hover:text-rift transition">
              Explore Set <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
