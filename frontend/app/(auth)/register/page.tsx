"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Eye,
  EyeOff,
  Loader2,
  Check,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/lib/authContext";
import { toast } from "sonner";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username or Student ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (
      !passwordRequirements.every((req) => req.test(formData.password))
    ) {
      newErrors.password = "Password does not meet all criteria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await registerUser(formData);
      setIsSuccess(true);
      toast.success("Account created successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
        <div className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="glass-card w-full max-w-md space-y-6 rounded-3xl p-10 text-center shadow-2xl">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30">
            <Check className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
              Account Created!
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Welcome to the FindUp community, <span className="font-semibold text-foreground">{formData.fullName.split(" ")[0]}</span>!<br />
              Your account has been registered. You can now log in to report items and submit claims.
            </p>
          </div>
          <div className="pt-2">
            <Button
              className="h-11 w-full rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 font-semibold text-white shadow-lg shadow-teal-500/20"
              onClick={() => router.push("/login")}
            >
              Proceed to Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      <div className="relative w-full max-w-4xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left Side: Information & Highlights */}
        <div className="hidden lg:flex flex-col justify-between p-8">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/25">
                <Search className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-foreground">
                Find<span className="text-primary">Up</span>
              </span>
            </Link>

            <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Join your campus lost & found network.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Create an account in seconds to report lost items, verify found belongings, and receive automated matching notifications.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground font-semibold">1-Click Reporting:</strong> Post lost items with photos, location, and tags.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground font-semibold">Secure Claims:</strong> Verification system prevents fraudulent handovers.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground font-semibold">Live Campus Alerts:</strong> Get notified instantly when items match.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-xl border border-border/40 bg-muted/40 p-4 text-xs text-muted-foreground backdrop-blur-sm">
            ✨ Free & open to all IGNOU regional center students and staff.
          </div>
        </div>

        {/* Right Side: Register Card */}
        <div className="glass-card w-full rounded-3xl p-8 sm:p-10 shadow-2xl shadow-teal-500/10">
          <div className="lg:hidden mb-6 flex justify-center">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 text-white">
                <Search className="h-5 w-5" />
              </div>
              <span className="text-xl font-extrabold text-foreground">FindUp</span>
            </Link>
          </div>

          <div className="space-y-1 text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Create Your Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs font-semibold uppercase tracking-wider">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Rohit Sharma"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className={`rounded-xl border-border/60 bg-background/50 text-sm ${
                  errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@ignou.ac.in"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className={`rounded-xl border-border/60 bg-background/50 text-sm ${
                  errors.email ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Student ID / Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider">
                Username or Student/Staff ID
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g. 2352777723 or rohit_sharma"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className={`rounded-xl border-border/60 bg-background/50 text-sm ${
                  errors.username ? "border-destructive focus-visible:ring-destructive" : ""
                }`}
              />
              {errors.username && (
                <p className="text-xs text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`rounded-xl border-border/60 bg-background/50 pr-10 text-sm ${
                    errors.password ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Requirements Badges */}
              <div className="mt-2 grid grid-cols-2 gap-1.5 pt-1">
                {passwordRequirements.map((req) => {
                  const passed = req.test(formData.password);
                  return (
                    <div key={req.label} className="flex items-center gap-1.5 text-[11px]">
                      <div
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors ${
                          passed
                            ? "bg-teal-500/20 text-teal-600 dark:text-teal-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Check className="h-2 w-2" />
                      </div>
                      <span className={passed ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {req.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 font-semibold text-white shadow-lg shadow-teal-500/20 hover:opacity-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
