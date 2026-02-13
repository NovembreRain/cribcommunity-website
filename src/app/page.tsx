import { supabase, HeroSlide, CommunityEvent } from '@/lib/supabase';
import { HeroSlideshow } from '@/components/home/hero-slideshow';
import { EventsFlipbook } from '@/components/home/events-flipbook';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

// Revalidate data every 60 seconds (ISR) - Keeps site fast but fresh
export const revalidate = 60;

export default async function Home() {
  // 1. Fetch Hero Slides (Active Only)
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // 2. Fetch Events (Upcoming & Past)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .or('status.eq.upcoming,status.eq.past')
    .order('event_date', { ascending: false })
    .limit(10);

  // Safely cast data (or default to empty arrays)
  const heroSlides = (slides as HeroSlide[]) || [];
  const communityEvents = (events as CommunityEvent[]) || [];

  return (
    <main className="min-h-screen bg-stone-50">

      {/* SECTION 1: HERO ENGINE (Replaces your old static hero) */}
      <HeroSlideshow slides={heroSlides} />

      {/* SECTION 2: THE SPLIT (New Feature: Events & Social) */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">

          {/* LEFT: Events Flipbook (7 Cols) */}
          <div className="lg:col-span-7 h-[500px] lg:h-full">
            <EventsFlipbook events={communityEvents} />
          </div>

          {/* RIGHT: Instagram Plugged In (5 Cols) */}
          <div className="lg:col-span-5 h-[400px] lg:h-full bg-stone-900 rounded-3xl p-8 relative overflow-hidden group">
            {/* Background Image (Mocking a high-quality Insta vibe) */}
            <div className="absolute inset-0 opacity-60">
              <Image
                src="/images/hero-bg.jpg" // Fallback to hero if no specific insta image
                alt="Instagram Vibe"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </div>

              <div>
                <h3 className="font-serif text-3xl font-bold">@cribcommunity</h3>
                <p className="text-white/80 mt-2 text-sm max-w-xs mx-auto">
                  Join our digital tribe. Tag us to be featured in our stories.
                </p>
              </div>

              {/* Pseudo-Grid of "Recent Posts" */}
              <div className="grid grid-cols-3 gap-2 w-full max-w-xs opacity-80">
                {[1, 2, 3].map(i => (
                  <div key={i} className="aspect-square bg-white/10 rounded-md border border-white/20 backdrop-blur-sm" />
                ))}
              </div>

              <Link
                href="https://instagram.com/cribcommunity"
                target="_blank"
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-stone-200 transition-colors"
              >
                Follow Us
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Placeholder for Next Sections */}
      <div className="py-20 text-center opacity-50">
        <p>Testimonials & Property List Loading...</p>
      </div>

    </main>
  );
}