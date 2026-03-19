const stats = [
  { value: "2,500+", label: "Items Recovered", description: "Successfully reunited" },
  { value: "15,000+", label: "Active Users", description: "Students & staff" },
  { value: "85%", label: "Recovery Rate", description: "Within 7 days" },
  { value: "67", label: "Regional Centers", description: "Across India" },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">{stat.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
