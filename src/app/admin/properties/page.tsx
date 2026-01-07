"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { ImageUpload } from "@/components/ui/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
// Added Trash2 icon
import { Loader2, Plus, Pencil, Hotel, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Property, Location } from "@/lib/supabase"

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    location_id: "",
    description: "",
    short_description: "",
    address: "",
    slideshow_images: [] as string[],
    gallery_images: [] as string[],
    rules: ""
  })

  // Fetch Data
  async function fetchData() {
    const { data: locs } = await supabase.from('locations').select('*').order('name')
    if (locs) setLocations(locs)

    const { data: props } = await supabase.from('properties').select('*, locations(name)').order('created_at')
    if (props) setProperties(props as any)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    if (!editingId) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, name, slug }))
    } else {
      setFormData(prev => ({ ...prev, name }))
    }
  }

  // Submit
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    if (!formData.location_id) {
      toast.error("Missing Location", { description: "Please select a location." })
      setIsSaving(false)
      return
    }

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        location_id: formData.location_id,
        description: formData.description,
        short_description: formData.short_description,
        address: formData.address,
        slideshow_images: formData.slideshow_images,
        gallery_images: formData.gallery_images,
        rules: formData.rules
      }

      if (editingId) {
        const { error } = await supabase.from('properties').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success("Property updated")
      } else {
        const { error } = await supabase.from('properties').insert([payload])
        if (error) throw error
        toast.success("Property created")
      }

      setIsOpen(false)
      fetchData()
      resetForm()
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error("Duplicate Property", { description: "This slug is already taken." })
      } else {
        toast.error("Operation failed")
      }
    } finally {
      setIsSaving(false)
    }
  }

  // DELETE HANDLER
  async function handleDelete(id: string) {
    if (!confirm("Are you sure? This deletes all Rooms and Bookings for this property.")) return

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id)
      if (error) throw error
      
      toast.success("Property deleted")
      // Optimistic update
      setProperties(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  function resetForm() {
    setEditingId(null)
    setFormData({
      name: "", slug: "", location_id: "", description: "", 
      short_description: "", address: "", slideshow_images: [], gallery_images: [], rules: ""
    })
  }

  function handleEdit(property: Property) {
    setEditingId(property.id)
    setFormData({
      name: property.name,
      slug: property.slug,
      location_id: property.location_id,
      description: property.description || "",
      short_description: property.short_description || "",
      address: property.address || "",
      slideshow_images: property.slideshow_images || [],
      gallery_images: property.gallery_images || [],
      rules: property.rules || ""
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Properties</h1>
          <p className="text-stone-500">Manage your sanctuaries and their details.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Property" : "New Property"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6 mt-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input placeholder="e.g. The Garden Crib" value={formData.name} onChange={handleNameChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input placeholder="e.g. garden-crib" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select 
                    value={formData.location_id} 
                    onValueChange={(val) => setFormData({...formData, location_id: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(loc => (
                        <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input placeholder="Full address..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hover Slideshow (Max 5)</label>
                <ImageUpload 
                  value={formData.slideshow_images}
                  onChange={(val: string[]) => setFormData({...formData, slideshow_images: val})}
                  onRemove={(url) => setFormData({...formData, slideshow_images: formData.slideshow_images.filter(x => x !== url)})}
                  maxFiles={5}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Images (Max 10)</label>
                <ImageUpload 
                  value={formData.gallery_images}
                  onChange={(val: string[]) => setFormData({...formData, gallery_images: val})}
                  onRemove={(url) => setFormData({...formData, gallery_images: formData.gallery_images.filter(x => x !== url)})}
                  maxFiles={10}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description (Card View)</label>
                <Input placeholder="One liner..." value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <Textarea placeholder="Tell the story..." className="h-32" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">House Rules</label>
                <Textarea placeholder="Quiet hours, etc..." className="h-24" value={formData.rules} onChange={(e) => setFormData({...formData, rules: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Save Property
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop: any) => (
          <div key={prop.id} className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-stone-100">
              {prop.slideshow_images?.[0] ? (
                <Image src={prop.slideshow_images[0]} alt={prop.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <Hotel className="w-8 h-8 opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium">
                {prop.locations?.name}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif font-bold text-lg">{prop.name}</h3>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-primary" onClick={() => handleEdit(prop)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  {/* DELETE BUTTON */}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600" onClick={() => handleDelete(prop.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-stone-500 line-clamp-2">{prop.short_description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}