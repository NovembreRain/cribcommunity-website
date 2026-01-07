import type { Metadata } from 'next'
import { Montserrat, Cormorant_Garamond } from 'next/font/google'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
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
        className={`${montserrat.variable} ${cormorant.variable} flex flex-col min-h-screen font-sans antialiased bg-[#FDF8F5] text-[#2D2A26]`}
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