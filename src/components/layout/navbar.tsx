import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export function Navbar() {
  return (
    // FIX: Warm background color to match logo
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF8F5]/90 backdrop-blur-md border-b border-[#E0Dcd5] transition-all">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex-shrink-0">
            {/* Note: Ensure your file is named 'logo.png' or update extension below */}
            <Image 
              src="/logo/logo.png" 
              alt="CribCommunity Logo" 
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#4A3B32]">
            Crib<span className="font-light text-[#8C7A6B]">Community</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold tracking-wide text-[#5C4D44]">
          <Link href="/locations" className="hover:text-[#E0684B] transition-colors uppercase">Locations</Link>
          <Link href="/about" className="hover:text-[#E0684B] transition-colors uppercase">Our Story</Link>
          <Link href="/journal" className="hover:text-[#E0684B] transition-colors uppercase">Journal</Link>
          <Link href="/contact" className="hover:text-[#E0684B] transition-colors uppercase">Contact</Link>
          
          <Link href="/locations">
            <Button className="rounded-full px-8 h-11 bg-[#E0684B] hover:bg-[#d05a3e] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-medium border-none">
              Book Now
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden p-2 text-[#5C4D44] hover:bg-[#F0EAE4] rounded-full transition-colors">
          <Menu className="w-7 h-7" />
        </button>
      </div>
    </nav>
  )
}