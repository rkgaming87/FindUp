"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Search,
  Shield,
  Heart,
  Users,
  Globe,
  MapPin,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28 bg-gradient-to-b from-muted/30 via-background to-background">
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-tr from-teal-500/15 via-cyan-500/15 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-40" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 backdrop-blur-md shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Our Story & Mission</span>
            </div>

            <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
              Reconnecting Campus Members with{" "}
              <span className="bg-gradient-to-r from-teal-600 via-cyan-500 to-sky-500 bg-clip-text text-transparent">
                What Matters Most
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              FindUp is a modern, student-driven initiative built to bridge the gap
              between misplaced valuables and their rightful owners across all IGNOU regional study centers.
            </p>
          </div>
        </section>

        {/* Vision & Pillars */}
        <section className="py-20 border-t border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                    Built for Trust, Speed, and Integrity
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Misplacing essential notes, examination ID cards, keys, or electronic devices is stressful. We developed FindUp to create an official, structured, and secure ecosystem for immediate reporting and verified handovers.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pt-2">
                  {[
                    {
                      icon: Shield,
                      title: "Verified Claims",
                      desc: "Photo evidence & ID verification protect every item handover.",
                      color: "text-teal-600 dark:text-teal-400",
                      bg: "bg-teal-500/10",
                    },
                    {
                      icon: Globe,
                      title: "67+ Regional Centers",
                      desc: "Connected statewide across all IGNOU centers in India.",
                      color: "text-cyan-600 dark:text-cyan-400",
                      bg: "bg-cyan-500/10",
                    },
                    {
                      icon: Search,
                      title: "Instant Matching",
                      desc: "Automated tagging matches lost items with found reports.",
                      color: "text-sky-600 dark:text-sky-400",
                      bg: "bg-sky-500/10",
                    },
                    {
                      icon: Heart,
                      title: "100% Free & Open",
                      desc: "A non-profit service dedicated solely to student welfare.",
                      color: "text-rose-600 dark:text-rose-400",
                      bg: "bg-rose-500/10",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="glass-card flex flex-col justify-between rounded-2xl p-5 shadow-xs transition-all hover:border-teal-500/40 hover:-translate-y-1"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-sm text-foreground">{item.title}</h3>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat Highlight Card */}
              <div className="glass-card relative overflow-hidden rounded-3xl p-10 shadow-2xl border border-border/60">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
                <div className="text-center space-y-6">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white shadow-xl shadow-teal-500/30">
                    <span className="text-4xl font-extrabold">88%</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-foreground">Highest Recovery Rate</h3>
                    <p className="mt-2 text-xs text-muted-foreground max-w-sm mx-auto">
                      Over 88% of verified reported belongings are successfully returned to students within 72 hours of submission.
                    </p>
                  </div>
                  <div className="border-t border-border/40 pt-6 flex justify-around text-center">
                    <div>
                      <p className="text-xl font-bold text-foreground">2,500+</p>
                      <p className="text-[11px] text-muted-foreground">Recovered Items</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">15,000+</p>
                      <p className="text-[11px] text-muted-foreground">Campus Members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative overflow-hidden py-20 bg-gradient-to-tr from-teal-900 via-teal-800 to-cyan-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to help your campus community?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-sm text-teal-100">
              Report an item or browse the active registry today. Every report makes a difference.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="rounded-xl bg-white text-teal-950 font-bold hover:bg-teal-50">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/browse">
                <Button size="lg" variant="outline" className="rounded-xl border-white/30 text-white hover:bg-white/10">
                  Browse Registry
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
