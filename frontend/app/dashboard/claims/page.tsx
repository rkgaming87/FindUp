"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/lib/api"
import { Search, Filter, Clock, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface Claim {
  _id: string;
  item_id: {
    _id: string;
    itemName: string;
    slug: string;
  };
  description: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

const statusConfig = {
  pending: {
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
    label: "Pending Review",
  },
  approved: {
    color: "bg-emerald-100 text-emerald-800",
    icon: CheckCircle,
    label: "Approved",
  },
  rejected: {
    color: "bg-rose-100 text-rose-800",
    icon: XCircle,
    label: "Rejected",
  },
}

export default function ClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true)
        const response = await api.get("/claims/my-claims")
        if (response.data && response.data.data) {
          setClaims(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching claims:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchClaims()
  }, [])

  const filteredClaims = claims.filter((claim) => {
    const itemName = claim.item_id?.itemName || ""
    const matchesSearch = itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || claim.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === "PENDING").length,
    approved: claims.filter(c => c.status === "APPROVED").length,
    rejected: claims.filter(c => c.status === "REJECTED").length,
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Claims</h1>
        <p className="text-muted-foreground">Track the status of your claim requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <span className="text-lg font-bold text-foreground">{stats.total}</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Total Claims</p>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{stats.pending} Pending</p>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{stats.approved} Approved</p>
              <p className="text-xs text-muted-foreground">Ready to collect</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
              <XCircle className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{stats.rejected} Rejected</p>
              <p className="text-xs text-muted-foreground">Not verified</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search claims..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Claims List */}
      {filteredClaims.length > 0 ? (
        <div className="space-y-4">
          {filteredClaims.map((claim) => {
            const statusKey = claim.status.toLowerCase() as keyof typeof statusConfig
            const statusInfo = statusConfig[statusKey] || statusConfig.pending
            const StatusIcon = statusInfo.icon
            
            return (
              <Card key={claim._id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${statusInfo.color.replace("text-", "bg-").split(" ")[0]}/20`}>
                        <StatusIcon className={`h-6 w-6 ${statusInfo.color.split(" ")[1]}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{claim.item_id?.itemName || "Untitled Item"}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {claim.description}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge className={statusInfo.color}>
                            {statusInfo.label}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Submitted {new Date(claim.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                      <Link href={`/items/${claim.item_id?.slug}`}>
                        <Button variant="outline" size="sm" className="gap-1 bg-transparent">
                          View Item
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {claim.status === "APPROVED" && (
                    <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                      <p className="text-sm font-medium text-emerald-800">
                        Your claim has been approved! Please visit the Administrative Block to collect your item. 
                        Bring a valid ID for verification.
                      </p>
                    </div>
                  )}

                  {claim.status === "REJECTED" && (
                    <div className="mt-4 rounded-lg bg-rose-50 p-4">
                      <p className="text-sm font-medium text-rose-800">
                        Unfortunately, your claim could not be verified. If you believe this is an error, 
                        please contact the admin office with additional proof of ownership.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No claims found</h3>
            <p className="mt-1 text-muted-foreground">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't submitted any claims yet"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Link href="/browse" className="mt-4">
                <Button>Browse found items</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
