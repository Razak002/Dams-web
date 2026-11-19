import { cn } from "@/lib/utils";
import { AlertTriangle, ShieldAlert } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  // Order Statuses
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-800 border-emerald-200",
  IN_WORKSHOP: "bg-[#013E37]/10 text-[#013E37] border-[#013E37]/25",
  DISPATCHED: "bg-sky-50 text-sky-800 border-sky-200",
  DELIVERED: "bg-emerald-100 text-emerald-900 border-emerald-300",
  CANCELLED: "bg-neutral-100 text-neutral-600 border-neutral-200",
  FAILED: "bg-red-50 text-red-700 border-red-200",

  // Custom Order Statuses
  NEW: "bg-[#FFEEB3] text-[#013E37] border-[#013E37]/20",
  REVIEWING: "bg-sky-50 text-sky-800 border-sky-200",
  QUOTED: "bg-amber-50 text-amber-800 border-amber-200",
  IN_PRODUCTION: "bg-[#013E37]/10 text-[#013E37] border-[#013E37]/25",
  READY_FOR_DISPATCH: "bg-teal-50 text-teal-800 border-teal-200",
  DECLINED: "bg-red-50 text-red-700 border-red-200",

  // Enquiry Statuses
  OPEN: "bg-amber-50 text-amber-800 border-amber-200",
  IN_PROGRESS: "bg-sky-50 text-sky-800 border-sky-200",
  RESOLVED: "bg-emerald-50 text-emerald-800 border-emerald-200",

  // Fulfilment Issues
  STOCK_CONFLICT: "bg-red-100 text-red-800 border-red-300",
  REFUND_REQUIRED: "bg-amber-100 text-amber-900 border-amber-300",
  AMOUNT_MISMATCH: "bg-red-100 text-red-800 border-red-300",
  PAID_AFTER_CANCEL: "bg-red-100 text-red-800 border-red-300",
};

export function AdminStatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style =
    STATUS_STYLES[status] ||
    "bg-neutral-100 text-neutral-700 border-neutral-200";

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border whitespace-nowrap",
        style,
        className
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

export function AdminErrorBanner({
  message,
  isForbidden = false,
}: {
  message: string;
  isForbidden?: boolean;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "p-4 border flex items-start gap-3 text-sm",
        isForbidden
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-red-50 border-red-200 text-red-800"
      )}
    >
      {isForbidden ? (
        <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="font-semibold">
          {isForbidden ? "Insufficient Permissions (403)" : "Action Notice"}
        </p>
        <p className="text-xs mt-0.5 opacity-90">{message}</p>
      </div>
    </div>
  );
}
