"use client";

import * as React from "react";
import Link from "next/link";
import { RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("DÁMS Storefront Error:", error);
  }, [error]);

  return (
    <section className="flex-1 bg-[#FAF9F6] text-[#171C1A] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-lg w-full bg-white border border-[#171C1A]/15 p-8 sm:p-10 text-center space-y-5 shadow-sm">
        <span className="inline-block px-3.5 py-1 rounded-full bg-[#013E37] text-[#FFEEB3] text-[11px] font-semibold uppercase tracking-[0.18em]">
          Temporary Interruption
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl text-[#171C1A]">
          Something Went Off-Script
        </h1>

        <p className="text-sm text-[#777F7B] leading-relaxed">
          We encountered an unexpected issue loading this page. You can retry
          right away or return to our Abuja storefront home.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full bg-[#013E37] hover:bg-[#025249] text-[#FFEEB3] text-xs font-bold uppercase tracking-[0.16em] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full border border-[#171C1A]/20 hover:border-[#013E37] text-[#171C1A] text-xs font-semibold uppercase tracking-[0.16em] transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
