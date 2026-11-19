"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { resendEmailOtp, verifyEmailOtp } from "@/lib/api-client";
import { useAuthStore } from "@/store/use-auth-store";
import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { toast } from "sonner";

function VerifyEmailOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const redirectTarget = searchParams.get("redirect");

  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = React.useState(initialEmail);
  const [digits, setDigits] = React.useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const [submitting, setSubmitting] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [cooldown, setCooldown] = React.useState(0);
  const [verified, setVerified] = React.useState(false);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleDigitChange = (index: number, value: string) => {
    const clean = value.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] || "");
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length !== 6) {
      toast.error("Please enter the complete 6-digit verification code.");
      return;
    }

    setSubmitting(true);

    const res = await verifyEmailOtp({ email: email.trim(), otp });
    setSubmitting(false);

    if (res.status === "success") {
      setVerified(true);
      if (res.data?.user) {
        setUser(res.data.user);
      }
      toast.success("Email verified! Redirecting you…");
      setTimeout(() => {
        router.push(redirectTarget || "/");
      }, 1500);
    } else {
      toast.error(res.message || "Invalid or expired verification code.");
    }
  };

  const handleResend = async () => {
    if (!email.trim() || cooldown > 0 || resending) return;
    setResending(true);
    const res = await resendEmailOtp(email.trim());
    setResending(false);

    if (res.status === "success") {
      setCooldown(60);
      toast.success(res.message || "A new 6-digit code has been sent.");
    } else {
      toast.error(res.message || "Unable to resend verification code.");
    }
  };

  return (
    <AuthSplitLayout>
      <div className="text-center space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-[34px] text-[#171C1A] tracking-tight">
          Verify Your Email
        </h1>
        <p className="text-xs sm:text-sm text-[#777F7B]">
          Enter the 6-digit OTP sent to{" "}
          <strong className="text-[#171C1A]">
            {email || "your email address"}
          </strong>
        </p>
      </div>

      {verified ? (
        <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#013E37]/25 space-y-3 text-center">
          <div className="w-10 h-10 mx-auto rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-[#171C1A]">
            Email Verified! Redirecting you...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {!initialEmail && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#171C1A]/15 focus-within:border-[#013E37] transition-colors bg-white">
              <Mail className="w-4 h-4 text-[#777F7B] shrink-0" />
              <div className="w-[1px] h-6 bg-[#171C1A]/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor="otp-email"
                  className="block text-[10px] text-[#777F7B] leading-none"
                >
                  Email Address
                </label>
                <input
                  id="otp-email"
                  type="email"
                  required
                  placeholder="patron@damsfootwear.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm font-semibold text-[#171C1A] focus:outline-none mt-1 bg-transparent"
                />
              </div>
            </div>
          )}

          {/* 6-Digit OTP Boxes */}
          <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`OTP digit ${idx + 1}`}
                className="h-13 sm:h-14 w-full text-center text-lg font-bold text-[#171C1A] rounded-xl border border-[#171C1A]/20 focus:border-[#013E37] focus:ring-2 focus:ring-[#013E37]/15 focus:outline-none bg-white"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-[#013E37] hover:bg-[#025249] text-[#FFEEB3] text-sm font-semibold tracking-wide shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <span>Verify Email</span>
            )}
          </button>

          <div className="text-center text-xs text-[#777F7B]">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              disabled={cooldown > 0 || resending}
              onClick={handleResend}
              className="font-semibold text-[#013E37] hover:underline disabled:opacity-50 cursor-pointer"
            >
              {cooldown > 0
                ? `Resend in ${cooldown}s`
                : resending
                  ? "Sending..."
                  : "Resend OTP"}
            </button>
          </div>
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

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 text-[#013E37] animate-spin" />
        </div>
      }
    >
      <VerifyEmailOtpContent />
    </Suspense>
  );
}
