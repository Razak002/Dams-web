"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  KeyRound,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { resetPassword } from "@/lib/api-client";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { toast } from "sonner";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";

  const [token, setToken] = React.useState(tokenFromUrl);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    const res = await resetPassword({
      token: token.trim(),
      newPassword,
    });
    setSubmitting(false);

    if (res.status === "success") {
      setSuccess(true);
      toast.success("Your password has been updated.");
      setTimeout(() => router.push("/login"), 2000);
    } else {
      toast.error(res.message || "Invalid or expired reset token.");
    }
  };

  return (
    <AuthSplitLayout>
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-[34px] text-[#171C1A] tracking-tight">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-[#777F7B]">
          Create a strong new password for your DÁMS account
        </p>
      </div>

      {success ? (
        <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#013E37]/25 space-y-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-[#171C1A]">
            Your password has been updated. Redirecting you to Sign In...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-wider"
          >
            Go to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <KeyRound className="w-4 h-4 text-[#777F7B] shrink-0" />
            <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <label
                htmlFor="reset-token"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                Reset Token / Code
              </label>
              <input
                id="reset-token"
                type="text"
                required
                placeholder="Paste token from email"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <Lock className="w-4 h-4 text-[#777F7B] shrink-0" />
            <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <label
                htmlFor="reset-new-password"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                New Password (Min 8 characters)
              </label>
              <input
                id="reset-new-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <Lock className="w-4 h-4 text-[#777F7B] shrink-0" />
            <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <label
                htmlFor="reset-confirm-password"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                Confirm New Password
              </label>
              <input
                id="reset-confirm-password"
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] placeholder:text-[#777F7B]/50 focus:outline-none mt-1 bg-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#013E37] hover:bg-[#025249] text-[#FFEEB3] text-sm font-semibold tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      )}

      <div className="text-center pt-1">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#013E37] hover:underline underline-offset-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthSplitLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 text-[#013E37] animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
