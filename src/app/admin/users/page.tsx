"use client";

import * as React from "react";
import Link from "next/link";
import { Loader2, Search, UserPlus } from "lucide-react";
import { AdminApiError, getAdminUsers } from "@/lib/admin-api";
import type { StaffMember } from "@/types/admin";
import { AdminErrorBanner } from "@/components/admin/AdminBadge";

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<StaffMember[]>([]);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [activeFilter, setActiveFilter] = React.useState<
    "ALL" | "true" | "false"
  >("ALL");
  const [search, setSearch] = React.useState("");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  React.useEffect(() => {
    let active = true;
    async function run() {
      setLoading(true);
      try {
        const res = await getAdminUsers({
          role: "CUSTOMER",
          isActive: activeFilter,
          search: search.trim() || undefined,
          page,
          limit: 20,
        });
        if (active) {
          setUsers(res.data ?? []);
          setTotal(res.meta?.total ?? (res.data?.length || 0));
          setTotalPages(res.meta?.totalPages ?? 1);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load patron users directory.",
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
  }, [activeFilter, search, page]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Patron Directory
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Users &amp; Patrons
          </h1>
          <p className="text-sm text-[#777F7B] mt-1">
            Registered customer accounts (separate from admin staff).
          </p>
        </div>

        <Link
          href="/admin/staff"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors self-start"
        >
          <UserPlus className="w-4 h-4" />
          <span>Staff Management</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#171C1A]/10 p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, email, phone..."
            className="h-11 w-full pl-9 pr-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>

        <select
          value={activeFilter}
          onChange={(e) => {
            setPage(1);
            setActiveFilter(e.target.value as "ALL" | "true" | "false");
          }}
          aria-label="Filter by account status"
          className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white"
        >
          <option value="ALL">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
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
              Loading users...
            </span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No users match the selected filters.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                  <tr>
                    <th className="py-3.5 px-5">Name</th>
                    <th className="py-3.5 px-5">Email &amp; Phone</th>
                    <th className="py-3.5 px-5">Role</th>
                    <th className="py-3.5 px-5">Auth Provider</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#171C1A]/10">
                  {users.map((member) => (
                    <tr key={member.id} className="hover:bg-[#FAF9F6]/60">
                      <td className="py-3.5 px-5 font-semibold text-xs text-[#171C1A]">
                        {member.firstName} {member.lastName}
                      </td>
                      <td className="py-3.5 px-5 text-xs">
                        <p className="text-[#171C1A]">{member.email}</p>
                        {member.phone && (
                          <p className="text-[11px] text-[#777F7B]">
                            {member.phone}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={
                            member.role === "CUSTOMER"
                              ? "px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#171C1A]/15 text-[#777F7B] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                              : "px-2.5 py-1 rounded-full bg-[#FFEEB3]/70 text-[#013E37] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap"
                          }
                        >
                          {member.role.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#171C1A]/15 text-[#4A5550] text-[11px] font-semibold uppercase tracking-wider whitespace-nowrap">
                          {member.authProvider || "local"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={
                            member.isActive
                              ? "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-emerald-50 text-emerald-800 border-emerald-200 whitespace-nowrap"
                              : "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border bg-neutral-100 text-neutral-600 border-neutral-200 whitespace-nowrap"
                          }
                        >
                          {member.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right text-xs text-[#777F7B] whitespace-nowrap">
                        {member.lastLoginAt
                          ? new Date(member.lastLoginAt).toLocaleString("en-NG")
                          : "Never"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-[#FAF9F6] border-t border-[#171C1A]/10 flex items-center justify-between text-xs text-[#777F7B]">
              <span>
                Showing {users.length} of {total} accounts (Page {page} of{" "}
                {totalPages})
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 border border-[#171C1A]/20 bg-white text-[#171C1A] disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 border border-[#171C1A]/20 bg-white text-[#171C1A] disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
