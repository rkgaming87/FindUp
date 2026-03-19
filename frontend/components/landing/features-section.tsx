import { 
  Search, 
  Bell, 
  Shield, 
  Clock, 
  Users, 
  MapPin 
} from "lucide-react"

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Powerful search with filters for category, date, location, and more to find your items quickly.",
  },
  {
    icon: Bell,
    title: "Real-time Alerts",
    description: "Get instant notifications when someone reports finding an item matching your lost item description.",
  },
  {
    icon: Shield,
    title: "Secure Claims",
    description: "Verification system ensures items are returned to their rightful owners with proper identification.",
  },
  {
    icon: Clock,
    title: "Quick Recovery",
    description: "Streamlined process from reporting to claiming, with most items recovered within a week.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by and for the IGNOU community, fostering trust and cooperation among students and staff.",
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Track where items were found or lost across all IGNOU regional centers and study centers.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Features</p>
          <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything you need to recover lost items
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Our platform provides all the tools to report, search, and claim lost and found items efficiently.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
