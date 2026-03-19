"use client";

import React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Search,
  Shield,
  Heart,
  Users,
  CheckCircle,
  Globe,
  MapPin,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden bg-background">
          <div className="absolute inset-x-0 top-0 h-96 bg-linear-to-b from-primary/10 to-transparent pointer-events-none" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-4 px-3 py-1 text-sm font-medium">
              Our Story
            </Badge>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl mb-6">
              Reconnecting People with <br />
              <span className="text-primary">What Matters Most</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed transition-all duration-700">
              FindUp is more than just a lost and found portal. It's a
              community-driven initiative built to bridge the gap between those
              who lost something precious and those who found it.
            </p>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-24 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="space-y-8 animate-in slide-in-from-left duration-1000">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                    Our Mission
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    To provide a seamless, transparent, and secure digital
                    platform for the IGNOU community to recover lost belongings.
                    We believe that honesty should be rewarded and kindness
                    should be simple.
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    {
                      icon: Shield,
                      title: "Trust & Safety",
                      desc: "Verifying every claim before releasing item details.",
                    },
                    {
                      icon: Globe,
                      title: "Community First",
                      desc: "Empowering 2500+ active users across centers.",
                    },
                    {
                      icon: Search,
                      title: "Smart Matching",
                      desc: "Using intelligent filters to find matches instantly.",
                    },
                    {
                      icon: Heart,
                      title: "Free to Use",
                      desc: "Non-profit initiative for the benefit of all students.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-4 p-4 rounded-xl border border-border bg-background transition-all hover:shadow-md"
                    >
                      <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-in slide-in-from-right duration-1000">
                <div className="aspect-square rounded-3xl overflow-hidden bg-primary/5 flex items-center justify-center border-4 border-background shadow-2xl relative">
                  <div className="text-center p-8 space-y-4">
                    <div className="mx-auto h-24 w-24 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-3xl font-bold shadow-lg shadow-primary/30">
                      85%
                    </div>
                    <h3 className="text-2xl font-bold">Recovery Rate</h3>
                    <p className="text-muted-foreground">
                      The highest success rate in regional center campuses.
                    </p>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 h-24 w-24 bg-rose-500/10 rounded-full blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-blue-500/10 rounded-full blur-3xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it Started */}
        <section className="py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                The Problem We Solved
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                "It started when our team witnessed a student losing her
                important project documents and having no official way to track
                them besides social media whispers. We knew there had to be a
                better way."
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <p className="font-bold text-xl uppercase tracking-widest text-primary">
                The Team
              </p>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built by a group of passionate developers at the IGNOU Computer
                Science Regional Center, dedicated to creating software that
                makes campus life easier.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full -ml-32 -mb-32 blur-2xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6">
              Ready to Find Your Lost Belongings?
            </h2>
            <p className="text-primary-foreground/80 mb-10 text-lg max-w-2xl mx-auto">
              Join the thousands of users already helping each other. Your next
              discovery starts here.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 font-semibold"
                >
                  Get Started for Free
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 bg-transparent text-white border-white hover:bg-white/10"
                >
                  Browse Items
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

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}
    >
      {children}
    </span>
  );
}
