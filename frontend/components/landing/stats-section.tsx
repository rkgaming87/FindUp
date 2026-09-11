import { Award, Users, CheckCircle2, Building2 } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "2,500+",
    label: "Items Reunited",
    description: "Returned to rightful owners",
    gradient: "from-teal-500 to-emerald-500",
  },
  {
    icon: Users,
    value: "15,000+",
    label: "Registered Users",
    description: "Students & faculty network",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: CheckCircle2,
    value: "88%",
    label: "Success Rate",
    description: "Matched within 72 hours",
    gradient: "from-sky-500 to-teal-500",
  },
  {
    icon: Building2,
    value: "67+",
    label: "Regional Centers",
    description: "Connected across India",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function StatsSection() {
  return (
    <section className="relative border-y border-border/40 bg-gradient-to-b from-background via-muted/30 to-background py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="glass-card group relative overflow-hidden rounded-2xl p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.gradient} text-white shadow-md shadow-teal-500/20 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                      {stat.value}
                    </h3>
                    <p className="text-sm font-semibold text-foreground/90">{stat.label}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{stat.description}</p>
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-teal-500/5 blur-xl group-hover:bg-teal-500/10 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
