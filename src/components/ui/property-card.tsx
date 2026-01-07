"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, ArrowUpRight } from "lucide-react"
import type { Property } from "@/lib/supabase"

interface PropertyCardProps {
  property: Property
  href: string
}

export function PropertyCard({ property, href }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Use slideshow_images for the hover effect, fallback to gallery or placeholder
  const images = property.slideshow_images && property.slideshow_images.length > 0 
    ? property.slideshow_images 
    : (property.gallery_images && property.gallery_images.length > 0 ? property.gallery_images : ['/images/placeholder.jpg'])

  // Slideshow Logic
  useEffect(() => {
    if (isHovered && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      }, 1500) // Change image every 1.5s
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setCurrentImageIndex(0) // Reset to cover image
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isHovered, images.length])

  return (
    <Link href={href} className="block h-full">
      <div 
        className="group relative h-[500px] w-full overflow-hidden rounded-none md:rounded-2xl cursor-pointer bg-muted"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Slideshow Layer */}
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              transition={{ duration: 0.5 }}
              className="relative h-full w-full"
            >
              {images[currentImageIndex] && (
                <Image
                  src={images[currentImageIndex]!}
                  alt={property.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dark Overlay (Appears on Hover) */}
        <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8">
          {/* Frosted Glass Content Card */}
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 group-hover:bg-white/20 group-hover:-translate-y-2 translate-y-0 shadow-lg">
            
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-md">
                  {property.name}
                </h3>
                <div className="flex items-center text-white/90 text-sm mb-4 font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  {property.address || "Auroville, India"}
                </div>
                <p className="text-white/90 line-clamp-2 font-light text-sm max-w-md leading-relaxed">
                   {property.short_description || property.description}
                </p>
              </div>
              
              <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Link>
  )
}