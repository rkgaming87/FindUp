"use client"

import { useEffect, useState } from "react"
import { Bell, Check, Trash2, CheckCheck, Loader2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface Notification {
  _id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
  link?: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await api.get("/notifications/me")
      if (res.data && res.data.data) {
        setNotifications(res.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
      toast.error("Could not load notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.put("/notifications/mark-all-read")
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Failed to mark all as read:", error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`)
      setNotifications(prev => prev.filter(n => n._id !== id))
      toast.success("Notification deleted")
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your claims and reports</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2 shrink-0">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card 
              key={notification._id} 
              className={`transition-colors ${!notification.read ? "border-primary/50 bg-primary/5 shadow-sm" : "opacity-80"}`}
            >
              <CardContent className="flex items-start gap-4 p-4 sm:p-6">
                <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  !notification.read ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Bell className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0 mt-1 whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {!notification.read && (
                      <Button size="sm" variant="secondary" onClick={() => markAsRead(notification._id)}>
                        <Check className="mr-2 h-4 w-4" /> Mark as read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => deleteNotification(notification._id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 text-center border-dashed">
          <div className="mb-4 flex h-16 w-16 flex-col items-center justify-center rounded-full bg-muted/50">
            <Bell className="h-8 w-8 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold text-foreground">All caught up!</h3>
          <p className="mt-2 text-muted-foreground max-w-sm">
            You don't have any notifications arriving right now. We'll alert you when there are updates on your items.
          </p>
        </Card>
      )}
    </div>
  )
}
