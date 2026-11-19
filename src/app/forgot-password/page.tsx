"use client";

import * as React from "react";
import Link from "next/link";
import { Mail, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { requestPasswordReset } from "@/lib/api-client";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const res = await requestPasswordReset(email.trim());
    setSubmitting(false);

    if (res.status === "success") {
      setSent(true);
      const msg =
        res.message ||
        "If an account exists for that email, we have sent a password reset link and token.";
      setMessage(msg);
      toast.success("Reset instructions sent.");
    } else {
      toast.error(res.message || "Unable to process password reset request.");
    }
  };

  return (
    <AuthSplitLayout>
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-[34px] text-[#171C1A] tracking-tight">
          Forgot Password
        </h1>
        <p className="text-xs sm:text-sm text-[#777F7B]">
          Enter your email address to receive a reset link or code
        </p>
      </div>

      {sent ? (
        <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#013E37]/25 space-y-4 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm text-[#171C1A] leading-relaxed">
            {message}
          </p>
          <Link
            href="/reset-password"
            className="inline-flex items-center justify-center w-full h-11 rounded-xl bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-wider hover:bg-[#025249] transition-colors"
          >
            Enter Reset Token
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
            <Mail className="w-4 h-4 text-[#777F7B] shrink-0" />
            <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <label
                htmlFor="forgot-email"
                className="block text-[10px] text-[#777F7B] leading-none"
              >
                Email Address
              </label>
              <input
                id="forgot-email"
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#013E37] hover:bg-[#025249] text-[#FFEEB3] text-sm font-semibold tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending Reset Link...</span>
              </>
            ) : (
              <span>Send Reset Link</span>
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
