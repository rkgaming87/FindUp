"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Search,
  LayoutDashboard,
  FileText,
  ClipboardList,
  Bell,
  Settings,
  LogOut,
  Plus,
  User,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import api from "@/lib/api"

const baseSidebarLinks = [
  {
    href: "/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/dashboard/my-items",
    label: "My Items",
    icon: FileText,
  },
  {
    href: "/dashboard/claims",
    label: "My Claims",
    icon: ClipboardList,
  },
  {
    href: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    badge: 0, // This will be dynamic
  },
  {
    href: "/dashboard/profile",
    label: "Profile",
    icon: User,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return
      try {
        const res = await api.get("/notifications/me")
        if (res.data && res.data.data) {
          const count = res.data.data.filter((n: any) => !n.read).length
          setUnreadCount(count)
        }
      } catch (error) {
        console.error("Failed to fetch notifications unread count:", error)
      }
    }
    
    fetchUnreadCount()
  }, [user, pathname])

  const sidebarLinks = baseSidebarLinks.map(link => 
    link.label === "Notifications" ? { ...link, badge: unreadCount } : link
  )

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Search className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">FindUp</span>
          </Link>
        </div>

        {/* Report Button */}
        <div className="p-4">
          <Link href="/dashboard/report">
            <Button className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Report Item
            </Button>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || 
              (link.href !== "/dashboard" && pathname.startsWith(link.href))
            
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
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {link.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.fullName.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
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
