"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Package, 
  ClipboardList, 
  Users, 
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { toast } from "sonner"

const statusColors: Record<string, string> = {
  lost: "bg-amber-100 text-amber-800",
  found: "bg-emerald-100 text-emerald-800",
  claimed: "bg-blue-100 text-blue-800",
  resolved: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [itemStats, setItemStats] = useState({ total: 0, resolved: 0 })
  const [userStats, setUserStats] = useState({ active: 0 })
  const [pendingClaims, setPendingClaims] = useState<any[]>([])
  const [recentItems, setRecentItems] = useState<any[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [itemsRes, usersRes, claimsRes] = await Promise.all([
          api.get("/admin/items"),
          api.get("/admin/users"),
          api.get("/admin/claims")
        ])

        if (itemsRes.data.success) {
          const allItems = [...(itemsRes.data.lostItems || []), ...(itemsRes.data.foundItems || [])]
          // Sort items dynamically to get recent ones since MongoDB typically sorts by insertion anyway or we can manually sort:
          // Currently, API doesn't order by createdAt. For simplicity, just grab the last 5.
          setRecentItems(allItems.slice(-5).reverse())
          setItemStats({
            total: allItems.length,
            resolved: allItems.filter(i => i.status?.toLowerCase() === "recovered" || i.status?.toLowerCase() === "resolved").length
          })
        }

        if (usersRes.data.success) {
          const users = usersRes.data.users || []
          setUserStats({
            active: users.filter((u: any) => u.status === "ACTIVE").length
          })
        }

        if (claimsRes.data.success) {
          const claims = claimsRes.data.claims || []
          const pending = claims.filter((c: any) => c.status === "PENDING" || c.status === "pending")
          // Sort pending claims to get most recent at top naturally
          setPendingClaims(pending.slice(0, 5))
        }

      } catch (error) {
        console.error("Failed to load dashboard data", error)
        toast.error("Failed to load dashboard statistics")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const stats = [
    {
      title: "Total Items",
      value: itemStats.total,
      change: "Tracking globally",
      changeType: "neutral" as const,
      icon: Package,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Pending Claims",
      value: pendingClaims.length,
      change: `${pendingClaims.length} awaiting review`,
      changeType: pendingClaims.length > 0 ? "warning" : "positive" as const,
      icon: ClipboardList,
      color: "text-amber-600 bg-amber-100",
    },
    {
      title: "Items Recovered",
      value: itemStats.resolved,
      change: "Successfully resolved",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Active Users",
      value: userStats.active,
      change: "Currently registered",
      changeType: "positive" as const,
      icon: Users,
      color: "text-primary bg-primary/10",
    },
  ]

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Overview of the FindUp lost and found system.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.changeType === "positive" ? "text-emerald-600" : 
                  stat.changeType === "warning" ? "text-amber-600" : "text-muted-foreground"
                }`}>
                  {stat.changeType === "positive" && <TrendingUp className="h-4 w-4" />}
                  {stat.changeType === "warning" && <AlertTriangle className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Claims */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Pending Claims
                {pendingClaims.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {pendingClaims.length} new
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Claims awaiting your review</CardDescription>
            </div>
            <Link href="/admin/claims">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingClaims.length > 0 ? (
              <div className="space-y-4">
                {pendingClaims.map((claim) => (
                  <div
                    key={claim._id}
                    className="flex items-center gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                      <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{claim.item_id?.itemName || "Item"}</p>
                      <p className="text-sm text-muted-foreground">
                        by {claim.user_id?.fullName || "User"} - {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Link href={`/admin/claims`}>
                      <Button size="sm">Review</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle className="h-10 w-10 text-emerald-500" />
                <p className="mt-2 text-sm text-muted-foreground">All claims have been reviewed!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Items</CardTitle>
              <CardDescription>Latest reported items</CardDescription>
            </div>
            <Link href="/admin/items">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.length > 0 ? recentItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 rounded-lg border border-border p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                    {item.category?.toLowerCase() === "electronics" && "📱"}
                    {item.category?.toLowerCase() === "accessories" && "👜"}
                    {item.category?.toLowerCase() === "bags" && "🎒"}
                    {item.category?.toLowerCase() === "documents" && "📄"}
                    {item.category?.toLowerCase() === "keys" && "🔑"}
                    {(!item.category || !["electronics", "accessories", "bags", "documents", "keys"].includes(item.category.toLowerCase())) && "📦"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{item.itemName}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                  <Badge className={statusColors[item.status?.toLowerCase()] || "bg-muted text-muted-foreground"}>
                    {item.status || "Unknown"}
                  </Badge>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  No items populated yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/admin/claims">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <ClipboardList className="h-6 w-6" />
                <span>Review Claims</span>
              </Button>
            </Link>
            <Link href="/admin/items">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <Package className="h-6 w-6" />
                <span>Manage Items</span>
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </Button>
            </Link>
            <Link href="/admin/reports">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <TrendingUp className="h-6 w-6" />
                <span>View Reports</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
