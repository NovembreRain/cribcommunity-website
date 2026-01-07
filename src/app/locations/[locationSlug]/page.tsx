import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { PropertyCard } from "@/components/ui/property-card"
import type { Property } from "@/lib/supabase"

interface PageProps {
  params: Promise<{ locationSlug: string }>
}

export default async function LocationDetailPage({ params }: PageProps) {
  const { locationSlug } = await params

  // 1. Get Location ID
  const { data: location } = await supabase
    .from('locations')
    .select('*')
    .eq('slug', locationSlug)
    .single()

  if (!location) return notFound()

  // 2. Get Properties for this Location
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('location_id', location.id)
    .order('name')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <header className="mb-20 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-primary mb-6">
            {location.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            {location.description}
          </p>
        </header>

        {/* The Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[500px]">
          {properties && properties.length > 0 ? (
            properties.map((property: Property, index: number) => (
              <div 
                key={property.id} 
                // Visual Pattern: Every 3rd item spans 2 columns on medium screens
                className={index % 3 === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <PropertyCard 
                  property={property} 
                  href={`/locations/${locationSlug}/${property.slug}`} 
                />
              </div>
            ))
          ) : (
             <div className="col-span-full text-center py-20 text-muted-foreground border border-dashed rounded-xl">
               <p>No properties added to this location yet.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  )
}