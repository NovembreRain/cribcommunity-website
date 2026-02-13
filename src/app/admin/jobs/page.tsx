"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr' // Changed import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, Briefcase } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Job {
  id: string
  title: string
  department: string
  location: string
  type: string
  description: string
  is_active: boolean
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize Authenticated Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "Auroville",
    type: "Full-time",
    description: "",
    is_active: true
  })

  async function fetchJobs() {
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false })
    if (data) setJobs(data as Job[])
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingId) {
        const { error } = await supabase.from('jobs').update(formData).eq('id', editingId)
        if (error) throw error
        toast.success("Job updated")
      } else {
        const { error } = await supabase.from('jobs').insert([formData])
        if (error) throw error
        toast.success("Job posted")
      }
      setIsOpen(false)
      fetchJobs()
      resetForm()
    } catch (error) {
      toast.error("Operation failed")
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase.from('jobs').update({ is_active: !currentStatus }).eq('id', id)
    if (!error) {
      toast.success(currentStatus ? "Job closed" : "Job activated")
      fetchJobs()
    }
  }

  function resetForm() {
    setEditingId(null)
    setFormData({ title: "", department: "", location: "Auroville", type: "Full-time", description: "", is_active: true })
  }

  function handleEdit(job: Job) {
    setEditingId(job.id)
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
      is_active: job.is_active
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Careers</h1>
          <p className="text-stone-500">Manage job openings and volunteer positions.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Post Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Job" : "New Position"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Title</label>
                <Input placeholder="e.g. Community Manager" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input placeholder="e.g. Operations" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Input placeholder="e.g. Volunteer" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea placeholder="Job details..." className="h-32" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Save Post
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => (
          <div key={job.id} className={`p-4 rounded-xl border flex items-center justify-between ${job.is_active ? 'bg-white border-stone-200' : 'bg-stone-50 border-stone-200 opacity-70'}`}>
            <div className="flex items-center gap-4">
              <div className="p-2 bg-stone-100 rounded-full text-stone-500">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900">{job.title}</h3>
                <p className="text-sm text-stone-500">{job.department} • {job.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 mr-4">
                <span className="text-xs text-stone-500">{job.is_active ? 'Active' : 'Closed'}</span>
                <Switch checked={job.is_active} onCheckedChange={() => toggleStatus(job.id, job.is_active)} />
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleEdit(job)}>
                <Pencil className="w-4 h-4 text-stone-400" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}