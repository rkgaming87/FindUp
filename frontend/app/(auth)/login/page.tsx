"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/lib/authContext";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callback = searchParams.get("callback");
  const { refreshUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username or Student ID is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    setServerError(null);
    setIsLoading(true);

    try {
      await loginUser(formData);
      await refreshUser();
      toast.success("Welcome back to FindUp!");
      router.replace(callback || "/dashboard");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error || "Failed to sign in";
      setServerError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 sm:px-6 lg:px-8">
      {/* Dynamic Ambient Background Glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute inset-0 bg-grid-pattern opacity-40" />
      </div>

      <div className="relative w-full max-w-4xl grid gap-8 lg:grid-cols-2 items-center">
        {/* Left Side: Brand & Benefits */}
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
              Welcome back to your campus lost & found.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Sign in to manage reported items, check claim statuses, and connect with finders across IGNOU study centers.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Fast & secure student verification</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Real-time claim notifications & alerts</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/90">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <span>Campus-wide coverage across 67+ regional centers</span>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-xl border border-border/40 bg-muted/40 p-4 text-xs text-muted-foreground backdrop-blur-sm">
            🔒 Protected by student credential verification & SSL encryption.
          </div>
        </div>

        {/* Right Side: Auth Glass Card */}
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
              Sign In to Your Account
            </h2>
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Sign up free
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* Username / ID */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-semibold uppercase tracking-wider">
                Username or Student ID
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="e.g., rohit123 or 2352777723"
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{serverError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-11 w-full gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 font-semibold text-white shadow-lg shadow-teal-500/20 hover:opacity-95"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
