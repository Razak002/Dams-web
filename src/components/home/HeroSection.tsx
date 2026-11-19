"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";

const DynamicHeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
});

const TYPED_PHRASES = [
  "PURELY NATURAL",
  "LOCALLY MADE",
  "100% ORIGINAL",
  "ABUJA CRAFTED",
] as const;

function TypewriterLine() {
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [displayText, setDisplayText] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    const currentPhrase = TYPED_PHRASES[phraseIndex];
    const typeSpeed = isDeleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText.length < currentPhrase.length) {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
      } else if (!isDeleting && displayText.length === currentPhrase.length) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && displayText.length > 0) {
        setDisplayText(currentPhrase.slice(0, displayText.length - 1));
      } else if (isDeleting && displayText.length === 0) {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % TYPED_PHRASES.length);
      }
    }, typeSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <span className="relative block whitespace-nowrap">
      {/* Invisible longest phrase reserves exact width & height so the page never shifts */}
      <span className="invisible select-none" aria-hidden="true">
        PURELY NATURAL_
      </span>
      <span className="absolute inset-0 flex items-center text-[#FFEEB3]">
        <span>{displayText}</span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.85, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[3px] sm:w-[4px] h-[0.82em] bg-[#FFEEB3] ml-1.5 shrink-0"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}

export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  // Interactive 3D Mouse-Tilt Physics for the Hero Shoe
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 140, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 140, damping: 20 });

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-14, 14]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section className="relative bg-[#013E37] text-white overflow-hidden">
      {/* Subtle Oversized Starburst Watermark */}
      <svg
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 w-[520px] sm:w-[680px] lg:w-[780px] h-auto opacity-[0.05] text-[#FFEEB3]"
      >
        <path
          d="M300 0L358 212L560 140L412 300L560 460L358 388L300 600L242 388L40 460L188 300L40 140L242 212L300 0Z"
          fill="currentColor"
        />
      </svg>

      {/* Soft Radial Highlight Behind Hero Product */}
      <div
        className="pointer-events-none absolute right-[8%] top-1/2 -translate-y-1/2 w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] rounded-full bg-[#FFEEB3]/12 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-12 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-8 items-center">
          {/* Left Column: Typewriter Stacked Headline & Pill CTA */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="lg:col-span-6 space-y-4 sm:space-y-6 z-10"
          >
            <motion.h1
              variants={fadeUp}
              className="font-serif uppercase text-[32px] xs:text-4xl sm:text-5xl lg:text-[54px] xl:text-[62px] leading-[1.06] tracking-tight text-white"
            >
              <span className="block">Own Every Step</span>
              <TypewriterLine />
              <span className="block">Local Product.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base text-white/85 max-w-md leading-relaxed"
            >
              Own every step in purely natural, locally made footwear 100%
              original local product handcrafted in Abuja for enduring comfort
              and unmistakable poise.
            </motion.p>

            {/* Sample-Matched Pill CTA Button with Circular Arrow Badge */}
            <motion.div
              variants={fadeUp}
              className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <Link
                href="/collections"
                className="group inline-flex items-center gap-4 bg-[#FFEEB3] hover:bg-white text-[#013E37] rounded-full pl-6 pr-2 py-2 text-xs sm:text-sm font-bold tracking-wide shadow-xl transition-all duration-300"
              >
                <span>Shop Now</span>
                <span className="w-9 h-9 rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
                  <ArrowUpRight className="w-4 h-4" />
                </span>
              </Link>

              <Link
                href="/about"
                className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFEEB3]/90 hover:text-white underline underline-offset-8 transition-colors px-2 py-2"
              >
                Our Local Craft
              </Link>
            </motion.div>

            {/* Live Craftsmanship Pills */}
            <motion.div
              variants={fadeUp}
              className="pt-2 sm:pt-4 flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.13em] text-[#FFEEB3]/90"
            >
              <span className="px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
                ✓ Purely Natural Leather
              </span>
              <span className="px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
                ✓ Contoured Cork Footbed
              </span>
              <span className="px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
                ✓ Locally Made in Abuja
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Three.js 3D Golden Orbital Halo + Interactive 3D Levitating Hero Shoe */}
          <div
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            className="lg:col-span-6 relative flex flex-col items-center justify-center z-10 min-h-[280px] sm:min-h-[460px] lg:min-h-[480px]"
            style={{ perspective: 1100 }}
          >
            {/* Three.js R3F 3D Orbital Rings & Golden Sparkles Stage */}
            {!prefersReducedMotion && <DynamicHeroScene />}

            {/* Floating Craftsmanship Callout Tag — Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden sm:flex items-center gap-2 absolute top-6 left-2 z-20 px-3.5 py-2 rounded-full bg-[#012d28]/90 backdrop-blur-md border border-[#FFEEB3]/30 text-[11px] text-[#FFEEB3] shadow-lg"
            >
              <span>Engraved DÁMS® Copper Buckles</span>
            </motion.div>

            {/* Floating Craftsmanship Callout Tag — Bottom Right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="hidden sm:flex items-center gap-2 absolute bottom-10 right-2 z-20 px-3.5 py-2 rounded-full bg-[#012d28]/90 backdrop-blur-md border border-[#FFEEB3]/30 text-[11px] text-[#FFEEB3] shadow-lg"
            >
              <span>Anatomical Natural Cork Footbed</span>
            </motion.div>

            {/* 3D Tilt + Floating Hero Image (/images/hero.png) */}
            <motion.div
              style={{
                rotateX: prefersReducedMotion ? 0 : rotateX,
                rotateY: prefersReducedMotion ? 0 : rotateY,
                transformStyle: "preserve-3d",
              }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: [0, -10, 0],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full max-w-[290px] sm:max-w-[440px] lg:max-w-[500px] aspect-square flex items-center justify-center cursor-pointer"
            >
              <Image
                src="/images/hero.png"
                alt="DÁMS Purely Natural Locally Made Footwear — 100% Original Local Product"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 500px"
                className="object-contain drop-shadow-[0_32px_44px_rgba(0,0,0,0.6)] -rotate-6 transition-transform duration-500"
              />
            </motion.div>

            {/* Grounded Studio Shadow Pedestal (Pulses with Levitation) */}
            <motion.div
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      scaleX: [1, 0.88, 1],
                      opacity: [0.5, 0.32, 0.5],
                    }
              }
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-3/4 h-6 rounded-full bg-black/50 blur-xl -mt-4 z-0"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
