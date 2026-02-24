import type { Metadata } from 'next'
import { Playfair_Display, Outfit } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CribCommunity - Rustic Nature Hostels in Auroville',
  description: 'Safe, sustainable, and nature-immersed stays for women, families, and creative souls in Auroville.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        suppressHydrationWarning
        className={`${outfit.variable} ${playfairDisplay.variable} flex flex-col min-h-screen font-sans antialiased bg-background text-text-high`}
      >
        <Navbar />
        {/* FIX: Added pt-24 to prevent navbar overlap */}
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
