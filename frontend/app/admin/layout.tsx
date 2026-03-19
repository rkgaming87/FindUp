"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Search,
  LayoutDashboard,
  Package,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import api from "@/lib/api"

const getAdminLinks = (pendingCount: number) => [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/items", label: "All Items", icon: Package },
  { href: "/admin/claims", label: "Claims", icon: ClipboardList, badge: pendingCount > 0 ? pendingCount : null },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

function usePendingClaimsCount() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await api.get("/admin/claims")
        if (res.data.success && res.data.claims) {
          const pending = res.data.claims.filter((c: any) => c.status === "PENDING" || c.status === "pending")
          setCount(pending.length)
        }
      } catch (err) {
        console.error("Failed to fetch pending claims count:", err)
      }
    }
    fetchClaims()
    
    // Optional polling or event listening could be added here
    const intervalId = setInterval(fetchClaims, 30000)
    return () => clearInterval(intervalId)
  }, [])
  
  return count
}

function AdminSidebar({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const adminLinks = getAdminLinks(pendingCount)

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-foreground">FindUp</span>
              <span className="ml-2 text-xs text-muted-foreground">Admin</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/admin" && pathname.startsWith(link.href))
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
                {link.badge && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Admin User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.fullName?.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "AD"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName || "Admin User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@example.com"}</p>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => logout()}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Log out</span>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}

function AdminHeader({ pendingCount }: { pendingCount: number }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const adminLinks = getAdminLinks(pendingCount)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background px-4 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </button>

        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">Admin</span>
        </Link>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 border-r border-border bg-card">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Shield className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-bold">Admin</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1 p-4">
                {adminLinks.map((link) => {
                  const isActive = pathname === link.href || 
                    (link.href !== "/admin" && pathname.startsWith(link.href))
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pendingCount = usePendingClaimsCount()

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.push("/")
    }
  }, [user, loading, router])

  if (loading || (!user || user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar pendingCount={pendingCount} />
      <AdminHeader pendingCount={pendingCount} />
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
