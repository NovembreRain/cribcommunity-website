"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr' // Changed import
import { ImageUpload } from "@/components/ui/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
// Added Trash2 icon
import { Loader2, Plus, Pencil, Map, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Location } from "@/lib/supabase"

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize authenticated client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: [] as string[]
  })

  async function fetchLocations() {
    const { data } = await supabase.from('locations').select('*').order('created_at')
    if (data) setLocations(data)
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!editingId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, name, slug }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        cover_image: formData.cover_image[0] || null,
        is_active: true
      }

      if (editingId) {
        const { error } = await supabase.from('locations').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success("Location updated")
      } else {
        const { error } = await supabase.from('locations').insert([payload])
        if (error) throw error
        toast.success("Location created")
      }

      setIsOpen(false)
      fetchLocations()
      resetForm()
    } catch (error: any) {
      // Handle Duplicate Slug Error (409)
      if (error.code === '23505') {
        toast.error("Duplicate Location", {
          description: "A location with this URL Slug already exists."
        })
      } else {
        toast.error("Operation failed", { description: error.message })
      }
    } finally {
      setIsSaving(false)
    }
  }

  // DELETE HANDLER
  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This will also delete all Properties inside this Location.")) return

    try {
      const { error } = await supabase.from('locations').delete().eq('id', id)
      if (error) throw error

      toast.success("Location deleted")
      // Update UI instantly without refetching
      setLocations(prev => prev.filter(l => l.id !== id))
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  function resetForm() {
    setEditingId(null)
    setFormData({ name: "", slug: "", description: "", cover_image: [] })
  }

  function handleEdit(location: Location) {
    setEditingId(location.id)
    setFormData({
      name: location.name,
      slug: location.slug,
      description: location.description || "",
      cover_image: location.cover_image ? [location.cover_image] : []
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Locations</h1>
          <p className="text-stone-500">Manage your high-level destinations.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Location" : "New Location"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="e.g. Pondicherry" value={formData.name} onChange={handleNameChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (URL)</label>
                  <Input placeholder="e.g. pondicherry" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload
                  value={formData.cover_image}
                  onChange={(val: string[]) => setFormData({ ...formData, cover_image: val })}
                  onRemove={() => setFormData({ ...formData, cover_image: [] })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Description..." className="h-24" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Save Location
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-stone-100">
              {loc.cover_image ? (
                <Image
                  src={loc.cover_image}
                  alt={loc.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <Map className="w-8 h-8 opacity-20" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif font-bold text-lg">{loc.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-primary" onClick={() => handleEdit(loc)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {/* DELETE BUTTON */}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600" onClick={() => handleDelete(loc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-stone-500 line-clamp-2">{loc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}