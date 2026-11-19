import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-[#013E37] text-[#FFEEB3] hover:bg-[#025249] active:bg-[#012d28] border border-transparent",
      secondary:
        "bg-[#FFEEB3] text-[#013E37] hover:bg-[#ffe58f] active:bg-[#f5d97e] border border-transparent font-semibold",
      outline:
        "bg-transparent text-[#171C1A] border border-[#171C1A]/25 hover:border-[#013E37] hover:text-[#013E37]",
      ghost:
        "bg-transparent text-[#171C1A] hover:bg-[#171C1A]/5 border border-transparent",
    };

    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-9 px-4 text-xs tracking-wider uppercase",
      md: "h-12 px-6 text-sm tracking-wide",
      lg: "h-14 px-8 text-base tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#013E37] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45 cursor-pointer",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
