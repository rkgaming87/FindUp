import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "I lost my laptop bag in the library and thought it was gone forever. Within 3 days, someone had reported finding it and I got everything back!",
    name: "Priya Sharma",
    role: "MBA Student, Delhi RC",
    initials: "PS",
  },
  {
    quote: "As a faculty member, I really appreciate how organized this platform is. It's made managing lost items at our center so much easier.",
    name: "Dr. Rajesh Kumar",
    role: "Faculty, Bangalore RC",
    initials: "RK",
  },
  {
    quote: "The notification system is brilliant! I got an alert the moment someone found my ID card. The whole process took less than 24 hours.",
    name: "Amit Patel",
    role: "BCA Student, Mumbai RC",
    initials: "AP",
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Testimonials</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Trusted by the IGNOU community
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            See what students and staff have to say about their experience with FindUp.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <Quote className="mb-4 h-8 w-8 text-primary/30" />
              <blockquote className="text-sm leading-relaxed text-muted-foreground">
                {testimonial.quote}
              </blockquote>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
