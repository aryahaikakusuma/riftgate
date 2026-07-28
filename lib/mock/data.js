// Riftbound TCG data — sourced from RiftScribe public API (cdn.riftscribe.gg)
// Cached locally in /lib/mock/riftscribe-cards.json (fetched once at build).
// Refs: riftbound.gg/cards, riftscribe.gg/api-docs
import RAW from './riftscribe-cards.json'
import ORACLE from './riftscribe-oracle.json'

// ---- Domains / Factions ---------------------------------------------------
export const DOMAINS = [
  { id: 'body',      name: 'Body',      color: '#E63946', hex: 'E63946' },
  { id: 'mind',      name: 'Mind',      color: '#4CA5FF', hex: '4CA5FF' },
  { id: 'chaos',     name: 'Chaos',     color: '#B02BFF', hex: 'B02BFF' },
  { id: 'order',     name: 'Order',     color: '#F4C542', hex: 'F4C542' },
  { id: 'fury',      name: 'Fury',      color: '#FF6B00', hex: 'FF6B00' },
  { id: 'calm',      name: 'Calm',      color: '#3EDC81', hex: '3EDC81' },
  { id: 'colorless', name: 'Colorless', color: '#9CA3AF', hex: '9CA3AF' },
]

export const RARITIES = [
  { id: 'common',    name: 'Common',    color: '#9ca3af' },
  { id: 'uncommon',  name: 'Uncommon',  color: '#22c55e' },
  { id: 'rare',      name: 'Rare',      color: '#3b82f6' },
  { id: 'epic',      name: 'Epic',      color: '#a855f7' },
  { id: 'showcase',  name: 'Showcase',  color: '#f59e0b' },
]

export const CARD_TYPES = ['Legend', 'Unit', 'Gear', 'Rune', 'Battlefield', 'Spell']

// ---- Sets ---(codes match RiftScribe API) ---------------------------------
export const SETS = [
  { id: 'OGN', code: 'OGN', name: 'Origins',                releaseDate: '2025-10-17', totalCards: 288, coverGradient: 'from-orange-600 via-red-600 to-neutral-900',      tagline: 'Awal legenda Riftbound. Set pembuka dengan 12 champion utama.' },
  { id: 'OGS', code: 'OGS', name: 'Origins Proving Grounds', releaseDate: '2025-10-17', totalCards: 64,  coverGradient: 'from-yellow-500 via-orange-600 to-neutral-900',   tagline: 'Preconstructed starter deck untuk masuk kompetitif.' },
  { id: 'SFD', code: 'SFD', name: 'Spiritforged',           releaseDate: '2026-02-13', totalCards: 240, coverGradient: 'from-emerald-600 via-teal-700 to-neutral-900',    tagline: 'Ekspansi mekanik Spirit — sinergi champion baru.' },
  { id: 'UNL', code: 'UNL', name: 'Unleashed',              releaseDate: '2026-04-25', totalCards: 180, coverGradient: 'from-purple-600 via-fuchsia-700 to-neutral-900',  tagline: 'Set ketiga bertema kebangkitan dari kegelapan.' },
  { id: 'VEN', code: 'VEN', name: 'Vendetta',               releaseDate: '2026-08-14', totalCards: 220, coverGradient: 'from-red-700 via-rose-800 to-neutral-900',        tagline: 'Set keempat bertema balas dendam. Rune Fury dominan.' },
]

export const LEGENDS = ['Ahri','Teemo','Jhin','Darius','Sett','Vex','Yasuo','Lux','Viktor','Jinx','Zed','Lulu','Braum','Ekko','Vi','Caitlyn','Jayce','Heimerdinger']

// ---- Seeded deterministic PRNG (no hydration mismatch) --------------------
const seeded = (seed) => {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) { s ^= seed.charCodeAt(i); s = Math.imul(s, 16777619) >>> 0 }
  return () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return (s & 0x7fffffff) / 0x7fffffff }
}
const BASE_DATE = new Date('2026-06-15T00:00:00Z').getTime()

const basePriceFor = (rarity, seed) => {
  const rnd = seeded(`b-${seed}`)
  const base = rarity === 'showcase' ? 35 : rarity === 'epic' ? 12 : rarity === 'rare' ? 4 : rarity === 'uncommon' ? 1.2 : 0.35
  return Number((base * (0.7 + rnd() * 0.9)).toFixed(2))
}
const mkPrice = (base, seed) => {
  const rnd = seeded(`p-${seed}`)
  const days = 60
  const points = []
  let p = base
  for (let i = days - 1; i >= 0; i--) {
    const drift = (Math.sin(i / 4) * 0.05 + (rnd() - 0.5) * 0.08) * base
    p = Math.max(base * 0.45, p + drift)
    points.push({ date: new Date(BASE_DATE - i * 24 * 3600 * 1000).toISOString().slice(0, 10), price: Number(p.toFixed(2)) })
  }
  return points
}
const mkListings = (base, seed) => {
  const rnd = seeded(`l-${seed}`)
  const markets = ['CardKingdom', 'TCGPlayer', 'RiftMarket', 'Tokopedia TCG', 'Shopee TCG']
  return markets.map((m, i) => ({
    market: m,
    price: Number((base * (0.85 + rnd() * 0.4)).toFixed(2)),
    stock: Math.floor(rnd() * 40) + 1,
    condition: ['NM', 'LP', 'MP'][Math.floor(rnd() * 3)],
    seller: `seller_${i + 1}`,
  })).sort((a, b) => a.price - b.price)
}

// Convert RAW RiftScribe card to our internal shape
const KNOWN_LEGENDS = new Set(LEGENDS.map(l => l.toLowerCase()))
function toCard(r) {
  const seed = r.id
  const base = basePriceFor(r.rarity, seed)
  const setSize = SETS.find(s => s.id === r.set_id)?.totalCards || 300
  const oracle = ORACLE[r.id] || {}
  // Extract legend name if possible from name ("Ahri, Nine-Tailed Vixen" → "Ahri")
  let legend = null
  if (r.type === 'Legend') {
    const first = (r.name || '').split(',')[0].trim()
    legend = first || null
  } else {
    const words = (r.name || '').split(/\W+/)
    for (const w of words) {
      if (KNOWN_LEGENDS.has(w.toLowerCase())) { legend = w; break }
    }
  }
  return {
    id: r.id,
    number: `${String(r.collector_number).padStart(3, '0')}/${setSize}`,
    name: r.name,
    setId: r.set_id,
    type: r.type,
    domain: r.faction || 'colorless',
    rarity: r.rarity,
    energy: r.stats?.energy ?? null,
    power: r.stats?.might ?? null,
    hp: r.stats?.power ?? null,
    legend,
    variant: r.variant || '',
    orientation: r.orientation || 'portrait',
    isBanned: !!r.is_banned,
    image: r.image_thumb?.medium || r.image,
    imageLarge: r.image_thumb?.large || r.image,
    imageSmall: r.image_thumb?.small || r.image,
    imageBlur: r.blur,
    text: oracle.description || '',
    flavorText: oracle.flavor_text || '',
    keywords: oracle.keywords || [],
    tags: oracle.tags || [],
    artist: oracle.artist || null,
    basePrice: base,
    priceHistory: mkPrice(base, seed),
    listings: mkListings(base, seed),
  }
}

// Filter out non-standard sets and duplicate variants for cleaner listing.
export const CARDS = RAW
  .filter(r => r && r.image_thumb?.medium && SETS.some(s => s.id === r.set_id))
  .map(toCard)

export const getCardById = (id) => CARDS.find(c => c.id === id)
export const getSetById = (id) => SETS.find(s => s.id === id)
export const getCardsBySet = (setId) => CARDS.filter(c => c.setId === setId)
export const getDomain = (id) => DOMAINS.find(d => d.id === id)
export const getRarity = (id) => RARITIES.find(r => r.id === id)
