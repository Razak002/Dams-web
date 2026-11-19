"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Loader2,
  X,
  AlertTriangle,
  Eye,
} from "lucide-react";
import {
  AdminApiError,
  createManualOrder,
  getAdminOrders,
  getAdminProducts,
} from "@/lib/admin-api";
import type { AdminOrder, AdminProduct } from "@/types/admin";
import { formatNGN, NIGERIAN_STATES } from "@/lib/utils";
import { useAuthStore } from "@/store/use-auth-store";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { toast } from "sonner";
import { Input } from "@/components/ui/Inputs";

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "ALL";

  const user = useAuthStore((s) => s.user);
  const canWriteOrders =
    user?.role === "SUPER_ADMIN" || user?.role === "WORKSHOP_MANAGER";

  const [orders, setOrders] = React.useState<AdminOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = React.useState(initialStatus);
  const [paymentFilter, setPaymentFilter] = React.useState("ALL");
  const [issueFilter, setIssueFilter] = React.useState("ALL");
  const [stateFilter, setStateFilter] = React.useState("ALL");
  const [fromDate, setFromDate] = React.useState("");
  const [toDate, setToDate] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Manual Sale Modal
  const [manualOpen, setManualOpen] = React.useState(false);
  const [catalogProducts, setCatalogProducts] = React.useState<AdminProduct[]>(
    []
  );
  const [manualSubmitting, setManualSubmitting] = React.useState(false);

  const [manualForm, setManualForm] = React.useState({
    paymentMethod: "walk-in" as "whatsapp" | "walk-in",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    street: "",
    city: "Abuja",
    state: "Abuja (FCT)",
    productId: "",
    size: 42,
    colour: "",
    quantity: 1,
    status: "PAID" as "PAID" | "IN_WORKSHOP" | "DELIVERED",
  });

  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const res = await getAdminOrders({
          status: statusFilter,
          paymentMethod: paymentFilter,
          fulfilmentIssue: issueFilter,
          state: stateFilter,
          from: fromDate,
          to: toDate,
          search: searchQuery.trim(),
        });
        if (active) {
          setOrders(res.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        if (err instanceof AdminApiError) {
          setError({ message: err.message, isForbidden: err.status === 403 });
        } else {
          setError({ message: "Unable to load orders.", isForbidden: false });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void run();
    return () => {
      active = false;
    };
  }, [
    statusFilter,
    paymentFilter,
    issueFilter,
    stateFilter,
    fromDate,
    toDate,
    searchQuery,
    refreshTick,
  ]);

  const loadOrders = () => {
    setLoading(true);
    setRefreshTick((t) => t + 1);
  };

  const openManualModal = async () => {
    setManualOpen(true);
    if (catalogProducts.length === 0) {
      try {
        const res = await getAdminProducts({ status: "published", limit: 50 });
        const list = res.data ?? [];
        setCatalogProducts(list);
        if (list[0]) {
          setManualForm((prev) => ({
            ...prev,
            productId: list[0].id,
            size: list[0].sizes[0]?.size || 42,
            colour: list[0].colourways[0]?.name || "",
          }));
        }
      } catch {
        // Ignore
      }
    }
  };

  const selectedProduct = catalogProducts.find(
    (p) => p.id === manualForm.productId
  );

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setManualSubmitting(true);
    try {
      await createManualOrder({
        paymentMethod: manualForm.paymentMethod,
        customerName: manualForm.customerName.trim(),
        customerEmail: manualForm.customerEmail.trim(),
        customerPhone: manualForm.customerPhone.trim(),
        shippingAddress: {
          street:
            manualForm.street.trim() || "Abuja Atelier Walk-In Pickup",
          city: manualForm.city.trim(),
          state: manualForm.state,
        },
        items: [
          {
            productId: manualForm.productId,
            size: Number(manualForm.size),
            colour: manualForm.colour,
            quantity: Number(manualForm.quantity),
          },
        ],
        status: manualForm.status,
      });
      setManualOpen(false);
      toast.success("Manual order logged.");
      await loadOrders();
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to create manual order."
      );
    } finally {
      setManualSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Fulfilment &amp; Logistics
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Orders &amp; Dispatch
          </h1>
        </div>

        {canWriteOrders && (
          <Button
            type="button"
            variant="primary"
            onClick={openManualModal}
            className="text-xs uppercase tracking-wider font-bold self-start"
          >
            <Plus className="w-4 h-4" />
            <span>Log Manual Sale</span>
          </Button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#171C1A]/10 p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ORD-..., email, name..."
              className="h-11 w-full pl-9 pr-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by order status"
            className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white focus:border-[#013E37] focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="IN_WORKSHOP">IN WORKSHOP</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="FAILED">FAILED</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            aria-label="Filter by payment method"
            className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white focus:border-[#013E37] focus:outline-none"
          >
            <option value="ALL">All Channels</option>
            <option value="paystack">Paystack</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="walk-in">Abuja Walk-In</option>
          </select>

          <select
            value={issueFilter}
            onChange={(e) => setIssueFilter(e.target.value)}
            aria-label="Filter by fulfilment issue"
            className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white focus:border-[#013E37] focus:outline-none"
          >
            <option value="ALL">All Fulfilment Health</option>
            <option value="STOCK_CONFLICT">⚠ STOCK CONFLICT</option>
            <option value="REFUND_REQUIRED">⚠ REFUND REQUIRED</option>
            <option value="AMOUNT_MISMATCH">⚠ AMOUNT MISMATCH</option>
            <option value="PAID_AFTER_CANCEL">⚠ PAID AFTER CANCEL</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            aria-label="Filter by Nigerian state"
            className="h-10 px-3 border border-[#171C1A]/20 text-xs bg-white focus:border-[#013E37] focus:outline-none"
          >
            <option value="ALL">All Nigerian States</option>
            {NIGERIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="From date"
            className="h-10 px-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="To date"
            className="h-10 px-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      {/* Orders Table */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#013E37]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading orders...
            </span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No orders match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Patron</th>
                  <th className="py-3.5 px-5">Destination</th>
                  <th className="py-3.5 px-5">Channel</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Total</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {orders.map((ord) => (
                  <tr
                    key={ord.id || ord.orderId}
                    className={
                      ord.fulfilmentIssue
                        ? "bg-red-50/40 hover:bg-red-50/70"
                        : "hover:bg-[#FAF9F6]/70"
                    }
                  >
                    <td className="py-3.5 px-5">
                      <Link
                        href={`/admin/orders/${ord.orderId || ord.id}`}
                        className="font-mono text-xs font-bold text-[#013E37] hover:underline"
                      >
                        {ord.orderId}
                      </Link>
                      {ord.fulfilmentIssue && (
                        <div className="mt-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          <AdminStatusBadge status={ord.fulfilmentIssue} />
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-xs text-[#171C1A]">
                        {ord.customerName}
                      </p>
                      <p className="text-[11px] text-[#777F7B]">
                        {ord.customerPhone}
                      </p>
                    </td>
                    <td className="py-3.5 px-5 text-xs text-[#171C1A]">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                    </td>
                    <td className="py-3.5 px-5 text-xs uppercase font-semibold text-[#777F7B]">
                      {ord.paymentMethod}
                    </td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge status={ord.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right font-bold text-xs text-[#171C1A]">
                      {formatNGN(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/orders/${ord.orderId || ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#013E37] hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Manual Sale Modal */}
      {manualOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl border border-[#171C1A]/15 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h2 className="font-serif text-xl text-[#FFEEB3]">
                Log Manual Sale (Walk-In / WhatsApp)
              </h2>
              <button
                type="button"
                onClick={() => setManualOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleManualSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Channel
                  </label>
                  <select
                    value={manualForm.paymentMethod}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        paymentMethod: e.target.value as "whatsapp" | "walk-in",
                      })
                    }
                    className="h-11 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                  >
                    <option value="walk-in">Abuja Walk-In (₦0 Ship)</option>
                    <option value="whatsapp">WhatsApp Concierge</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={manualForm.status}
                    onChange={(e) =>
                      setManualForm({
                        ...manualForm,
                        status: e.target.value as
                          | "PAID"
                          | "IN_WORKSHOP"
                          | "DELIVERED",
                      })
                    }
                    className="h-11 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                  >
                    <option value="PAID">PAID</option>
                    <option value="IN_WORKSHOP">IN WORKSHOP</option>
                    <option value="DELIVERED">DELIVERED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Patron Name"
                  required
                  value={manualForm.customerName}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      customerName: e.target.value,
                    })
                  }
                />
                <Input
                  label="Phone"
                  required
                  value={manualForm.customerPhone}
                  onChange={(e) =>
                    setManualForm({
                      ...manualForm,
                      customerPhone: e.target.value,
                    })
                  }
                />
              </div>

              <Input
                label="Email"
                type="email"
                required
                value={manualForm.customerEmail}
                onChange={(e) =>
                  setManualForm({
                    ...manualForm,
                    customerEmail: e.target.value,
                  })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input
                  label="Street / Note"
                  value={manualForm.street}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, street: e.target.value })
                  }
                />
                <Input
                  label="City"
                  required
                  value={manualForm.city}
                  onChange={(e) =>
                    setManualForm({ ...manualForm, city: e.target.value })
                  }
                />
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    State
                  </label>
                  <select
                    value={manualForm.state}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, state: e.target.value })
                    }
                    className="h-12 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Line Item */}
              <div className="p-4 bg-[#FAF9F6] border border-[#171C1A]/10 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider">
                  Footwear Pair
                </label>
                <select
                  value={manualForm.productId}
                  onChange={(e) => {
                    const prod = catalogProducts.find(
                      (p) => p.id === e.target.value
                    );
                    setManualForm({
                      ...manualForm,
                      productId: e.target.value,
                      size: prod?.sizes[0]?.size || 42,
                      colour: prod?.colourways[0]?.name || "",
                    });
                  }}
                  className="h-11 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                >
                  {catalogProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {formatNGN(p.price)}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">
                      EU Size
                    </label>
                    <select
                      value={manualForm.size}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          size: Number(e.target.value),
                        })
                      }
                      className="h-10 w-full px-2 border border-[#171C1A]/20 text-xs bg-white"
                    >
                      {(selectedProduct?.sizes || []).map((s) => (
                        <option key={s.size} value={s.size}>
                          EU {s.size} ({s.stock} left)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">
                      Colourway
                    </label>
                    <select
                      value={manualForm.colour}
                      onChange={(e) =>
                        setManualForm({ ...manualForm, colour: e.target.value })
                      }
                      className="h-10 w-full px-2 border border-[#171C1A]/20 text-xs bg-white"
                    >
                      {(selectedProduct?.colourways || []).map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={manualForm.quantity}
                      onChange={(e) =>
                        setManualForm({
                          ...manualForm,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="h-10 w-full px-2 border border-[#171C1A]/20 text-xs bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setManualOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={manualSubmitting}
                >
                  {manualSubmitting ? "Logging Sale..." : "Create Manual Order"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#013E37]" />
        </div>
      }
    >
      <AdminOrdersContent />
    </Suspense>
  );
}
