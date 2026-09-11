"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { ArrowRight, MapPin, Calendar, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FoundItem {
  _id: string;
  itemName: string;
  category: string;
  foundItemLocation?: string;
  lostItemLocation?: string;
  itemImage?: string;
  createdAt: string;
  reportedDate?: string;
  status: string;
  slug: string;
}

const getCategoryIcon = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("electronics") || cat.includes("phone") || cat.includes("laptop")) return "💻";
  if (cat.includes("accessory") || cat.includes("accessories") || cat.includes("watch")) return "⌚";
  if (cat.includes("bag") || cat.includes("wallet")) return "🎒";
  if (cat.includes("document") || cat.includes("card") || cat.includes("id")) return "📄";
  if (cat.includes("book")) return "📚";
  if (cat.includes("key")) return "🔑";
  if (cat.includes("bottle")) return "🧴";
  return "📦";
};

export function RecentItemsSection() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestItems = async () => {
      try {
        const response = await api.get("/users/found-items?limit=4");
        if (response.data && response.data.data) {
          setItems(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching latest items:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestItems();
  }, []);

  return (
    <section className="relative border-t border-border/40 bg-gradient-to-b from-background via-muted/20 to-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
              <Sparkles className="h-3 w-3" />
              <span>Live Campus Feed</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Recently Reported Items
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Browse the latest belongings found across study centers and campuses.
            </p>
          </div>
          <Link href="/browse">
            <Button
              variant="outline"
              className="gap-2 rounded-xl border-border/70 bg-background/50 backdrop-blur-sm transition-all hover:bg-muted"
            >
              <span>Explore All Registry</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Items Grid */}
        <div className="mt-12">
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="glass-card animate-pulse rounded-2xl overflow-hidden p-3 border border-border/40"
                >
                  <div className="aspect-video w-full rounded-xl bg-muted" />
                  <div className="mt-4 space-y-2 p-1">
                    <div className="h-5 w-3/4 rounded bg-muted" />
                    <div className="h-3 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((item) => (
                <Link
                  key={item._id}
                  href={`/items/${item.slug}`}
                  className="glass-card group relative flex flex-col overflow-hidden rounded-2xl p-3 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40"
                >
                  {/* Image / Fallback Container */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-tr from-muted to-muted/50">
                    {item.itemImage ? (
                      <img
                        src={item.itemImage}
                        alt={item.itemName}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-teal-500/10 via-cyan-500/5 to-sky-500/10">
                        <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                          {getCategoryIcon(item.category)}
                        </span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-md border border-border/40 shadow-xs">
                        {item.status === "RETURNED" || item.status === "RECOVERED" ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Reunited</span>
                          </>
                        ) : (
                          <>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                            <span>Found & Available</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Category Chip */}
                    <div className="absolute bottom-2.5 right-2.5">
                      <Badge
                        variant="secondary"
                        className="bg-background/80 backdrop-blur-md text-[11px] font-medium border border-border/40"
                      >
                        {item.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="flex flex-1 flex-col justify-between p-3">
                    <div>
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {item.itemName}
                      </h3>
                      <div className="mt-2.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                          <span className="line-clamp-1">
                            {item.foundItemLocation || item.lostItemLocation || "Campus premises"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          <span>
                            {new Date(item.reportedDate || item.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-border/30 pt-3 text-xs font-semibold text-primary">
                      <span>View details & claim</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="glass-card flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 mb-3">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-base font-semibold text-foreground">No recent items recorded yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Be the first to report a lost or found item to help the campus community.
              </p>
              <Link href="/dashboard/report" className="mt-4">
                <Button size="sm" className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                  Report Item
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
