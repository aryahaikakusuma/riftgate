'use client'
import CardThumbnail from './CardThumbnail'

export default function CardGrid({ cards, empty = 'No cards found.' }) {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        {empty}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {cards.map(c => <CardThumbnail key={c.id} card={c} />)}
    </div>
  )
}
