import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Home, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <section className="relative flex-1 bg-[#FAF9F6] text-[#171C1A] overflow-hidden flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-10">
      {/* Subtle Background Starburst Watermark */}
      <svg
        viewBox="0 0 600 600"
        fill="none"
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-24 w-[420px] sm:w-[580px] h-auto opacity-[0.04] text-[#013E37]"
      >
        <path
          d="M300 0L358 212L560 140L412 300L560 460L358 388L300 600L242 388L40 460L188 300L40 140L242 212L300 0Z"
          fill="currentColor"
        />
      </svg>

      <div className="relative z-10 max-w-4xl mx-auto w-full text-center flex flex-col items-center">
        {/* Eyebrow Pill */}
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#013E37] text-[#FFEEB3] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
          <Compass className="w-3.5 h-3.5" />
          <span>Error 404 • Page Not Found</span>
        </span>

        {/* Giant 404 Watermark + Floating DÁMS Footwear Stage */}
        <div className="relative w-full flex flex-col items-center justify-center my-4 sm:my-6">
          <div
            aria-hidden="true"
            className="select-none pointer-events-none font-serif font-bold leading-none tracking-tight text-[120px] xs:text-[150px] sm:text-[220px] md:text-[260px] text-[#013E37]/[0.08]"
          >
            404
          </div>

          <div className="relative -mt-24 xs:-mt-28 sm:-mt-40 md:-mt-48 w-44 xs:w-52 sm:w-64 aspect-square flex items-center justify-center">
            <Image
              src="/images/hero.png"
              alt="DÁMS Signature Natural Cork Slide"
              fill
              priority
              sizes="(max-width: 640px) 208px, 256px"
              className="object-contain -rotate-12 drop-shadow-[0_24px_32px_rgba(1,62,55,0.25)] hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Editorial Copy */}
        <h1 className="font-serif text-3xl sm:text-5xl text-[#171C1A] tracking-tight">
          This Path Leads Off the Last
        </h1>

        <p className="mt-3 text-sm sm:text-base text-[#777F7B] max-w-md mx-auto leading-relaxed">
          The pair or page you are looking for may have been moved, archived, or
          sold out from our Abuja workshop. Let’s guide your steps back to our
          collection.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/collections"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-4 bg-[#013E37] hover:bg-[#025249] text-[#FFEEB3] rounded-full pl-6 pr-2 py-2 text-xs sm:text-sm font-bold tracking-wide shadow-lg transition-all duration-300"
          >
            <span>Explore Collections</span>
            <span className="w-9 h-9 rounded-full bg-[#FFEEB3] text-[#013E37] flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-13 px-7 rounded-full border border-[#171C1A]/20 bg-white hover:border-[#013E37] text-[#171C1A] hover:text-[#013E37] text-xs sm:text-sm font-semibold tracking-wide transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Quick Category Shortcuts */}
        <div className="mt-10 pt-6 border-t border-[#171C1A]/10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#777F7B]">
          <Link
            href="/collections?category=men"
            className="hover:text-[#013E37] transition-colors"
          >
            Men&apos;s Pairs
          </Link>
          <span className="text-[#171C1A]/20">•</span>
          <Link
            href="/collections?category=women"
            className="hover:text-[#013E37] transition-colors"
          >
            Women&apos;s Pairs
          </Link>
          <span className="text-[#171C1A]/20">•</span>
          <Link
            href="/collections?category=unisex"
            className="hover:text-[#013E37] transition-colors"
          >
            Unisex Slides
          </Link>
          <span className="text-[#171C1A]/20">•</span>
          <Link
            href="/contact"
            className="hover:text-[#013E37] transition-colors"
          >
            Abuja Concierge
          </Link>
        </div>
      </div>
    </section>
  );
}
