"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AvailabilityCalendar() {
  const [bookings, setBookings] = useState<any[]>([])
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  // Calculate 14-day view based on current date state
  // These are derived values, recalculated on render
  const startDate = startOfWeek(currentDate)
  const endDate = addDays(startDate, 13)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      
      // Re-calculate dates inside effect or use stable references
      const start = startOfWeek(currentDate)
      const end = addDays(start, 13)

      const { data: roomData } = await supabase.from('room_types').select('*, properties(name)').order('property_id')
      
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('*')
        .neq('status', 'cancelled')
        .gte('check_out', start.toISOString())
        .lte('check_in', end.toISOString())

      if (roomData) setRooms(roomData)
      if (bookingData) setBookings(bookingData)
      setLoading(false)
    }
    loadData()
    // FIX: Depend on 'currentDate' state, not the derived 'startDate' object
  }, [currentDate])

  const getBookingForDay = (roomId: string, day: Date) => {
    return bookings.find(b => 
      b.room_type_id === roomId && 
      new Date(b.check_in) <= day && 
      new Date(b.check_out) > day
    )
  }

  // Navigation
  const nextWeek = () => setCurrentDate(addDays(currentDate, 7))
  const prevWeek = () => setCurrentDate(addDays(currentDate, -7))

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">Availability</h1>
          <div className="text-sm text-stone-500">
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* SCROLLABLE CONTAINER */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse whitespace-nowrap">
            <thead>
              <tr>
                {/* Sticky Room Column Header */}
                <th className="p-4 text-left font-medium text-stone-500 w-48 sticky left-0 bg-white z-20 border-b border-r border-stone-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  Room
                </th>
                {days.map(day => (
                  <th key={day.toString()} className={`p-2 min-w-[60px] font-normal text-stone-500 border-b border-stone-100 text-center ${isSameDay(day, new Date()) ? 'bg-blue-50 text-blue-600 font-bold' : ''}`}>
                    {format(day, "dd")}
                    <div className="text-[10px] uppercase">{format(day, "EEE")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id} className="hover:bg-stone-50 transition-colors">
                  {/* Sticky Room Name */}
                  <td className="p-4 font-medium sticky left-0 bg-white z-10 border-r border-b border-stone-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="truncate w-40" title={room.name}>{room.name}</div>
                    <div className="text-xs text-stone-400 truncate w-40">{room.properties?.name}</div>
                  </td>
                  {days.map(day => {
                    const booking = getBookingForDay(room.id, day)
                    const isCheckIn = booking && isSameDay(new Date(booking.check_in), day)
                    
                    return (
                      <td key={day.toString()} className="p-1 border-r border-b border-stone-100 text-center relative h-16">
                        {booking ? (
                          <div 
                            className={`
                              h-full rounded-md text-[10px] flex items-center justify-center px-1 font-medium transition-all hover:scale-105 cursor-pointer shadow-sm
                              ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'}
                            `}
                            title={`${booking.guest_name} (${booking.status})`}
                          >
                            {isCheckIn ? booking.guest_name.split(' ')[0] : ''}
                          </div>
                        ) : (
                          <div className="h-full w-full" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}