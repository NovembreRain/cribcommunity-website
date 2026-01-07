"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
// FIX 1: Use the browser client creator for auth actions
import { createBrowserClient } from '@supabase/ssr'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Loader2, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  // FIX 2: Default to empty string
  const [email, setEmail] = useState("") 
  const [password, setPassword] = useState("")

  // Initialize client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error("Access Denied", {
          description: "Invalid credentials. Please try again."
        })
        setLoading(false)
        return
      }

      toast.success("Welcome back", {
        description: "Securely logging you in..."
      })

      // FIX 3: THE ANTI-LOOP TRICK
      // 1. Refresh the router to update Server Components/Middleware with the new cookie
      router.refresh()
      
      // 2. Wait a tiny bit for the cookie to settle, then redirect
      setTimeout(() => {
        router.replace("/admin")
      }, 1000)

    } catch (err) {
      setLoading(false)
      toast.error("Login Error", { description: "Something went wrong." })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-stone-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">Admin Access</h1>
          <p className="text-stone-500 mt-2">Enter credentials to manage CribCommunity</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Input 
              type="email" 
              placeholder="admin@cribcommunity.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-stone-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-stone-50"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2" /> : null}
            {loading ? "Verifying..." : "Enter Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  )
}