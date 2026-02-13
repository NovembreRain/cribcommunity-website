'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ArrowRight, Wifi, Wind, Coffee } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedPropertiesProps {
    properties: Property[];
}

export function FeaturedProperties({ properties }: FeaturedPropertiesProps) {
    return (
        <section className="py-24 bg-stone-50" id="locations">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 font-bold">
                            Our <span className="text-terracotta">Sanctuaries</span>
                        </h2>
                        <p className="mt-4 text-stone-600 max-w-lg text-lg">
                            Hand-picked stays designed for creatives, nomads, and nature lovers.
                        </p>
                    </div>
                    <Link href="/locations" className="hidden md:block">
                        <Button variant="outline" className="gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link href="/locations">
                        <Button variant="outline" className="w-full">View All Locations</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

function PropertyCard({ property }: { property: Property }) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Cycle images on hover
    // (In a real implementation, use setInterval inside useEffect when hovered)

    // Use slideshow or gallery images
    const coverImage = property.slideshow_images?.[0] || property.gallery_images?.[0] || '/images/hero-bg.jpg';

    // Determine location slug/name from joined data (or fallback)
    const locationName = property.locations?.name || "Auroville";
    const locationSlug = property.locations?.slug || "auroville";

    return (
        <Link href={`/locations/${locationSlug}/${property.slug}`} className="group">
            <div
                className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 mb-4"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Image / Slideshow Layer */}
                <Image
                    src={coverImage}
                    alt={property.name}
                    fill
                    className={cn(
                        "object-cover transition-transform duration-700",
                        isHovered ? "scale-105" : "scale-100"
                    )}
                />

                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    ₹{property.price_per_night} / night
                </div>

                <div className="absolute bottom-4 left-4 text-white">
                    <p className="flex items-center text-xs font-medium uppercase tracking-wider mb-1 opacity-90">
                        <span className="w-2 h-2 rounded-full bg-terracotta mr-2 animate-pulse" />
                        {locationName}
                    </p>
                </div>
            </div>

            <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-terracotta transition-colors">
                {property.name}
            </h3>

            <p className="text-stone-500 text-sm mt-2 line-clamp-2">
                {property.description}
            </p>

            {/* Amenities Preview */}
            <div className="flex gap-3 mt-4 text-stone-400">
                <Wifi className="w-4 h-4" />
                <Wind className="w-4 h-4" />
                <Coffee className="w-4 h-4" />
                <span className="text-xs self-center">+ more</span>
            </div>
        </Link>
    );
}