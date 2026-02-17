'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Trash2, Edit, Plus, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface Testimonial {
    id: string;
    author: string;
    avatar_url?: string;
    rating: number;
    content: string;
    source: string;
    location?: string;
    featured: boolean;
    order_position: number;
    approved: boolean; // Added approved
}

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Form state
    const [formData, setFormData] = useState({
        author: '',
        avatar_url: '',
        rating: 5,
        content: '',
        source: 'google',
        location: '',
        featured: false,
        approved: true
    });

    useEffect(() => {
        fetchTestimonials();
    }, []);

    async function fetchTestimonials() {
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('order_position', { ascending: true });

        if (error) {
            toast.error('Failed to load testimonials');
            return;
        }

        setTestimonials(data || []);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('testimonials')
                    .update({
                        ...formData,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', editingId);

                if (error) throw error;
                toast.success('Testimonial updated!');
            } else {
                // Create new
                const { error } = await supabase
                    .from('testimonials')
                    .insert({
                        ...formData,
                        order_position: testimonials.length
                    });

                if (error) throw error;
                toast.success('Testimonial added!');
            }

            resetForm();
            fetchTestimonials();
            setIsAdding(false);
        } catch (error) {
            toast.error('Operation failed');
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this testimonial?')) return;

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete');
            return;
        }

        toast.success('Deleted!');
        fetchTestimonials();
    }

    function startEdit(testimonial: Testimonial) {
        setFormData({
            author: testimonial.author,
            avatar_url: testimonial.avatar_url || '',
            rating: testimonial.rating,
            content: testimonial.content,
            source: testimonial.source,
            location: testimonial.location || '',
            featured: testimonial.featured,
            approved: testimonial.approved
        });
        setEditingId(testimonial.id);
        setIsAdding(true);
    }

    function resetForm() {
        setFormData({
            author: '',
            avatar_url: '',
            rating: 5,
            content: '',
            source: 'google',
            location: '',
            featured: false,
            approved: true
        });
        setEditingId(null);
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-900">Testimonials</h1>
                    <p className="text-stone-500">Manage community reviews and stories.</p>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsAdding(!isAdding); }}
                    className="flex items-center gap-2 bg-[#E0684B] hover:bg-[#d05a3e]"
                >
                    {isAdding ? 'Close Form' : <><Plus className="w-4 h-4" /> Add Testimonial</>}
                </Button>
            </div>

            {/* Add/Edit Form */}
            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-stone-200 animate-in slide-in-from-top-4">
                    <h2 className="text-xl font-bold font-serif mb-6 text-[#4A3B32]">
                        {editingId ? 'Edit' : 'Add New'} Testimonial
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Author Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Guest Name *</label>
                            <Input
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                placeholder="e.g. Sarah J."
                                required
                            />
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating *</label>
                            <Select
                                value={formData.rating.toString()}
                                onValueChange={(val) => setFormData({ ...formData, rating: parseInt(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select rating" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[5, 4, 3, 2, 1].map(num => (
                                        <SelectItem key={num} value={num.toString()}>
                                            {num} Star{num !== 1 && 's'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Source */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Source *</label>
                            <Select
                                value={formData.source}
                                onValueChange={(val) => setFormData({ ...formData, source: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="google">Google</SelectItem>
                                    <SelectItem value="airbnb">Airbnb</SelectItem>
                                    <SelectItem value="booking">Booking.com</SelectItem>
                                    <SelectItem value="direct">Direct Feedback</SelectItem>
                                    <SelectItem value="instagram">Instagram</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Property Location</label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Purity Stays"
                            />
                        </div>

                        {/* Avatar URL */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Guest Photo URL (Optional)</label>
                            <Input
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                placeholder="https://..."
                                type="url"
                            />
                        </div>

                        {/* Review Content */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-medium">Review Text *</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Write the review content here..."
                                rows={4}
                                required
                            />
                        </div>

                        {/* Toggles */}
                        <div className="md:col-span-2 flex gap-8 pt-2">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="approved"
                                    checked={formData.approved}
                                    onChange={(e) => setFormData({ ...formData, approved: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-[#E0684B] focus:ring-[#E0684B]"
                                />
                                <label htmlFor="approved" className="text-sm font-medium cursor-pointer">
                                    Approved (Visible Publicly)
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="featured"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-[#E0684B] focus:ring-[#E0684B]"
                                />
                                <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                                    Featured (Highlighted)
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setIsAdding(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-[#E0684B] hover:bg-[#d05a3e]">
                            {editingId ? 'Update' : 'Save'} Testimonial
                        </Button>
                    </div>
                </form>
            )}

            {/* Testimonials List */}
            <div className="space-y-4">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={testimonial.id}
                        className={`bg-white rounded-xl border p-6 flex flex-col md:flex-row gap-6 transition-all hover:shadow-md ${testimonial.featured ? 'border-[#E0684B]/30 bg-[#FDF8F5]' : 'border-stone-200'}`}
                    >
                        {/* Left Info */}
                        <div className="flex items-start gap-4 min-w-[200px]">
                            <div className="w-12 h-12 rounded-full bg-stone-100 overflow-hidden shrink-0">
                                {testimonial.avatar_url ? (
                                    <img
                                        src={testimonial.avatar_url}
                                        alt={testimonial.author}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-500 font-bold">
                                        {testimonial.author[0]}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-900">{testimonial.author}</h3>
                                <div className="flex text-yellow-400 text-xs my-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-3 h-3 ${i < testimonial.rating ? "fill-current" : "text-stone-300"}`} />
                                    ))}
                                </div>
                                <div className="text-xs text-stone-500 uppercase tracking-wide font-medium">{testimonial.source}</div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <p className="text-stone-600 italic text-sm md:text-base leading-relaxed">"{testimonial.content}"</p>
                            {(testimonial.location || testimonial.featured || !testimonial.approved) && (
                                <div className="flex gap-2 mt-3">
                                    {testimonial.location && (
                                        <span className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-medium">
                                            📍 {testimonial.location}
                                        </span>
                                    )}
                                    {testimonial.featured && (
                                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-bold">
                                            Featured
                                        </span>
                                    )}
                                    {!testimonial.approved && (
                                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-md font-bold">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2 justify-center md:border-l md:pl-6 border-stone-100">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEdit(testimonial)}
                                className="justify-start"
                            >
                                <Edit className="w-4 h-4 mr-2" /> Edit
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 justify-start"
                                onClick={() => handleDelete(testimonial.id)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                ))}

                {testimonials.length === 0 && !isAdding && (
                    <div className="text-center py-16 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                        <div className="inline-flex justify-center items-center w-12 h-12 rounded-full bg-stone-100 mb-4">
                            <Star className="w-6 h-6 text-stone-400" />
                        </div>
                        <h3 className="text-lg font-medium text-stone-900">No testimonials yet</h3>
                        <p className="text-stone-500 mt-1">Start adding reviews to build trust.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
