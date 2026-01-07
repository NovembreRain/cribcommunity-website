import { supabase } from "@/lib/supabase"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="container px-4 py-12 md:py-20 md:px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
          Journal
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Stories from the vines, updates from the community, and guides to life in Auroville.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts && posts.map((post) => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
            <article className="h-full flex flex-col rounded-xl overflow-hidden border bg-card transition-all hover:shadow-lg">
              <div className="relative h-48 bg-muted">
                {post.cover_image ? (
                  <Image 
                    src={post.cover_image} 
                    alt={post.title} 
                    fill 
                    className="object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/10 text-secondary">
                    <span className="font-serif italic text-2xl opacity-20">CribCommunity</span>
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at).toLocaleDateString()}
                </div>
                <h2 className="text-xl font-serif font-bold mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-grow">
                  {post.excerpt}
                </p>
                <span className="text-sm font-medium text-primary underline-offset-4 group-hover:underline">
                  Read Story
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  )
}