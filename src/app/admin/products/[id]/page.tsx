"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Archive, Trash2 } from "lucide-react";
import {
  AdminApiError,
  deleteAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/lib/admin-api";
import type { AdminProduct } from "@/types/admin";
import { AdminErrorBanner } from "@/components/admin/AdminBadge";
import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/Buttons";

export default function AdminEditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params?.id || "";

  const [product, setProduct] = React.useState<AdminProduct | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    async function load() {
      if (!productId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getAdminProductById(productId);
        if (active) setProduct(data);
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load product.",
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
  }, [productId]);

  const handleDelete = async (hard: boolean) => {
    if (!product) return;
    const confirmed = window.confirm(
      hard
        ? `Permanently delete "${product.name}"? This cannot be undone.`
        : `Archive "${product.name}" from the storefront?`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteAdminProduct(product.id, hard);
      router.push("/admin/products");
    } catch (err) {
      setError({
        message:
          err instanceof AdminApiError
            ? err.message
            : "Unable to remove product.",
        isForbidden: err instanceof AdminApiError && err.status === 403,
      });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-[#013E37]">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="text-sm font-medium">Loading footwear details...</span>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#013E37]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Footwear</span>
        </Link>
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#013E37]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Footwear</span>
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-3xl text-[#171C1A]">
              {product.name}
            </h1>
            <span className="px-3 py-1 rounded-full bg-[#FFEEB3] text-[#013E37] text-xs font-bold">
              {product.salesCount ?? 0} pairs sold
            </span>
          </div>
          <p className="text-xs text-[#777F7B] font-mono">{product.slug}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={() => void handleDelete(false)}
          >
            <Archive className="w-4 h-4" />
            <span>Archive</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={deleting}
            onClick={() => void handleDelete(true)}
            className="border-red-300 text-red-700 hover:border-red-600"
          >
            <Trash2 className="w-4 h-4" />
            <span>Permanently Delete</span>
          </Button>
        </div>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      <ProductForm
        initialProduct={product}
        submitLabel="Save Footwear Changes"
        onSubmit={async (payload) => {
          const updated = await updateAdminProduct(product.id, payload);
          setProduct(updated);
        }}
      />

      {/* Stock History Audit Table */}
      <div className="bg-white border border-[#171C1A]/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-[#171C1A]/10">
          <h2 className="font-serif text-xl text-[#171C1A]">
            Stock Adjustment Audit Trail
          </h2>
        </div>

        {!product.stockHistory || product.stockHistory.length === 0 ? (
          <div className="p-6 text-xs text-[#777F7B]">
            No stock adjustments recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3 px-5">EU Size</th>
                  <th className="py-3 px-5">Change</th>
                  <th className="py-3 px-5">Reason</th>
                  <th className="py-3 px-5">Changed By</th>
                  <th className="py-3 px-5 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {product.stockHistory.map((entry, idx) => (
                  <tr key={entry.id || idx}>
                    <td className="py-3 px-5 font-bold">EU {entry.size}</td>
                    <td className="py-3 px-5 font-mono">
                      {entry.previousStock} →{" "}
                      <span className="font-bold text-[#013E37]">
                        {entry.newStock}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-[#171C1A]">
                      {entry.reason || "—"}
                    </td>
                    <td className="py-3 px-5 text-[#777F7B]">
                      {entry.changedBy}
                    </td>
                    <td className="py-3 px-5 text-right text-[#777F7B]">
                      {new Date(entry.changedAt).toLocaleString("en-NG")}
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
