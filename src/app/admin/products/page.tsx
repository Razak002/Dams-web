"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Loader2, Boxes, X, Edit } from "lucide-react";
import {
  AdminApiError,
  getAdminProducts,
  updateAdminProductStock,
} from "@/lib/admin-api";
import type { AdminProduct } from "@/types/admin";
import { cn, formatNGN } from "@/lib/utils";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";

const TABS = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
  { id: "outOfStock", label: "Out of Stock" },
] as const;

export default function AdminProductsPage() {
  const [activeTab, setActiveTab] =
    React.useState<(typeof TABS)[number]["id"]>("all");
  const [search, setSearch] = React.useState("");
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  // Quick Stock Modal (no optimistic edits)
  const [stockProduct, setStockProduct] = React.useState<AdminProduct | null>(
    null
  );
  const [stockDraft, setStockDraft] = React.useState<
    { size: number; stock: number }[]
  >([]);
  const [stockReason, setStockReason] = React.useState("");
  const [savingStock, setSavingStock] = React.useState(false);
  const [stockError, setStockError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const res = await getAdminProducts({
          status:
            activeTab === "all" || activeTab === "outOfStock"
              ? undefined
              : activeTab,
          outOfStock: activeTab === "outOfStock",
          search: search.trim() || undefined,
        });
        if (active) {
          setProducts(res.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load products.",
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
  }, [activeTab, search]);

  const openStockModal = (product: AdminProduct) => {
    setStockProduct(product);
    setStockDraft(product.sizes.map((s) => ({ size: s.size, stock: s.stock })));
    setStockReason("");
    setStockError(null);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockProduct) return;
    setSavingStock(true);
    setStockError(null);

    try {
      const updated = await updateAdminProductStock(stockProduct.id, {
        sizes: stockDraft,
        reason: stockReason.trim() || "Workshop stock adjustment",
      });
      // Update only after server confirms
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      setStockProduct(null);
    } catch (err) {
      setStockError(
        err instanceof AdminApiError ? err.message : "Failed to update stock."
      );
    } finally {
      setSavingStock(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Catalogue &amp; Inventory
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Footwear &amp; Stock
          </h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Footwear</span>
        </Link>
      </div>

      {/* Tabs + Search */}
      <div className="bg-white border border-[#171C1A]/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
                activeTab === tab.id
                  ? "bg-[#013E37] text-[#FFEEB3]"
                  : "bg-[#FAF9F6] text-[#171C1A] hover:bg-[#171C1A]/10"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#777F7B] absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, slug..."
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

      {/* Table */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        {loading ? (
          <div className="py-16 flex items-center justify-center gap-2 text-[#013E37]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Loading footwear catalogue...
            </span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No footwear silhouettes found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Footwear</th>
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5">Price</th>
                  <th className="py-3.5 px-5">Total Stock</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {products.map((prod) => {
                  const totalStock = prod.sizes.reduce(
                    (sum, s) => sum + s.stock,
                    0
                  );
                  return (
                    <tr key={prod.id} className="hover:bg-[#FAF9F6]/60">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 bg-[#FAF9F6] border border-[#171C1A]/10 shrink-0 overflow-hidden">
                            {prod.images[0]?.url && (
                              <Image
                                src={prod.images[0].url}
                                alt={prod.name}
                                fill
                                unoptimized
                                className="object-contain"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-[#171C1A]">
                              {prod.name}
                            </p>
                            <p className="text-[11px] text-[#777F7B] font-mono">
                              {prod.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-xs uppercase text-[#777F7B]">
                        {prod.category} • {prod.silhouette}
                      </td>
                      <td className="py-3.5 px-5 text-xs font-bold text-[#171C1A]">
                        {formatNGN(prod.price)}
                      </td>
                      <td className="py-3.5 px-5 text-xs">
                        <span
                          className={cn(
                            "font-bold",
                            totalStock === 0
                              ? "text-red-600"
                              : totalStock <= 5
                                ? "text-amber-700"
                                : "text-[#013E37]"
                          )}
                        >
                          {totalStock} pairs
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        {prod.isArchived || prod.status === "archived" ? (
                          <AdminStatusBadge status="CANCELLED" />
                        ) : prod.isPublished ? (
                          <AdminStatusBadge status="PAID" />
                        ) : (
                          <AdminStatusBadge status="PENDING" />
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => openStockModal(prod)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#013E37] hover:underline cursor-pointer"
                          >
                            <Boxes className="w-3.5 h-3.5" />
                            <span>Stock</span>
                          </button>
                          <Link
                            href={`/admin/products/${prod.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#171C1A] hover:text-[#013E37]"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Stock Modal */}
      {stockProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md border border-[#171C1A]/15 shadow-2xl">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#FFEEB3] truncate pr-4">
                Stock Matrix — {stockProduct.name}
              </h3>
              <button
                type="button"
                onClick={() => setStockProduct(null)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="p-6 space-y-4">
              {stockError && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
                  {stockError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                {stockDraft.map((row, idx) => (
                  <div
                    key={row.size}
                    className="p-2.5 bg-[#FAF9F6] border border-[#171C1A]/10 flex flex-col gap-1"
                  >
                    <label className="text-[11px] font-bold text-[#013E37]">
                      EU {row.size}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={row.stock}
                      onChange={(e) =>
                        setStockDraft((prev) =>
                          prev.map((s, i) =>
                            i === idx
                              ? { ...s, stock: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                      className="h-9 w-full px-2 bg-white border border-[#171C1A]/20 text-xs font-semibold"
                    />
                  </div>
                ))}
              </div>

              <Input
                label="Adjustment Reason"
                placeholder="e.g. New batch of 20 pairs from Abuja workshop"
                value={stockReason}
                onChange={(e) => setStockReason(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStockProduct(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={savingStock}
                >
                  {savingStock ? "Saving..." : "Save Stock"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
