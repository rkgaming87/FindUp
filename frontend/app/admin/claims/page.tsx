"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  Check,
  X,
  Loader2
} from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  pending: {
    color: "bg-amber-100 text-amber-800",
    icon: Clock,
    label: "Pending",
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

interface ClaimData {
  _id: string;
  itemTitle: string;
  claimantName: string;
  claimantEmail: string;
  description: string;
  proofDescription?: string;
  status: string;
  createdAt: string;
}

export default function AdminClaimsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [claims, setClaims] = useState<ClaimData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null)

  const fetchClaims = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/claims")
      if (res.data.success && res.data.claims) {
        const mappedClaims = res.data.claims.map((c: any) => ({
          _id: c._id,
          itemTitle: c.item_id?.itemName || "Unknown Item",
          claimantName: c.user_id?.fullName || "Unknown User",
          claimantEmail: c.user_id?.email || "",
          description: c.description || "",
          proofDescription: c.proofImage || "",
          status: c.status?.toLowerCase() || "pending",
          createdAt: c.createdAt,
        }))
        setClaims(mappedClaims)
      }
    } catch (error) {
      console.error("Failed to fetch claims:", error)
      toast.error("Failed to fetch claims")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClaims()
  }, [])

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.claimantName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === "pending").length,
    approved: claims.filter(c => c.status === "approved").length,
    rejected: claims.filter(c => c.status === "rejected").length,
  }

  const handleAction = async (action: "approve" | "reject") => {
    if (!selectedClaim) return
    
    setActionType(action)
    setIsProcessing(true)
    
    try {
      const statusPayload = action === "approve" ? "APPROVED" : "REJECTED"
      const res = await api.patch(`/claims/${selectedClaim._id}/status`, { status: statusPayload })
      if (res.data) {
        toast.success(`Claim successfully ${action}d`)
        fetchClaims() // refresh list
      }
    } catch (error: any) {
      console.error(`Failed to ${action} claim:`, error)
      toast.error(error.response?.data?.message || `Failed to ${action} claim`)
    } finally {
      setIsProcessing(false)
      setActionType(null)
      setSelectedClaim(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Claims Management</h1>
        <p className="text-muted-foreground">Review and process item claim requests</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Claims</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.pending}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.approved}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
              <XCircle className="h-4 w-4 text-rose-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{stats.rejected}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by item or claimant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Claims Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Claimant</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin mb-2" />
                    Loading claims...
                  </TableCell>
                </TableRow>
              ) : filteredClaims.length > 0 ? (
                filteredClaims.map((claim) => {
                  const statusInfo = statusConfig[claim.status] || statusConfig.pending
                  return (
                    <TableRow key={claim._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{claim.itemTitle}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                            {claim.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">{claim.claimantName}</p>
                        <p className="text-xs text-muted-foreground">{claim.claimantEmail}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {new Date(claim.createdAt).toLocaleDateString()}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusInfo.color}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedClaim(claim)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {claim.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                onClick={() => {
                                  setSelectedClaim(claim)
                                  handleAction("approve")
                                }}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                                onClick={() => {
                                  setSelectedClaim(claim)
                                  handleAction("reject")
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <p className="text-muted-foreground">No claims found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Claim Details Dialog */}
      <Dialog open={!!selectedClaim && !actionType} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedClaim && (
            <>
              <DialogHeader>
                <DialogTitle>Claim Details</DialogTitle>
                <DialogDescription>
                  Review the claim information before making a decision.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Item</p>
                  <p className="text-foreground">{selectedClaim.itemTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claimant</p>
                  <p className="text-foreground">{selectedClaim.claimantName} ({selectedClaim.claimantEmail})</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Claim Description</p>
                  <p className="text-foreground whitespace-pre-wrap">{selectedClaim.description}</p>
                </div>
                {selectedClaim.proofDescription && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Proof Offered</p>
                    {selectedClaim.proofDescription.startsWith("http") || selectedClaim.proofDescription.startsWith("data:image") ? (
                      <img src={selectedClaim.proofDescription} alt="Proof" className="max-w-full h-auto mt-2 rounded" />
                    ) : (
                      <p className="text-foreground">{selectedClaim.proofDescription}</p>
                    )}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge className={statusConfig[selectedClaim.status]?.color || statusConfig.pending.color}>
                    {statusConfig[selectedClaim.status]?.label || "Unknown"}
                  </Badge>
                </div>
              </div>
              {selectedClaim.status === "pending" && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleAction("reject")}
                    disabled={isProcessing}
                  >
                    {isProcessing && actionType === "reject" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleAction("approve")}
                    disabled={isProcessing}
                  >
                    {isProcessing && actionType === "approve" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
