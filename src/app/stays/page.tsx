import { supabase } from '@/lib/supabase';
import { PropertyCard } from '@/components/ui/property-card';
import { Metadata } from 'next';
import { Property } from '@/lib/supabase';

export const metadata: Metadata = {
    title: 'Stays | Crib Community',
    description: 'Explore our network of rustic, sustainable stays in Auroville and beyond.',
};

// Revalidate every minute
export const revalidate = 60;

export default async function StaysPage() {
    // Fetch properties from Supabase with joined location data
    const { data: properties, error } = await supabase
        .from('properties')
        .select('*, locations(slug, name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching properties:', error);
    }

    // Cast with the correct nested type structure
    // The locations join returns an array or single object depending on relationship, usually single for belongs_to
    const allProperties = (properties as unknown as Property[]) || [];

    return (
        <main className="min-h-screen bg-stone-50 pt-24 pb-20">

            {/* Header */}
            <div className="container mx-auto px-4 mb-16 text-center">
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-6">
                    Our <span className="text-terracotta">Sanctuaries</span>
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
                    From treehouses in the canopy to clay huts on the earth.
                    Find the space that speaks to your soul.
                </p>
            </div>

            {/* Grid */}
            <div className="container mx-auto px-4">
                {allProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-12">
                        {allProperties.map((property) => {
                            // Construct the correct URL: /locations/[region]/[property]
                            // Use optional chaining in case join failed or data is missing
                            const regionSlug = property.locations?.slug || 'auroville';
                            const href = `/locations/${regionSlug}/${property.slug}`;

                            return (
                                <PropertyCard key={property.id} property={property} href={href} />
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-xl">
                        <p className="text-stone-500">No stays found. Check back later!</p>
                    </div>
                )}
            </div>

        </main>
    );
}
