"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { loginPatron } from "@/lib/api-client";
import { useAuthStore } from "@/store/use-auth-store";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import { toast } from "sonner";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {}
  );

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    const res = await loginPatron({ email: email.trim(), password });
    setSubmitting(false);

    if (res.status === "success" && res.data?.user) {
      const user = res.data.user;
      setUser(user);
      toast.success("Welcome back to DÁMS.");

      const role = user.role || "CUSTOMER";
      if (role === "CUSTOMER") {
        router.push(
          redirectTarget && !redirectTarget.startsWith("/admin")
            ? redirectTarget
            : "/"
        );
      } else {
        router.push(
          redirectTarget && redirectTarget.startsWith("/admin")
            ? redirectTarget
            : "/admin"
        );
      }
      return;
    }

    toast.error(res.message || "Invalid email or password.");
    if (res.errors) {
      const mapped: Record<string, string> = {};
      Object.entries(res.errors).forEach(([k, msgs]) => {
        if (msgs?.[0]) mapped[k] = msgs[0];
      });
      setFieldErrors(mapped);
    }
  };

  return (
    <AuthSplitLayout>
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-[34px] text-[#171C1A] tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-[#777F7B]">
          Welcome back, please enter your details
        </p>
      </div>

      {/* Segmented Pill Switcher (Sign In | Signup) */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F4F5F4] border border-[#171C1A]/5">
        <span className="h-10 rounded-lg text-xs font-semibold bg-white text-[#171C1A] shadow-xs flex items-center justify-center">
          Sign In
        </span>
        <Link
          href={
            redirectTarget
              ? `/signup?redirect=${encodeURIComponent(redirectTarget)}`
              : "/signup"
          }
          className="h-10 rounded-lg text-xs font-semibold text-[#777F7B] hover:text-[#171C1A] flex items-center justify-center transition-colors"
        >
          Signup
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Email Card Input */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
          <Mail className="w-4 h-4 text-[#777F7B] shrink-0" />
          <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="login-email"
              className="block text-[10px] text-[#777F7B] leading-none"
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              placeholder="patron@damsfootwear.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
            />
          </div>
          {isEmailValid && (
            <CheckCircle2 className="w-4 h-4 text-[#013E37] shrink-0" />
          )}
        </div>
        {fieldErrors.email && (
          <p className="text-[11px] text-red-600 px-1">{fieldErrors.email}</p>
        )}

        {/* Password Card Input */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
          <Lock className="w-4 h-4 text-[#777F7B] shrink-0" />
          <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="login-password"
              className="block text-[10px] text-[#777F7B] leading-none"
            >
              Password
            </label>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-[#777F7B] hover:text-[#171C1A] cursor-pointer"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="text-[11px] text-red-600 px-1">
            {fieldErrors.password}
          </p>
        )}

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#013E37] hover:underline underline-offset-4"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl bg-[#013E37] hover:bg-[#025249] active:bg-[#012d28] text-[#FFEEB3] text-sm font-semibold tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in...</span>
            </>
          ) : (
            <span>Continue</span>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex-1 h-[1px] bg-[#171C1A]/10" />
        <span className="text-[11px] font-medium text-[#777F7B]">
          Or Continue With
        </span>
        <div className="flex-1 h-[1px] bg-[#171C1A]/10" />
      </div>

      <GoogleContinueButton
        redirectTarget={redirectTarget}
        onError={(msg) => toast.error(msg)}
      />

      <div className="text-center">
        <Link
          href="/collections"
          className="text-[11px] font-medium text-[#777F7B] hover:text-[#013E37] transition-colors"
        >
          Browse Storefront
        </Link>
      </div>
    </AuthSplitLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 text-[#013E37] animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
