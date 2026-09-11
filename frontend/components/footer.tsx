import Link from "next/link";
import { Search, Heart, Shield, Sparkles, MapPin } from "lucide-react";

const footerLinks = {
  platform: [
    { label: "Browse Registry", href: "/browse" },
    { label: "Report Lost Item", href: "/dashboard/report" },
    { label: "About FindUp", href: "/about" },
    { label: "User Dashboard", href: "/dashboard" },
  ],
  support: [
    { label: "Help & FAQs", href: "/about" },
    { label: "Verification Guide", href: "/about" },
    { label: "Safety & Security", href: "/about" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/about" },
    { label: "Terms of Service", href: "/about" },
    { label: "Campus Guidelines", href: "/about" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 via-cyan-600 to-sky-500 shadow-md shadow-teal-500/20">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-foreground">
                  Find<span className="text-primary">Up</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                  IGNOU Lost & Found
                </span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A modern, community-driven platform connecting IGNOU students, staff, and regional study centers across India to safely recover misplaced belongings.
            </p>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>Covering 67+ Regional Centers Nationwide</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.platform.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">Trust & Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} FindUp - IGNOU. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Built with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for the IGNOU student community
          </p>
        </div>
      </div>
    </footer>
  );
}
