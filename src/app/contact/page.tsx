import { ContactForm } from "@/components/forms/contact-form"
import { Mail, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container px-4 py-12 md:py-20 md:px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
          Get in Touch
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Whether you have a question about our hostels, want to partner with us, 
          or just want to say hello—we’d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
        
        {/* Contact Information (Left Column) */}
        <div className="lg:col-span-5 space-y-8">
          <div className="rounded-2xl bg-muted/50 p-8 space-y-6">
            <h3 className="font-serif text-2xl font-bold">Contact Info</h3>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Headquarters</p>
                <p className="text-muted-foreground">Auroville Main Road,<br />Kuilapalayam, Auroville,<br />Tamil Nadu 605101, India</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:hello@cribcommunity.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@cribcommunity.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
            <h3 className="font-serif text-2xl font-bold mb-6">Send us a Message</h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}