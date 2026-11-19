"use client";

import * as React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import {
  AdminApiError,
  getAdminAnalyticsOverview,
} from "@/lib/admin-api";
import type { AnalyticsOverview } from "@/types/admin";
import { formatNGN } from "@/lib/utils";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";

export default function AdminOverviewPage() {
  const [data, setData] = React.useState<AnalyticsOverview | null>(null);
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
        const overview = await getAdminAnalyticsOverview();
        if (active) setData(overview);
      } catch (err) {
        if (!active) return;
        if (err instanceof AdminApiError) {
          setError({
            message: err.message,
            isForbidden: err.status === 403,
          });
        } else {
          setError({
            message: "Unable to load analytics overview.",
            isForbidden: false,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center text-[#013E37] gap-2.5">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading Abuja analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <AdminErrorBanner
        message={error.message}
        isForbidden={error.isForbidden}
      />
    );
  }

  if (!data) return null;

  const statusEntries = Object.entries(data.ordersByStatus || {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Executive Overview
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#171C1A] mt-1">
            Workshop &amp; Storefront Pulse
          </h1>
        </div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors self-start"
        >
          <span>Manage Orders</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-[#171C1A]/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#777F7B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Revenue
            </span>
            <TrendingUp className="w-4 h-4 text-[#013E37]" />
          </div>
          <p className="font-serif text-3xl text-[#013E37]">
            {formatNGN(data.totalRevenueNGN)}
          </p>
          <p className="text-xs text-[#777F7B]">Confirmed NGN volume</p>
        </div>

        <div className="bg-white border border-[#171C1A]/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#777F7B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Paid Orders
            </span>
            <ShoppingBag className="w-4 h-4 text-[#013E37]" />
          </div>
          <p className="font-serif text-3xl text-[#171C1A]">
            {data.paidOrdersCount}
          </p>
          <p className="text-xs text-[#777F7B]">
            Out of {data.ordersCount} total orders
          </p>
        </div>

        <Link
          href="/admin/custom-orders?status=NEW"
          className="bg-white border border-[#171C1A]/10 hover:border-[#013E37] p-6 space-y-2 transition-colors group"
        >
          <div className="flex items-center justify-between text-[#777F7B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Pending Bespoke
            </span>
            <Sparkles className="w-4 h-4 text-[#013E37]" />
          </div>
          <p className="font-serif text-3xl text-[#171C1A] group-hover:text-[#013E37]">
            {data.pendingCustomCommissions}
          </p>
          <p className="text-xs text-[#013E37] font-semibold">
            Review commissions →
          </p>
        </Link>

        <div className="bg-white border border-[#171C1A]/10 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#777F7B]">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Low-Stock Alerts
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-3xl text-amber-700">
            {data.lowStockAlerts.length}
          </p>
          <p className="text-xs text-[#777F7B]">
            Silhouettes needing restock
          </p>
        </div>
      </div>

      {/* Orders by Status Breakdown */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-4">
        <h2 className="font-serif text-xl text-[#171C1A]">
          Orders by Status Breakdown
        </h2>
        {statusEntries.length === 0 ? (
          <p className="text-sm text-[#777F7B]">No order data recorded yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {statusEntries.map(([status, count]) => (
              <Link
                key={status}
                href={`/admin/orders?status=${status}`}
                className="flex items-center gap-2.5 px-4 py-2.5 bg-[#FAF9F6] border border-[#171C1A]/10 hover:border-[#013E37] transition-colors"
              >
                <AdminStatusBadge status={status} />
                <span className="text-sm font-bold text-[#171C1A]">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Low Stock Alerts Table */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#171C1A]/10 flex items-center justify-between">
          <h2 className="font-serif text-xl text-[#171C1A]">
            Low-Stock Size Alerts
          </h2>
          <Link
            href="/admin/products"
            className="text-xs font-semibold uppercase tracking-wider text-[#013E37] hover:underline"
          >
            All Products
          </Link>
        </div>

        {data.lowStockAlerts.length === 0 ? (
          <div className="p-6 text-sm text-[#777F7B]">
            All EU sizes are adequately stocked.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-xs uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3 px-6">Footwear</th>
                  <th className="py-3 px-6">Low EU Sizes</th>
                  <th className="py-3 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {data.lowStockAlerts.map((alert) => (
                  <tr key={alert.productId} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-6">
                      <p className="font-semibold text-[#171C1A]">
                        {alert.name}
                      </p>
                      <p className="text-xs text-[#777F7B] font-mono">
                        {alert.slug}
                      </p>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex flex-wrap gap-1.5">
                        {alert.lowSizes.map((sz) => (
                          <span
                            key={sz.size}
                            className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold"
                          >
                            EU {sz.size}: {sz.stock} left
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        href={`/admin/products/${alert.productId}`}
                        className="text-xs font-bold uppercase tracking-wider text-[#013E37] hover:underline"
                      >
                        Restock →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Silhouettes & Sales by State */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#171C1A]/10">
            <h2 className="font-serif text-xl text-[#171C1A]">
              Top Silhouettes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-xs uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3 px-6">Pair</th>
                  <th className="py-3 px-6 text-right">Units</th>
                  <th className="py-3 px-6 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {data.topSilhouettes.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-6 text-[#777F7B]">
                      No sales recorded yet.
                    </td>
                  </tr>
                ) : (
                  data.topSilhouettes.map((row) => (
                    <tr key={row.productId}>
                      <td className="py-3 px-6 font-medium text-[#171C1A]">
                        {row.name}
                      </td>
                      <td className="py-3 px-6 text-right">{row.unitsSold}</td>
                      <td className="py-3 px-6 text-right font-semibold text-[#013E37]">
                        {formatNGN(row.revenueNGN)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#171C1A]/10">
            <h2 className="font-serif text-xl text-[#171C1A]">
              Sales by State
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-xs uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3 px-6">State</th>
                  <th className="py-3 px-6 text-right">Orders</th>
                  <th className="py-3 px-6 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {data.salesByState.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 px-6 text-[#777F7B]">
                      No regional order data yet.
                    </td>
                  </tr>
                ) : (
                  data.salesByState.map((row) => (
                    <tr key={row.state}>
                      <td className="py-3 px-6 font-medium text-[#171C1A]">
                        {row.state}
                      </td>
                      <td className="py-3 px-6 text-right">
                        {row.ordersCount}
                      </td>
                      <td className="py-3 px-6 text-right font-semibold text-[#013E37]">
                        {formatNGN(row.revenueNGN)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
