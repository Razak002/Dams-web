"use client";

import * as React from "react";
import { Download, Loader2 } from "lucide-react";
import {
  AdminApiError,
  getAdminNewsletter,
  getAdminNewsletterCsvUrl,
} from "@/lib/admin-api";
import type { NewsletterSubscriber } from "@/types/admin";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = React.useState<NewsletterSubscriber[]>(
    []
  );
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  React.useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await getAdminNewsletter(1, 50);
        if (active) setSubscribers(res.data ?? []);
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load newsletter ledger.",
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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Patron Community
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Newsletter Ledger
          </h1>
        </div>

        <a
          href={getAdminNewsletterCsvUrl()}
          download="dams-newsletter-subscribers.csv"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors self-start"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </a>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#013E37]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading subscribers...
            </span>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No newsletter subscribers recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Email</th>
                  <th className="py-3.5 px-5">Source</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Subscribed On</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-5 text-xs font-semibold text-[#171C1A]">
                      {sub.email}
                    </td>
                    <td className="py-3.5 px-5 text-xs uppercase text-[#777F7B]">
                      {sub.source}
                    </td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge
                        status={sub.isActive ? "PAID" : "CANCELLED"}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs text-[#777F7B]">
                      {new Date(sub.createdAt).toLocaleDateString("en-NG")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
