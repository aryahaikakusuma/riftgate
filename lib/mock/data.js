// Riftbound TCG mock data — sets, domains, rarities, cards.
// Ref: riftbound.gg/cards, riftbound.gg/sets

export const DOMAINS = [
  { id: 'body',   name: 'Body',   color: '#E63946', hex: 'E63946', hueClass: 'text-red-400',    ringClass: 'ring-red-500'    },
  { id: 'mind',   name: 'Mind',   color: '#4CA5FF', hex: '4CA5FF', hueClass: 'text-blue-400',   ringClass: 'ring-blue-500'   },
  { id: 'chaos',  name: 'Chaos',  color: '#B02BFF', hex: 'B02BFF', hueClass: 'text-purple-400', ringClass: 'ring-purple-500' },
  { id: 'order',  name: 'Order',  color: '#F4C542', hex: 'F4C542', hueClass: 'text-yellow-300', ringClass: 'ring-yellow-500' },
  { id: 'fury',   name: 'Fury',   color: '#FF6B00', hex: 'FF6B00', hueClass: 'text-orange-400', ringClass: 'ring-orange-500' },
  { id: 'calm',   name: 'Calm',   color: '#3EDC81', hex: '3EDC81', hueClass: 'text-emerald-400',ringClass: 'ring-emerald-500'},
]

export const RARITIES = [
  { id: 'common',    name: 'Common',    color: '#9ca3af' },
  { id: 'uncommon',  name: 'Uncommon',  color: '#22c55e' },
  { id: 'rare',      name: 'Rare',      color: '#3b82f6' },
  { id: 'epic',      name: 'Epic',      color: '#a855f7' },
  { id: 'legendary', name: 'Legendary', color: '#f59e0b' },
  { id: 'mythic',    name: 'Mythic',    color: '#ef4444' },
]

export const CARD_TYPES = ['Legend', 'Champion', 'Unit', 'Gear', 'Rune', 'Battlefield', 'Spell']

export const SETS = [
  { id: 'OGN',    code: 'OGN',    name: 'Origins',                releaseDate: '2025-10-17', totalCards: 288, coverGradient: 'from-orange-600 via-red-600 to-neutral-900', tagline: 'Awal legenda Riftbound. Set pembuka dengan 12 champion utama.' },
  { id: 'OGN-PG', code: 'OGN-PG', name: 'Origins Proving Grounds', releaseDate: '2025-10-17', totalCards: 64,  coverGradient: 'from-yellow-500 via-orange-600 to-neutral-900', tagline: 'Preconstructed starter deck untuk masuk kompetitif.' },
  { id: 'SPF',    code: 'SPF',    name: 'Spiritforged',           releaseDate: '2026-02-13', totalCards: 240, coverGradient: 'from-emerald-600 via-teal-700 to-neutral-900', tagline: 'Ekspansi mekanik Spirit — sinergi champion baru.' },
  { id: 'ARC',    code: 'ARC',    name: 'Arcane',                 releaseDate: '2026-04-25', totalCards: 180, coverGradient: 'from-purple-600 via-fuchsia-700 to-neutral-900', tagline: 'Kolaborasi dengan serial Arcane. Champion Piltover & Zaun.' },
  { id: 'VND',    code: 'VND',    name: 'Vendetta',               releaseDate: '2026-08-14', totalCards: 220, coverGradient: 'from-red-700 via-rose-800 to-neutral-900', tagline: 'Set ketiga bertema balas dendam. Rune Fury dominan.' },
]

// Legends / Champions (nama-nama champion League of Legends yang muncul di Riftbound)
export const LEGENDS = ['Ahri','Teemo','Jhin','Darius','Sett','Vex','Yasuo','Lux','Viktor','Jinx','Zed','Lulu','Braum','Ekko','Vi','Caitlyn','Jayce','Heimerdinger']

// Deterministic seeded PRNG so SSR + client render matches (avoids hydration mismatch).
const seeded = (seed) => {
  let s = 2166136261
  for (let i = 0; i < seed.length; i++) { s ^= seed.charCodeAt(i); s = Math.imul(s, 16777619) >>> 0 }
  return () => { s = (Math.imul(s, 1103515245) + 12345) >>> 0; return (s & 0x7fffffff) / 0x7fffffff }
}

const BASE_DATE = new Date('2026-06-15T00:00:00Z').getTime()

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

let _id = 0
const mk = (partial) => {
  _id++
  const cardId = `${partial.setId}-${String(_id).padStart(3, '0')}`
  const base = partial.basePrice ?? (partial.rarity === 'mythic' ? 45 : partial.rarity === 'legendary' ? 22 : partial.rarity === 'epic' ? 9 : partial.rarity === 'rare' ? 3.5 : partial.rarity === 'uncommon' ? 0.9 : 0.25)
  return {
    id: cardId,
    number: `${String(_id).padStart(3, '0')}/${partial.setSize || 288}`,
    ...partial,
    basePrice: base,
    priceHistory: mkPrice(base, cardId),
    listings: mkListings(base, cardId),
  }
}

_id = 0
export const CARDS = [
  // === ORIGINS ===
  mk({ setId: 'OGN', setSize: 288, name: 'Ahri, Nine-Tailed Vixen', type: 'Legend',      domain: 'chaos', rarity: 'mythic',    energy: 4, power: 5, hp: 5, legend: 'Ahri',    text: 'Once per turn: return a Unit to its owner\'s hand. Champion Ahri gains +1 Power for each Chaos rune spent.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Teemo, Swift Scout',       type: 'Legend',      domain: 'calm',  rarity: 'legendary', energy: 2, power: 2, hp: 3, legend: 'Teemo',   text: 'Stealth. When Teemo deals damage, place a Poison Dart on target Champion.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Jhin, Virtuoso',           type: 'Legend',      domain: 'body',  rarity: 'mythic',    energy: 5, power: 4, hp: 4, legend: 'Jhin',    text: 'Every 4th shot deals double damage. Jhin cannot be targeted while set-up.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Darius, Hand of Noxus',    type: 'Legend',      domain: 'fury',  rarity: 'legendary', energy: 4, power: 6, hp: 5, legend: 'Darius',  text: 'Overpower. When an enemy Unit dies, Darius gains +1 Power this turn.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Sett, The Boss',           type: 'Legend',      domain: 'fury',  rarity: 'legendary', energy: 3, power: 4, hp: 5, legend: 'Sett',    text: 'Whenever Sett is damaged, gain equal Power until end of turn.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Vex, The Gloomist',        type: 'Legend',      domain: 'chaos', rarity: 'epic',      energy: 3, power: 2, hp: 4, legend: 'Vex',     text: 'When you play a Chaos rune, deal 1 damage to enemy Champion.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Ahri\'s Charm',            type: 'Spell',       domain: 'chaos', rarity: 'rare',      energy: 2, text: 'Take control of target Unit with Power 3 or less until end of turn.', legend: 'Ahri' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Noxian Guillotine',        type: 'Spell',       domain: 'fury',  rarity: 'uncommon',  energy: 3, text: 'Deal 5 damage to a Unit with 3 or less HP. If it dies, refund 1 Fury rune.', legend: 'Darius' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Poison Trail',             type: 'Rune',        domain: 'calm',  rarity: 'common',    text: 'Generate 1 Calm rune. Whenever an enemy Champion moves, deal 1 damage.', legend: 'Teemo' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Curtain Call',             type: 'Gear',        domain: 'body',  rarity: 'epic',      energy: 3, text: 'Equipped Champion gains Ranged and Sniper. Shots ignore Guard.', legend: 'Jhin' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Ionian Blossom',           type: 'Battlefield', domain: 'chaos', rarity: 'rare',      text: 'While on the field: Chaos runes cost 1 less to activate (min 1).' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Vixen Fox Kit',            type: 'Unit',        domain: 'chaos', rarity: 'common',    energy: 1, power: 1, hp: 2, text: 'When summoned, look at top card of your deck.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Noxian Grunt',             type: 'Unit',        domain: 'fury',  rarity: 'common',    energy: 1, power: 2, hp: 1, text: 'Aggressive.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Bandle Scout',             type: 'Unit',        domain: 'calm',  rarity: 'common',    energy: 1, power: 1, hp: 1, text: 'Stealth. Cannot be blocked by Units with Power 3+.' }),
  mk({ setId: 'OGN', setSize: 288, name: 'Piltover Peacemaker',      type: 'Spell',       domain: 'order', rarity: 'uncommon',  energy: 3, text: 'Deal 3 damage in a line. Advance your Sniper by 1.', legend: 'Caitlyn' }),

  // === ORIGINS PROVING GROUNDS ===
  mk({ setId: 'OGN-PG', setSize: 64, name: 'Lux, Ray of Hope',        type: 'Legend',      domain: 'order', rarity: 'epic',      energy: 3, power: 3, hp: 4, legend: 'Lux',     text: 'When you play an Order rune, draw a card if Lux is uninjured.' }),
  mk({ setId: 'OGN-PG', setSize: 64, name: 'Viktor, Machine Herald',   type: 'Legend',      domain: 'mind',  rarity: 'epic',      energy: 4, power: 3, hp: 4, legend: 'Viktor',  text: 'Adapt: gain a random keyword each turn.' }),
  mk({ setId: 'OGN-PG', setSize: 64, name: 'Prismatic Barrier',       type: 'Spell',       domain: 'order', rarity: 'common',    energy: 2, text: 'Prevent next 4 damage to your Champion.', legend: 'Lux' }),
  mk({ setId: 'OGN-PG', setSize: 64, name: 'Hex Core',                type: 'Gear',        domain: 'mind',  rarity: 'uncommon',  energy: 2, text: 'Equipped Champion may draw a card once per turn.', legend: 'Viktor' }),
  mk({ setId: 'OGN-PG', setSize: 64, name: 'Demacian Standard',       type: 'Battlefield', domain: 'order', rarity: 'common',    text: 'Order Units gain +0/+1 while on the field.' }),

  // === SPIRITFORGED ===
  mk({ setId: 'SPF', setSize: 240, name: 'Yasuo, Unforgiven',        type: 'Legend',      domain: 'mind',  rarity: 'mythic',    energy: 4, power: 4, hp: 4, legend: 'Yasuo',   text: 'Windwall: negate the next enemy Spell. If it targeted Yasuo, refund its cost to you.' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Lulu, Fae Sorceress',       type: 'Legend',      domain: 'calm',  rarity: 'legendary', energy: 3, power: 2, hp: 3, legend: 'Lulu',    text: 'Polymorph: transform target Unit into a 1/1 Squirrel until end of turn.' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Braum, Heart of Freljord', type: 'Legend',      domain: 'order', rarity: 'legendary', energy: 3, power: 1, hp: 6, legend: 'Braum',   text: 'Guard. Allies behind Braum take -1 damage from all sources.' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Spirit Blossom',            type: 'Battlefield', domain: 'calm',  rarity: 'rare',      text: 'Once per turn: transform a rune into a Spirit rune.' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Steel Tempest',             type: 'Spell',       domain: 'mind',  rarity: 'uncommon',  energy: 2, text: 'Deal 2 damage. If this is the third Steel Tempest played, deal 4 instead and knock up.', legend: 'Yasuo' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Pix, Faerie Companion',     type: 'Unit',        domain: 'calm',  rarity: 'uncommon',  energy: 1, power: 0, hp: 2, text: 'Support: attached Champion gains +2 Power.', legend: 'Lulu' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Frostshield',               type: 'Gear',        domain: 'order', rarity: 'rare',      energy: 2, text: 'Equipped Champion gains Guard and immunity to freeze.', legend: 'Braum' }),
  mk({ setId: 'SPF', setSize: 240, name: 'Kitsune Emissary',          type: 'Unit',        domain: 'chaos', rarity: 'rare',      energy: 2, power: 2, hp: 2, text: 'When played, return a Chaos rune from graveyard to hand.' }),

  // === ARCANE ===
  mk({ setId: 'ARC', setSize: 180, name: 'Jinx, Loose Cannon',       type: 'Legend',      domain: 'chaos', rarity: 'mythic',    energy: 3, power: 4, hp: 3, legend: 'Jinx',    text: 'Get Excited! Whenever an enemy Champion dies, Jinx gains +2 Power and +1 Speed.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Vi, Piltover Enforcer',    type: 'Legend',      domain: 'fury',  rarity: 'legendary', energy: 4, power: 5, hp: 5, legend: 'Vi',      text: 'Vault Breaker: bypass Guard once per game.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Caitlyn, Sheriff',         type: 'Legend',      domain: 'order', rarity: 'legendary', energy: 3, power: 3, hp: 4, legend: 'Caitlyn', text: 'Ace in the Hole: Snipe from anywhere on the field.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Jayce, Defender',           type: 'Legend',      domain: 'mind',  rarity: 'legendary', energy: 3, power: 3, hp: 4, legend: 'Jayce',   text: 'Transform between Cannon and Hammer form each turn.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Ekko, Boy Who Shattered Time', type: 'Legend',  domain: 'mind',  rarity: 'mythic',    energy: 4, power: 3, hp: 4, legend: 'Ekko',    text: 'Rewind: once per game, return Ekko to state at start of turn.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Fishbones',                 type: 'Gear',        domain: 'chaos', rarity: 'epic',      energy: 3, text: 'Equipped Champion gains AoE: attacks deal 1 damage to adjacent Units.', legend: 'Jinx' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Piltover Skyline',          type: 'Battlefield', domain: 'order', rarity: 'rare',      text: 'Order and Mind Units gain +1 range.' }),
  mk({ setId: 'ARC', setSize: 180, name: 'Zaun Chem-Punk',            type: 'Unit',        domain: 'chaos', rarity: 'common',    energy: 2, power: 3, hp: 1, text: 'When killed, deal 1 damage to your Champion.' }),

  // === VENDETTA ===
  mk({ setId: 'VND', setSize: 220, name: 'Zed, Master of Shadows',   type: 'Legend',      domain: 'fury',  rarity: 'mythic',    energy: 3, power: 4, hp: 3, legend: 'Zed',     text: 'Living Shadow: create a copy of Zed with half stats. Attacks are combined.' }),
  mk({ setId: 'VND', setSize: 220, name: 'Heimerdinger, Revered Inventor', type: 'Legend', domain: 'mind', rarity: 'epic',     energy: 4, power: 1, hp: 4, legend: 'Heimerdinger', text: 'Deploy Turret: summon a 0/2 Turret with Ranged.' }),
  mk({ setId: 'VND', setSize: 220, name: 'Death Mark',                type: 'Spell',       domain: 'fury',  rarity: 'rare',      energy: 3, text: 'Mark a Champion. If they take damage from Zed this turn, deal double.', legend: 'Zed' }),
  mk({ setId: 'VND', setSize: 220, name: 'Vengeful Blade',            type: 'Gear',        domain: 'fury',  rarity: 'rare',      energy: 2, text: 'When equipped Champion takes damage, retaliate for equal Power.' }),
  mk({ setId: 'VND', setSize: 220, name: 'H-28G Evolution Turret',    type: 'Unit',        domain: 'mind',  rarity: 'common',    energy: 1, power: 0, hp: 2, text: 'Ranged. When Heimerdinger is in play, deals +1 damage.', legend: 'Heimerdinger' }),
  mk({ setId: 'VND', setSize: 220, name: 'Shadow Realm',              type: 'Battlefield', domain: 'fury',  rarity: 'epic',      text: 'Fury Champions gain Stealth on the turn they are summoned.' }),
  mk({ setId: 'VND', setSize: 220, name: 'Runic Blast',               type: 'Rune',        domain: 'fury',  rarity: 'uncommon',  text: 'Generate 1 Fury rune. Deal 1 damage.' }),
]

export const getCardById = (id) => CARDS.find(c => c.id === id)
export const getSetById = (id) => SETS.find(s => s.id === id)
export const getCardsBySet = (setId) => CARDS.filter(c => c.setId === setId)
export const getDomain = (id) => DOMAINS.find(d => d.id === id)
export const getRarity = (id) => RARITIES.find(r => r.id === id)
