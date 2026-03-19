"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Lock, 
  Loader2, 
  Settings as SettingsIcon,
  Palette
} from "lucide-react"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

const profileFormSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
})

export default function AdminSettingsPage() {
  const { user, refreshUser } = useAuth()
  const { theme, setTheme } = useTheme()
  const [isUpdating, setIsUpdating] = useState(false)

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName || "",
        email: user.email || "",
      })
    }
  }, [user, form])

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsUpdating(true)
    try {
      const res = await api.put("/users/me", values)
      if (res.data) {
        toast.success("Profile updated successfully")
        await refreshUser()
      }
    } catch (error: any) {
      console.error("Failed to update profile", error)
      toast.error(error.response?.data?.message || "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and global settings</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Details
            </CardTitle>
            <CardDescription>
              Update your personal administrative account information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" placeholder="John Doe" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" type="email" placeholder="admin@example.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={isUpdating || !form.formState.isDirty}>
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Account Security & Role
            </CardTitle>
            <CardDescription>
              Information about your administrative permissions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-sm">Account Role</p>
                <p className="text-xs text-muted-foreground">Highest clearance administrative access</p>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                {user?.role || "ADMIN"}
              </div>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b border-border">
              <div>
                <p className="font-medium text-foreground text-sm">Account Status</p>
                <p className="text-xs text-muted-foreground">Current standing in the system</p>
              </div>
              <div className="flex items-center px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider">
                {user?.status || "ACTIVE"}
              </div>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
              <p className="text-xs text-muted-foreground mt-2 inline-block ml-4">
                Password changes securely navigate to the auth reset flow.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Global UI Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Dashboard Preferences
            </CardTitle>
            <CardDescription>
              Customize the appearance of the administrative dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-2">
              <div>
                <p className="font-medium text-foreground text-sm">Theme Preference</p>
                <p className="text-xs text-muted-foreground">Select light, dark, or system preference</p>
              </div>
              <div className="flex bg-muted rounded-md p-1 border border-border">
                <Button 
                  type="button" 
                  variant={theme === 'light' ? "secondary" : "ghost"}
                  size="sm" 
                  onClick={() => setTheme('light')}
                  className="rounded px-4"
                >
                  Light
                </Button>
                <Button 
                  type="button" 
                  variant={theme === 'dark' ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setTheme('dark')}
                  className="rounded px-4"
                >
                  Dark
                </Button>
                <Button 
                  type="button" 
                  variant={theme === 'system' ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setTheme('system')}
                  className="rounded px-4"
                >
                  System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
