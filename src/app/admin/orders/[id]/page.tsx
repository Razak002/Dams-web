"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  Truck,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  AdminApiError,
  getAdminOrderById,
  updateAdminOrderStatus,
} from "@/lib/admin-api";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin";
import { formatNGN } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";
import { toast } from "sonner";

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderIdParam = params?.id || "";

  const user = useAuthStore((s) => s.user);
  const canTransition =
    user?.role === "SUPER_ADMIN" || user?.role === "WORKSHOP_MANAGER";

  const [order, setOrder] = React.useState<AdminOrder | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);
  const [updating, setUpdating] = React.useState(false);

  // Dispatch Modal
  const [dispatchOpen, setDispatchOpen] = React.useState(false);
  const [dispatchForm, setDispatchForm] = React.useState({
    riderName: "",
    riderPhone: "",
    waybillNumber: "",
    trackingNote: "",
  });

  // Cancel Paid Order Warning Modal
  const [cancelOpen, setCancelOpen] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    async function load() {
      if (!orderIdParam) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminOrderById(orderIdParam);
        if (active) setOrder(res);
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load order details.",
          isForbidden: err instanceof AdminApiError && err.status === 403,
        });
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [orderIdParam]);

  const handleTransition = async (
    nextStatus: AdminOrderStatus,
    extra?: {
      riderName?: string;
      riderPhone?: string;
      waybillNumber?: string;
      trackingNote?: string;
    }
  ) => {
    if (!order) return;
    setUpdating(true);
    setError(null);
    try {
      const updated = await updateAdminOrderStatus(
        order.orderId || order.id,
        {
          status: nextStatus,
          ...extra,
        }
      );
      setOrder(updated);
      setDispatchOpen(false);
      setCancelOpen(false);
      toast.success(`Order updated to ${nextStatus.replace(/_/g, " ")}.`);
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Status transition failed."
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-[#013E37]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading order...</span>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#013E37]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      </div>
    );
  }

  if (!order) return null;

  const isPaidFlow =
    order.status === "PAID" || order.status === "IN_WORKSHOP";

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#013E37] hover:opacity-80"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>

      {/* Header + Valid Next-Step Transition Controls */}
      <div className="bg-white border border-[#171C1A]/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#171C1A]">
              {order.orderId}
            </h1>
            <AdminStatusBadge status={order.status} />
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#171C1A]/15 text-[11px] font-bold uppercase tracking-wider text-[#171C1A]">
              {order.paymentMethod}
            </span>
          </div>
          <p className="text-xs text-[#777F7B] font-mono">
            Ref: {order.paymentReference || order.reference || order.orderId}
          </p>
        </div>

        {canTransition && (
          <div className="flex flex-wrap items-center gap-2.5">
            {order.status === "PAID" && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => handleTransition("IN_WORKSHOP")}
              >
                Move to Workshop
              </Button>
            )}

            {order.status === "IN_WORKSHOP" && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => setDispatchOpen(true)}
              >
                <Truck className="w-4 h-4" />
                <span>Mark Dispatched</span>
              </Button>
            )}

            {order.status === "DISPATCHED" && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                disabled={updating}
                onClick={() => handleTransition("DELIVERED")}
              >
                Mark Delivered
              </Button>
            )}

            {(order.status === "PENDING" ||
              order.status === "PAID" ||
              order.status === "IN_WORKSHOP") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={updating}
                onClick={() =>
                  isPaidFlow
                    ? setCancelOpen(true)
                    : void handleTransition("CANCELLED")
                }
                className="border-red-300 text-red-700 hover:border-red-600 hover:text-red-800"
              >
                Cancel Order
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Fulfilment Issue Alert Banner */}
      {order.fulfilmentIssue && (
        <div className="p-4 bg-red-50 border border-red-300 flex items-start gap-3 text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold uppercase tracking-wider">
              Fulfilment Anomaly: {order.fulfilmentIssue.replace(/_/g, " ")}
            </p>
            <p>
              {order.fulfilmentIssue === "STOCK_CONFLICT"
                ? "Paid order could not deduct stock; restock EU sizes or issue a Paystack refund."
                : order.fulfilmentIssue === "REFUND_REQUIRED"
                  ? "Paid order was cancelled; process Paystack refund to the patron."
                  : "Payment anomaly recorded in paymentLog. Review audit trail below."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Line Items + Timeline + Payment Log */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-[#171C1A]/10">
              <h2 className="font-serif text-xl text-[#171C1A]">
                Ordered Footwear
              </h2>
            </div>
            <div className="divide-y divide-[#171C1A]/10">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.productId}-${item.size}-${idx}`}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div>
                    <p className="font-semibold text-sm text-[#171C1A]">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#777F7B] mt-0.5">
                      {item.colour} • EU {item.size} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-sm text-[#171C1A]">
                    {formatNGN(item.priceAtPurchase * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 bg-[#FAF9F6] border-t border-[#171C1A]/10 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#777F7B]">Subtotal</span>
                <span className="font-semibold">
                  {formatNGN(order.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#777F7B]">Shipping</span>
                <span className="font-semibold">
                  {order.shippingFee === 0
                    ? "Complimentary"
                    : formatNGN(order.shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#013E37] pt-2 border-t border-[#171C1A]/10">
                <span>Total Amount</span>
                <span>{formatNGN(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white border border-[#171C1A]/10 p-6 space-y-4">
            <h2 className="font-serif text-xl text-[#171C1A]">
              Order Timeline
            </h2>
            {order.timeline.length === 0 ? (
              <p className="text-xs text-[#777F7B]">No timeline events yet.</p>
            ) : (
              <ol className="space-y-3 border-l-2 border-[#013E37]/25 pl-4">
                {order.timeline.map((t, i) => (
                  <li key={i} className="space-y-0.5">
                    <p className="text-xs font-bold text-[#013E37]">
                      {t.label || t.stage}
                    </p>
                    {t.note && (
                      <p className="text-xs text-[#171C1A]">{t.note}</p>
                    )}
                    {t.completedAt && (
                      <p className="text-[11px] text-[#777F7B]">
                        {new Date(t.completedAt).toLocaleString("en-NG")}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Payment Log */}
          {order.paymentLog && order.paymentLog.length > 0 && (
            <div className="bg-white border border-[#171C1A]/10 p-6 space-y-3">
              <h2 className="font-serif text-xl text-[#171C1A]">
                Payment Audit Log
              </h2>
              <div className="divide-y divide-[#171C1A]/10 text-xs">
                {order.paymentLog.map((log, i) => (
                  <div key={i} className="py-2.5 flex justify-between gap-4">
                    <div>
                      <p className="font-semibold text-[#171C1A]">
                        {log.event}
                      </p>
                      {log.note && (
                        <p className="text-[#777F7B]">{log.note}</p>
                      )}
                    </div>
                    <span className="text-[#777F7B] shrink-0">
                      {new Date(log.timestamp).toLocaleString("en-NG")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Customer & Dispatch Rider */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#171C1A]/10 p-6 space-y-3 text-xs">
            <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-2">
              Patron &amp; Delivery
            </h2>
            <p className="font-semibold text-sm text-[#171C1A]">
              {order.customerName}
            </p>
            <p className="text-[#777F7B]">{order.customerEmail}</p>
            <p className="text-[#777F7B]">{order.customerPhone}</p>
            <div className="pt-2 border-t border-[#171C1A]/10 space-y-0.5 text-[#171C1A]">
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </p>
            </div>
          </div>

          {(order.dispatch?.riderName ||
            order.riderName ||
            order.dispatch?.waybillNumber ||
            order.waybillNumber ||
            order.dispatch?.trackingNote ||
            order.trackingNote) && (
            <div className="bg-white border border-[#171C1A]/10 p-6 space-y-2 text-xs">
              <h2 className="font-serif text-lg text-[#013E37]">
                Dispatch Tracking
              </h2>
              {(order.dispatch?.riderName || order.riderName) && (
                <p>
                  <strong>Rider:</strong>{" "}
                  {order.dispatch?.riderName || order.riderName} (
                  {order.dispatch?.riderPhone || order.riderPhone})
                </p>
              )}
              {(order.dispatch?.waybillNumber || order.waybillNumber) && (
                <p>
                  <strong>Waybill:</strong>{" "}
                  <span className="font-mono">
                    {order.dispatch?.waybillNumber || order.waybillNumber}
                  </span>
                </p>
              )}
              {(order.dispatch?.trackingNote || order.trackingNote) && (
                <p className="text-[#777F7B]">
                  {order.dispatch?.trackingNote || order.trackingNote}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mark Dispatched Modal */}
      {dispatchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md border border-[#171C1A]/15 shadow-2xl">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#FFEEB3]">
                Dispatch Order {order.orderId}
              </h3>
              <button
                type="button"
                onClick={() => setDispatchOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleTransition("DISPATCHED", dispatchForm);
              }}
              className="p-6 space-y-4"
            >
              <Input
                label="Rider / Courier Name"
                required
                value={dispatchForm.riderName}
                onChange={(e) =>
                  setDispatchForm({
                    ...dispatchForm,
                    riderName: e.target.value,
                  })
                }
              />
              <Input
                label="Rider Phone"
                required
                value={dispatchForm.riderPhone}
                onChange={(e) =>
                  setDispatchForm({
                    ...dispatchForm,
                    riderPhone: e.target.value,
                  })
                }
              />
              <Input
                label="Waybill Number (Optional)"
                value={dispatchForm.waybillNumber}
                onChange={(e) =>
                  setDispatchForm({
                    ...dispatchForm,
                    waybillNumber: e.target.value,
                  })
                }
              />
              <Input
                label="Tracking Note"
                placeholder="e.g. Dispatched from Wuse II Workshop"
                value={dispatchForm.trackingNote}
                onChange={(e) =>
                  setDispatchForm({
                    ...dispatchForm,
                    trackingNote: e.target.value,
                  })
                }
              />
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDispatchOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={updating}>
                  {updating ? "Updating..." : "Confirm Dispatch"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Paid Order Confirmation Warning Modal */}
      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md border border-red-300 shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3 text-red-800">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="font-serif text-xl">Cancel Paid Order?</h3>
                <p className="text-xs mt-1 text-[#777F7B] leading-relaxed">
                  Cancelling this paid order will automatically restore EU size
                  stock in inventory and flag the order as{" "}
                  <strong>REFUND_REQUIRED</strong> for Paystack reconciliation.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCancelOpen(false)}
              >
                Keep Order
              </Button>
              <Button
                type="button"
                variant="primary"
                disabled={updating}
                onClick={() => void handleTransition("CANCELLED")}
                className="bg-red-700 hover:bg-red-800 text-white"
              >
                {updating ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
