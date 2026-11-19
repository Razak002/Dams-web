"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { registerPatron } from "@/lib/api-client";
import { useAuthStore } from "@/store/use-auth-store";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { GoogleContinueButton } from "@/components/auth/GoogleContinueButton";
import { toast } from "sonner";

function SignupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const setUser = useAuthStore((s) => s.setUser);

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");
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

    const res = await registerPatron({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
    });

    setSubmitting(false);

    if (res.status === "success") {
      if (res.data?.user) {
        setUser(res.data.user);
      }
      toast.success("Account created! Check your email for the 6-digit code.");
      // Route to email OTP verification with optional redirect preserved
      const nextParams = new URLSearchParams({ email: email.trim() });
      if (redirectTarget) nextParams.set("redirect", redirectTarget);
      router.push(`/verify-email?${nextParams.toString()}`);
      return;
    }

    toast.error(res.message || "Unable to create your account.");
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
          Join DÁMS
        </h1>
        <p className="text-xs sm:text-sm text-[#777F7B]">
          Create your patron account for Abuja &amp; nationwide orders
        </p>
      </div>

      {/* Segmented Pill Switcher (Sign In | Signup) */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F4F5F4] border border-[#171C1A]/5">
        <Link
          href={
            redirectTarget
              ? `/login?redirect=${encodeURIComponent(redirectTarget)}`
              : "/login"
          }
          className="h-10 rounded-lg text-xs font-semibold text-[#777F7B] hover:text-[#171C1A] flex items-center justify-center transition-colors"
        >
          Sign In
        </Link>
        <span className="h-10 rounded-lg text-xs font-semibold bg-white text-[#171C1A] shadow-xs flex items-center justify-center">
          Signup
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <UserIcon className="w-4 h-4 text-[#777F7B] shrink-0" />
            <div className="flex-1 min-w-0">
              <label
                htmlFor="signup-first"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                First Name
              </label>
              <input
                id="signup-first"
                type="text"
                required
                placeholder="Amina"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full text-xs font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <div className="flex-1 min-w-0">
              <label
                htmlFor="signup-last"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                Last Name
              </label>
              <input
                id="signup-last"
                type="text"
                required
                placeholder="Bello"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full text-xs font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
          <Phone className="w-4 h-4 text-[#777F7B] shrink-0" />
          <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="signup-phone"
              className="block text-[10px] text-[#777F7B] leading-none"
            >
              Phone / WhatsApp
            </label>
            <input
              id="signup-phone"
              type="tel"
              required
              placeholder="+234 803 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
            />
          </div>
        </div>
        {fieldErrors.phone && (
          <p className="text-[11px] text-red-600 px-1">{fieldErrors.phone}</p>
        )}

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
          <Mail className="w-4 h-4 text-[#777F7B] shrink-0" />
          <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="signup-email"
              className="block text-[10px] text-[#777F7B] leading-none"
            >
              Email Address
            </label>
            <input
              id="signup-email"
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

        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
          <Lock className="w-4 h-4 text-[#777F7B] shrink-0" />
          <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
          <div className="flex-1 min-w-0">
            <label
              htmlFor="signup-password"
              className="block text-[10px] text-[#777F7B] leading-none"
            >
              Password (Min 8 characters)
            </label>
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              autoComplete="new-password"
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl bg-[#013E37] hover:bg-[#025249] active:bg-[#012d28] text-[#FFEEB3] text-sm font-semibold tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <span>Create Account</span>
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
    </AuthSplitLayout>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 text-[#013E37] animate-spin" />
        </div>
      }
    >
      <SignupFormContent />
    </Suspense>
  );
}
