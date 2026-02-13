'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { CommunityEvent } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface EventsFlipbookProps {
    events: CommunityEvent[];
}

export function EventsFlipbook({ events }: EventsFlipbookProps) {
    const [mode, setMode] = useState<'upcoming' | 'past'>('upcoming');

    // Filter events based on mode
    const filteredEvents = events.filter(e => {
        const isPast = new Date(e.event_date) < new Date();
        return mode === 'upcoming' ? !isPast : isPast;
    }).sort((a, b) => {
        // Sort upcoming: nearest first. Sort past: most recent first.
        const dateA = new Date(a.event_date).getTime();
        const dateB = new Date(b.event_date).getTime();
        return mode === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    const displayEvent = filteredEvents[0]; // Only show the top card (simplest flipbook)

    return (
        <div className="h-full flex flex-col justify-center p-8 md:p-12 bg-stone-100 rounded-3xl relative overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            {/* Header & Toggle */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="font-serif text-3xl md:text-4xl text-stone-800">
                        Community <span className="text-terracotta italic">Pulse</span>
                    </h2>
                    <p className="text-stone-500 mt-2 text-sm">What's happening in the tribe.</p>
                </div>

                <div className="flex bg-white p-1 rounded-full shadow-sm border border-stone-200">
                    <button
                        onClick={() => setMode('upcoming')}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            mode === 'upcoming' ? "bg-stone-800 text-white shadow-md" : "text-stone-500 hover:text-stone-800"
                        )}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setMode('past')}
                        className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            mode === 'past' ? "bg-terracotta text-white shadow-md" : "text-stone-500 hover:text-terracotta"
                        )}
                    >
                        Rewind
                    </button>
                </div>
            </div>

            {/* The "Card" Area */}
            <div className="relative z-10 flex-1 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {displayEvent ? (
                        <motion.div
                            key={displayEvent.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="h-full"
                        >
                            <div className="group relative h-full bg-white rounded-2xl overflow-hidden shadow-xl border border-stone-200 flex flex-col md:flex-row">

                                {/* Image Side */}
                                <div className="relative h-48 md:h-full md:w-1/2 bg-stone-200">
                                    {displayEvent.image_url ? (
                                        <Image
                                            src={displayEvent.image_url}
                                            alt={displayEvent.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-stone-400">
                                            No Image
                                        </div>
                                    )}
                                    {/* Date Badge */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-stone-900 px-3 py-1 rounded-lg shadow-sm font-bold text-sm flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-terracotta" />
                                        {format(new Date(displayEvent.event_date), 'MMM d, yyyy')}
                                    </div>
                                </div>

                                {/* Content Side */}
                                <div className="p-6 md:p-8 md:w-1/2 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2">
                                            {displayEvent.title}
                                        </h3>
                                        <div className="flex items-center text-stone-500 text-sm mb-4">
                                            <MapPin className="w-4 h-4 mr-1 text-terracotta" />
                                            {displayEvent.location || 'Auroville'}
                                        </div>
                                        <p className="text-stone-600 text-sm line-clamp-4 leading-relaxed">
                                            {displayEvent.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-stone-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-terracotta uppercase tracking-wider">
                                            {mode === 'upcoming' ? 'Registration Open' : 'Event Concluded'}
                                        </span>
                                        <Link href={`/events`}>
                                            <Button variant="ghost" size="sm" className="hover:bg-stone-50 gap-2">
                                                Details <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center text-stone-400 border-2 border-dashed border-stone-200 rounded-2xl"
                        >
                            <Calendar className="w-12 h-12 mb-4 opacity-20" />
                            <p>No {mode} events found.</p>
                            <p className="text-sm">Check back soon!</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* "View All" Footer */}
            <div className="mt-6 text-center">
                <Link href="/events" className="text-sm font-medium text-stone-500 hover:text-terracotta transition-colors">
                    View all events &rarr;
                </Link>
            </div>

        </div>
    );
}