'use client'
import { useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1773216344170-7fca0c1f83ea?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80',
    tag: 'New Set',
    title: 'Spiritforged',
    subtitle: 'Riftbound\'s second expansion. 240 cards, a new Spirit mechanic, and 6 legendary champions ready to battle.',
    cta: { label: 'Explore Spiritforged', href: '/sets/SFD' },
  },
  {
    img: 'https://images.unsplash.com/photo-1514922121266-75835418bbf1?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80',
    tag: 'Meta Report',
    title: 'Fury Dominates',
    subtitle: 'Rune Fury is up 34% in top 8 tournaments this week. Check out the trending Zed & Darius deck lists.',
    cta: { label: 'View Decks', href: '/deck-builder' },
  },
  {
    img: 'https://images.unsplash.com/photo-1600081728723-c8aa2ee3236a?crop=entropy&cs=srgb&fm=jpg&w=1600&q=80',
    tag: 'Price Watch',
    title: 'Origins Mythics Soaring',
    subtitle: 'Origins Showcase card prices are soaring after the banlist rotation. Lock in now or wait for a correction.',
    cta: { label: 'Check Origins', href: '/sets/OGN' },
  },
]

export default function HeroCarousel() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true })
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!embla) return
    const onSelect = () => setIdx(embla.selectedScrollSnap())
    embla.on('select', onSelect)
    const t = setInterval(() => embla.scrollNext(), 6000)
    return () => { embla.off('select', onSelect); clearInterval(t) }
  }, [embla])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/5" ref={emblaRef}>
      <div className="flex">
        {SLIDES.map((s, i) => (
          <div key={i} className="relative flex-[0_0_100%] min-w-0 aspect-[16/7] md:aspect-[16/6]">
            <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
            <div className="relative h-full flex items-center px-6 md:px-12">
              <div className="max-w-xl">
                <div className="inline-block text-[10px] tracking-[0.25em] uppercase font-bold px-2 py-1 rounded bg-rift text-white mb-4">{s.tag}</div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-3">{s.title}</h1>
                <p className="text-sm md:text-base text-white/80 mb-6">{s.subtitle}</p>
                <Link href={s.cta.href} className="inline-flex px-5 py-2.5 bg-rift text-white font-semibold rounded-md text-sm hover:opacity-90 transition">
                  {s.cta.label}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => embla?.scrollPrev()} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-rift grid place-items-center">
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button onClick={() => embla?.scrollNext()} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur border border-white/10 hover:border-rift grid place-items-center">
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => embla?.scrollTo(i)} className={`h-1.5 rounded-full transition-all ${i === idx ? 'bg-rift w-8' : 'bg-white/40 w-2'}`} />
        ))}
      </div>
    </div>
  )
}
