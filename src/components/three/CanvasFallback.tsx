import Image from "next/image";

export function CanvasFallback() {
  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-6">
      <div className="relative w-full max-w-md aspect-[4/3] rounded-xs overflow-hidden border border-[#FFEEB3]/20 bg-[#012d28]/80 shadow-2xl">
        <Image
          src="https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=85"
          alt="DÁMS Hand-Welted Ikoyi Derby — Abuja Craftsmanship"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#013E37]/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-[#FFEEB3]">
          <span className="uppercase tracking-[0.18em] font-semibold">
            The Ikoyi Derby • Studio Edition
          </span>
          <span className="text-white/75">Sokoto Calfskin</span>
        </div>
      </div>
    </div>
  );
}
