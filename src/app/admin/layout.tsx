"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

function AdminLayoutGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const user = useAuthStore((s) => s.user);
  const initialized = useAuthStore((s) => s.initialized);
  const fetchSession = useAuthStore((s) => s.fetchSession);

  React.useEffect(() => {
    let active = true;
    async function verifyGuard() {
      const currentUser = await fetchSession(true);
      if (!active) return;

      if (!currentUser) {
        router.replace(
          `/login?redirect=${encodeURIComponent(pathname || "/admin")}`
        );
        return;
      }

      if (!currentUser.role || currentUser.role === "CUSTOMER") {
        router.replace("/");
        return;
      }

      // Redirect non-super-admins away from /admin overview to /admin/orders
      if (pathname === "/admin" && currentUser.role !== "SUPER_ADMIN") {
        router.replace("/admin/orders");
      }
    }

    void verifyGuard();
    return () => {
      active = false;
    };
  }, [fetchSession, pathname, router]);

  if (!initialized || !user || !user.role || user.role === "CUSTOMER") {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-3 text-[#013E37]">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">
          Verifying Abuja Workshop Session...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#FAF9F6] text-[#171C1A] flex">
      <AdminSidebar
        user={user}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        {/* Top Mobile / Breadcrumb Bar */}
        <header className="shrink-0 z-30 h-16 bg-white border-b border-[#171C1A]/10 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#013E37] hover:bg-[#013E37]/5 rounded-md cursor-pointer"
              aria-label="Open admin navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#777F7B]">
              DÁMS Footwear • Abuja Workshop Console
            </span>
          </div>

          <span className="text-xs font-semibold text-[#013E37] bg-[#FFEEB3]/60 px-3 py-1 rounded-full">
            {user.role.replace(/_/g, " ")}
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center gap-3 text-[#013E37]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Loading Workshop Console...
          </p>
        </div>
      }
    >
      <AdminLayoutGuard>{children}</AdminLayoutGuard>
    </React.Suspense>
  );
}
