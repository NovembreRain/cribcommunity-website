"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from '@supabase/ssr' // Changed import
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { toast } from "sonner"
import { Loader2, Plus, Pencil, FileText, ExternalLink, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  published: boolean
  created_at: string
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
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
    slug: "",
    excerpt: "",
    content: "",
    cover_image: [] as string[],
    published: false
  })

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
    if (data) setPosts(data as any)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // Auto-slug generator
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    if (!editingId) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      setFormData(prev => ({ ...prev, title, slug }))
    } else {
      setFormData(prev => ({ ...prev, title }))
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        cover_image: formData.cover_image[0] || null,
        published: formData.published
      }

      if (editingId) {
        const { error } = await supabase.from('posts').update(payload).eq('id', editingId)
        if (error) throw error
        toast.success("Story updated")
      } else {
        const { error } = await supabase.from('posts').insert([payload])
        if (error) throw error
        toast.success("Story published")
      }
      setIsOpen(false)
      fetchPosts()
      resetForm()
    } catch (error: any) {
      toast.error("Operation failed", { description: error.message })
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this story?")) return

    try {
      const { error } = await supabase.from('posts').delete().eq('id', id)
      if (error) throw error

      toast.success("Story deleted")
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      toast.error("Delete failed")
    }
  }

  function resetForm() {
    setEditingId(null)
    setFormData({ title: "", slug: "", excerpt: "", content: "", cover_image: [], published: true })
  }

  function handleEdit(post: Post) {
    setEditingId(post.id)
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content,
      cover_image: post.cover_image ? [post.cover_image] : [],
      published: post.published
    })
    setIsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Journal</h1>
          <p className="text-stone-500">Share stories from the community.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" /> Write Story</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Story" : "New Story"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSubmit} className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input placeholder="e.g. Monsoon Magic" value={formData.title} onChange={handleTitleChange} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input placeholder="e.g. monsoon-magic" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <ImageUpload
                  value={formData.cover_image}
                  onChange={(val: string[]) => setFormData({ ...formData, cover_image: val })}
                  onRemove={() => setFormData({ ...formData, cover_image: [] })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt (Card View)</label>
                <Textarea placeholder="Short summary..." className="h-20" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea placeholder="Write your story here..." className="h-64 font-mono text-sm" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  {/* FIX: Explicitly typed 'checked' as boolean */}
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked: boolean) => setFormData({ ...formData, published: checked })}
                  />
                  <span className="text-sm text-stone-600">{formData.published ? 'Public' : 'Draft'}</span>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" /> : null} Save Story
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-48 bg-stone-100">
              {post.cover_image ? (
                <Image src={post.cover_image} alt={post.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400">
                  <FileText className="w-8 h-8 opacity-20" />
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${post.published ? 'bg-green-100 text-green-700' : 'bg-stone-200 text-stone-600'}`}>
                {post.published ? 'Published' : 'Draft'}
              </div>
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-serif font-bold text-lg line-clamp-1">{post.title}</h3>
              <p className="text-sm text-stone-500 line-clamp-2">{post.excerpt}</p>

              <div className="flex justify-between items-center pt-2">
                <Link href={`/blog/${post.slug}`} target="_blank">
                  <Button variant="ghost" size="sm" className="text-stone-400 hover:text-primary">
                    <ExternalLink className="w-4 h-4 mr-1" /> View
                  </Button>
                </Link>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-600" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}