"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import { postLostItem, postFoundItem } from "@/lib/foundItemContext"
import { SuccessModal } from "@/components/dashboard/success-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { categories, locations } from "@/lib/mock-data"

export default function ReportItemPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [submittedTitle, setSubmittedTitle] = useState("")
  const [formData, setFormData] = useState({
    type: "lost",
    title: "",
    category: "",
    description: "",
    location: "",
    date: "",
    contactInfo: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "Item title is required"
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category"
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    }
    
    if (!formData.location) {
      newErrors.location = "Please select a location"
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    try {
      const slug = `${formData.title.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      
      const payload: any = {
        itemName: formData.title,
        category: formData.category,
        description: formData.description,
        slug: slug,
        itemImage: null,
        reportedDate: formData.date,
      };

      if (formData.type === "lost") {
        payload.lostItemLocation = formData.location;
        await postLostItem(payload);
      } else {
        payload.foundItemLocation = formData.location;
        await postFoundItem(payload);
      }

      setSubmittedTitle(formData.title);
      setIsSuccessModalOpen(true);
    } catch (error: any) {
      console.error("Error reporting item:", error);
      alert(error.response?.data?.message || "Failed to submit report. Item name might already exist or you might be logged out.");
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <SuccessModal 
        isOpen={isSuccessModalOpen} 
        onClose={() => setIsSuccessModalOpen(false)} 
        type={formData.type as any}
        title={submittedTitle}
      />
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Report an Item</h1>
          <p className="text-muted-foreground">Submit details about a lost or found item</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Item Type */}
            <Card>
              <CardHeader>
                <CardTitle>Item Type</CardTitle>
                <CardDescription>Are you reporting a lost or found item?</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="lost"
                      id="lost"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="lost"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="text-3xl mb-2">😢</span>
                      <span className="font-semibold">I Lost Something</span>
                      <span className="text-sm text-muted-foreground">Report a missing item</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="found"
                      id="found"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="found"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <span className="text-3xl mb-2">🎉</span>
                      <span className="font-semibold">I Found Something</span>
                      <span className="text-sm text-muted-foreground">Report a found item</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Item Details */}
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Provide as much detail as possible to help identify the item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Black Leather Wallet, Blue Backpack"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the item in detail - color, brand, distinguishing features, contents (if applicable)..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length}/20 characters minimum
                  </p>
                  {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Images (Optional)</Label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 transition-colors hover:border-muted-foreground/50">
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground/50" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop images here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location & Date */}
            <Card>
              <CardHeader>
                <CardTitle>Location & Date</CardTitle>
                <CardDescription>Where and when was the item {formData.type}?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                  >
                    <SelectTrigger className={errors.location ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={errors.date ? "border-destructive" : ""}
                    max={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>

                {/* Contact Info (for lost items) */}
                {formData.type === "lost" && (
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Information (Optional)</Label>
                    <Input
                      id="contactInfo"
                      placeholder="Phone number or alternate email"
                      value={formData.contactInfo}
                      onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">
                      This will help the finder contact you directly
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for a Good Report</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>Be specific about the item&apos;s appearance, including color, brand, and size.</p>
                <p>Mention any unique features or damage that could help identify the item.</p>
                <p>For found items, don&apos;t reveal all details publicly to verify true ownership.</p>
                <p>Upload clear photos if possible - they greatly increase recovery chances.</p>
              </CardContent>
            </Card>

            {/* Submit */}
            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Submit ${formData.type === "lost" ? "Lost" : "Found"} Item Report`
                  )}
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
