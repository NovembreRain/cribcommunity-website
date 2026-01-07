import { supabase } from "@/lib/supabase"
import { BookingsTable } from "@/components/admin/bookings-table"

export const revalidate = 0 // Ensure we always see the latest bookings

export default async function AdminBookingsPage() {
  // 1. Fetch bookings with joined data
  // We use the inner join syntax 'properties (name)' to get the names directly
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select(`
      *,
      properties (name),
      room_types (name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching bookings:", error)
    return <div className="p-8 text-red-500">Error loading bookings. Please check the console.</div>
  }

  // 2. Format data for the table
  // Supabase returns arrays for joined data, we flatten it for the UI
  const formattedBookings = (bookings || []).map(b => ({
    ...b,
    properties: Array.isArray(b.properties) ? b.properties[0] : b.properties,
    room_types: Array.isArray(b.room_types) ? b.room_types[0] : b.room_types,
  }))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Booking Requests</h1>
          <p className="text-stone-500">Manage incoming reservations and check availability.</p>
        </div>
      </div>

      {/* 3. The Interactive Table */}
      <BookingsTable initialBookings={formattedBookings as any} />
    </div>
  )
}