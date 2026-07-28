'use client'
// Simple localStorage-backed collection store.
const KEY = 'riftgate.collection.v1'

export function readCollection() {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch { return {} }
}

export function writeCollection(obj) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(obj))
}

export function addToCollection(cardId, qty = 1) {
  const c = readCollection()
  c[cardId] = (c[cardId] || 0) + qty
  if (c[cardId] <= 0) delete c[cardId]
  writeCollection(c)
  return c
}

export function setInCollection(cardId, qty) {
  const c = readCollection()
  if (qty <= 0) delete c[cardId]
  else c[cardId] = qty
  writeCollection(c)
  return c
}

// Deck store
const DECK_KEY = 'riftgate.deck.v1'
export function readDeck() {
  if (typeof window === 'undefined') return { legend: null, cards: {} }
  try { return JSON.parse(localStorage.getItem(DECK_KEY) || '{"legend":null,"cards":{}}') } catch { return { legend: null, cards: {} } }
}
export function writeDeck(d) {
  if (typeof window === 'undefined') return
  localStorage.setItem(DECK_KEY, JSON.stringify(d))
}
