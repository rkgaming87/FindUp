"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Calendar,
  Grid,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";

import { getAllItems } from "@/lib/foundItemContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Item = {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  category: string;
  status: string;
  type: "lost" | "found";
  createdAt: string;
  date: string;
  itemImage?: string;
};

const categoryIcons: Record<string, string> = {
  electronics: "💻",
  accessories: "⌚",
  bags: "🎒",
  books: "📚",
  documents: "📄",
  keys: "🔑",
  clothing: "👕",
  other: "📦",
};

const filterCategories = [
  { id: "all", label: "All Categories", icon: "✨" },
  { id: "electronics", label: "Electronics", icon: "💻" },
  { id: "bags", label: "Bags & Wallets", icon: "🎒" },
  { id: "documents", label: "ID & Docs", icon: "📄" },
  { id: "accessories", label: "Accessories", icon: "⌚" },
  { id: "keys", label: "Keys", icon: "🔑" },
  { id: "books", label: "Books", icon: "📚" },
];

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory.toLowerCase());
  const [selectedType, setSelectedType] = useState<"all" | "lost" | "found">("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const activeCategory = selectedCategory !== "all" ? selectedCategory : "";
        const res = await getAllItems(page, 12, searchQuery, activeCategory);

        if (res.totalPages) setTotalPages(res.totalPages);
        if (res.total !== undefined) setTotalItemsCount(res.total);

        const formattedItems: Item[] = (res.data || []).map((item: any) => ({
          id: item._id,
          slug: item.slug,
          title: item.itemName,
          description: item.description,
          location: item.foundItemLocation || item.lostItemLocation || "Campus",
          category: item.category?.toLowerCase() || "other",
          status: item.status?.toLowerCase() || "pending",
          type: item.type || "found",
          createdAt: item.createdAt,
          date: item.reportedDate || item.createdAt,
          itemImage: item.itemImage,
        }));

        setItems(formattedItems);
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, searchQuery, selectedCategory]);

  const filteredItems = items
    .filter((item) => {
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return 0;
    });

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1 pb-16">
        {/* Page Header Banner */}
        <div className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-muted/40 via-background to-background py-10 sm:py-14">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-[600px] rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
                  <Sparkles className="h-3 w-3" />
                  <span>Central Campus Directory</span>
                </div>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                  Browse Lost & Found Items
                </h1>
                <p className="mt-2 text-base text-muted-foreground">
                  Explore verified lost and recovered belongings reported across all IGNOU centers.
                </p>
              </div>

              <Link href="/dashboard/report">
                <Button className="rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 font-semibold text-white shadow-md shadow-teal-500/20">
                  + Report New Item
                </Button>
              </Link>
            </div>

            {/* Category Quick Pills */}
            <div className="mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {filterCategories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setPage(1);
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md shadow-teal-500/20"
                        : "border border-border/60 bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="glass-card flex flex-col gap-4 rounded-2xl p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items by name, model, description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="pl-10 pr-10 rounded-xl border-border/50 bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Type Segment Filter (All / Lost / Found) */}
            <div className="flex items-center rounded-xl border border-border/50 bg-background/50 p-1">
              {(["all", "lost", "found"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                    selectedType === type
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Sort Dropdown & Layout Toggles */}
            <div className="flex items-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 rounded-xl border-border/50 bg-background/50 text-xs font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center rounded-xl border border-border/50 bg-background/50 p-1">
                <Button
                  size="icon"
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 rounded-lg"
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 rounded-lg"
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Results Info Counter */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground">
                {filteredItems.length}
              </span>{" "}
              of <span className="font-semibold text-foreground">{totalItemsCount}</span> items
            </p>
            {(selectedCategory !== "all" || searchQuery || selectedType !== "all") && (
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                  setSelectedType("all");
                }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Reset all filters
              </button>
            )}
          </div>

          {/* Main Items Listing Grid / List */}
          <div className="mt-6">
            {isLoading ? (
              <div className="flex h-72 flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading registry items...</p>
              </div>
            ) : filteredItems.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.slug}`}
                      className="glass-card group relative flex flex-col overflow-hidden rounded-2xl p-3 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-teal-500/10 hover:border-teal-500/40"
                    >
                      {/* Image / Icon container */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-tr from-muted to-muted/50">
                        {item.itemImage ? (
                          <img
                            src={item.itemImage}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-teal-500/10 via-cyan-500/5 to-sky-500/10">
                            <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                              {categoryIcons[item.category] || "📦"}
                            </span>
                          </div>
                        )}

                        {/* Type & Status Badges */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              item.type === "lost"
                                ? "bg-rose-500/90 text-white"
                                : "bg-teal-500/90 text-white"
                            }`}
                          >
                            {item.type}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-foreground backdrop-blur-md border border-border/40">
                            {item.status === "recovered" || item.status === "returned" ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                <span>Recovered</span>
                              </>
                            ) : (
                              <>
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span>Active</span>
                              </>
                            )}
                          </span>
                        </div>

                        {/* Category Chip */}
                        <div className="absolute bottom-2.5 right-2.5">
                          <Badge
                            variant="secondary"
                            className="bg-background/80 backdrop-blur-md text-[10px] font-medium border border-border/40"
                          >
                            {item.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-3">
                        <div>
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4 space-y-1.5 border-t border-border/30 pt-3">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span className="line-clamp-1">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{new Date(item.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="flex flex-col gap-3">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/items/${item.slug}`}
                      className="glass-card group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:border-teal-500/40"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-2xl">
                          {categoryIcons[item.category] || "📦"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            <span
                              className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                                item.type === "lost"
                                  ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                  : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                              }`}
                            >
                              {item.type}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-primary" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 p-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/10 text-teal-600 mb-4">
                  <Search className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No matching items found</h3>
                <p className="mt-1.5 max-w-sm text-xs text-muted-foreground">
                  Try adjusting your search terms or selecting a different category filter.
                </p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                    setSelectedType("all");
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-5 rounded-xl"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-1.5 h-4 w-4" />
                Previous
              </Button>
              <div className="text-xs text-muted-foreground">
                Page <span className="font-bold text-foreground">{page}</span> of{" "}
                <span className="font-bold text-foreground">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-border/60"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
