import React from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { BookingWidget } from "@/components/forms/booking-widget"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wifi, Wind, MapPin, Users, CheckCircle2, Star, Calendar, ArrowLeft, Share2 } from "lucide-react"

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
    : (property.slideshow_images && property.slideshow_images.length > 0 ? property.slideshow_images : ['/images/placeholder.jpg'])

  const mainImage = displayImages[0]
  const otherImages = displayImages.slice(1, 5)

  // Calculate "Starting From" price based on rooms if available, else property price
  const startingPrice = rooms && rooms.length > 0
    ? Math.min(...rooms.map(r => r.price_per_night))
    : property.price_per_night

  return (
    <main className="min-h-screen bg-stone-50">

      {/* --- HERO SECTION (Adaptive UI) --- */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={mainImage}
          alt={property.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Navigation Back */}
        <Link href="/stays" className="absolute top-24 left-4 md:left-8 z-20">
          <Button variant="outline" size="icon" className="rounded-full bg-white/20 backdrop-blur border-white/50 text-white hover:bg-white hover:text-black hover:border-white transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>

        {/* Title Content */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent pt-32 pb-8 md:pb-12 px-4 md:px-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="text-white">
                <Badge className="bg-terracotta text-white hover:bg-terracotta mb-4 text-sm px-3 py-1 font-medium tracking-wide">
                  Sanctuary
                </Badge>
                <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold mb-3 shadow-sm leading-tight">
                  {property.name}
                </h1>
                <div className="flex items-center text-white/90 gap-4 text-sm md:text-base font-medium">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-terracotta" /> {property.address || "Auroville, India"}</span>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-end text-white">
                <div className="text-right">
                  <p className="text-3xl font-bold">₹{startingPrice}</p>
                  <p className="text-sm opacity-80">per night</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT COLUMN: Details (Span 8) */}
          <div className="lg:col-span-8 space-y-16">

            {/* Description */}
            <section className="prose prose-stone prose-lg max-w-none">
              <h2 className="font-serif text-3xl font-bold text-stone-900 mb-6">About this space</h2>
              <div className="leading-relaxed whitespace-pre-line text-stone-600">
                {property.description}
              </div>
            </section>

            {/* Property Amenities (New Grid Style) */}
            <section className="border-t border-stone-200 pt-12">
              <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities?.map((amenity: string) => (
                  <div key={amenity} className="flex items-center gap-3 p-4 rounded-xl bg-stone-100 text-stone-700 hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-stone-200">
                    <CheckCircle2 className="w-5 h-5 text-terracotta" />
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
                {(!property.amenities || property.amenities.length === 0) && (
                  <p className="text-stone-500 italic">No specific property amenities listed.</p>
                )}
              </div>
            </section>

            {/* Gallery Grid */}
            {otherImages.length > 0 && (
              <section className="border-t border-stone-200 pt-12">
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-6">Gallery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherImages.map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 group">
                      <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Accommodation Types (The Old Logic, Better Styled) */}
            <section className="border-t border-stone-200 pt-12">
              <h3 className="font-serif text-3xl font-bold text-stone-900 mb-8">Accommodation Types</h3>
              <div className="flex flex-col gap-6">
                {rooms && rooms.length > 0 ? (
                  rooms.map((room) => (
                    <div key={room.id} className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:shadow-lg hover:border-stone-300">
                      <div className="flex flex-col md:flex-row">
                        {/* Room Image */}
                        <div className="relative h-64 md:h-auto md:w-2/5 bg-stone-100">
                          {room.images && room.images.length > 0 ? (
                            <Image src={room.images[0]} alt={room.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                              <Users className="w-12 h-12 opacity-20" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm md:hidden">
                            ₹{room.price_per_night} / night
                          </div>
                        </div>

                        {/* Room Details */}
                        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h4 className="text-2xl font-bold font-serif text-stone-900">{room.name}</h4>
                              <div className="flex items-center gap-4 text-sm text-stone-500 mt-2 font-medium">
                                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Sleeps {room.capacity}</span>
                                {room.total_units > 1 && <span className="px-2 py-0.5 bg-stone-100 rounded text-xs">{room.total_units} units available</span>}
                              </div>
                            </div>
                            <div className="text-right hidden md:block">
                              <span className="block text-2xl font-bold text-stone-900">₹{room.price_per_night}</span>
                              <span className="text-xs text-stone-500 uppercase tracking-wide">per night</span>
                            </div>
                          </div>

                          <p className="text-stone-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                            {room.description || "A comfortable space designed for rest and connection."}
                          </p>

                          <div className="flex flex-wrap gap-2 text-xs font-medium text-stone-500 mt-auto">
                            {room.amenities && room.amenities.map((am: string) => (
                              <span key={am} className="flex items-center bg-stone-100 px-3 py-1.5 rounded-full border border-stone-200">
                                <CheckCircle2 className="w-3 h-3 mr-1.5 text-terracotta" /> {am}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 border-2 border-dashed border-stone-200 rounded-2xl text-center">
                    <p className="text-stone-500 italic">No specific room types configured yet.</p>
                  </div>
                )}
              </div>
            </section>

            {/* House Rules */}
            {property.rules && (
              <section className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                <h3 className="font-serif text-xl font-bold mb-4 text-stone-800">House Rules</h3>
                <div className="prose text-sm text-stone-600 whitespace-pre-line leading-relaxed">
                  {property.rules}
                </div>
              </section>
            )}

          </div>

          {/* RIGHT COLUMN: Sticky Booking Widget (Span 4) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border border-stone-200 bg-white shadow-xl overflow-hidden">
                <div className="bg-stone-50 p-4 border-b border-stone-100 text-center">
                  <p className="font-medium text-stone-600 text-sm flex items-center justify-center gap-2">
                    <Star className="w-4 h-4 fill-terracotta text-terracotta" />
                    Best rates guaranteed direct
                  </p>
                </div>
                {/* The Actual Booking Engine Logic */}
                <div className="p-0">
                  <BookingWidget propertyId={property.id} propertyName={property.name} />
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-stone-100 text-center border border-stone-200">
                <h4 className="font-serif font-bold mb-2 text-stone-900">Need assistance?</h4>
                <p className="text-sm text-stone-500 mb-4">Call our front desk directly.</p>
                <a href="tel:+919876543210" className="text-xl font-bold text-terracotta hover:underline">+91 98765 43210</a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}