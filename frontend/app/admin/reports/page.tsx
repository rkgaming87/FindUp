"use client"

import { useState, useEffect } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Download, Package, Users, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import api from "@/lib/api"
import { toast } from "sonner"

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true)
  const [itemStats, setItemStats] = useState({ total: 0, lost: 0, found: 0, recovered: 0 })
  const [userStats, setUserStats] = useState({ total: 0, active: 0, blocked: 0 })
  const [claimStats, setClaimStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [categoryData, setCategoryData] = useState<{name: string, value: number}[]>([])
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ef4444', '#14b8a6', '#64748b']

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)
        const [itemsRes, usersRes, claimsRes] = await Promise.all([
          api.get("/admin/items"),
          api.get("/admin/users"),
          api.get("/admin/claims")
        ])

        if (itemsRes.data.success) {
          const allItems = [...(itemsRes.data.lostItems || []), ...(itemsRes.data.foundItems || [])]
          
          setItemStats({
            total: allItems.length,
            lost: allItems.filter(i => i.status?.toLowerCase() === "lost" || i.status?.toLowerCase() === "pending").length,
            found: allItems.filter(i => i.status?.toLowerCase() === "found").length,
            recovered: allItems.filter(i => i.status?.toLowerCase() === "recovered" || i.status?.toLowerCase() === "resolved").length
          })

          const catCounts: Record<string, number> = {}
          allItems.forEach(i => {
            const cat = i.category || 'Other'
            catCounts[cat] = (catCounts[cat] || 0) + 1
          })
          setCategoryData(Object.entries(catCounts).map(([name, value]) => ({ name, value })))
        }

        if (usersRes.data.success) {
          const users = usersRes.data.users || []
          setUserStats({
            total: users.length,
            active: users.filter((u: any) => u.status === "ACTIVE").length,
            blocked: users.filter((u: any) => u.status === "BLOCKED").length
          })
        }

        if (claimsRes.data.success) {
          const claims = claimsRes.data.claims || []
          setClaimStats({
            total: claims.length,
            pending: claims.filter((c: any) => c.status === "PENDING" || c.status === "pending").length,
            approved: claims.filter((c: any) => c.status === "APPROVED" || c.status === "approved").length,
            rejected: claims.filter((c: any) => c.status === "REJECTED" || c.status === "rejected").length,
          })
        }
      } catch (error) {
        console.error("Failed to load report data", error)
        toast.error("Failed to load reports")
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Generating reports...</span>
      </div>
    )
  }

  const claimStatusData = [
    { name: 'Pending', value: claimStats.pending, fill: '#f59e0b' },
    { name: 'Approved', value: claimStats.approved, fill: '#10b981' },
    { name: 'Rejected', value: claimStats.rejected, fill: '#f43f5e' }
  ]

  const itemStatusData = [
    { name: 'Lost/Pending', value: itemStats.lost, fill: '#f59e0b' },
    { name: 'Found', value: itemStats.found, fill: '#3b82f6' },
    { name: 'Recovered', value: itemStats.recovered, fill: '#10b981' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Overview of platform activities and statistics</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => window.print()}>
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {itemStats.recovered} items successfully recovered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claimStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {claimStats.pending} pending review
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {userStats.active} active accounts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Items by Category</CardTitle>
            <CardDescription>Distribution of reported items across categories</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No categorical data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claims Processing</CardTitle>
            <CardDescription>Status of all claims submitted</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {claimStats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={claimStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {claimStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No claims data to display
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Item Status Distribution</CardTitle>
            <CardDescription>Current states of all reported items on the platform</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {itemStats.total > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={itemStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <RechartsTooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {itemStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No item data to display
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
