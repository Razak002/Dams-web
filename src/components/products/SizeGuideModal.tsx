"use client";

import * as React from "react";
import { X, Ruler, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { backdropFade } from "@/lib/animations";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { eu: 37, uk: 4, cm: "23.5 cm", fit: "Women's Standard" },
  { eu: 38, uk: 5, cm: "24.1 cm", fit: "Unisex / Women's" },
  { eu: 39, uk: 6, cm: "24.8 cm", fit: "Unisex" },
  { eu: 40, uk: 6.5, cm: "25.4 cm", fit: "Men's / Unisex" },
  { eu: 41, uk: 7.5, cm: "26.0 cm", fit: "Men's Standard" },
  { eu: 42, uk: 8, cm: "26.7 cm", fit: "Men's Standard" },
  { eu: 43, uk: 9, cm: "27.3 cm", fit: "Men's Standard" },
  { eu: 44, uk: 9.5, cm: "28.0 cm", fit: "Men's Wide / Tall" },
  { eu: 45, uk: 10.5, cm: "28.6 cm", fit: "Men's Extended" },
  { eu: 46, uk: 11, cm: "29.3 cm", fit: "Men's Extended" },
];

export function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={backdropFade}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-[#171C1A]/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            role="dialog"
            aria-modal="true"
            aria-label="DÁMS Size and Last Guide"
            className="relative z-10 w-full max-w-2xl bg-white text-[#171C1A] shadow-2xl border border-[#171C1A]/15 overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 bg-[#013E37] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Ruler className="w-5 h-5 text-[#FFEEB3]" />
                <h3 className="font-serif text-xl text-[#FFEEB3]">
                  DÁMS Last & Sizing Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-white/80 hover:text-[#FFEEB3] cursor-pointer"
                aria-label="Close size guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="text-sm text-[#777F7B] leading-relaxed">
                DÁMS footwear is lasted to true European (EU) specifications with a slightly generous instep tailored for West African comfort. If you wear a half-size or have a wide forefoot, we recommend selecting the next EU size up.
              </p>

              <div className="overflow-x-auto border border-[#171C1A]/15">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-[#F7F7F5] border-b border-[#171C1A]/15 text-xs uppercase tracking-wider text-[#171C1A]">
                      <th className="py-3 px-4 font-semibold">EU Size</th>
                      <th className="py-3 px-4 font-semibold">UK Size</th>
                      <th className="py-3 px-4 font-semibold">Foot Length</th>
                      <th className="py-3 px-4 font-semibold">Last Profile</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#171C1A]/10">
                    {SIZE_CHART.map((row) => (
                      <tr key={row.eu} className="hover:bg-[#FAF9F6]">
                        <td className="py-2.5 px-4 font-semibold">EU {row.eu}</td>
                        <td className="py-2.5 px-4 text-[#777F7B]">UK {row.uk}</td>
                        <td className="py-2.5 px-4">{row.cm}</td>
                        <td className="py-2.5 px-4 text-xs text-[#777F7B]">
                          {row.fit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-[#FAF9F6] border border-[#013E37]/20 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#013E37] shrink-0 mt-0.5" />
                <div className="text-xs text-[#171C1A] space-y-1">
                  <p className="font-semibold uppercase tracking-wider">
                    Complimentary 14-Day Exchange Guarantee
                  </p>
                  <p className="text-[#777F7B]">
                    Every order includes one complimentary size exchange within Nigeria so you can try your pair indoors on a carpeted surface with complete peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
