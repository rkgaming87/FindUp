"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import { ArrowRight, MapPin, Clock, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FoundItem {
  _id: string
  itemName: string
  category: string
  foundItemLocation: string
  createdAt: string
  reportedDate?: string
  status: string
  slug: string
}

const categoryColors: Record<string, string> = {
  Accessories: "bg-amber-100 text-amber-800",
  Electronics: "bg-blue-100 text-blue-800",
  Bags: "bg-emerald-100 text-emerald-800",
  Documents: "bg-rose-100 text-rose-800",
}

const getCategoryIcon = (category: string) => {
  const cat = category.toLowerCase();
  if (cat.includes("electronics")) return "📱";
  if (cat.includes("accessory") || cat.includes("accessories")) return "👜";
  if (cat.includes("bag")) return "🎒";
  if (cat.includes("document")) return "📄";
  if (cat.includes("book")) return "📚";
  if (cat.includes("key")) return "🔑";
  if (cat.includes("clothing") || cat.includes("watch")) return "👕";
  if (cat.includes("stationery")) return "✏️";
  return "📦";
};

export function RecentItemsSection() {
  const [items, setItems] = useState<FoundItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        const response = await api.get("/users/found-items?limit=4")
        if (response.data && response.data.data) {
          setItems(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching latest items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestItems()
  }, [])

  return (
    <section className="bg-muted/30 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Recently Found</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              Latest found items
            </h2>
            <p className="mt-2 text-muted-foreground">
              Browse the most recently reported found items across IGNOU.
            </p>
          </div>
          <Link href="/browse">
            <Button variant="outline" className="gap-2 bg-transparent">
              View All Items
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Items Grid */}
        <div className="mt-10">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <Link
                  key={item._id}
                  href={`/items/${item.slug}`}
                  className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
                >
                  {/* Image placeholder */}
                  <div className="aspect-video bg-muted/50 flex items-center justify-center">
                    <div className="text-4xl text-muted-foreground/30">
                      {getCategoryIcon(item.category)}
                    </div>
                  </div>
                  
                    <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.itemName}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className={`shrink-0 text-[10px] sm:text-xs font-semibold px-2 py-0.5 ${
                          categoryColors[item.category] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        <span className="mr-1">{getCategoryIcon(item.category)}</span>
                        {item.category}
                      </Badge>
                    </div>
                    
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">{item.foundItemLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(item.reportedDate || item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center">
              <p className="text-muted-foreground">No recently found items recorded.</p>
              <Link href="/dashboard/report" className="mt-4">
                <Button variant="link">Report a found item</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
