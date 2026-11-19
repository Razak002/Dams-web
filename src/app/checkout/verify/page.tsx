"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { verifyOrder } from "@/lib/api-client";
import { useCartStore } from "@/store/use-cart-store";
import { formatNGN } from "@/lib/utils";
import type { VerifyOrderResponse } from "@/types/order";

function VerifyOrderContent() {
  const searchParams = useSearchParams();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";
  const amountParam = Number(searchParams.get("amount")) || undefined;

  const clearCart = useCartStore((s) => s.clearCart);
  const [loading, setLoading] = React.useState(() => Boolean(reference));
  const [order, setOrder] = React.useState<VerifyOrderResponse | null>(null);

  React.useEffect(() => {
    if (!reference) return;
    let active = true;

    async function checkPayment() {
      const result = await verifyOrder(reference, amountParam);
      if (!active) return;

      setOrder(result);
      setLoading(false);

      if (result.status === "PAID" || result.status === "success") {
        clearCart();
      }
    }

    checkPayment();
    return () => {
      active = false;
    };
  }, [reference, amountParam, clearCart]);

  if (loading) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-9 h-9 text-[#013E37] animate-spin" />
        <h1 className="font-serif text-2xl text-[#171C1A]">
          Verifying Your Payment with Paystack...
        </h1>
        <p className="text-sm text-[#777F7B]">
          Reference: <span className="font-mono">{reference}</span>
        </p>
      </div>
    );
  }

  const isFailed =
    !reference ||
    !order ||
    order.status === "FAILED" ||
    order.status === "failed";

  if (isFailed) {
    return (
      <div className="min-h-[65vh] max-w-lg mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-red-700 flex items-center justify-center">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl text-[#171C1A]">
          Payment Verification Incomplete
        </h1>
        <p className="text-sm text-[#777F7B]">
          We could not confirm a completed transaction for reference{" "}
          <span className="font-mono text-[#171C1A]">
            {reference || "N/A"}
          </span>
          . Your bag has been preserved so you can try again or contact our Abuja concierge.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/checkout"
            className="px-6 py-3.5 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Return to Checkout
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3.5 border border-[#171C1A]/25 text-[#171C1A] text-xs font-semibold uppercase tracking-[0.16em]"
          >
            Contact Concierge
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-[75vh] py-16 px-4">
      <div className="max-w-xl mx-auto bg-white border border-[#171C1A]/15 p-8 sm:p-10 space-y-6">
        <div className="w-14 h-14 bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Order Confirmed • Abuja Atelier
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A]">
            Thank You for Your Commission
          </h1>
          <p className="text-sm text-[#777F7B] leading-relaxed">
            Your payment has been verified and our Abuja workshop is preparing your pair for quality inspection and dispatch.
          </p>
        </div>

        <dl className="p-5 bg-[#FAF9F6] border border-[#171C1A]/10 space-y-3 text-xs">
          <div className="flex justify-between">
            <dt className="text-[#777F7B] uppercase tracking-wider">
              Order Number
            </dt>
            <dd className="font-mono font-semibold text-[#171C1A]">
              {order.orderId}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#777F7B] uppercase tracking-wider">
              Paystack Reference
            </dt>
            <dd className="font-mono text-[#171C1A]">{order.reference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#777F7B] uppercase tracking-wider">
              Amount Paid
            </dt>
            <dd className="font-bold text-[#013E37]">
              {formatNGN(order.totalAmount)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#777F7B] uppercase tracking-wider">
              Order Status
            </dt>
            <dd className="font-semibold text-[#013E37] uppercase">
              {order.status}
            </dd>
          </div>
        </dl>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/collections"
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 px-6 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#025249] transition-colors"
          >
            <span>Continue Exploring</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-12 px-6 border border-[#171C1A]/20 text-xs font-semibold uppercase tracking-[0.16em] text-[#171C1A] hover:border-[#013E37]"
          >
            Need Assistance?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[65vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#013E37] animate-spin" />
        </div>
      }
    >
      <VerifyOrderContent />
    </Suspense>
  );
}
