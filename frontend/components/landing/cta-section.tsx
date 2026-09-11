import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-teal-900 via-teal-800 to-cyan-900 p-8 shadow-2xl sm:p-14 lg:p-20 text-white border border-teal-500/30">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-teal-400/25 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-10" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Join Your Campus Registry</span>
            </div>

            <h2 className="mt-6 text-balance text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to recover what is yours?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-teal-100 sm:text-lg">
              Join thousands of IGNOU students and faculty who have recovered their valuables, keys, and credentials through FindUp.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 w-full gap-2 rounded-xl bg-white px-7 font-bold text-teal-950 shadow-xl transition-all duration-300 hover:bg-teal-50 hover:scale-105 sm:w-auto"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="h-4 w-4 text-teal-800" />
                </Button>
              </Link>
              <Link href="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 w-full gap-2 rounded-xl border-white/30 bg-white/10 px-7 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:w-auto"
                >
                  <Compass className="h-4 w-4" />
                  <span>Browse Lost Items First</span>
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-teal-200">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-cyan-300" />
                No registration required to browse
              </span>
              <span>•</span>
              <span>Free for all IGNOU members</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
