"use client"

import React from "react"
import { CheckCircle, ArrowRight, FileText } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  type: "lost" | "found"
  title: string
}

export function SuccessModal({ isOpen, onClose, type, title }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="flex flex-col items-center justify-center pt-8">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 transition-all duration-500 scale-110">
            <CheckCircle className="h-10 w-10 animate-in fade-in zoom-in duration-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Report Submitted!</DialogTitle>
          <DialogDescription className="text-center text-base">
            Your {type} item <span className="font-semibold text-foreground">"{title}"</span> has been 
            successfully registered on FindUp.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pb-8 pt-4">
          <Link href="/dashboard/my-items" className="w-full">
            <Button className="w-full gap-2 py-6 text-base" onClick={onClose}>
              <FileText className="h-5 w-5" />
              View My Items
            </Button>
          </Link>
          <Button variant="outline" className="w-full py-6 text-base bg-transparent" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
