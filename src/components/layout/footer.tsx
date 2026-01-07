import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#F7F1E3] border-t border-[#E0DCD5] pt-16 pb-8">
      <div className="container mx-auto px-6">
        {/* Changed to 3 columns since we removed the Legal section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold text-[#4A3B32]">CribCommunity</h3>
            <p className="text-[#5C4D44] leading-relaxed">
              Safe, sustainable, and nature-immersed stays for the modern traveler in Auroville.
            </p>
          </div>

          {/* Links - Consolidated */}
          <div className="md:pl-10"> {/* Added padding for visual balance */}
            <h4 className="font-bold text-[#4A3B32] mb-4 uppercase text-sm tracking-wider">Explore</h4>
            <ul className="space-y-2 text-[#5C4D44]">
              <li>
                <Link href="/locations" className="hover:text-[#E0684B] transition-colors">
                  Locations
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#E0684B] transition-colors">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/journal" className="hover:text-[#E0684B] transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#E0684B] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-bold text-[#4A3B32] mb-4 uppercase text-sm tracking-wider">Connect</h4>
            <div className="flex gap-4 text-[#5C4D44]">
              <a href="#" className="hover:text-[#E0684B] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#E0684B] transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-[#E0684B] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E0DCD5] pt-8 text-center text-[#8C7A6B] text-sm">
          &copy; {new Date().getFullYear()} CribCommunity. All rights reserved.
        </div>
      </div>
    </footer>
  )
}