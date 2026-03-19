import Link from "next/link"
import { ArrowRight, Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/5" />
        <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            IGNOU Lost & Found Platform
          </div>

          {/* Headline */}
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Lost something?{" "}
            <span className="text-primary">Find it here.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            A centralized platform for IGNOU students and staff to report lost items, 
            browse found belongings, and reunite with what matters most.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/browse">
              <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Browse Found Items
              </Button>
            </Link>
            <Link href="/dashboard/report">
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                Report Lost Item
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Trust indicator */}
          <p className="mt-8 text-sm text-muted-foreground">
            <MapPin className="mr-1 inline-block h-4 w-4" />
            Serving all IGNOU regional centers across India
          </p>
        </div>
      </div>
    </section>
  )
}
