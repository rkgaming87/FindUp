import {
  Search,
  BellRing,
  ShieldCheck,
  Zap,
  Users2,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "AI & Instant Search",
    description:
      "Deep search by tags, item color, serial numbers, timestamps, and locations to rapidly match lost belongings.",
    badge: "Fast Matching",
    gradient: "from-teal-500/20 to-cyan-500/20",
    iconColor: "text-teal-500",
  },
  {
    icon: BellRing,
    title: "Real-time Notifications",
    description:
      "Receive live alerts instantly whenever a recovered item matching your description is registered on the portal.",
    badge: "Automated",
    gradient: "from-cyan-500/20 to-blue-500/20",
    iconColor: "text-cyan-500",
  },
  {
    icon: ShieldCheck,
    title: "Verified Claim Protection",
    description:
      "Prevent fraudulent claims with student enrollment verification, photo evidence matching, and moderator authorization.",
    badge: "High Security",
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-500",
  },
  {
    icon: Zap,
    title: "Rapid 1-Click Reporting",
    description:
      "Intuitive multi-step report flow with instant image compression, Cloudinary upload, and automatic tagging.",
    badge: "Streamlined",
    gradient: "from-sky-500/20 to-indigo-500/20",
    iconColor: "text-sky-500",
  },
  {
    icon: Users2,
    title: "Campus Community Network",
    description:
      "Empowers IGNOU students, professors, and library staff to cooperate and return lost items safely.",
    badge: "Community First",
    gradient: "from-indigo-500/20 to-purple-500/20",
    iconColor: "text-indigo-500",
  },
  {
    icon: MapPin,
    title: "Multi-Center Location Mapping",
    description:
      "Filter items by study center, library branch, administrative building, examination hall, or transit points.",
    badge: "All 67 Centers",
    gradient: "from-teal-500/20 to-emerald-500/20",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-background py-20 sm:py-28">
      {/* Subtle Glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[700px] rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
            <Sparkles className="h-3 w-3" />
            <span>Platform Features</span>
          </div>
          <h2 className="mt-4 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Engineered to reunite you with what matters
          </h2>
          <p className="mt-4 text-pretty text-base text-muted-foreground sm:text-lg">
            A comprehensive suite of modern recovery tools built specifically for campus environments.
          </p>
        </div>

        {/* Features Bento Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-2xl p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${feature.gradient} ${feature.iconColor} shadow-inner transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/30 flex items-center text-xs font-semibold text-primary">
                  <span>Learn more</span>
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
