import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse bg-[#171C1A]/[0.06]", className)}
      aria-hidden="true"
    />
  );
}

export function DamsBrandLoader({
  label = "Loading DÁMS Atelier…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-[60vh] w-full flex flex-col items-center justify-center gap-3.5 px-4 text-[#013E37]",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="w-12 h-12 rounded-full bg-[#013E37]/10 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#013E37]" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4A5550]">
        {label}
      </p>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full" />
              ))}
            </div>
          </div>
          <Skeleton className="h-14 w-full" />
        </div>
      </div>
    </div>
  );
}

export function AccountSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F7F4] py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#EBE7DF] p-6 space-y-6">
            <div className="flex flex-col items-center gap-3 pb-4 border-b border-[#EBE7DF]">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-lg" />
              <Skeleton className="h-4 w-48 rounded-lg" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-full rounded-xl" />
              ))}
            </div>
          </div>
          <div className="lg:col-span-7 bg-white rounded-3xl border border-[#EBE7DF] p-6 sm:p-8 space-y-5">
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Skeleton className="h-11 w-full rounded-xl" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-9 w-64" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full border border-[#171C1A]/10" />
        ))}
      </div>
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
