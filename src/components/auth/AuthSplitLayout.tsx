"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export function AuthSplitLayout({
  children,
  footerNote = "Own every step in purely natural, locally made Nigerian footwear. Sign in to track your Abuja workshop commissions, saved pairs, and nationwide deliveries.",
}: {
  children: React.ReactNode;
  footerNote?: string;
}) {
  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white text-[#171C1A]">
      {/* Left Column: Clean White Auth Form */}
      <div className="flex flex-col justify-between px-6 sm:px-12 lg:px-16 py-8 sm:py-10 bg-white">
        {/* Top Brand Mark */}
        <div className="flex justify-center pt-2">
          <Link
            href="/"
            aria-label="Return to DÁMS Footwear Home"
            className="inline-flex items-center justify-center group"
          >
            <Image
              src="/images/brand/colored-logo.png"
              alt="DÁMS Footwear"
              width={160}
              height={160}
              priority
              className="w-28 sm:w-32 h-auto object-contain -my-6 group-hover:scale-105 transition-transform duration-300"
            />
          </Link>
        </div>

        {/* Center Form Stack */}
        <div className="w-full max-w-[380px] mx-auto my-8 space-y-6">
          {children}
        </div>

        {/* Bottom Muted Brand Statement */}
        <p className="text-[11px] text-[#777F7B] text-center max-w-md mx-auto leading-relaxed pb-2">
          {footerNote}
        </p>
      </div>

      {/* Right Column: Full-Bleed Dark Turquoise Brand Visual Stage */}
      <div className="hidden lg:flex relative bg-[#013E37] overflow-hidden flex-col items-center justify-center p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent 0%, rgba(255,238,179,0.08) 1px, transparent 1px)",
            backgroundSize: "96px 100%",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute w-[460px] h-[460px] rounded-full bg-[#FFEEB3]/12 blur-3xl"
        />

        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 w-full max-w-[440px] aspect-square flex items-center justify-center"
        >
          <Image
            src="/images/hero.png"
            alt="DÁMS Purely Natural Locally Made Footwear"
            fill
            priority
            sizes="440px"
            className="object-contain -rotate-6 drop-shadow-[0_34px_48px_rgba(0,0,0,0.55)]"
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="w-64 h-6 rounded-full bg-black/45 blur-xl -mt-4"
        />

        <div className="relative z-10 mt-8 text-center space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFEEB3]">
            100% Original Local Product
          </p>
          <p className="font-serif text-2xl text-white">
            Handcrafted in Abuja, Nigeria
          </p>
        </div>
      </div>
    </div>
  );
}
