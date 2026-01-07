import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50">
      
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0">
          {/* ⚠️ ENSURE FILE EXISTS AT: public/images/hero-bg.jpg */}
          <Image 
            src="/images/hero-bg.jpg" 
            alt="Nature Stay in Auroville" 
            fill 
            className="object-cover"
            priority
            quality={90}
          />
          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white space-y-8 mt-16">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight drop-shadow-xl text-[#E0684B] md:text-white">
            Find Your Tribe <br className="hidden md:block" /> in Nature
          </h1>
          
          <p className="text-lg md:text-2xl font-light text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Safe, sustainable, and rustic stays for women, families, and creative souls in the heart of Auroville.
          </p>

          {/* BUTTON GROUP - Perfectly Aligned */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            
            {/* Primary Button */}
            <Link href="/locations" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-10 text-lg font-medium rounded-full bg-[#E0684B] hover:bg-[#c95235] text-white border-2 border-[#E0684B] shadow-xl transition-all hover:scale-105"
              >
                Explore Locations
              </Button>
            </Link>

            {/* Secondary Button */}
            <Link href="/about" className="w-full sm:w-auto">
              <Button 
                size="lg" 
                className="w-full sm:w-auto h-14 px-10 text-lg font-medium rounded-full bg-transparent/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-stone-900 shadow-xl transition-all hover:scale-105"
              >
                Our Story
              </Button>
            </Link>

          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/80">
          <div className="w-[30px] h-[50px] border-2 border-white rounded-full flex justify-center p-2 box-content">
            <div className="w-1 h-3 bg-white rounded-full animate-scroll" />
          </div>
        </div>
      </section>

      {/* --- REST OF CONTENT --- */}
      
    </div>
  )
}