'use client';

import { Star, Quote } from 'lucide-react';
import { Testimonial } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    // If no testimonials, show nothing
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-20 bg-stone-100 overflow-hidden">
            <div className="container mx-auto px-4 mb-10 text-center">
                <h2 className="font-serif text-3xl md:text-4xl text-stone-800">
                    Stories from the <span className="text-terracotta">Tribe</span>
                </h2>
            </div>

            {/* Infinite Scroll Marquee Wrapper */}
            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fade edges */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-stone-100 to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-stone-100 to-transparent z-10" />

                <div className="flex w-max animate-scroll-left hover:pause">
                    {/* We duplicate the list to ensure seamless looping */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className="w-[300px] md:w-[400px] flex-shrink-0 mx-4"
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 h-full flex flex-col relative">
                                <Quote className="absolute top-6 right-6 text-stone-100 w-10 h-10 fill-current" />

                                <div className="flex gap-1 mb-4 text-orange-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn("w-4 h-4", i < t.rating ? "fill-current" : "text-stone-200")}
                                        />
                                    ))}
                                </div>

                                <p className="text-stone-600 italic mb-6 flex-1 text-sm md:text-base leading-relaxed">
                                    &quot;{t.content}&quot;
                                </p>

                                <div className="flex items-center gap-3 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden relative">
                                        {t.avatar_url ? (
                                            <Image src={t.avatar_url} alt={t.author} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-terracotta text-white font-bold">
                                                {t.author[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900 text-sm">{t.author}</p>
                                        <p className="text-xs text-stone-400">via {t.source}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}