"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: {
    url: string;
    alt: string;
    angle: string;
  }[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Studio Frame */}
      <div className="relative aspect-[4/5] w-full bg-[#F7F7F5] border border-[#171C1A]/10 overflow-hidden">
        <Image
          src={activeImage.url}
          alt={activeImage.alt || productName}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover object-center transition-all duration-500"
        />

        <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-white/90 backdrop-blur-xs border border-[#171C1A]/10 text-[11px] uppercase tracking-[0.14em] text-[#171C1A]">
          {activeImage.angle}
        </div>
      </div>

      {/* Multi-Angle Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={img.url + index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "relative aspect-square bg-[#F7F7F5] overflow-hidden border transition-all cursor-pointer",
                  isActive
                    ? "border-[#013E37] ring-2 ring-[#013E37]/30"
                    : "border-[#171C1A]/10 opacity-70 hover:opacity-100"
                )}
                aria-label={`View ${img.angle}`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
