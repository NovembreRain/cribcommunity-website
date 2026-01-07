"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format, differenceInCalendarDays, addDays } from "date-fns"
import { Calendar as CalendarIcon, Loader2, Minus, Plus, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import type { RoomType } from "@/lib/supabase"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// 1. Validation Schema
const formSchema = z.object({
  guest_name: z.string().min(2, "Name required"),
  guest_email: z.string().email("Invalid email"),
  guest_phone: z.string().min(10, "Phone required"),
  room_type_id: z.string().min(1, "Select a room"),
  date_range: z.object({
    from: z.date(),
    to: z.date(),
  }),
  num_guests: z.coerce.number().min(1).max(10),
  special_requests: z.string().optional(),
})

interface BookingWidgetProps {
  propertyId: string
  propertyName: string
}

export function BookingWidget({ propertyId, propertyName }: BookingWidgetProps) {
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [loadingRooms, setLoadingRooms] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 2. Initialize Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      guest_name: "",
      guest_email: "",
      guest_phone: "",
      room_type_id: "",
      num_guests: 1,
      special_requests: "",
      date_range: {
        from: new Date(),
        to: addDays(new Date(), 1),
      }
    },
  })

  // 3. Fetch Rooms
  useEffect(() => {
    async function fetchRooms() {
      const { data } = await supabase
        .from('room_types')
        .select('*')
        .eq('property_id', propertyId)
      
      if (data) setRooms(data)
      setLoadingRooms(false)
    }
    fetchRooms()
  }, [propertyId])

  // 4. Live Calculations
  const selectedRoomId = form.watch("room_type_id")
  const dateRange = form.watch("date_range")
  
  const selectedRoom = rooms.find(r => r.id === selectedRoomId)
  const nights = dateRange?.from && dateRange?.to 
    ? differenceInCalendarDays(dateRange.to, dateRange.from) 
    : 0
  const estimatedPrice = selectedRoom && nights > 0 
    ? selectedRoom.price_per_night * nights 
    : 0

  // 5. Submit Handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        property_id: propertyId,
        room_type_id: values.room_type_id,
        guest_name: values.guest_name,
        guest_email: values.guest_email,
        guest_phone: values.guest_phone,
        check_in: format(values.date_range.from, "yyyy-MM-dd"),
        check_out: format(values.date_range.to, "yyyy-MM-dd"),
        num_guests: values.num_guests,
        special_requests: values.special_requests
      }

      const res = await fetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || data.error)

      toast.success("Request Sent!", { description: `We'll confirm your stay at ${propertyName} shortly.` })
      form.reset()
    } catch (error: any) {
      toast.error("Booking Failed", { description: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-6">
      
      {/* CUSTOM STYLE FOR BIGGER CALENDAR */}
      <style jsx global>{`
        .rdp-day { width: 40px !important; height: 40px !important; font-size: 1rem !important; }
        .rdp-nav_button { width: 32px !important; height: 32px !important; }
        .rdp-head_cell { font-size: 0.9rem !important; font-weight: 600 !important; color: #78716c; }
        .rdp-caption_label { font-size: 1.1rem !important; font-family: var(--font-serif); }
      `}</style>

      <div className="space-y-1">
        <h3 className="font-serif text-2xl font-bold text-foreground">Reserve</h3>
        <p className="text-sm text-muted-foreground">Best rates guaranteed direct.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          
          {/* --- TOP SECTION: COMPACT SELECTORS --- */}
          
          {/* 1. Date Picker Block */}
          <FormField
            control={form.control}
            name="date_range"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-14 justify-start text-left font-normal border-input bg-background hover:bg-accent/50 rounded-xl px-4",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-3 h-5 w-5 text-muted-foreground" />
                      <div className="flex flex-col items-start">
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dates</span>
                        <span className="font-medium text-foreground text-base">
                          {field.value?.from ? (
                            field.value.to ? (
                              <>{format(field.value.from, "MMM dd")} — {format(field.value.to, "MMM dd")}</>
                            ) : format(field.value.from, "MMM dd")
                          ) : "Check-in — Check-out"}
                        </span>
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 border-none shadow-xl rounded-xl" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value}
                      onSelect={field.onChange}
                      numberOfMonths={1}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      className="p-4 bg-white rounded-xl border border-stone-100"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* 2. Room Selector */}
            <FormField
              control={form.control}
              name="room_type_id"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="h-14 rounded-xl px-4 bg-background">
                        <div className="text-left">
                          <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Room</span>
                          <SelectValue placeholder="Select..." />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl shadow-lg">
                      {rooms.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 3. Guest Counter */}
            <FormField
              control={form.control}
              name="num_guests"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="h-14 rounded-xl border border-input bg-background flex items-center justify-between px-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Guests</span>
                      <span className="font-medium text-foreground">{field.value as number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full"
                        onClick={() => field.onChange(Math.max(1, (field.value as number) - 1))}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <Button 
                        type="button" variant="ghost" size="icon" className="h-7 w-7 rounded-full"
                        onClick={() => field.onChange(Math.min(10, (field.value as number) + 1))}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- MIDDLE SECTION: PERSONAL DETAILS --- */}
          <div className="space-y-3 pt-2">
            <FormField
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Full Name" {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="guest_email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email Address" {...field} className="h-11 rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guest_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Phone No." {...field} className="h-11 rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="special_requests"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Special requests? (Optional)" 
                      {...field} 
                      className="min-h-[60px] rounded-lg resize-none" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* --- BOTTOM SECTION: TOTAL & SUBMIT --- */}
          <div className="pt-2 space-y-4 border-t border-border mt-4">
            {estimatedPrice > 0 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-medium text-sm">Total ({nights} nights)</span>
                <span className="font-serif text-2xl font-bold text-primary">₹{estimatedPrice.toLocaleString()}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 text-lg rounded-xl shadow-md transition-all hover:-translate-y-0.5" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" /> Processing...
                </>
              ) : (
                "Request Booking"
              )}
            </Button>
            
            <p className="text-center text-[10px] text-muted-foreground uppercase tracking-wide">
              No payment required today
            </p>
          </div>

        </form>
      </Form>
    </div>
  )
}