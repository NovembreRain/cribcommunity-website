import { supabase, HeroSlide, CommunityEvent, Property, Testimonial } from '@/lib/supabase';
import { HeroSlideshow } from '@/components/home/hero-slideshow';
import { EventsFlipbook } from '@/components/home/events-flipbook';
import { FeaturedProperties } from '@/components/home/featured-properties';
import { TestimonialsCarousel } from '@/components/home/testimonials-carousel';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram } from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function Home() {
  // 1. Fetch Hero Slides
  const { data: slides } = await supabase
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  // 2. Fetch Events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .or('status.eq.upcoming,status.eq.past')
    .order('event_date', { ascending: false })
    .limit(10);

  // 3. Fetch Featured Properties
  const { data: properties } = await supabase
    .from('properties')
    .select('*')
    .eq('is_active', true)
    .limit(6);

  // 4. Fetch Testimonials
  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('approved', true) // Changed from is_approved
    .order('featured', { ascending: false }) // Show featured first
    .order('order_position', { ascending: true }) // Then by order
    .limit(10);

  const heroSlides = (slides as HeroSlide[]) || [];
  const communityEvents = (events as CommunityEvent[]) || [];
  const featuredProperties = (properties as Property[]) || [];
  const clientTestimonials = (testimonials as Testimonial[]) || [];

  return (
    <main className="min-h-screen bg-stone-50">

      {/* SECTION 1: HERO ENGINE */}
      <HeroSlideshow slides={heroSlides} />

      {/* SECTION 2: COMMUNITY SPLIT */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[600px]">
          <div className="lg:col-span-7 h-[500px] lg:h-full">
            <EventsFlipbook events={communityEvents} />
          </div>
          <div className="lg:col-span-5 h-[400px] lg:h-full bg-stone-900 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-60">
              <Image src="/images/hero-bg.jpg" alt="Insta" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white space-y-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center"><Instagram className="w-8 h-8 text-white" /></div>
              </div>
              <div>
                <h3 className="font-serif text-3xl font-bold">@cribcommunity</h3>
                <p className="text-white/80 mt-2 text-sm max-w-xs mx-auto">Join our digital tribe. Tag us to be featured.</p>
              </div>
              <Link href="https://instagram.com/cribcommunity" target="_blank" className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:bg-stone-200">Follow Us</Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PROPERTIES */}
      <FeaturedProperties properties={featuredProperties} />

      {/* SECTION 4: TESTIMONIALS */}
      <TestimonialsCarousel testimonials={clientTestimonials} />

      {/* FOOTER is global, so it stays at the bottom automatically via layout.tsx */}
    </main>
  );
}