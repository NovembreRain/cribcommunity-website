'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { MapPin, Calendar, Clock, ArrowRight } from 'lucide-react';
import { CommunityEvent } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RegistrationModal } from './registration-modal';

interface EventCardProps {
    event: CommunityEvent;
}

export function EventCard({ event }: EventCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const isUpcoming = event.status === 'upcoming';
    const eventDate = new Date(event.event_date);

    return (
        <>
            <div className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                {/* Image Area */}
                <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
                    <Image
                        src={event.image_url || '/images/hero-bg.jpg'}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                        {isUpcoming ? (
                            <Badge className="bg-white/90 text-stone-900 hover:bg-white backdrop-blur shadow-sm">
                                Upcoming
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className="bg-stone-900/50 text-white backdrop-blur">
                                Past Event
                            </Badge>
                        )}
                    </div>

                    {/* Date Box */}
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur rounded-lg p-2 text-center min-w-[60px] shadow-sm">
                        <span className="block text-xs font-bold text-terracotta uppercase">
                            {format(eventDate, 'MMM')}
                        </span>
                        <span className="block text-xl font-bold text-stone-900 leading-none">
                            {format(eventDate, 'dd')}
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex flex-col flex-1">
                    <div className="mb-4">
                        <h3 className="font-serif text-2xl font-bold text-stone-900 mb-2 group-hover:text-terracotta transition-colors">
                            {event.title}
                        </h3>
                        <div className="flex flex-col gap-2 text-sm text-stone-500">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-terracotta" />
                                {format(eventDate, 'h:mm a')}
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-terracotta" />
                                {event.location || 'Crib Community, Auroville'}
                            </div>
                        </div>
                    </div>

                    <p className="text-stone-600 text-sm line-clamp-3 mb-6 flex-1">
                        {event.description}
                    </p>

                    <div className="pt-4 border-t border-stone-100">
                        {isUpcoming && event.registration_open ? (
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="w-full bg-stone-900 hover:bg-stone-800 text-white"
                            >
                                Register Now
                            </Button>
                        ) : (
                            <Button variant="outline" disabled className="w-full opacity-50">
                                {event.status === 'cancelled' ? 'Event Cancelled' : 'Registration Closed'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                eventTitle={event.title}
                eventId={event.id}
            />
        </>
    );
}