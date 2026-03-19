"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Flag,
  CheckCircle,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface Item {
  _id: string
  title: string
  description: string
  location: string
  category: string
  status: string
  date: string
  createdAt: string
  reportedBy: string
  reporterEmail?: string
  type: string
}

const statusColors: any = {
  lost: "bg-amber-100 text-amber-800",
  found: "bg-emerald-100 text-emerald-800",
  claimed: "bg-blue-100 text-blue-800",
  resolved: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-800",
  recovered: "bg-emerald-100 text-emerald-800",
  returned: "bg-emerald-100 text-emerald-800",
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

export default function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false)
  const [claimDescription, setClaimDescription] = useState("")
  const [proofDescription, setProofDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isClaimSubmitted, setIsClaimSubmitted] = useState(false)

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching item with ID/Slug:", id)
        
        // Try fetching from lost items first
        try {
          const lostRes = await api.get(`/lost-items/${id}`)
          const data = lostRes.data.lostItem || lostRes.data.data
          if (data) {
            console.log("Found in lost-items:", data.itemName)
            setItem({
              _id: data._id,
              title: data.itemName,
              description: data.description,
              location: data.lostItemLocation,
              category: data.category,
              status: (data.status || "lost").toLowerCase(),
              date: data.reportedDate || data.createdAt,
              createdAt: data.createdAt,
              reportedBy: data.user_id?.fullName || "Anonymous Member",
              reporterEmail: data.user_id?.email,
              type: "lost"
            })
            setLoading(false)
            return
          }
        } catch (e) {
          console.log("Not found in lost-items, checking found-items...")
        }

        // Try found items
        try {
          const foundRes = await api.get(`/found-items/${id}`)
          const data = foundRes.data.foundItem || foundRes.data.data
          if (data) {
            console.log("Found in found-items:", data.itemName)
            setItem({
              _id: data._id,
              title: data.itemName,
              description: data.description,
              location: data.foundItemLocation,
              category: data.category,
              status: (data.status || "found").toLowerCase(),
              date: data.reportedDate || data.createdAt,
              createdAt: data.createdAt,
              reportedBy: data.user_id?.fullName || "Anonymous Member",
              reporterEmail: data.user_id?.email,
              type: "found"
            })
            setLoading(false)
            return
          }
        } catch (e2) {
          console.error("Found fetch error:", e2)
          setError(`Item with slug/id '${id}' not found in any registry.`)
        }
      } catch (err: any) {
        console.error("General fetch error:", err)
        setError(`Failed to load item details: ${err.message}`)
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center bg-muted/30">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-12 bg-muted/30">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-10 pb-10 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold text-foreground">Item not found</h2>
              <p className="mt-2 text-muted-foreground">
                {error || "The item you're looking for doesn't exist or has been removed."}
              </p>
              <Link href="/browse" className="mt-8 inline-block">
                <Button>Browse all items</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const handleClaimSubmit = async () => {
    if (!claimDescription.trim()) return
    setIsSubmitting(true)
    try {
      await api.post("/claims", {
        itemId: item?._id,
        itemType: item?.type,
        description: claimDescription,
        proofImage: proofDescription 
      })
      setIsClaimSubmitted(true)
    } catch (err: any) {
      console.error("Claim error:", err)
      setError(err.response?.data?.message || "Failed to submit claim.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFlagItem = async () => {
    if (!item || !window.confirm("Are you sure you want to report this item as inappropriate?")) return;
    
    try {
      const res = await api.patch(`/users/all-items/${item._id}/flag`);
      if (res.data.success) {
        toast.success(res.data.message || "Item reported to moderators.");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to flag item. Please log in.");
    }
  }

  const relatedItems: any[] = []

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/browse" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to browse
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Item Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6 sm:flex-row">
                    {/* Image */}
                    <div className="flex h-48 w-full shrink-0 items-center justify-center rounded-xl bg-muted sm:h-64 sm:w-64">
                      <span className="text-8xl">{getCategoryIcon(item.category)}</span>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start gap-2">
                        <Badge className={statusColors[item.status]}>
                          {item.status}
                        </Badge>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>

                      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                        {item.title}
                      </h1>

                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{item.status === "found" ? "Found" : "Lost"} on {new Date(item.date).toLocaleDateString("en-US", { 
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Reported {new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        {item.type === "found" && (
                          <Dialog open={isClaimDialogOpen} onOpenChange={setIsClaimDialogOpen}>
                            <DialogTrigger asChild>
                              <Button size="lg">Claim This Item</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              {!isClaimSubmitted ? (
                                <>
                                  <DialogHeader>
                                    <DialogTitle>Submit a Claim</DialogTitle>
                                    <DialogDescription>
                                      Please provide details to prove this item belongs to you. Your claim will be reviewed by an admin.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="claim-description">
                                        Why do you believe this is your item? *
                                      </Label>
                                      <Textarea
                                        id="claim-description"
                                        placeholder="Describe how you lost this item and any identifying details..."
                                        rows={4}
                                        value={claimDescription}
                                        onChange={(e) => setClaimDescription(e.target.value)}
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="proof-description">
                                        What proof can you provide? (Optional)
                                      </Label>
                                      <Textarea
                                        id="proof-description"
                                        placeholder="e.g., I can describe the contents, show purchase receipt, etc."
                                        rows={3}
                                        value={proofDescription}
                                        onChange={(e) => setProofDescription(e.target.value)}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button
                                      variant="outline"
                                      onClick={() => setIsClaimDialogOpen(false)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={handleClaimSubmit}
                                      disabled={!claimDescription.trim() || isSubmitting}
                                    >
                                      {isSubmitting ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Submitting...
                                        </>
                                      ) : (
                                        "Submit Claim"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </>
                              ) : (
                                <div className="py-6 text-center">
                                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                                    <CheckCircle className="h-8 w-8 text-primary" />
                                  </div>
                                  <DialogTitle className="text-xl">Claim Submitted!</DialogTitle>
                                  <DialogDescription className="mt-2">
                                    Your claim has been submitted successfully. You&apos;ll receive a notification once an admin reviews it.
                                  </DialogDescription>
                                  <Button
                                    className="mt-6"
                                    onClick={() => {
                                      setIsClaimDialogOpen(false)
                                      router.push("/dashboard/claims")
                                    }}
                                  >
                                    View My Claims
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button 
                          variant="ghost" 
                          size="lg" 
                          className="gap-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                          onClick={handleFlagItem}
                        >
                          <Flag className="h-4 w-4" />
                          Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>

              {/* Related Items */}
              {relatedItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Items</CardTitle>
                    <CardDescription>Other items in the same category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {relatedItems.map((relatedItem) => (
                        <Link key={relatedItem.id} href={`/items/${relatedItem.id}`}>
                          <div className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                            <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-muted">
                              <span className="text-3xl">{getCategoryIcon(relatedItem.category)}</span>
                            </div>
                            <h4 className="font-medium text-foreground line-clamp-1">{relatedItem.title}</h4>
                            <p className="mt-1 text-xs text-muted-foreground">{relatedItem.location}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Reported By */}
              <Card>
                <CardHeader>
                  <CardTitle>Reported By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.reportedBy}</p>
                      <p className="text-sm text-muted-foreground">{item.reporterEmail || "Verified account"}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    For privacy, reporter details are hidden until a claim is approved.
                  </p>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    <Badge className={statusColors[item.status]}>{item.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm font-medium text-foreground">{item.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium text-foreground text-right max-w-[150px] truncate">
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium text-foreground">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Tips */}
              <Card>
                <CardHeader>
                  <CardTitle>Safety Tips</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>Only claim items that genuinely belong to you.</p>
                  <p>Be prepared to provide proof of ownership when collecting.</p>
                  <p>Report suspicious listings to help keep our community safe.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
