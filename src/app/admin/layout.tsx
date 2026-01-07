"use client"

import { useEffect, useState } from "react" // Import useEffect
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
// Use createBrowserClient for client-side auth checks
import { createBrowserClient } from '@supabase/ssr' 
import { 
  LayoutDashboard, 
  Hotel, 
  Map, 
  CalendarDays, 
  FileText, 
  Briefcase, 
  LogOut,
  Menu,
  Loader2 // Import Loader
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// ... keep your sidebarItems array ...
const sidebarItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/admin/calendar", label: "Availability", icon: CalendarDays }, // Added Calendar
  { href: "/admin/locations", label: "Locations", icon: Map },
  { href: "/admin/properties", label: "Properties", icon: Hotel },
  { href: "/admin/blog", label: "Blog Posts", icon: FileText },
  { href: "/admin/jobs", label: "Careers", icon: Briefcase },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true) // Loading state

  // Initialize Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // DEFENSE IN DEPTH: Client-side Auth Check
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      } else {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [router, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Show nothing (or loader) while checking permission
  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-stone-50"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-stone-900">
      <div className="p-6 border-b border-stone-200">
        <span className="font-serif text-xl font-bold text-primary">Crib Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-stone-100 text-stone-600"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-stone-200">
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 bg-white border-r border-stone-200 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full z-40 bg-white border-b px-4 h-16 flex items-center justify-between">
        <span className="font-serif font-bold text-primary">Crib Admin</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon"><Menu /></Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 mt-16 md:mt-0">
        {children}
      </main>
    </div>
  )
}