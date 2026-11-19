"use client";

import * as React from "react";
import { Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Search,
  Eye,
  X,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  AdminApiError,
  getAdminCustomOrders,
  updateAdminCustomOrder,
} from "@/lib/admin-api";
import type { AdminCustomOrder } from "@/types/admin";
import type { CustomOrderCommissionStatus } from "@/types/order";
import { cn, formatNGN, formatWhatsAppPhone } from "@/lib/utils";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";

const COMMISSION_STATUSES: (CustomOrderCommissionStatus | "ALL")[] = [
  "ALL",
  "NEW",
  "REVIEWING",
  "QUOTED",
  "IN_PRODUCTION",
  "READY_FOR_DISPATCH",
  "DELIVERED",
  "DECLINED",
];

const PIPELINE_STEPS: CustomOrderCommissionStatus[] = [
  "NEW",
  "REVIEWING",
  "QUOTED",
  "IN_PRODUCTION",
  "READY_FOR_DISPATCH",
  "DELIVERED",
];

const NEXT_STAGE_MAP: Partial<
  Record<
    CustomOrderCommissionStatus,
    { next: CustomOrderCommissionStatus; label: string; guidance: string }
  >
> = {
  NEW: {
    next: "REVIEWING",
    label: "Start Workshop Review",
    guidance:
      "Inspect the patron's specs, size, and reference image. Move to Reviewing while confirming leather/material availability.",
  },
  REVIEWING: {
    next: "QUOTED",
    label: "Send Quote & Deposit Link",
    guidance:
      "Confirm the Quoted Price (₦ NGN), tick 'Generate Paystack Deposit Link', and save as Quoted so the patron can pay their deposit.",
  },
  QUOTED: {
    next: "IN_PRODUCTION",
    label: "Begin Production",
    guidance:
      "Share the Paystack Deposit Link with the patron below. Once their deposit is confirmed, advance to In Production.",
  },
  IN_PRODUCTION: {
    next: "READY_FOR_DISPATCH",
    label: "Mark Ready for Dispatch",
    guidance:
      "Pair is being crafted in the Abuja workshop. Once finishing and QC are complete, advance to Ready for Dispatch.",
  },
  READY_FOR_DISPATCH: {
    next: "DELIVERED",
    label: "Mark Delivered",
    guidance:
      "Coordinate delivery or atelier pickup with the patron, then mark Delivered once handed over.",
  },
};

function AdminCustomOrdersContent() {
  const searchParams = useSearchParams();
  const initialStatus =
    (searchParams.get("status") as CustomOrderCommissionStatus) || "ALL";

  const [statusFilter, setStatusFilter] = React.useState<
    CustomOrderCommissionStatus | "ALL"
  >(
    COMMISSION_STATUSES.includes(initialStatus) ? initialStatus : "ALL"
  );
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState<AdminCustomOrder[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  // Selected detail modal
  const [selected, setSelected] = React.useState<AdminCustomOrder | null>(null);
  const [commissionStatus, setCommissionStatus] =
    React.useState<CustomOrderCommissionStatus>("NEW");
  const [quotedPriceNGN, setQuotedPriceNGN] = React.useState("");
  const [workshopNotes, setWorkshopNotes] = React.useState("");
  const [generateDepositLink, setGenerateDepositLink] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const res = await getAdminCustomOrders({
          status: statusFilter,
          search: search.trim() || undefined,
        });
        if (active) {
          setItems(res.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load custom shoe commissions.",
          isForbidden: err instanceof AdminApiError && err.status === 403,
        });
      } finally {
        if (active) setLoading(false);
      }
    }
    void run();
    return () => {
      active = false;
    };
  }, [statusFilter, search]);

  const openDetail = (item: AdminCustomOrder) => {
    setSelected(item);
    setCommissionStatus(item.commissionStatus);
    setQuotedPriceNGN(
      item.quotedPriceNGN ? String(item.quotedPriceNGN) : String(item.budgetNGN)
    );
    setWorkshopNotes(item.workshopNotes || "");
    setGenerateDepositLink(false);
    setCopiedLink(false);
  };

  const handleUpdate = async (
    e: React.FormEvent,
    overrideStatus?: CustomOrderCommissionStatus,
    overrideGenerateDeposit?: boolean
  ) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);

    const nextStatus = overrideStatus ?? commissionStatus;
    const shouldGenerateDeposit =
      overrideGenerateDeposit ?? generateDepositLink;

    try {
      const updated = await updateAdminCustomOrder(
        selected.referenceId || selected.id,
        {
          commissionStatus: nextStatus,
          quotedPriceNGN: quotedPriceNGN ? Number(quotedPriceNGN) : undefined,
          workshopNotes: workshopNotes.trim() || undefined,
          generateDepositLink: shouldGenerateDeposit,
        }
      );
      setItems((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      setSelected(updated);
      setCommissionStatus(updated.commissionStatus);
      setGenerateDepositLink(false);
      toast.success(
        `Commission ${updated.referenceId} updated to ${updated.commissionStatus.replace(/_/g, " ")}.`
      );
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to update commission."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCopyDepositLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      toast.success("Paystack deposit link copied to clipboard.");
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error("Unable to copy link.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
          Abuja Bespoke Pipeline
        </p>
        <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
          Custom Shoe Commissions
        </h1>
        <p className="text-xs text-[#777F7B] mt-1.5">
          Workflow: <strong>New</strong> → <strong>Reviewing</strong> →{" "}
          <strong>Quoted</strong> (generate &amp; share Paystack deposit link) →{" "}
          <strong>In Production</strong> →{" "}
          <strong>Ready for Dispatch</strong> → <strong>Delivered</strong>
        </p>
      </div>

      {/* Status Tabs & Search */}
      <div className="bg-white border border-[#171C1A]/10 p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {COMMISSION_STATUSES.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer",
                statusFilter === st
                  ? "bg-[#013E37] text-[#FFEEB3]"
                  : "bg-[#FAF9F6] text-[#171C1A] hover:bg-[#171C1A]/10"
              )}
            >
              {st.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BESPOKE-..., patron name, material..."
            className="h-10 w-full pl-9 pr-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      {/* List */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#013E37]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading bespoke requests...
            </span>
          </div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No custom shoe commissions match this filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Reference</th>
                  <th className="py-3.5 px-5">Patron</th>
                  <th className="py-3.5 px-5">Material &amp; Size</th>
                  <th className="py-3.5 px-5">Budget / Quote</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {items.map((item) => (
                  <tr key={item.id || item.referenceId} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-[#013E37]">
                      {item.referenceId}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-xs text-[#171C1A]">
                        {item.fullName}
                      </p>
                      <p className="text-[11px] text-[#777F7B]">
                        {item.locationCity}, {item.locationState}
                      </p>
                    </td>
                    <td className="py-3.5 px-5 text-xs">
                      <p className="font-medium text-[#171C1A]">
                        {item.preferredMaterial}
                      </p>
                      <p className="text-[11px] text-[#777F7B]">
                        EU {item.size}
                      </p>
                    </td>
                    <td className="py-3.5 px-5 text-xs">
                      <p className="font-bold text-[#171C1A]">
                        {formatNGN(item.budgetNGN)}
                      </p>
                      {item.quotedPriceNGN && (
                        <p className="text-[11px] text-[#013E37] font-semibold">
                          Quoted: {formatNGN(item.quotedPriceNGN)}
                        </p>
                      )}
                    </td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge status={item.commissionStatus} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => openDetail(item)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#013E37] hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Commission Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl border border-[#171C1A]/15 shadow-2xl max-h-[92vh] flex flex-col">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#FFEEB3]">
                {selected.referenceId} — {selected.fullName}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Visual Pipeline Stepper */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  {PIPELINE_STEPS.map((step, idx) => {
                    const currentIdx = PIPELINE_STEPS.indexOf(
                      selected.commissionStatus
                    );
                    const isCurrent = selected.commissionStatus === step;
                    const isCompleted =
                      currentIdx !== -1 && idx < currentIdx;
                    return (
                      <React.Fragment key={step}>
                        <span
                          className={cn(
                            "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border",
                            isCurrent
                              ? "bg-[#013E37] text-[#FFEEB3] border-[#013E37]"
                              : isCompleted
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-[#FAF9F6] text-[#777F7B] border-[#171C1A]/10"
                          )}
                        >
                          {idx + 1}. {step.replace(/_/g, " ")}
                        </span>
                        {idx < PIPELINE_STEPS.length - 1 && (
                          <span className="text-[#777F7B] text-xs">→</span>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {selected.commissionStatus === "DECLINED" && (
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-red-50 text-red-700 border-red-200">
                      DECLINED
                    </span>
                  )}
                </div>

                {/* What's Next Guidance + Quick Advance */}
                {(() => {
                  const nextInfo = NEXT_STAGE_MAP[selected.commissionStatus];
                  if (!nextInfo) return null;
                  const shouldAutoDeposit =
                    nextInfo.next === "QUOTED" && !selected.depositPaymentUrl;
                  return (
                    <div className="p-3.5 bg-[#013E37]/5 border border-[#013E37]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-0.5">
                        <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#013E37]">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Next Step</span>
                        </p>
                        <p className="text-xs text-[#171C1A]/85 leading-relaxed">
                          {nextInfo.guidance}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="primary"
                        disabled={saving}
                        onClick={(e) =>
                          handleUpdate(e, nextInfo.next, shouldAutoDeposit)
                        }
                        className="text-[11px] uppercase tracking-wider font-bold shrink-0"
                      >
                        <span>{nextInfo.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })()}
              </div>

              {/* Patron Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF9F6] border border-[#171C1A]/10 text-xs">
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[#013E37]">
                    Patron Contact
                  </p>
                  <p className="font-semibold text-[#171C1A]">
                    {selected.fullName}
                  </p>
                  <p className="text-[#777F7B]">{selected.email}</p>
                  <p className="text-[#777F7B]">{selected.phone}</p>
                  <p className="text-[#171C1A]">
                    {selected.locationCity}, {selected.locationState}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[#013E37]">
                    Pair Specifications
                  </p>
                  <p>
                    <strong>Material:</strong> {selected.preferredMaterial}
                  </p>
                  <p>
                    <strong>Size:</strong> EU {selected.size}
                  </p>
                  <p>
                    <strong>Proposed Budget:</strong>{" "}
                    {formatNGN(selected.budgetNGN)}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#171C1A]">
                  Customer Description
                </p>
                <p className="text-sm text-[#171C1A]/85 leading-relaxed bg-[#FAF9F6] p-4 border border-[#171C1A]/10">
                  {selected.description}
                </p>
              </div>

              {selected.sampleImageUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#171C1A]">
                    Uploaded Reference Image
                  </p>
                  <div className="relative h-56 w-full bg-[#FAF9F6] border border-[#171C1A]/10 overflow-hidden">
                    <Image
                      src={selected.sampleImageUrl}
                      alt="Customer reference sample"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Workshop Form */}
              <form
                onSubmit={handleUpdate}
                className="pt-4 border-t border-[#171C1A]/10 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                      Commission Status
                    </label>
                    <select
                      value={commissionStatus}
                      onChange={(e) =>
                        setCommissionStatus(
                          e.target.value as CustomOrderCommissionStatus
                        )
                      }
                      className="h-12 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                    >
                      {COMMISSION_STATUSES.filter((s) => s !== "ALL").map(
                        (st) => (
                          <option key={st} value={st}>
                            {st.replace(/_/g, " ")}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <Input
                    label="Quoted Price (₦ NGN)"
                    type="number"
                    min={1000}
                    value={quotedPriceNGN}
                    onChange={(e) => setQuotedPriceNGN(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Workshop Notes
                  </label>
                  <textarea
                    rows={3}
                    value={workshopNotes}
                    onChange={(e) => setWorkshopNotes(e.target.value)}
                    placeholder="Hide selection, last notes, estimated completion..."
                    className="w-full p-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateDepositLink}
                    onChange={(e) => setGenerateDepositLink(e.target.checked)}
                    className="accent-[#013E37] w-4 h-4"
                  />
                  <span>Generate Paystack Deposit Link for Patron</span>
                </label>

                {selected.depositPaymentUrl && (
                  <div className="p-4 bg-[#FAF9F6] border border-[#013E37]/25 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold uppercase tracking-wider text-[#013E37]">
                        Paystack Deposit Link Ready
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyDepositLink(selected.depositPaymentUrl!)
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#013E37]/30 bg-white text-[#013E37] font-semibold hover:bg-[#013E37]/5 cursor-pointer"
                        >
                          {copiedLink ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedLink ? "Copied" : "Copy Link"}</span>
                        </button>
                        <a
                          href={selected.depositPaymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#013E37]/30 bg-white text-[#013E37] font-semibold hover:bg-[#013E37]/5"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        {selected.phone && (
                          <a
                            href={`https://wa.me/${formatWhatsAppPhone(selected.phone)}?text=${encodeURIComponent(
                              `Hello ${selected.fullName}, your DÁMS bespoke commission (${selected.referenceId}) has been quoted at ${formatNGN(
                                selected.quotedPriceNGN || selected.budgetNGN
                              )}. Complete your deposit here: ${selected.depositPaymentUrl}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#013E37] text-[#FFEEB3] font-semibold hover:bg-[#025249]"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp Patron</span>
                          </a>
                        )}
                        {selected.email && (
                          <a
                            href={`mailto:${encodeURIComponent(selected.email)}?subject=${encodeURIComponent(
                              `DÁMS Bespoke Commission Quote — ${selected.referenceId}`
                            )}&body=${encodeURIComponent(
                              `Hello ${selected.fullName},\n\nYour DÁMS bespoke commission (${selected.referenceId}) has been quoted at ${formatNGN(
                                selected.quotedPriceNGN || selected.budgetNGN
                              )}.\n\nPlease complete your deposit using this Paystack link:\n${selected.depositPaymentUrl}\n\nThank you,\nDÁMS Abuja Atelier`
                            )}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#171C1A]/20 bg-white text-[#171C1A] font-semibold hover:bg-[#171C1A]/5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelected(null)}
                  >
                    Close
                  </Button>
                  <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? "Saving..." : "Update Commission"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCustomOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#013E37]" />
        </div>
      }
    >
      <AdminCustomOrdersContent />
    </Suspense>
  );
}
