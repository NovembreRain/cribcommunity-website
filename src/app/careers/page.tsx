import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"

// This is a Server Component (fetches data on the server for SEO)
export default async function CareersPage() {
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="container px-4 py-12 md:py-20 md:px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
          Join the Tribe
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          We are always looking for creative souls, community builders, and nature lovers 
          to help us build the most welcoming hostels in Auroville.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <div 
              key={job.id} 
              className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  <span className="bg-secondary/10 text-secondary px-2 py-1 rounded">
                    {job.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {job.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.location}
                  </span>
                </div>
                <h3 className="text-xl font-bold font-serif">{job.title}</h3>
                <p className="text-muted-foreground max-w-xl text-sm leading-relaxed">
                  {job.description}
                </p>
              </div>
              <div className="shrink-0">
                <Link href={`/contact?subject=Application: ${job.title}`}>
                  <Button variant="outline" className="group">
                    Apply Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
            <h3 className="text-lg font-medium text-muted-foreground">No open positions right now.</h3>
            <p className="text-sm text-muted-foreground/80 mt-2">
              Feel free to send us an open application via our contact page.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}