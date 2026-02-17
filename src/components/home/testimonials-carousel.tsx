'use client';

import { Star, Quote, MapPin } from 'lucide-react';
import { Testimonial } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface TestimonialsCarouselProps {
    testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
    if (!testimonials || testimonials.length === 0) return null;

    return (
        <section className="py-24 bg-[#FBF9F6] overflow-hidden">
            <div className="container mx-auto px-4 mb-12 text-center">
                <h2 className="font-serif text-3xl md:text-5xl text-stone-900 font-bold mb-4">
                    Stories from the <span className="text-[#E0684B]">Tribe</span>
                </h2>
                <p className="text-stone-500 max-w-lg mx-auto">
                    Real experiences from nomads, creators, and guests who have found their sanctuary with us.
                </p>
            </div>

            {/* Infinite Scroll Marquee Wrapper */}
            <div className="relative w-full">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FBF9F6] to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#FBF9F6] to-transparent z-10 pointer-events-none" />

                <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused] py-4">
                    {/* Double the list for seamless looping */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={`${t.id}-${i}`}
                            className="w-[350px] md:w-[450px] flex-shrink-0 mx-4 md:mx-6"
                        >
                            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-stone-100 h-full flex flex-col relative group">
                                <Quote className="absolute top-8 right-8 text-[#E0684B]/20 w-12 h-12 fill-current transform rotate-180" />

                                <div className="flex gap-1 mb-6 text-[#E0684B]">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={cn("w-4 h-4", i < t.rating ? "fill-current" : "text-stone-200")}
                                        />
                                    ))}
                                </div>

                                <p className="text-stone-700 italic mb-8 flex-1 text-base md:text-lg leading-relaxed font-serif">
                                    &ldquo;{t.content}&rdquo;
                                </p>

                                <div className="flex items-center gap-4 mt-auto border-t border-stone-50 pt-6">
                                    <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden relative shrink-0 border border-stone-100">
                                        {t.avatar_url ? (
                                            <Image src={t.avatar_url} alt={t.author} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#E0684B] text-white font-bold text-lg">
                                                {t.author[0]}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-stone-900 text-base truncate">{t.author}</p>
                                        <div className="flex items-center gap-2 text-xs text-stone-500">
                                            <span className="capitalize">{t.source}</span>
                                            {t.location && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-stone-300" />
                                                    <span className="flex items-center truncate">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {t.location}
                                                    </span>
                                                </>
                                            )}
                                        </div>
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