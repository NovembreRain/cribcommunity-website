"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
// FIX: Added 'Pencil' to the imports
import { Loader2, Plus, Trash2, ArrowLeft, BedDouble, Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image"
import type { RoomType, Property } from "@/lib/supabase"

export default function AdminRoomsPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string
  
  const [property, setProperty] = useState<Property | null>(null)
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    capacity: 1,
    price_per_night: 0,
    total_units: 1,
    description: "",
    images: [] as string[],
    amenities: "" // We'll parse this from comma-separated string
  })

  // Fetch Data
  async function fetchData() {
    // Get Property Name
    const { data: prop } = await supabase.from('properties').select('*').eq('id', propertyId).single()
    if (prop) setProperty(prop)

    // Get Rooms
    const { data: roomList } = await supabase.from('room_types').select('*').eq('property_id', propertyId).order('price_per_night')
    if (roomList) setRooms(roomList as any)
  }

  useEffect(() => {
    fetchData()
  }, [propertyId])

  // Submit Handler
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Convert comma string to array
      const amenitiesArray = formData.amenities.split(',').map(s => s.trim()).filter(Boolean)

      const payload = {
        property_id: propertyId,
        name: formData.name,
        capacity: formData.capacity,
        price_per_night: formData.price_per_night,
        total_units: formData.total_units,
        description: formData.description,
        images: formData.images,
        amenities: amenitiesArray
      }

      if (editingId) {
        const { error } = await supabase.from('room_types').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success("Room updated")
      } else {
        const { error } = await supabase.from('room_types').insert([payload])
        if (error) throw error
        toast.success("Room created")
      }

      setIsOpen(false)
      fetchData()
      resetForm()
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsSaving(false)
    }
  }

  function resetForm() {
    setEditingId(null)
    setFormData({ 
      name: "", capacity: 1, price_per_night: 0, total_units: 1, 
      description: "", images: [], amenities: "" 
    })
  }

  function handleEdit(room: RoomType) {
    setEditingId(room.id)
    setFormData({
      name: room.name,
      capacity: room.capacity,
      price_per_night: room.price_per_night,
      total_units: room.total_units,
      description: room.description || "",
      images: room.images || [],
      amenities: room.amenities ? room.amenities.join(", ") : ""
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/admin/properties')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            {property ? `Rooms at ${property.name}` : "Loading..."}
          </h1>
          <p className="text-stone-500">Manage inventory and pricing.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if(!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> Add Room Type
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Room" : "New Room"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6 mt-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Name</label>
                <Input placeholder="e.g. Deluxe Garden Suite" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (₹)</label>
                  <Input type="number" value={formData.price_per_night} onChange={(e) => setFormData({...formData, price_per_night: parseFloat(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Capacity (Guests)</label>
                  <Input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Units</label>
                  <Input type="number" value={formData.total_units} onChange={(e) => setFormData({...formData, total_units: parseInt(e.target.value)})} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Images</label>
                {/* FIX: Typed val as string[] */}
                <ImageUpload 
                  value={formData.images}
                  onChange={(val: string[]) => setFormData({...formData, images: val})}
                  onRemove={(url) => setFormData({...formData, images: formData.images.filter(x => x !== url)})}
                  maxFiles={5}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Amenities (Comma separated)</label>
                <Input placeholder="Wifi, AC, Balcony" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Room details..." className="h-24" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Save Room
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Rooms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40 bg-stone-100">
              {room.images?.[0] ? (
                <Image src={room.images[0]} alt={room.name} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <BedDouble className="w-8 h-8 opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded text-xs font-bold">
                ₹{room.price_per_night}
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-serif font-bold text-lg">{room.name}</h3>
                  <p className="text-xs text-stone-500">Cap: {room.capacity} | Units: {room.total_units}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-primary" onClick={() => handleEdit(room)}>
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}