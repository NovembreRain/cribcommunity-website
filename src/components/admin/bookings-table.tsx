"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
// FIX 1: Import the SSR browser client creator
import { createBrowserClient } from '@supabase/ssr'
import { 
  CheckCircle, 
  XCircle, 
  MoreHorizontal, 
  Search, 
  Download,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface BookingRow {
  id: string
  guest_name: string
  guest_email: string
  check_in: string
  check_out: string
  total_price: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'blocked'
  created_at: string
  properties: { name: string } | null
  room_types: { name: string } | null
}

interface BookingsTableProps {
  initialBookings: BookingRow[]
}

export function BookingsTable({ initialBookings }: BookingsTableProps) {
  const router = useRouter()
  
  // FIX 2: Initialize the "Smart" Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [bookings, setBookings] = useState<BookingRow[]>(initialBookings)
  const [filter, setFilter] = useState("pending") 
  const [search, setSearch] = useState("")
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    setBookings(initialBookings)
  }, [initialBookings])

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = search.toLowerCase()
    const matchesSearch = 
      booking.guest_name.toLowerCase().includes(searchLower) ||
      booking.guest_email.toLowerCase().includes(searchLower) ||
      (booking.properties?.name || "").toLowerCase().includes(searchLower)

    if (filter === "pending") return booking.status === "pending" && matchesSearch
    if (filter === "confirmed") return booking.status === "confirmed" && matchesSearch
    if (filter === "cancelled") return booking.status === "cancelled" && matchesSearch
    
    return matchesSearch
  })

  async function updateStatus(id: string, newStatus: 'pending' | 'confirmed' | 'cancelled') {
    const previousBookings = [...bookings]
    
    // Optimistic Update
    setBookings(current => 
      current.map(b => (b.id === id ? { ...b, status: newStatus } : b))
    )

    try {
      // FIX 3: Check if we actually have a session (Debug check)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error("No active session found. Please log in again.")

      // Perform Update
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id)

      if (error) throw error

      toast.success(`Booking ${newStatus}`, {
        description: "Database updated successfully."
      })
      
      router.refresh()
    } catch (error: any) {
      console.error("Update failed:", error)
      setBookings(previousBookings) // Revert
      toast.error("Update failed", { 
        description: error.message || "Could not connect to database." 
      })
    }
  }

  const handleExport = () => {
    setIsExporting(true)
    try {
      const headers = ["ID", "Guest", "Property", "Check In", "Check Out", "Total", "Status"]
      const rows = filteredBookings.map(b => [
        b.id,
        `"${b.guest_name}"`,
        `"${b.properties?.name}"`,
        b.check_in,
        b.check_out,
        b.total_price,
        b.status
      ])
      
      const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.download = `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`
      link.click()
      toast.success("Download started")
    } catch (e) {
      toast.error("Export failed")
    } finally {
      setIsExporting(false)
    }
  }

  // --- Render Helpers ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">Pending</Badge>
      case "cancelled":
        return <Badge variant="outline" className="text-stone-400">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row justify-between gap-4 items-start xl:items-center bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        
        <Tabs value={filter} className="w-full xl:w-auto" onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All Records</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              {bookings.filter(b => b.status === 'pending').length > 0 && (
                <span className="ml-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {bookings.filter(b => b.status === 'pending').length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-3 w-full xl:w-auto">
          <Input
            placeholder="Search..."
            className="bg-stone-50 border-stone-200 w-full md:w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="outline" size="icon" onClick={handleExport} disabled={isExporting}>
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-stone-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-stone-50">
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Calendar className="w-8 h-8 text-stone-300 opacity-50" />
                    <p>No records found in this view.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredBookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-stone-50/50">
                  <TableCell>
                    <div className="font-medium text-stone-900">{booking.guest_name}</div>
                    <div className="text-xs text-stone-500">{booking.guest_email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{booking.properties?.name}</div>
                    <div className="text-xs text-stone-500">{booking.room_types?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(new Date(booking.check_in), "MMM d")} - {format(new Date(booking.check_out), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="text-right font-medium">₹{booking.total_price}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {booking.status !== 'confirmed' && (
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, "confirmed")}>
                            <CheckCircle className="mr-2 h-4 w-4 text-green-600" /> Confirm
                          </DropdownMenuItem>
                        )}
                        {booking.status !== 'cancelled' && (
                          <DropdownMenuItem onClick={() => updateStatus(booking.id, "cancelled")}>
                            <XCircle className="mr-2 h-4 w-4 text-red-600" /> Cancel
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}