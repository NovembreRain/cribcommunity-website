"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import { ArrowUpRight, ArrowDownLeft, Wallet, Users } from "lucide-react"
import { format } from "date-fns"

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, bookings: 0, pending: 0 })
  const [arrivals, setArrivals] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    async function loadData() {
      const today = new Date().toISOString().split('T')[0]

      // 1. Get Counters
      const { count: pending } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending')
      
      // 2. Get Revenue Data
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_price, created_at')
        .eq('status', 'confirmed')
      
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_price || 0), 0) || 0
      
      // 3. Process Chart Data
      const monthlyData: Record<string, number> = {}
      bookings?.forEach(b => {
        const month = format(new Date(b.created_at), 'MMM')
        monthlyData[month] = (monthlyData[month] || 0) + (b.total_price || 0)
      })
      const chart = Object.keys(monthlyData).map(key => ({ name: key, total: monthlyData[key] }))

      // 4. Get Morning Report
      const { data: arriving } = await supabase
        .from('bookings')
        .select('*, properties(name)')
        .eq('check_in', today)
        .neq('status', 'cancelled')

      setStats({ revenue: totalRevenue, bookings: bookings?.length || 0, pending: pending || 0 })
      setArrivals(arriving || [])
      setChartData(chart)
    }
    loadData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><Wallet className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-stone-500">Total Revenue</p>
              <h3 className="text-2xl font-bold text-stone-900">₹{stats.revenue.toLocaleString()}</h3>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-stone-500">Confirmed Stays</p>
              <h3 className="text-2xl font-bold text-stone-900">{stats.bookings}</h3>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><ArrowUpRight className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-stone-500">Pending Action</p>
              <h3 className="text-2xl font-bold text-stone-900">{stats.pending}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Morning Report */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-96 overflow-y-auto">
          <h3 className="font-serif font-bold text-lg mb-4">Morning Report (Arrivals Today)</h3>
          {arrivals.length === 0 ? (
            <div className="text-stone-400 text-sm py-8 text-center bg-stone-50 rounded-lg">No arrivals scheduled for today.</div>
          ) : (
            <div className="space-y-4">
              {arrivals.map((booking) => (
                <div key={booking.id} className="flex justify-between items-center p-3 bg-stone-50 rounded-lg">
                  <div>
                    <p className="font-medium">{booking.guest_name}</p>
                    <p className="text-xs text-stone-500">{booking.properties?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Checking In</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Chart - FIXED: Explicit Height */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm h-96 flex flex-col">
          <h3 className="font-serif font-bold text-lg mb-4">Revenue Trend</h3>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} tick={{ fontSize: 12, fill: '#888' }} />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, "Revenue"]} 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                />
                <Bar dataKey="total" fill="#2d2a26" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}