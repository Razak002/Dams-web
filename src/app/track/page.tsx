"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Loader2, Sparkles, Package, CheckCircle2 } from "lucide-react";
import { trackCustomShoeOrder, trackOrder } from "@/lib/api-client";
import { cn, formatNGN } from "@/lib/utils";
import type {
  CustomOrderTrackingData,
  OrderTimelineEntry,
} from "@/types/order";

type TrackMode = "bespoke" | "order";

function TrackPageContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const initialContact = searchParams.get("contact") || "";
  const initialMode: TrackMode =
    initialRef.toUpperCase().startsWith("BESPOKE-") ? "bespoke" : "order";

  const [mode, setMode] = React.useState<TrackMode>(
    initialRef ? initialMode : "bespoke"
  );
  const [reference, setReference] = React.useState(initialRef);
  const [contact, setContact] = React.useState(initialContact);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [bespokeResult, setBespokeResult] =
    React.useState<CustomOrderTrackingData | null>(null);
  const [orderResult, setOrderResult] = React.useState<{
    orderId: string;
    status: string;
    timeline: OrderTimelineEntry[];
    trackingNote?: string;
  } | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !contact.trim()) return;

    setLoading(true);
    setError(null);
    setBespokeResult(null);
    setOrderResult(null);

    if (mode === "bespoke") {
      const res = await trackCustomShoeOrder(
        reference.trim(),
        contact.trim()
      );
      setLoading(false);
      if (res.status === "success" && res.data) {
        setBespokeResult(res.data);
      } else {
        setError(res.message || "Custom shoe request not found.");
      }
      return;
    }

    const res = await trackOrder(reference.trim(), contact.trim());
    setLoading(false);
    if (res.status === "success" && res.data) {
      setOrderResult(res.data);
    } else {
      setError(res.message || "Order not found.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] text-[#171C1A] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Abuja Atelier Tracking
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171C1A]">
            Track Your Order or Bespoke Pair
          </h1>
          <p className="text-sm text-[#777F7B]">
            Enter your reference ID and the email or phone number used when
            placing your request.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F4F5F4] border border-[#171C1A]/5">
            <button
              type="button"
              onClick={() => {
                setMode("bespoke");
                setError(null);
              }}
              className={cn(
                "h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer",
                mode === "bespoke"
                  ? "bg-white text-[#013E37] shadow-xs"
                  : "text-[#777F7B] hover:text-[#171C1A]"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Commission</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("order");
                setError(null);
              }}
              className={cn(
                "h-10 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer",
                mode === "order"
                  ? "bg-white text-[#013E37] shadow-xs"
                  : "text-[#777F7B] hover:text-[#171C1A]"
              )}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Storefront Order</span>
            </button>
          </div>

          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
                  {mode === "bespoke"
                    ? "Bespoke Reference ID"
                    : "Order Reference"}
                </label>
                <input
                  type="text"
                  required
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder={
                    mode === "bespoke" ? "BESPOKE-..." : "DAMS-..."
                  }
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#4A5550] mb-1.5">
                  Email or Phone
                </label>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="you@example.com or 080..."
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EBE7DF] bg-[#F9F7F4]/60 text-sm focus:outline-none focus:border-[#013E37]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{loading ? "Searching..." : "Track Status"}</span>
            </button>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Bespoke Commission Tracking Result */}
        {bespokeResult && (
          <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBE7DF] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#777F7B]">
                  Commission Reference
                </p>
                <p className="font-mono text-base font-bold text-[#013E37]">
                  {bespokeResult.referenceId}
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider">
                {bespokeResult.commissionStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-[#F9F7F4] p-4 rounded-xl border border-[#EBE7DF]">
              <div>
                <p className="text-[#777F7B] uppercase tracking-wider">
                  Material
                </p>
                <p className="font-semibold text-[#171C1A] mt-0.5">
                  {bespokeResult.preferredMaterial}
                </p>
              </div>
              <div>
                <p className="text-[#777F7B] uppercase tracking-wider">Size</p>
                <p className="font-semibold text-[#171C1A] mt-0.5">
                  EU {bespokeResult.size}
                </p>
              </div>
              <div>
                <p className="text-[#777F7B] uppercase tracking-wider">
                  {bespokeResult.quotedPriceNGN ? "Quoted Price" : "Budget"}
                </p>
                <p className="font-semibold text-[#013E37] mt-0.5">
                  {formatNGN(
                    bespokeResult.quotedPriceNGN || bespokeResult.budgetNGN
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#4A5550]">
                Specification Notes
              </p>
              <p className="text-sm text-[#171C1A]/85 leading-relaxed">
                {bespokeResult.description}
              </p>
            </div>

            {bespokeResult.workshopNotes && (
              <div className="p-4 rounded-xl bg-[#013E37]/5 border border-[#013E37]/15 space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#013E37]">
                  Workshop Update
                </p>
                <p className="text-sm text-[#171C1A]">
                  {bespokeResult.workshopNotes}
                </p>
              </div>
            )}

            {bespokeResult.sampleImageUrl && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#4A5550]">
                  Submitted Reference Image
                </p>
                <div className="relative h-64 w-full bg-[#F9F7F4] border border-[#EBE7DF] rounded-xl overflow-hidden">
                  <Image
                    src={bespokeResult.sampleImageUrl}
                    alt={`Reference sample for ${bespokeResult.referenceId}`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Standard Order Tracking Result */}
        {orderResult && (
          <div className="bg-white border border-[#EBE7DF] rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EBE7DF] pb-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#777F7B]">
                  Order Reference
                </p>
                <p className="font-mono text-base font-bold text-[#013E37]">
                  {orderResult.orderId}
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider">
                {orderResult.status.replace(/_/g, " ")}
              </span>
            </div>

            {orderResult.trackingNote && (
              <p className="text-sm text-[#4A5550]">
                {orderResult.trackingNote}
              </p>
            )}

            {Array.isArray(orderResult.timeline) &&
              orderResult.timeline.length > 0 && (
                <div className="space-y-3">
                  {orderResult.timeline.map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-[#013E37] mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-[#171C1A]">
                          {entry.label || entry.stage.replace(/_/g, " ")}
                        </p>
                        {entry.note && (
                          <p className="text-[#777F7B]">{entry.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/collections"
            className="text-xs font-semibold uppercase tracking-wider text-[#013E37] hover:underline"
          >
            ← Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-[#F9F7F4]">
          <Loader2 className="w-7 h-7 animate-spin text-[#013E37]" />
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
