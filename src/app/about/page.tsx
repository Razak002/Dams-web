import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Our Story — Abuja-Based Nigerian Footwear Manufacturing",
  description:
    "Discover the heritage of DÁMS Footwear: a family-owned Nigerian footwear label crafting purely natural, 100% original leather shoes and slides in Abuja.",
};

const PROCESS_STEPS = [
  {
    step: "Stage 01",
    title: "Hide Selection & Tannery Grading",
    body: "We partner directly with established Northern Nigerian tanneries in Sokoto and Kano, selecting only top-grade full-grain calfskin and supple kidskin hides free of structural blemishes.",
  },
  {
    step: "Stage 02",
    title: "Pattern Clicking & Skiving",
    body: "Each silhouette is hand-clicked along the tightest grain direction of the hide so the vamp creases evenly and retains its architectural shape across years of wear.",
  },
  {
    step: "Stage 03",
    title: "Hand-Lasting & Blake Welt Stitching",
    body: "Uppers are pulled over our proprietary anatomical lasts and allowed to rest before being lock-stitched to stacked leather soles and natural rubber heel toplifts.",
  },
  {
    step: "Stage 04",
    title: "Artisanal Burnishing & Final Inspection",
    body: "Edges are bevelled, hand-painted, and carnauba-wax burnished in our Abuja finishing room before each pair is stamped and packed in breathable cotton dust bags.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Editorial Hero */}
      <section className="bg-[#013E37] text-white py-16 sm:py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFEEB3]">
              The House of DÁMS • Abuja, Nigeria
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.08]">
              A Family Legacy of{" "}
              <span className="text-[#FFEEB3]">Nigerian Shoemaking.</span>
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl leading-relaxed">
              DÁMS was founded in Abuja as a family run manufacturing workshop with a singular discipline: to prove that locally manufactured footwear can stand shoulder-to-shoulder with the finest global ateliers.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden border border-[#FFEEB3]/25 bg-[#012d28]">
              <Image
                src="https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=85"
                alt="Handcrafted DÁMS leather shoes in our Abuja workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Narrative */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
              Why Local Production Matters
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#171C1A] leading-tight">
              Not a Reseller Catalogue. A True Manufacturing House.
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base text-[#171C1A]/85 leading-relaxed">
            <p>
              For decades, West African leather prized globally by luxury houses in Italy and France left our shores raw, only to return as high markup imported footwear poorly suited to our climate and roads.
            </p>
            <p>
              At DÁMS, we keep the value chain home. By uniting Northern Nigerian vegetable tanned hides, solid brass hardware, and our Abuja family workshop, we control every millimetre of quality from the insole rib to the final wax polish.
            </p>
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "100% in-house pattern cutting and lasting in Abuja",
                "Locally tanned full-grain calfskin & kidskin linings",
                "Lifetime resoling & refurbishment service for patrons",
                "Fair artisan wages & multi-generational apprenticeship",
              ].map((item) => (
                <div
                  key={item}
                  className="p-4 bg-[#FAF9F6] border border-[#171C1A]/10 flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#013E37] shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-[#171C1A]">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Stage Shoemaking Process */}
      <section
        id="craftsmanship"
        className="py-20 sm:py-28 bg-[#FAF9F6] border-y border-[#171C1A]/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
              Inside The Workshop
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#171C1A]">
              Four Stages of DÁMS Shoemaking
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white p-7 border border-[#171C1A]/10 flex flex-col justify-between space-y-6"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
                  {item.step}
                </span>
                <div className="space-y-3">
                  <h3 className="font-serif text-xl text-[#171C1A]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#777F7B] leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 bg-[#013E37] text-white">
            <div>
              <h3 className="font-serif text-2xl text-[#FFEEB3]">
                Experience Nigerian Craftsmanship Firsthand
              </h3>
              <p className="mt-1 text-sm text-white/80">
                Explore our permanent collection of derbies, loafers, Chelsea boots, and woven mules.
              </p>
            </div>
            <Link
              href="/collections"
              className="inline-flex items-center gap-3 px-7 py-4 bg-[#FFEEB3] text-[#013E37] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#ffe58f] transition-colors shrink-0"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
