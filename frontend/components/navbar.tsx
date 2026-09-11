"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Loader2,
  User,
  LayoutDashboard,
  LogOut,
  Shield,
  Plus,
  Compass,
  Info,
  Sparkles,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "/browse", label: "Browse Items", icon: Compass },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/about", label: "About", icon: Info },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full glass-nav border-b border-border/40 transition-all duration-300">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-sky-500 shadow-md shadow-teal-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-teal-500/30">
            <Search className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-400 border border-background"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
              Find<span className="text-primary">Up</span>
            </span>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              IGNOU Registry
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 rounded-full border border-border/40 bg-background/50 p-1.5 backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Actions & Auth */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />

          {loading ? (
            <div className="flex h-9 w-9 items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/notifications" className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full border border-border/40 bg-background/40"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </Button>
              </Link>

              <Link href="/dashboard/report">
                <Button
                  size="sm"
                  className="gap-2 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 font-medium text-white shadow-md shadow-teal-500/20 transition-all duration-300 hover:scale-102 hover:shadow-teal-500/30"
                >
                  <Plus className="h-4 w-4" />
                  Report Item
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border-2 border-primary/20 p-0 transition-transform hover:scale-105"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-tr from-teal-500 to-cyan-500 font-bold text-white text-xs">
                        {user.fullName
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-60 rounded-xl border border-border/60 bg-background/95 p-1 shadow-xl backdrop-blur-xl"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none text-foreground">
                        {user.fullName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/60" />
                  {user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link
                        href="/admin"
                        className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <Shield className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Admin Console</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard/profile"
                      className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm font-medium text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-4 font-medium text-foreground hover:bg-muted/80"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 font-medium text-white shadow-md shadow-teal-500/20 transition-all hover:scale-102 hover:shadow-teal-500/30"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu triggers */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-border/40 bg-background/50 p-2 text-foreground backdrop-blur hover:bg-muted"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="glass-nav border-t border-border/40 px-4 pb-6 pt-3 md:hidden">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-border/40 pt-4">
            {user ? (
              <>
                <Link
                  href="/dashboard/report"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                    <Plus className="h-4 w-4" />
                    Report Lost or Found Item
                  </Button>
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button variant="outline" className="w-full rounded-xl">
                      Admin Console
                    </Button>
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full rounded-xl">
                    User Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full rounded-xl">
                    Sign in
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                    Create Account
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
