"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, Hammer, Compass } from "lucide-react";
import { motion } from "motion/react";
import { fadeUp, staggerContainer } from "@/lib/animations";
import { CustomShoeRequestWizard } from "@/components/home/CustomShoeRequestWizard";

const MATERIAL_PILLARS = [
  {
    icon: Layers,
    number: "01",
    title: "Vegetable-Tanned Sokoto Calfskin",
    description:
      "We select full-grain hides from trusted Northern Nigerian tanneries, drum-dyed and hand-burnished in Abuja so each pair develops a rich personal patina over years of wear.",
  },
  {
    icon: Hammer,
    number: "02",
    title: "360° Blake-Stitched & Resoleable",
    description:
      "Unlike disposable cemented imports, our dress derbies and loafers unite the upper, insole, and outsole with a mechanical lock-stitch that can be resoled by our workshop.",
  },
  {
    icon: Compass,
    number: "03",
    title: "Engineered for West African Climate",
    description:
      "Breathable kidskin linings, moisture-wicking vegetable leather footbeds, and high-grip natural rubber heel toplifts keep you steady through humid heat and tropical rain.",
  },
];

export function BrandStory() {
  return (
    <>
      {/* 1. Brand Story & Local Craftsmanship Section (Neutral Editorial Background) */}
      <section className="py-14 sm:py-28 bg-[#FAF9F6] border-y border-[#171C1A]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Editorial Visual */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[5/6] w-full overflow-hidden bg-[#171C1A] border border-[#171C1A]/15">
                <Image
                  src="https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1200&q=85"
                  alt="Artisan hand-lasting leather shoes at the DÁMS Abuja workshop"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              <div className="relative sm:absolute -mt-10 mx-4 sm:mx-0 sm:mt-0 sm:-bottom-6 sm:-right-6 z-10 bg-[#013E37] text-white p-5 sm:p-6 sm:max-w-xs shadow-xl border border-[#FFEEB3]/20">
                <p className="font-serif text-lg sm:text-xl text-[#FFEEB3]">
                  “A serious footwear house built at home.”
                </p>
                <p className="mt-1.5 text-xs text-white/75 leading-relaxed">
                  Every pair passes through 14 master lasters, pattern cutters, and finishers in Abuja before earning the DÁMS stamp.
                </p>
              </div>
            </div>

            {/* Editorial Copy */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="lg:col-span-6 space-y-6"
            >
              <motion.p
                variants={fadeUp}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]"
              >
                Our Heritage • Abuja-Based Nigerian Manufacturing
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171C1A] leading-[1.12]"
              >
                Crafted in Abuja. Worn Across Continents.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="text-base text-[#171C1A]/85 leading-relaxed"
              >
                DÁMS began with a straightforward conviction: Nigeria possesses both the raw leather heritage and the generational shoemaking skill to produce world-class footwear without outsourcing its soul.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="text-sm text-[#777F7B] leading-relaxed"
              >
                In our Abuja factory, traditional wooden lasts meet contemporary architectural silhouettes. We do not re-label generic imports — we cut every pattern, skive every seam, and burnish every sole in-house.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="pt-4 grid grid-cols-2 gap-6 border-t border-[#171C1A]/10"
              >
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                    Direct Workshop Value
                  </h3>
                  <p className="mt-1 text-xs text-[#777F7B] leading-relaxed">
                    European-grade Blake construction without international import duties or middleman markups.
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                    In-House Refurbishment
                  </h3>
                  <p className="mt-1 text-xs text-[#777F7B] leading-relaxed">
                    Send your well-worn DÁMS pairs back to our Abuja atelier for resoling and patina restoration.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="pt-2">
                <Link
                  href="/about"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-4 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#025249] transition-colors"
                >
                  <span>Read Our Full Story</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Material Detail Feature */}
      <section className="py-14 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
              Material & Construction Anatomy
            </p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-[#171C1A]">
              Dependable Craftsmanship in Every Layer
            </h2>
          </div>

          <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
            {MATERIAL_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.number}
                  className="p-6 sm:p-8 bg-[#FAF9F6] border border-[#171C1A]/10 flex flex-col justify-between space-y-5 sm:space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl text-[#013E37]">
                      {pillar.number}
                    </span>
                    <div className="w-10 h-10 bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <h3 className="font-serif text-xl text-[#171C1A]">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-[#777F7B] leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Bespoke / Custom Shoe Request Wizard */}
      <CustomShoeRequestWizard />
    </>
  );
}
