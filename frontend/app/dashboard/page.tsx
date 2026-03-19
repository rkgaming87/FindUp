"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import api from "@/lib/api"
import { 
  FileText, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  AlertCircle,
  Plus,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [claims, setClaims] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return
      try {
        setLoading(true)
        const [itemsRes, claimsRes] = await Promise.all([
          api.get("/users/me/items"),
          api.get("/claims/my-claims")
        ])
        
        if (itemsRes.data && itemsRes.data.data) {
          setItems(itemsRes.data.data)
        }
        if (claimsRes.data && claimsRes.data.data) {
          setClaims(claimsRes.data.data)
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      fetchDashboardData()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <h2 className="mt-4 text-xl font-semibold">Authentication Required</h2>
        <p className="mt-2 text-muted-foreground">Please log in to access your dashboard.</p>
        <Button onClick={() => router.push("/login")} className="mt-6">Log In</Button>
      </Card>
    )
  }

  const lostCount = items.filter(i => i.lostItemLocation).length;
  const foundCount = items.filter(i => i.foundItemLocation).length;
  const recoveredCount = items.filter(i => i.status === "RECOVERED").length;

  const stats = [
    {
      title: "Items Reported",
      value: items.length,
      icon: FileText,
      color: "text-amber-600 bg-amber-100",
    },
    {
      title: "Lost Items",
      value: lostCount,
      icon: AlertCircle,
      color: "text-rose-600 bg-rose-100",
    },
    {
      title: "Recovered",
      value: recoveredCount,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Found Items",
      value: foundCount,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-100",
    },
  ]

  const statusColors: Record<string, string> = {
    lost: "bg-amber-100 text-amber-800",
    found: "bg-emerald-100 text-emerald-800",
    claimed: "bg-blue-100 text-blue-800",
    resolved: "bg-muted text-muted-foreground",
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    recovered: "bg-emerald-100 text-emerald-800"
  }

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("electronics")) return "📱";
    if (cat.includes("accessory") || cat.includes("accessories")) return "👜";
    if (cat.includes("bag")) return "🎒";
    if (cat.includes("document")) return "📄";
    if (cat.includes("book")) return "📚";
    if (cat.includes("key")) return "🔑";
    return "📦";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Welcome back, {user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here&apos;s an overview of your lost and found activity.
          </p>
        </div>
        <Link href="/dashboard/report">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Report Item
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Recent Items</CardTitle>
              <CardDescription>Items you have reported</CardDescription>
            </div>
            <Link href="/dashboard/my-items">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {items.length > 0 ? (
              <div className="space-y-4">
                {items.slice(0, 3).reverse().map((item) => (
                  <Link
                    key={item._id}
                    href={`/items/${item.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{item.itemName}</p>
                      <p className="text-sm text-muted-foreground">{item.lostItemLocation || item.foundItemLocation}</p>
                    </div>
                    <Badge className={statusColors[item.status.toLowerCase()] || "bg-muted"}>
                      {item.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No items reported yet</p>
                <Link href="/dashboard/report" className="mt-4">
                  <Button size="sm">Report an item</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Claims */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My Claims</CardTitle>
              <CardDescription>Status of your claim requests</CardDescription>
            </div>
            <Link href="/dashboard/claims">
              <Button variant="ghost" size="sm" className="gap-1">
                View all
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {claims.length > 0 ? (
              <div className="space-y-4">
                {claims.slice(0, 3).map((claim) => (
                  <Link
                    key={claim._id}
                    href={`/items/${claim.item_id?.slug}`}
                    className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <ClipboardList className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{claim.item_id?.itemName || "Untitled Item"}</p>
                      <p className="text-sm text-muted-foreground">
                        Submitted {new Date(claim.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={statusColors[claim.status.toLowerCase()]}>
                      {claim.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No claims submitted yet</p>
                <Link href="/browse" className="mt-4">
                  <Button size="sm">Browse found items</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you can perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/report">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <FileText className="h-6 w-6" />
                <span>Report Lost Item</span>
              </Button>
            </Link>
            <Link href="/browse">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <ClipboardList className="h-6 w-6" />
                <span>Browse Found Items</span>
              </Button>
            </Link>
            <Link href="/dashboard/my-items">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <CheckCircle className="h-6 w-6" />
                <span>View My Items</span>
              </Button>
            </Link>
            <Link href="/dashboard/notifications">
              <Button variant="outline" className="h-auto w-full flex-col gap-2 py-6 bg-transparent">
                <Clock className="h-6 w-6" />
                <span>Check Notifications</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
