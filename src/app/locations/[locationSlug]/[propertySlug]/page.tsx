import React from "react" // Fixes the UMD global error
import { notFound } from "next/navigation"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { BookingWidget } from "@/components/forms/booking-widget"
import { Wifi, Wind, MapPin, Users, CheckCircle2, Star, Calendar } from "lucide-react"


interface PageProps {
  params: Promise<{ locationSlug: string; propertySlug: string }>
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { propertySlug } = await params
  
  // 1. Fetch Property Details
  const { data: property } = await supabase
    .from('properties')
    .select('*')
    .eq('slug', propertySlug)
    .single()

  if (!property) return notFound()

  // 2. Fetch Rooms for this Property
  const { data: rooms } = await supabase
    .from('room_types')
    .select('*')
    .eq('property_id', property.id)
    .order('price_per_night')

  // Helper to use gallery or fallback
  const displayImages = property.gallery_images && property.gallery_images.length > 0 
    ? property.gallery_images 
    : ['/images/placeholder.jpg']

  return (
    <div className="min-h-screen bg-background">
      {/* --- HERO SECTION --- */}
      <div className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden">
        <Image 
          src={displayImages[0]} 
          alt={property.name} 
          fill 
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 text-white">
          <div className="container mx-auto">
             <div className="flex items-center gap-2 mb-4 text-white/80 uppercase tracking-widest text-sm font-medium">
               <MapPin className="w-4 h-4" /> {property.address || "Auroville, India"}
             </div>
             <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 shadow-sm">
               {property.name}
             </h1>
             {property.short_description && (
               <p className="text-xl text-white/90 max-w-2xl font-light">{property.short_description}</p>
             )}
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: Content (Span 8) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Description */}
            <section className="prose prose-lg text-muted-foreground max-w-none">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">About the Sanctuary</h2>
              <div className="leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
              
              {/* Feature Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 not-prose">
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border shadow-sm text-center">
                  <Wifi className="w-6 h-6 mb-3 text-primary" />
                  <span className="text-sm font-medium">Fast Wifi</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border shadow-sm text-center">
                  <Wind className="w-6 h-6 mb-3 text-primary" />
                  <span className="text-sm font-medium">AC / Fans</span>
                </div>
                 <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border shadow-sm text-center">
                  <Users className="w-6 h-6 mb-3 text-primary" />
                  <span className="text-sm font-medium">Community</span>
                </div>
                 <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-card border shadow-sm text-center">
                  <Calendar className="w-6 h-6 mb-3 text-primary" />
                  <span className="text-sm font-medium">Events</span>
                </div>
              </div>
            </section>

            {/* Gallery Preview */}
            {displayImages.length > 1 && (
               <section>
                 <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Visuals</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-96">
                    {displayImages.slice(1, 4).map((img: string, i: number) => (
                      <div key={i} className="relative h-full w-full rounded-xl overflow-hidden first:col-span-2 first:row-span-2 group">
                        <Image src={img} alt="Gallery" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                 </div>
               </section>
            )}

            {/* Rooms List */}
            <section>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-8">Accommodation Types</h2>
              <div className="grid gap-6">
                {rooms && rooms.length > 0 ? (
                  rooms.map((room) => (
                    <div key={room.id} className="group relative overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-md">
                      <div className="flex flex-col md:flex-row">
                        {/* Room Image */}
                        <div className="relative h-56 md:h-auto md:w-2/5 bg-muted">
                           {room.images && room.images.length > 0 ? (
                              <Image src={room.images[0]} alt={room.name} fill className="object-cover" />
                           ) : (
                             <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50">
                               <Users className="w-12 h-12 opacity-20" />
                             </div>
                           )}
                        </div>
                        
                        {/* Room Details */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-bold font-serif">{room.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <Users className="w-4 h-4" /> Capacity: {room.capacity}
                              </div>
                            </div>
                            <div className="text-right">
                               <span className="block text-2xl font-bold text-primary">₹{room.price_per_night}</span>
                               <span className="text-xs text-muted-foreground">/ night</span>
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                            {room.description || "A comfortable space designed for rest and connection."}
                          </p>
  
                          <div className="flex flex-wrap gap-3 text-xs font-medium text-secondary">
                             {/* Fixed Static amenities + Dynamic ones */}
                             <span className="flex items-center bg-secondary/10 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3 h-3 mr-1"/> Clean Linens</span>
                             <span className="flex items-center bg-secondary/10 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3 h-3 mr-1"/> Lockers</span>
                             {/* FIX: Explicitly typed 'am' as string */}
                             {room.amenities && room.amenities.map((am: string) => (
                                <span key={am} className="flex items-center bg-secondary/10 px-3 py-1.5 rounded-full"><CheckCircle2 className="w-3 h-3 mr-1"/> {am}</span>
                             ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No room types configured for this property yet.</p>
                )}
              </div>
            </section>
            
            {/* Rules Section */}
            {property.rules && (
              <section className="bg-muted/30 p-8 rounded-2xl border">
                 <h3 className="font-serif text-xl font-bold mb-4">House Rules</h3>
                 <div className="prose text-sm text-muted-foreground whitespace-pre-line">
                   {property.rules}
                 </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Booking Widget (Span 4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
               <div className="rounded-2xl border bg-card shadow-lg overflow-hidden">
                 <div className="bg-primary/5 p-4 border-b border-primary/10 text-center">
                   <p className="font-medium text-primary text-sm flex items-center justify-center gap-2">
                     <Star className="w-4 h-4 fill-primary" /> Best rates guaranteed direct
                   </p>
                 </div>
                 {/* The Booking Engine */}
                 <div className="p-0">
                    <BookingWidget propertyId={property.id} propertyName={property.name} />
                 </div>
               </div>

               <div className="p-6 rounded-2xl bg-muted/50 text-center border">
                 <h4 className="font-serif font-bold mb-2">Need assistance?</h4>
                 <p className="text-sm text-muted-foreground mb-4">Call our front desk directly.</p>
                 <a href="tel:+919876543210" className="text-xl font-bold text-primary hover:underline">+91 98765 43210</a>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}