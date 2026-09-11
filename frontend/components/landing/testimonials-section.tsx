import { Quote, Star, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote:
      "I lost my laptop bag with all my project notes in the campus library and thought it was gone forever. Within 2 days, a student posted it on FindUp and I reclaimed everything safely!",
    name: "Priya Sharma",
    role: "MBA Student • Delhi Regional Center",
    initials: "PS",
    stars: 5,
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    quote:
      "As a faculty member, managing lost belongings was cumbersome. FindUp has streamlined lost items at our center with clear identification verification.",
    name: "Dr. Rajesh Kumar",
    role: "Faculty Member • Bangalore Center",
    initials: "RK",
    stars: 5,
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    quote:
      "The instant notification alert is a game-changer! I got pinged the moment someone found my hall ticket and student ID before exams began.",
    name: "Amit Patel",
    role: "BCA Student • Mumbai Regional Center",
    initials: "AP",
    stars: 5,
    gradient: "from-emerald-500 to-teal-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3 w-3" />
            <span>Community Stories</span>
          </div>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by students & faculty across India
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            Hear from genuine community members who have successfully reclaimed their belongings.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                <blockquote className="text-sm leading-relaxed text-foreground/80 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
              </div>

              <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-4">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarFallback className={`bg-gradient-to-tr ${testimonial.gradient} font-bold text-white text-xs`}>
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
