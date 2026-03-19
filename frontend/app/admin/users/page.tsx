"use client"

import { useState, useEffect } from "react"
import { Shield, MoreHorizontal, Ban, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import api from "@/lib/api"
import { toast } from "sonner"

interface UserData {
  _id: string;
  fullName: string;
  username: string;
  status: "ACTIVE" | "BLOCKED";
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await api.get("/admin/users")
      if (res.data.success) {
        setUsers(res.data.users)
      }
    } catch (error) {
      console.error("Failed to fetch users", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleUserStatus = async (userId: string) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/status`)
      if (res.data.success) {
        toast.success(res.data.message)
        fetchUsers() // refresh list
      }
    } catch (error) {
      console.error("Failed to update user status", error)
      toast.error("Failed to update user status")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Users Management</h1>
          <p className="text-muted-foreground">Manage platform users and their access</p>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="rounded bg-muted px-2 py-1">{users.length} Total</span>
          <span className="rounded bg-emerald-100 px-2 py-1 text-emerald-800">
            {users.filter(u => u.status === "ACTIVE").length} Active
          </span>
          <span className="rounded bg-rose-100 px-2 py-1 text-rose-800">
            {users.filter(u => u.status === "BLOCKED").length} Blocked
          </span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    Loading users...
                  </TableCell>
                </TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {user.fullName.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="font-medium">{user.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.username}
                    </TableCell>
                    <TableCell>
                      {user.status === "ACTIVE" ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Active</Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-rose-100 text-rose-800 hover:bg-rose-100">Blocked</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleUserStatus(user._id)}
                        className={user.status === "ACTIVE" ? "text-rose-600" : "text-emerald-600"}
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" />
                            Block
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
