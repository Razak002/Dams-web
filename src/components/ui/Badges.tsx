import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "brand" | "accent" | "neutral" | "outline" | "stock";
}

export function Badge({
  className,
  variant = "neutral",
  children,
  ...props
}: BadgeProps) {
  const variants: Record<NonNullable<BadgeProps["variant"]>, string> = {
    brand: "bg-[#013E37] text-[#FFEEB3]",
    accent: "bg-[#FFEEB3] text-[#013E37]",
    neutral: "bg-[#F4F5F4] text-[#171C1A]",
    outline: "border border-[#171C1A]/20 text-[#777F7B]",
    stock: "bg-emerald-950/10 text-[#013E37] border border-[#013E37]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
