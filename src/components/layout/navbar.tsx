"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
// import { usePathname } from "next/navigation"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // const pathname = usePathname()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="text-sm font-bold tracking-widest uppercase text-[#5C4D44] hover:text-[#E0684B] transition-colors duration-300 relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E0684B] transition-all duration-300 group-hover:w-full" />
    </Link>
  )

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b border-transparent",
          isScrolled
            ? "bg-[#F7F1E3]/85 backdrop-blur-md h-20 shadow-sm border-[#E6E1D6]/50"
            : "bg-transparent h-24"
        )}
      >
        <div className="container mx-auto px-6 h-full flex items-center justify-between">

          {/* LEFT NAV (Desktop) */}
          <div className="hidden md:flex items-center justify-end flex-1 gap-8 lg:gap-12 pr-4 lg:pr-12">
            <NavLink href="/locations">Locations</NavLink>
            <NavLink href="/about">Our Story</NavLink>
            <NavLink href="/events">Events</NavLink>
          </div>

          {/* CENTER LOGO */}
          <Link href="/" className="relative group z-10 flex-shrink-0 transition-transform duration-300 hover:scale-105">
            <div className={cn(
              "relative transition-all duration-500",
              isScrolled ? "w-12 h-12" : "w-16 h-16"
            )}>
              <Image
                src="/logo/logo.png"
                alt="CribCommunity Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* RIGHT NAV (Desktop) */}
          <div className="hidden md:flex items-center justify-start flex-1 gap-8 lg:gap-12 pl-4 lg:pl-12">
            <NavLink href="/careers">Join Us</NavLink>
            <NavLink href="/blog">Blog</NavLink>
            <NavLink href="/contact">Contact</NavLink>

            <Link href="/locations">
              <Button className="rounded-full px-8 h-10 bg-[#E0684B] hover:bg-[#d05a3e] text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 font-bold tracking-wide text-xs uppercase">
                Book Now
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button
            className="md:hidden p-2 text-[#5C4D44] hover:bg-[#F0EAE4] rounded-full transition-colors absolute right-4"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={cn(
        "fixed inset-0 z-40 bg-[#F7F1E3] pt-24 px-6 transition-transform duration-500 ease-in-out md:hidden flex flex-col items-center gap-8",
        isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"
      )}>
        <Link href="/locations" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Locations</Link>
        <Link href="/about" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>
        <Link href="/events" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Events</Link>
        <Link href="/careers" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Join Us</Link>
        <Link href="/blog" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
        <Link href="/contact" className="text-xl font-serif font-bold text-[#4A3B32]" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
        <Link href="/locations" onClick={() => setIsMobileMenuOpen(false)}>
          <Button className="w-full rounded-full px-12 h-12 bg-[#E0684B] text-white text-lg font-bold">
            Book Now
          </Button>
        </Link>
      </div>
    </>
  )
}