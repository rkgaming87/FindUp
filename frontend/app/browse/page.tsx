"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Calendar,
  SlidersHorizontal,
  X,
  Grid,
  List,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { getAllItems } from "@/lib/foundItemContext";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { categories, locations } from "@/lib/mock-data";

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
};

const statusColors: Record<string, string> = {
  returned: "bg-green-100 text-green-800",
  pending: "bg-amber-100 text-amber-800",
  recovered: "bg-green-100 text-green-800",
};

const typeColors: Record<string, string> = {
  lost: "bg-red-100 text-red-800",
  found: "bg-blue-100 text-blue-800",
};

const categoryIcons: Record<string, string> = {
  electronics: "📱",
  accessories: "👜",
  bags: "🎒",
  books: "📚",
  documents: "📄",
  keys: "🔑",
  clothing: "👕",
  other: "📦",
};

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
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

        const activeCategory = categoryFilter.length > 0 ? categoryFilter[0] : "";
        const res = await getAllItems(page, 12, searchQuery, activeCategory);

        // Update pagination descriptors
        if (res.totalPages) setTotalPages(res.totalPages);
        if (res.total !== undefined) setTotalItemsCount(res.total);


        // 🔹 Transform API response to UI format
        const formattedItems: Item[] = res.data.map((item: any) => ({
          id: item._id,
          slug: item.slug,
          title: item.itemName,
          description: item.description,
          location: item.foundItemLocation || item.lostItemLocation,
          category: item.category?.toLowerCase(),
          status: item.status?.toLowerCase(),
          type: item.type,
          createdAt: item.createdAt,
          date: item.reportedDate || item.createdAt,
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
  }, [page, searchQuery, categoryFilter]); // Automatically Refetch optimally

  const filteredItems = items
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter.length === 0 || categoryFilter.includes(item.category);

      const matchesLocation =
        !locationFilter || item.location === locationFilter;

      return matchesLocation; // Note: Search and category are now efficiently handled natively by the database
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      }
      return 0;
    });

  const clearFilters = () => {
    setCategoryFilter([]);
    setLocationFilter("");
  };

  const hasActiveFilters = categoryFilter.length > 0 || locationFilter;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="border-b bg-background">
          <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="text-3xl font-bold">Browse Items</h1>
            <p className="mt-2 text-muted-foreground">
              Search through found items across IGNOU centers
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* SEARCH */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-lg border">
              <Button
                size="icon"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant={viewMode === "list" ? "secondary" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* RESULT COUNT */}
          <p className="mb-4 text-sm text-muted-foreground">
            {isLoading
              ? "Loading items..."
              : `Showing ${filteredItems.length} of ${totalItemsCount} items`}
          </p>

          {/* LOADING */}
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <Link key={item.id} href={`/items/${item.slug}`}>
                  <Card className="hover:shadow-lg transition">
                    <div className="flex h-40 items-center justify-center bg-muted">
                      <span className="text-5xl">
                        {categoryIcons[item.category] || "📦"}
                      </span>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{item.title}</h3>

                          <div className="flex flex-col items-end gap-1">
                            <Badge className={typeColors[item.type]}>
                              {item.type.toUpperCase()}
                            </Badge>
                            <Badge
                              className={
                                statusColors[item.status] ||
                                "bg-muted text-muted-foreground"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="mt-4 text-xs text-muted-foreground space-y-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-20 text-center">
                <Search className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
                <h3 className="text-xl font-semibold">No items found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}

          {/* FRONTEND PAGINATION CONTROLS */}
          {totalPages > 1 && !isLoading && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span> of{" "}
                <span className="font-medium text-foreground">{totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
