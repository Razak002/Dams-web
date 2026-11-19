import Link from "next/link";

export function AnnouncementStrip() {
  return (
    <div className="bg-[#012d28] text-[#FFEEB3] border-b border-[#FFEEB3]/10 text-xs sm:text-[13px] tracking-[0.14em] uppercase py-2.5 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <span className="hidden md:inline text-[#FFEEB3]/85 font-medium">
          Own Every Step • Purely Natural
        </span>
        <p className="mx-auto md:mx-0 text-center font-semibold">
          100% Original Local Product • Locally Made in Abuja, Nigeria
        </p>
        <Link
          href="/collections"
          className="hidden sm:inline font-semibold underline underline-offset-4 hover:text-white transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
