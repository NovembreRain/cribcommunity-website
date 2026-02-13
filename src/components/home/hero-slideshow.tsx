'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { HeroSlide } from '@/lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlideshowProps {
    slides: HeroSlide[];
}

export function HeroSlideshow({ slides }: HeroSlideshowProps) {
    const [current, setCurrent] = useState(0);

    // Fallback if no slides exist in DB
    const defaultSlide: HeroSlide = {
        id: 'default',
        image_url: '/images/hero-bg.jpg',
        title: 'Find Your Tribe <br /> in Nature',
        subtitle: 'Safe, sustainable, and rustic stays for women, families, and creative souls in the heart of Auroville.',
        cta_text: 'Explore Locations',
        cta_url: '/locations',
        display_order: 0,
        is_active: true,
        created_at: new Date().toISOString(),
    };

    const activeSlides = slides.length > 0 ? slides : [defaultSlide];

    // Auto-advance timer
    useEffect(() => {
        if (activeSlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % activeSlides.length);
        }, 6000); // Change slide every 6 seconds
        return () => clearInterval(timer);
    }, [activeSlides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % activeSlides.length);
    const prevSlide = () => setCurrent((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

    return (
        <section className="relative h-screen w-full overflow-hidden bg-stone-900">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeSlides[current].id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div className="relative w-full h-full">
                        <Image
                            src={activeSlides[current].image_url}
                            alt={activeSlides[current].title}
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                        />
                        {/* Dark Overlay for text readability */}
                        <div className="absolute inset-0 bg-black/30" />
                    </div>

                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white drop-shadow-lg"
                            dangerouslySetInnerHTML={{ __html: activeSlides[current].title }}
                        />

                        {activeSlides[current].subtitle && (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                                className="mt-6 text-lg md:text-2xl font-light text-white/95 max-w-2xl leading-relaxed drop-shadow-md"
                            >
                                {activeSlides[current].subtitle}
                            </motion.p>
                        )}

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="mt-8 flex flex-col sm:flex-row gap-4"
                        >
                            {activeSlides[current].cta_text && (
                                <Link href={activeSlides[current].cta_url || '/locations'}>
                                    <Button
                                        size="lg"
                                        className="h-14 px-10 text-lg rounded-full bg-terracotta hover:bg-terracotta/90 text-white shadow-xl transition-all hover:scale-105"
                                    >
                                        {activeSlides[current].cta_text}
                                    </Button>
                                </Link>
                            )}

                            <Link href="/our-story">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-14 px-10 text-lg rounded-full border-2 border-white text-white hover:bg-white hover:text-stone-900 bg-transparent/20 backdrop-blur-sm shadow-xl transition-all hover:scale-105"
                                >
                                    Our Story
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows (Only show if multiple slides exist) */}
            {activeSlides.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20 hidden md:block"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20 hidden md:block"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/80 z-20"
            >
                <div className="w-[30px] h-[50px] border-2 border-white rounded-full flex justify-center p-2 box-content opacity-80">
                    <div className="w-1 h-3 bg-white rounded-full animate-bounce" />
                </div>
            </motion.div>
        </section>
    );
}