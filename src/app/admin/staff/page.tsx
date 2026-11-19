"use client";

import * as React from "react";
import { Plus, Loader2, X, Search } from "lucide-react";
import {
  AdminApiError,
  createAdminStaff,
  getAdminStaff,
} from "@/lib/admin-api";
import type { StaffMember } from "@/types/admin";
import type { UserRole } from "@/types/auth";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";
import { toast } from "sonner";

type StaffRole = Exclude<UserRole, "CUSTOMER">;

export default function AdminStaffPage() {
  const [staff, setStaff] = React.useState<StaffMember[]>([]);
  const [roleFilter, setRoleFilter] = React.useState<StaffRole | "ALL">("ALL");
  const [activeFilter, setActiveFilter] = React.useState<
    "ALL" | "true" | "false"
  >("ALL");
  const [search, setSearch] = React.useState("");

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "WORKSHOP_MANAGER" as StaffRole,
  });

  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const list = await getAdminStaff();
        if (active) {
          setStaff(list);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load staff directory.",
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
  }, [refreshTick]);

  const reloadStaff = () => {
    setLoading(true);
    setRefreshTick((t) => t + 1);
  };

  const filteredStaff = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return staff.filter((member) => {
      if (roleFilter !== "ALL" && member.role !== roleFilter) return false;
      if (activeFilter === "true" && !member.isActive) return false;
      if (activeFilter === "false" && member.isActive) return false;
      if (!q) return true;
      return (
        `${member.firstName} ${member.lastName}`.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        (member.phone || "").toLowerCase().includes(q)
      );
    });
  }, [staff, roleFilter, activeFilter, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createAdminStaff({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        password: form.password,
        role: form.role,
      });
      setModalOpen(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        role: "WORKSHOP_MANAGER",
      });
      toast.success("Staff account created.");
      reloadStaff();
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to create staff account."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Access Control
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Staff Management
          </h1>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => {
            setModalOpen(true);
          }}
          className="text-xs uppercase tracking-wider font-bold self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-[#171C1A]/10 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff name, email, phone..."
            className="h-11 w-full pl-9 pr-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as StaffRole | "ALL")}
          aria-label="Filter by staff role"
          className="h-11 px-3 border border-[#171C1A]/20 text-xs bg-white"
        >
          <option value="ALL">All Staff Roles</option>
          <option value="SUPER_ADMIN">SUPER ADMIN</option>
          <option value="WORKSHOP_MANAGER">WORKSHOP MANAGER</option>
          <option value="CONCIERGE">CONCIERGE</option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) =>
            setActiveFilter(e.target.value as "ALL" | "true" | "false")
          }
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
              Loading directory...
            </span>
          </div>
        ) : filteredStaff.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No staff accounts match the selected filters.
          </div>
        ) : (
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
                {filteredStaff.map((member) => (
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
                      <span className="px-2.5 py-1 rounded-full bg-[#FFEEB3]/70 text-[#013E37] text-[11px] font-bold uppercase tracking-wider">
                        {member.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF9F6] border border-[#171C1A]/15 text-[#4A5550] text-[11px] font-semibold uppercase tracking-wider">
                        {member.authProvider || "local"}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge
                        status={member.isActive ? "PAID" : "CANCELLED"}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right text-xs text-[#777F7B]">
                      {member.lastLoginAt
                        ? new Date(member.lastLoginAt).toLocaleString("en-NG")
                        : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md border border-[#171C1A]/15 shadow-2xl">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#FFEEB3]">
                Add Abuja Workshop Staff
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                />
                <Input
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                />
              </div>

              <Input
                label="Work Email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Input
                label="Phone (Optional)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <Input
                label="Temporary Password (Min 8 chars)"
                type="password"
                minLength={8}
                required
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      role: e.target.value as Exclude<UserRole, "CUSTOMER">,
                    })
                  }
                  className="h-12 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
                >
                  <option value="WORKSHOP_MANAGER">WORKSHOP MANAGER</option>
                  <option value="CONCIERGE">CONCIERGE</option>
                  <option value="SUPER_ADMIN">SUPER ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Creating..." : "Create Staff Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
