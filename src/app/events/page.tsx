import { supabase, CommunityEvent } from '@/lib/supabase';
import { EventCard } from '@/components/events/event-card';
import { Metadata } from 'next';
import { CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Events | Crib Community',
    description: 'Join our workshops, music nights, and community gatherings.',
};

export const revalidate = 60;

export default async function EventsPage() {
    // Fetch all events
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });

    const allEvents = (events as CommunityEvent[]) || [];

    // Split into Upcoming (Ascending date) and Past (Descending date)
    const now = new Date();

    const upcomingEvents = allEvents
        .filter(e => new Date(e.event_date) >= now && e.status !== 'cancelled')
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()); // Nearest first

    const pastEvents = allEvents
        .filter(e => new Date(e.event_date) < now && e.status !== 'cancelled');
    // Already sorted descending from the query

    return (
        <main className="min-h-screen bg-stone-50 pt-24 pb-20">

            {/* Header */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6">
                    Community <span className="text-terracotta">Gatherings</span>
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                    More than just a stay. Connect, create, and celebrate with the tribe.
                </p>
            </div>

            <div className="container mx-auto px-4 space-y-20">

                {/* UPCOMING SECTION */}
                <section>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-terracotta text-white p-2 rounded-lg">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <h2 className="font-serif text-3xl font-bold text-stone-900">Upcoming Events</h2>
                    </div>

                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
                            <p className="text-stone-500 text-lg">
                                No upcoming events scheduled right now. <br />
                                Check back soon or follow us on Instagram for updates!
                            </p>
                        </div>
                    )}
                </section>

                {/* PAST EVENTS SECTION */}
                {pastEvents.length > 0 && (
                    <section className="opacity-80 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-3 mb-8 border-t border-stone-200 pt-12">
                            <h2 className="font-serif text-2xl font-bold text-stone-500">Past Gatherings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </section>
                )}

            </div>
        </main>
    );
}