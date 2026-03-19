"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import api from "@/lib/api"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  lost: "bg-amber-100 text-amber-800",
  found: "bg-emerald-100 text-emerald-800",
  claimed: "bg-blue-100 text-blue-800",
  resolved: "bg-muted text-muted-foreground",
  pending: "bg-orange-100 text-orange-800",
}

const categoryIcons: Record<string, string> = {
  Electronics: "📱",
  Accessories: "👜",
  Bags: "🎒",
  Books: "📚",
  Documents: "📄",
  Keys: "🔑",
  Clothing: "👕",
  Other: "📦",
}

interface ItemData {
  _id: string;
  itemImage?: string | null;
  itemName: string;
  category: string;
  description: string;
  status: string;
  slug?: string;
  isFlagged?: boolean;
}

export default function AdminItemsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [items, setItems] = useState<ItemData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/items")
      if (res.data.success) {
        // combine lostItems and foundItems
        const allItems = [...(res.data.lostItems || []), ...(res.data.foundItems || [])]
        setItems(allItems)
      }
    } catch (error) {
      console.error("Failed to fetch items", error)
      toast.error("Failed to load items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  const deleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await api.delete(`/admin/items/${itemId}`)
      if (res.data.success) {
        toast.success(res.data.message)
        fetchItems()
      }
    } catch (error) {
      console.error("Failed to delete item", error)
      toast.error("Failed to delete item")
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "flagged" ? item.isFlagged : item.status.toLowerCase() === statusFilter.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  // Sort such that flagged items bubble to the top automatically
  filteredItems.sort((a, b) => {
    if (a.isFlagged && !b.isFlagged) return -1;
    if (!a.isFlagged && b.isFlagged) return 1;
    return 0;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(items.map(i => i.category))).filter(Boolean)

  const stats = {
    total: items.length,
    found: items.filter(i => i.status.toLowerCase() === "found").length,
    lost: items.filter(i => i.status.toLowerCase() === "pending" || i.status.toLowerCase() === "lost").length,
    resolved: items.filter(i => i.status.toLowerCase() === "resolved").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Items Management</h1>
          <p className="text-muted-foreground">View and manage all reported items</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded bg-muted px-2 py-1">{stats.total} Total</span>
          <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-800">{stats.found} Found</span>
          <span className="rounded bg-amber-100 px-2 py-1 text-amber-800">{stats.lost} Pending/Lost</span>
          <span className="rounded bg-rose-100 px-2 py-1 text-rose-800 font-medium">
            {items.filter(i => i.isFlagged).length} Flagged
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="found">Found</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="claimed">Claimed</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="flagged">Reported (Flagged)</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {categoryIcons[category] || "📦"} {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Items Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    Loading items...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell>
                      <span className="text-2xl">{categoryIcons[item.category] || "📦"}</span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">{item.itemName}</p>
                          {item.isFlagged && (
                            <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase tracking-wider">
                              Flagged
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                          {item.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[item.status.toLowerCase()] || "bg-muted text-muted-foreground"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/items/${item.slug || item._id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteItem(item._id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
