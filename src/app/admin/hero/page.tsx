"use client"
// Shadcn Cards used in list

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr'
import { Plus, Pencil, Trash2, Save, X, GripVertical } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Card,
    CardContent,
} from "../../../components/ui/card"
import { ImageUpload } from "@/components/ui/image-uploader" // Using your component

// Define the shape of our data
type HeroSlide = {
    id: string
    image_url: string
    title: string
    subtitle: string
    cta_text: string
    cta_url: string
    display_order: number
    is_active: boolean
}

export default function AdminHeroPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState<Partial<HeroSlide>>({
        display_order: 0,
        is_active: true
    })

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // 1. Fetch Slides
    const fetchSlides = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('hero_slides')
            .select('*')
            .order('display_order', { ascending: true })

        if (error) {
            toast.error("Failed to fetch slides")
        } else {
            setSlides(data || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchSlides()
    }, [])

    // 2. Handle Form Submit (Create or Update)
    const handleSubmit = async () => {
        if (!formData.image_url || !formData.title) {
            toast.error("Image and Title are required")
            return
        }

        const payload = {
            image_url: formData.image_url,
            title: formData.title,
            subtitle: formData.subtitle || '',
            cta_text: formData.cta_text || '',
            cta_url: formData.cta_url || '',
            display_order: formData.display_order || 0,
            is_active: formData.is_active,
        }

        try {
            if (editingId) {
                // Update existing
                const { error } = await supabase
                    .from('hero_slides')
                    .update(payload)
                    .eq('id', editingId)
                if (error) throw error
                toast.success("Slide updated")
            } else {
                // Create new
                const { error } = await supabase
                    .from('hero_slides')
                    .insert([payload])
                if (error) throw error
                toast.success("Slide created")
            }

            setIsDialogOpen(false)
            fetchSlides()
            resetForm()
        } catch (error) {
            console.error(error)
            toast.error("Operation failed")
        }
    }

    // 3. Handle Delete
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slide?")) return

        const { error } = await supabase.from('hero_slides').delete().eq('id', id)
        if (error) {
            toast.error("Failed to delete")
        } else {
            toast.success("Slide deleted")
            fetchSlides()
        }
    }

    const resetForm = () => {
        setEditingId(null)
        setFormData({ display_order: slides.length, is_active: true })
    }

    const openEdit = (slide: HeroSlide) => {
        setEditingId(slide.id)
        setFormData(slide)
        setIsDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-stone-900">Homepage Hero</h1>
                    <p className="text-stone-500">Manage the slideshow on your homepage.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsDialogOpen(true) }} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" /> Add Slide
                </Button>
            </div>

            {/* Slide List */}
            <div className="grid gap-4">
                {isLoading ? (
                    <p>Loading slides...</p>
                ) : slides.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                        <p className="text-stone-500">No slides yet. Add one to get started!</p>
                    </div>
                ) : (
                    slides.map((slide) => (
                        <Card key={slide.id} className="overflow-hidden">
                            <CardContent className="p-0 flex items-center gap-4">
                                {/* Image Preview */}
                                <div className="relative w-48 h-32 bg-stone-100 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                                    {!slide.is_active && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-bold">
                                            HIDDEN
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 py-4">
                                    <h3 className="font-bold text-lg" dangerouslySetInnerHTML={{ __html: slide.title }} />
                                    <p className="text-sm text-stone-500 line-clamp-1">{slide.subtitle}</p>
                                    <div className="flex gap-2 mt-2">
                                        {slide.cta_text && (
                                            <span className="text-xs bg-stone-100 px-2 py-1 rounded border">
                                                Btn: {slide.cta_text}
                                            </span>
                                        )}
                                        <span className="text-xs bg-stone-100 px-2 py-1 rounded border">
                                            Order: {slide.display_order}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="pr-6 flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => openEdit(slide)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(slide.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Slide" : "New Slide"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-6 py-4">
                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Background Image</Label>
                            <ImageUpload
                                value={formData.image_url ? [formData.image_url] : []}
                                onChange={(urls) => setFormData({ ...formData, image_url: urls[0] })}
                                onRemove={() => setFormData({ ...formData, image_url: '' })}
                                maxFiles={1}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label>Title (HTML Allowed)</Label>
                                <Input
                                    value={formData.title || ''}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Find Your <br/> Tribe"
                                />
                                <p className="text-xs text-stone-400">Use &lt;br/&gt; for line breaks.</p>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label>Subtitle</Label>
                                <Input
                                    value={formData.subtitle || ''}
                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>CTA Text</Label>
                                <Input
                                    value={formData.cta_text || ''}
                                    onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                    placeholder="Explore Locations"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>CTA Link</Label>
                                <Input
                                    value={formData.cta_url || ''}
                                    onChange={(e) => setFormData({ ...formData, cta_url: e.target.value })}
                                    placeholder="/locations"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    value={formData.display_order || 0}
                                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                />
                            </div>

                            <div className="flex items-center space-x-2 pt-8">
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                                <Label>Active (Visible on Homepage)</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Slide"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}