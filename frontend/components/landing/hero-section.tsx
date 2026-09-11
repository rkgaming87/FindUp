"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Search,
  MapPin,
  Sparkles,
  ShieldCheck,
  Zap,
  PlusCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const popularCategories = [
  { label: "Electronics", icon: "📱" },
  { label: "Wallets & Bags", icon: "🎒" },
  { label: "ID Cards & Docs", icon: "📄" },
  { label: "Keys", icon: "🔑" },
  { label: "Accessories", icon: "👓" },
];

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/browse");
    }
  };

  const handleCategoryClick = (cat: string) => {
    router.push(`/browse?category=${encodeURIComponent(cat)}`);
  };

  return (
    <section className="relative overflow-hidden bg-background py-16 sm:py-24 lg:py-28">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-sky-500/10 blur-3xl" />
        <div className="absolute top-1/3 -left-32 h-72 w-72 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute bottom-10 -right-32 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-60" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300 backdrop-blur-md shadow-sm transition-all hover:scale-105">
            <Sparkles className="h-3.5 w-3.5 text-teal-500 animate-spin-slow" />
            <span>AI-Powered Lost & Found Portal for IGNOU</span>
            <span className="flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
          </div>

          {/* Main Title */}
          <h1 className="mt-8 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Lost something on campus?{" "}
            <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
              Find it in seconds.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            FindUp connects thousands of IGNOU students, faculty, and campus staff.
            Report misplaced belongings, explore recovered items with real-time claims,
            and get notified instantly upon a match.
          </p>

          {/* Live Hero Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="mx-auto mt-10 max-w-2xl"
          >
            <div className="glass-card relative flex items-center rounded-2xl p-2 shadow-2xl shadow-teal-500/10 transition-all focus-within:border-teal-500/50 focus-within:ring-4 focus-within:ring-teal-500/15">
              <Search className="ml-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by item name, color, location (e.g. 'Blue backpack in library')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 bg-transparent text-sm sm:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
              />
              <Button
                type="submit"
                className="gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-5 font-semibold text-white shadow-md shadow-teal-500/20 hover:opacity-95"
              >
                <span>Search</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Category Chips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-muted-foreground font-medium">Quick find:</span>
              {popularCategories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => handleCategoryClick(cat.label)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3 py-1 text-muted-foreground backdrop-blur-sm transition-all hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-700 dark:hover:text-teal-300"
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </form>

          {/* Direct Action Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/dashboard/report">
              <Button
                size="lg"
                className="h-12 w-full gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 font-semibold text-white shadow-lg shadow-teal-500/25 transition-all duration-300 hover:scale-102 hover:shadow-teal-500/35 sm:w-auto"
              >
                <PlusCircle className="h-5 w-5" />
                Report Lost Item
              </Button>
            </Link>
            <Link href="/browse">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full gap-2 rounded-xl border-border/80 bg-background/50 px-6 font-semibold backdrop-blur-sm transition-all duration-300 hover:bg-muted sm:w-auto"
              >
                <Search className="h-5 w-5 text-primary" />
                Explore Found Registry
              </Button>
            </Link>
          </div>

          {/* Trust Highlights Grid */}
          <div className="mt-14 grid grid-cols-1 gap-4 border-t border-border/40 pt-8 sm:grid-cols-3">
            <div className="flex items-center justify-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Verified Claims</p>
                <p className="text-xs text-muted-foreground">ID verification protection</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Instant Alerts</p>
                <p className="text-xs text-muted-foreground">Real-time owner notifications</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Campus-Wide</p>
                <p className="text-xs text-muted-foreground">All IGNOU regional centers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
