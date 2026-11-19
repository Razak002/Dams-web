"use client";

import * as React from "react";
import Image from "next/image";
import { Plus, Edit, Trash2, Loader2, Upload, X } from "lucide-react";
import {
  AdminApiError,
  createAdminCollection,
  deleteAdminCollection,
  getAdminCollections,
  updateAdminCollection,
  uploadAdminMedia,
} from "@/lib/admin-api";
import type { AdminCollection } from "@/types/admin";
import { AdminErrorBanner, AdminStatusBadge } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";
import { toast } from "sonner";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = React.useState<AdminCollection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<{
    message: string;
    isForbidden: boolean;
  } | null>(null);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<AdminCollection | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    slug: "",
    title: "",
    subtitle: "",
    description: "",
    coverImage: "",
    sortOrder: 1,
    isActive: true,
  });

  const [refreshTick, setRefreshTick] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    async function run() {
      try {
        const list = await getAdminCollections();
        if (active) {
          setCollections(list);
          setError(null);
        }
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load collections.",
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

  const loadCollections = () => {
    setLoading(true);
    setRefreshTick((t) => t + 1);
  };

  const openCreate = () => {
    setEditing(null);
    setForm({
      slug: "",
      title: "",
      subtitle: "",
      description: "",
      coverImage: "",
      sortOrder: collections.length + 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const openEdit = (col: AdminCollection) => {
    setEditing(col);
    setForm({
      slug: col.slug,
      title: col.title,
      subtitle: col.subtitle,
      description: col.description,
      coverImage: col.coverImage,
      sortOrder: col.sortOrder,
      isActive: col.isActive,
    });
    setModalOpen(true);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadAdminMedia(file);
      setForm((prev) => ({ ...prev, coverImage: uploaded.url }));
      toast.success("Cover image uploaded.");
    } catch (err) {
      toast.error(
        err instanceof AdminApiError ? err.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateAdminCollection(editing.id, form);
        toast.success("Collection updated.");
      } else {
        await createAdminCollection(form);
        toast.success("Collection created.");
      }
      setModalOpen(false);
      await loadCollections();
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to save collection."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (col: AdminCollection) => {
    if (!window.confirm(`Delete collection "${col.title}"?`)) return;
    try {
      await deleteAdminCollection(col.id);
      toast.success("Collection deleted.");
      await loadCollections();
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to delete collection."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
            Merchandising
          </p>
          <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
            Collections
          </h1>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={openCreate}
          className="text-xs uppercase tracking-wider font-bold self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Collection</span>
        </Button>
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
              Loading collections...
            </span>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-16 text-center text-sm text-[#777F7B]">
            No collections created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FAF9F6] text-[11px] uppercase tracking-wider text-[#777F7B] border-b border-[#171C1A]/10">
                <tr>
                  <th className="py-3.5 px-5">Collection</th>
                  <th className="py-3.5 px-5">Slug</th>
                  <th className="py-3.5 px-5">Products</th>
                  <th className="py-3.5 px-5">Order</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171C1A]/10">
                {collections.map((col) => (
                  <tr key={col.id} className="hover:bg-[#FAF9F6]/60">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 bg-[#FAF9F6] border border-[#171C1A]/10 shrink-0 overflow-hidden">
                          {col.coverImage && (
                            <Image
                              src={col.coverImage}
                              alt={col.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-xs text-[#171C1A]">
                            {col.title}
                          </p>
                          <p className="text-[11px] text-[#777F7B]">
                            {col.subtitle}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-xs text-[#777F7B]">
                      {col.slug}
                    </td>
                    <td className="py-3.5 px-5 text-xs font-semibold">
                      {col.productCount}
                    </td>
                    <td className="py-3.5 px-5 text-xs">{col.sortOrder}</td>
                    <td className="py-3.5 px-5">
                      <AdminStatusBadge
                        status={col.isActive ? "PAID" : "CANCELLED"}
                      />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(col)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#013E37] hover:underline cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(col)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 hover:underline cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg border border-[#171C1A]/15 shadow-2xl">
            <div className="px-6 py-4 bg-[#013E37] text-white flex items-center justify-between">
              <h3 className="font-serif text-xl text-[#FFEEB3]">
                {editing ? `Edit ${editing.title}` : "New Collection"}
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Title"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      title: e.target.value,
                      slug: editing
                        ? form.slug
                        : e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-"),
                    })
                  }
                />
                <Input
                  label="Slug"
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>

              <Input
                label="Subtitle"
                required
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full p-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider">
                    Cover Image
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#013E37] cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? "Uploading..." : "Upload Cover"}</span>
                    <input
                      type="file"
                      accept="image/webp,image/png,image/jpeg,.glb,model/gltf-binary"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <Input
                  placeholder="https://..."
                  value={form.coverImage}
                  onChange={(e) =>
                    setForm({ ...form, coverImage: e.target.value })
                  }
                />
                {form.coverImage && (
                  <div className="relative h-32 w-full bg-[#FAF9F6] border border-[#171C1A]/10 overflow-hidden">
                    <Image
                      src={form.coverImage}
                      alt={form.title || "Collection cover preview"}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 items-center">
                <Input
                  label="Sort Order"
                  type="number"
                  value={String(form.sortOrder)}
                  onChange={(e) =>
                    setForm({ ...form, sortOrder: Number(e.target.value) })
                  }
                />
                <label className="inline-flex items-center gap-2 text-xs font-semibold pt-5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="accent-[#013E37] w-4 h-4"
                  />
                  <span>Active on Storefront</span>
                </label>
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
                  {saving ? "Saving..." : "Save Collection"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
