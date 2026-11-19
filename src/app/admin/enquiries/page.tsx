"use client";

import * as React from "react";
import { Loader2, Search, Eye, X } from "lucide-react";
import {
  AdminApiError,
  getAdminEnquiries,
  updateAdminEnquiry,
} from "@/lib/admin-api";
import type { AdminEnquiry, EnquiryStatus } from "@/types/admin";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";

export default function AdminEnquiriesPage() {
  const [subject, setSubject] = React.useState("ALL");
  const [status, setStatus] = React.useState<EnquiryStatus | "ALL">("ALL");
  const [search, setSearch] = React.useState("");
  const [enquiries, setEnquiries] = React.useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  const [selected, setSelected] = React.useState<AdminEnquiry | null>(null);
  const [ticketStatus, setTicketStatus] =
    React.useState<EnquiryStatus>("OPEN");
  const [conciergeNotes, setConciergeNotes] = React.useState("");
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const res = await getAdminEnquiries({
          subject,
          status,
          search: search.trim() || undefined,
        });
        if (active) {
          setEnquiries(res.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load concierge enquiries.",
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
  }, [subject, status, search]);

  const openTicket = (enq: AdminEnquiry) => {
    setSelected(enq);
    setTicketStatus(enq.status);
    setConciergeNotes(enq.conciergeNotes || "");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await updateAdminEnquiry(
        selected.ticketId || selected.id,
        {
          status: ticketStatus,
          conciergeNotes: conciergeNotes.trim() || undefined,
        }
      );
      setEnquiries((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setSelected(null);
    } catch (err) {
      setError({
        message:
          err instanceof AdminApiError
            ? err.message
            : "Unable to update enquiry.",
        isForbidden: err instanceof AdminApiError && err.status === 403,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
          Patron Support
        </p>
        <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
          Concierge Enquiries
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#171C1A]/10 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ENQ-..., name, email..."
            className="h-11 w-full pl-9 pr-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white"
        >
          <option value="ALL">All Topics</option>
          <option value="sizing">Sizing</option>
          <option value="bespoke">Bespoke</option>
          <option value="order-status">Order Status</option>
          <option value="wholesale">Wholesale</option>
          <option value="general">General</option>
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as EnquiryStatus | "ALL")
          }
          className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      {/* Table */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#013E37]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading tickets...
            </span>
          </div>
        ) : enquiries.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No enquiries found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Ticket</th>
                  <th className="py-3.5 px-5">Patron</th>
                  <th className="py-3.5 px-5">Topic</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {enquiries.map((enq) => (
                  <tr key={enq.id || enq.ticketId} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-5 font-mono text-xs font-bold text-[#013E37]">
                      {enq.ticketId}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-xs text-[#171C1A]">
                        {enq.fullName}
                      </p>
                      <p className="text-[11px] text-[#777F7B]">{enq.email}</p>
                    </td>
                    <td className="py-3.5 px-5 text-xs uppercase text-[#777F7B]">
                      {enq.subject}
                    </td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge status={enq.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => openTicket(enq)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#013E37] hover:underline cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg border border-[#171C1A]/15 shadow-2xl">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#FFEEB3]">
                Ticket {selected.ticketId}
              </h3>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="p-4 bg-[#FAF9F6] border border-[#171C1A]/10 text-xs space-y-1">
                <p className="font-semibold text-[#171C1A]">
                  {selected.fullName} • {selected.phone}
                </p>
                <p className="text-[#777F7B]">{selected.email}</p>
                <p className="pt-2 text-sm text-[#171C1A] leading-relaxed">
                  {selected.message}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Status
                </label>
                <select
                  value={ticketStatus}
                  onChange={(e) =>
                    setTicketStatus(e.target.value as EnquiryStatus)
                  }
                  className="h-11 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Concierge Notes
                </label>
                <textarea
                  rows={3}
                  value={conciergeNotes}
                  onChange={(e) => setConciergeNotes(e.target.value)}
                  className="w-full p-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelected(null)}
                >
                  Close
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : "Update Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
