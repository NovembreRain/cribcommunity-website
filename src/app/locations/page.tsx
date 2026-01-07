import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { ArrowRight } from "lucide-react"

export const revalidate = 0 // Disable caching to see DB changes instantly

export default async function LocationsIndex() {
  const { data: locations } = await supabase
    .from('locations')
    .select('*')
    .eq('is_active', true)
    .order('name')

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-x-auto snap-x snap-mandatory flex bg-stone-900">
      {/* Loop through Locations */}
      {locations && locations.map((location) => (
        <div 
          key={location.id} 
          className="relative min-w-full h-full snap-center shrink-0 group overflow-hidden"
        >
          {/* Cinematic Background Image */}
          <div className="absolute inset-0">
            {location.cover_image ? (
              <Image 
                src={location.cover_image} 
                alt={location.name} 
                fill 
                className="object-cover transition-transform duration-[3s] group-hover:scale-105"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600">
                <span className="text-xl">No Cover Image</span>
              </div>
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-20 text-white pb-32">
            <div className="max-w-4xl transition-transform duration-500 group-hover:-translate-y-4">
              <h2 className="font-serif text-6xl md:text-8xl font-bold mb-6 tracking-tight drop-shadow-lg">
                {location.name}
              </h2>
              <p className="text-xl md:text-2xl font-light text-white/90 mb-10 max-w-xl leading-relaxed drop-shadow-md">
                {location.description}
              </p>
              
              <Link href={`/locations/${location.slug}`}>
                <button className="flex items-center gap-4 text-lg font-medium border border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 rounded-full hover:bg-white hover:text-black hover:border-white transition-all group-hover:pl-10">
                  Explore Properties <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {(!locations || locations.length === 0) && (
        <div className="min-w-full h-full flex items-center justify-center text-white/50 bg-stone-900">
          <div className="text-center">
             <h2 className="text-3xl font-serif mb-2">No Locations Found</h2>
             <p>Please seed the database via the SQL Editor.</p>
          </div>
        </div>
      )}
    </div>
  )
}