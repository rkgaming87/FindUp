"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import { Plus, Search, Filter, MapPin, Calendar, MoreHorizontal, Pencil, Trash2, Eye, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Item {
  _id: string
  id: string
  slug: string
  title: string
  description: string
  location: string
  category: string
  status: string
  date: string
}

const statusColors: any = {
  lost: "bg-amber-100 text-amber-800",
  found: "bg-emerald-100 text-emerald-800",
  claimed: "bg-blue-100 text-blue-800",
  resolved: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-800",
  recovered: "bg-emerald-100 text-emerald-800",
}

const getCategoryIcon = (category: string) => {
  const cat = (category || "").toLowerCase();
  if (cat.includes("electronics")) return "📱";
  if (cat.includes("accessory") || cat.includes("accessories")) return "👜";
  if (cat.includes("bag")) return "🎒";
  if (cat.includes("book")) return "📚";
  if (cat.includes("document")) return "📄";
  if (cat.includes("key")) return "🔑";
  if (cat.includes("clothing") || cat.includes("watch")) return "👕";
  return "📦";
};

export default function MyItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  
  // Pagination State
  const [page, setPage] = useState(1)
  const limit = 6;

  useEffect(() => {
    const fetchMyItems = async () => {
      try {
        setLoading(true)
        const response = await api.get("/users/me/items")
        if (response.data && response.data.data) {
          // The backend returns lostItems list. Wait, let's check viewOwnItems again.
          // It returns: data: lostItem (which is an array of lost items) but wait...
          // I should check if it returns both lost and found.
          
          const formatted = response.data.data.map((item: any) => ({
            _id: item._id,
            id: item._id,
            slug: item.slug,
            title: item.itemName,
            description: item.description,
            location: item.lostItemLocation || item.foundItemLocation,
            category: item.category,
            status: item.status.toLowerCase(),
            date: item.reportedDate || item.createdAt
          }))
          setItems(formatted)
        }
      } catch (error) {
        console.error("Error fetching my items:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMyItems()
  }, [])

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Reset pagination when searching/filtering
  useEffect(() => { setPage(1) }, [searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredItems.length / limit) || 1;
  const paginatedItems = filteredItems.slice((page - 1) * limit, page * limit);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Items</h1>
          <p className="text-muted-foreground">Manage items you have reported</p>
        </div>
        <Link href="/dashboard/report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Report New Item
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="found">Found</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paginatedItems.length > 0 ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedItems.map((item) => (
              <Card key={item.id} className="overflow-hidden transition-shadow hover:shadow-md">
                {/* Image/Icon Area */}
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <span className="text-5xl">{getCategoryIcon(item.category)}</span>
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground truncate">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 -mr-2">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/items/${item.slug}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Item
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge className={statusColors[item.status]}>
                      {item.status}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>

                  <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-4">
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No items found</h3>
            <p className="mt-1 text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't reported any items yet"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/dashboard/report" className="mt-4">
                <Button>Report your first item</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
