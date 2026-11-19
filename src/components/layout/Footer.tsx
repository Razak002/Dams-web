"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
  RefreshCw,
} from "lucide-react";
import { subscribeNewsletter } from "@/lib/api-client";
import { DAMS_WHATSAPP_NUMBER } from "@/lib/utils";

export function Footer() {
  const [email, setEmail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setErrorMsg(null);
    setSubmitting(true);

    const res = await subscribeNewsletter(email.trim(), "footer");
    setSubmitting(false);

    if (res.status === "success") {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <footer className="relative bg-[#013E37] text-white overflow-hidden mt-auto border-t border-[#FFEEB3]/15">
      {/* Subtle Ambient Gold Radial Glow */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-12 w-[560px] h-[260px] rounded-full bg-[#FFEEB3]/[0.07] blur-3xl"
        aria-hidden="true"
      />

      {/* Top Assurance Strip */}
      <div className="border-b border-white/10 bg-[#01332D]/60">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="flex items-center gap-3.5 pt-3 first:pt-0 md:pt-0 md:px-4 first:md:pl-0">
            <div className="w-10 h-10 rounded-full bg-[#FFEEB3]/10 border border-[#FFEEB3]/25 text-[#FFEEB3] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFEEB3]">
                100% Original Local Product
              </p>
              <p className="text-xs text-white/70">
                Purely natural, handcrafted in our Abuja workshop
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-10 h-10 rounded-full bg-[#FFEEB3]/10 border border-[#FFEEB3]/25 text-[#FFEEB3] flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFEEB3]">
                24-Hr Abuja &amp; Nationwide Dispatch
              </p>
              <p className="text-xs text-white/70">
                Tracked doorstep delivery across all 36 Nigerian states
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 pt-3 md:pt-0 md:px-6">
            <div className="w-10 h-10 rounded-full bg-[#FFEEB3]/10 border border-[#FFEEB3]/25 text-[#FFEEB3] flex items-center justify-center shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#FFEEB3]">
                14-Day Fit Guarantee
              </p>
              <p className="text-xs text-white/70">
                Complimentary size exchange on unworn pairs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Editorial Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 sm:pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left Column: Editorial Headline, Location & Social Icons (WhatsApp, Facebook, TikTok, Instagram) */}
          <div className="md:col-span-5 space-y-7">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] leading-[1.14] tracking-tight text-white max-w-md">
              Own every step in purely natural,{" "}
              <span className="text-[#FFEEB3]">locally made</span> Nigerian
              footwear.
            </h2>

            <p className="inline-flex items-center gap-2 text-xs text-white/75 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <MapPin className="w-3.5 h-3.5 text-[#FFEEB3] shrink-0" />
              <span>Atelier &amp; Workshop: Abuja (FCT), Nigeria</span>
            </p>

            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFEEB3]/85">
                Follow us
              </span>

              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href={`https://wa.me/${DAMS_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat with DÁMS on WhatsApp"
                  title="WhatsApp"
                  className="w-10 h-10 rounded-full bg-[#FFEEB3] hover:bg-white text-[#013E37] flex items-center justify-center shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
                    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow DÁMS on Instagram"
                  title="Instagram"
                  className="w-10 h-10 rounded-full bg-[#FFEEB3] hover:bg-white text-[#013E37] flex items-center justify-center shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow DÁMS on TikTok"
                  title="TikTok"
                  className="w-10 h-10 rounded-full bg-[#FFEEB3] hover:bg-white text-[#013E37] flex items-center justify-center shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow DÁMS on Facebook"
                  title="Facebook"
                  className="w-10 h-10 rounded-full bg-[#FFEEB3] hover:bg-white text-[#013E37] flex items-center justify-center shadow-md transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Middle Column: Stacked Serif Navigation Links */}
          <div className="md:col-span-3 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFEEB3]/80">
              Footwear &amp; House
            </p>
            <ul className="space-y-3 font-serif text-xl sm:text-2xl">
              {[
                { href: "/collections", label: "Collections" },
                { href: "/about", label: "About us" },
                { href: "/about#craftsmanship", label: "How it's made" },
                { href: "/contact", label: "Contact & FAQ" },
                { href: "/cart", label: "Shopping Bag" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-white hover:text-[#FFEEB3] transition-colors"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#FFEEB3]" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Elevated Newsletter Card */}
          <div className="md:col-span-4 p-6 sm:p-7 rounded-2xl bg-white/[0.04] border border-[#FFEEB3]/20 space-y-4">
            <h3 className="font-serif text-2xl text-[#FFEEB3]">Newsletter</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              Be the first to know about new 100% original local Nigerian
              leather releases, small-batch Abuja drops, and footwear care tips.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="relative flex items-center w-full h-13 rounded-full border border-[#FFEEB3]/45 bg-[#012d28]/80 hover:border-[#FFEEB3] focus-within:border-[#FFEEB3] transition-colors pl-5 pr-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  submitted ? "Thank you for joining DÁMS!" : "Enter your email"
                }
                aria-label="Enter your email for newsletter"
                className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none pr-3"
              />
              <button
                type="submit"
                disabled={submitting}
                aria-label="Subscribe to newsletter"
                className="w-9 h-9 rounded-full bg-[#FFEEB3] hover:bg-white text-[#013E37] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shrink-0 disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : submitted ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>
            {errorMsg && (
              <p className="text-xs text-red-300">{errorMsg}</p>
            )}
          </div>
        </div>

        {/* Monumental Centerpiece Brand Logo Framed by Architectural Dividers */}
        <div className="mt-14 sm:mt-16 pt-10 border-t border-white/10 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center gap-6">
            <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FFEEB3]/30 to-[#FFEEB3]/50" />
            <Link
              href="/"
              aria-label="DÁMS Footwear Home"
              className="group relative inline-flex items-center justify-center"
            >
              <Image
                src="/images/brand/transparent.png"
                alt="DÁMS Footwear Official Logo"
                width={380}
                height={380}
                className="w-56 sm:w-72 md:w-80 h-auto object-contain -my-12 sm:-my-14 drop-shadow-[0_14px_32px_rgba(0,0,0,0.45)] group-hover:scale-[1.03] transition-transform duration-500"
              />
            </Link>
            <div className="hidden sm:block flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#FFEEB3]/30 to-[#FFEEB3]/50" />
          </div>

          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#FFEEB3]/80 text-center">
            Own Every Step • Purely Natural • Locally Made in Abuja
          </p>
        </div>
      </div>

      {/* Bottom Legal & Copyright Strip */}
      <div className="relative z-20 bg-[#FFEEB3] text-[#013E37] px-6 sm:px-8 lg:px-12 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-semibold">
          <p>
            Copyright © 2026 DÁMS Footwear Abuja. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/about"
              className="hover:underline underline-offset-4 transition-all"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="hover:underline underline-offset-4 transition-all"
            >
              Terms and Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
