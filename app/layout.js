import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Riftgate — Riftbound TCG Marketplace & Database',
  description: 'Marketplace, price tracker, dan deck builder untuk Riftbound TCG. Cari kartu dari Origins, Spiritforged, Arcane, Vendetta.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
