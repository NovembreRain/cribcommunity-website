import Image from "next/image"

export default function AboutPage() {
  return (
    <div className="container px-4 py-12 md:py-20 md:px-6 max-w-4xl mx-auto">
      <div className="space-y-6 text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary">Our Story</h1>
        <p className="text-xl text-muted-foreground">Cultivating community in the red earth of Auroville.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
           {/* Placeholder for About Image */}
           <div className="absolute inset-0 bg-secondary/20 flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Add image: /images/location2.jpg</span>
           </div>
           {/* Uncomment when image is ready:
           <Image src="/images/location2.jpg" alt="Community gathering" fill className="object-cover" />
           */}
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-semibold">Rooted in Nature</h2>
          <p className="text-muted-foreground leading-relaxed">
            Started in 2023, CribCommunity began with a simple idea: create a space where travelers don't just sleep, but connect. We wanted to offer an alternative to sterile hotels—a place where the vines grow into the windows and the birds are your alarm clock.
          </p>
        </div>
      </div>
    </div>
  )
}