"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Trash2, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
  AdminApiError,
  getAdminCollections,
  uploadAdminMedia,
} from "@/lib/admin-api";
import type {
  AdminCollection,
  AdminProduct,
  AdminProductPayload,
} from "@/types/admin";
import type { ProductCategory } from "@/types/product";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Buttons";

const DEFAULT_SIZES = [
  { size: 38, ukSize: 5, footLengthCm: 24.1, stock: 5 },
  { size: 39, ukSize: 6, footLengthCm: 24.8, stock: 5 },
  { size: 40, ukSize: 6.5, footLengthCm: 25.4, stock: 8 },
  { size: 41, ukSize: 7.5, footLengthCm: 26.0, stock: 8 },
  { size: 42, ukSize: 8, footLengthCm: 26.7, stock: 10 },
  { size: 43, ukSize: 9, footLengthCm: 27.3, stock: 6 },
  { size: 44, ukSize: 9.5, footLengthCm: 28.0, stock: 4 },
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function ProductForm({
  initialProduct,
  onSubmit,
  submitLabel,
}: {
  initialProduct?: AdminProduct;
  onSubmit: (payload: AdminProductPayload) => Promise<void>;
  submitLabel: string;
}) {
  const isEdit = Boolean(initialProduct);
  const [collections, setCollections] = React.useState<AdminCollection[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>(
    {}
  );

  const [name, setName] = React.useState(initialProduct?.name || "");
  const [slug, setSlug] = React.useState(initialProduct?.slug || "");
  const [subtitle, setSubtitle] = React.useState(
    initialProduct?.subtitle || ""
  );
  const [description, setDescription] = React.useState(
    initialProduct?.description || ""
  );
  const [category, setCategory] = React.useState<ProductCategory>(
    initialProduct?.category || "unisex"
  );
  const [collectionSlug, setCollectionSlug] = React.useState(
    initialProduct?.collectionSlug || ""
  );
  const [silhouette, setSilhouette] = React.useState(
    initialProduct?.silhouette || "Cork Slide"
  );
  const [origin, setOrigin] = React.useState(
    initialProduct?.origin || "Handcrafted in Abuja, Nigeria"
  );
  const [price, setPrice] = React.useState(
    String(initialProduct?.price || 48000)
  );
  const [compareAtPrice, setCompareAtPrice] = React.useState(
    initialProduct?.compareAtPrice ? String(initialProduct.compareAtPrice) : ""
  );
  const [isPublished, setIsPublished] = React.useState(
    initialProduct?.isPublished ?? true
  );
  const [featured, setFeatured] = React.useState(
    initialProduct?.featured ?? false
  );
  const [isBestSeller, setIsBestSeller] = React.useState(
    initialProduct?.isBestSeller ?? false
  );
  const [isNewArrival, setIsNewArrival] = React.useState(
    initialProduct?.isNewArrival ?? true
  );

  const [images, setImages] = React.useState(
    initialProduct?.images?.length
      ? initialProduct.images
      : [{ url: "", alt: "", angle: "Three-Quarter Profile" }]
  );
  const [colourways, setColourways] = React.useState(
    initialProduct?.colourways?.length
      ? initialProduct.colourways
      : [{ name: "Earth Chocolate", hex: "#3B261E" }]
  );
  const [materials, setMaterials] = React.useState(
    initialProduct?.materials || {
      upper: "100% Purely Natural Nigerian Leather",
      lining: "Breathable Goatskin Lining",
      sole: "Contoured Natural Cork & EVA Outsole",
      construction: "Hand-Lasted in Abuja",
    }
  );
  const [careText, setCareText] = React.useState(
    (initialProduct?.careInstructions || [
      "Wipe with a soft dry cloth after wear.",
    ]).join("\n")
  );
  const [sizes, setSizes] = React.useState(
    initialProduct?.sizes?.length ? initialProduct.sizes : DEFAULT_SIZES
  );

  React.useEffect(() => {
    getAdminCollections()
      .then((list) => setCollections(list))
      .catch(() => {});
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEdit) {
      setSlug(slugify(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadAdminMedia(file);
      setImages((prev) => [
        ...prev.filter((img) => img.url.trim() !== ""),
        {
          url: uploaded.url,
          alt: `${name || "DÁMS Footwear"} — Studio View`,
          angle: "Studio View",
        },
      ]);
      toast.success("Media uploaded.");
    } catch (err) {
      toast.error(
        err instanceof AdminApiError ? err.message : "Media upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        category,
        collectionSlug: collectionSlug || undefined,
        silhouette: silhouette.trim(),
        origin: origin.trim(),
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
        isPublished,
        featured,
        isBestSeller,
        isNewArrival,
        images: images.filter((img) => img.url.trim() !== ""),
        colourways: colourways.filter((c) => c.name.trim() !== ""),
        materials,
        careInstructions: careText
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean),
        sizes: sizes.map((s) => ({
          size: Number(s.size),
          ukSize: Number(s.ukSize),
          footLengthCm: Number(s.footLengthCm),
          stock: Number(s.stock),
        })),
      });
      toast.success(isEdit ? "Footwear updated." : "Footwear published.");
      setSuccessOpen(true);
    } catch (err) {
      if (err instanceof AdminApiError) {
        if (err.errors) {
          const mapped: Record<string, string> = {};
          Object.entries(err.errors).forEach(([k, msgs]) => {
            if (msgs?.[0]) mapped[k] = msgs[0];
          });
          setFieldErrors(mapped);
          const firstFieldError = Object.values(mapped)[0];
          toast.error(
            firstFieldError ? `${err.message}: ${firstFieldError}` : err.message
          );
        } else {
          toast.error(err.message);
        }
      } else {
        toast.error("Unable to save product.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Basic Info */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-5">
        <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
          1. Basic Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Product Name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            error={fieldErrors.name}
          />
          <Input
            label="Slug"
            required
            disabled={isEdit}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            helperText={
              isEdit ? "Locked after creation" : "Auto-generated from name"
            }
            error={fieldErrors.slug}
          />
        </div>

        <Input
          label="Subtitle"
          required
          placeholder="Purely Natural • 100% Original Local Product"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          error={fieldErrors.subtitle}
        />

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#171C1A] mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 border border-[#171C1A]/20 text-sm focus:border-[#013E37] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="h-12 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
            >
              <option value="unisex">Unisex</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Collection
            </label>
            <select
              value={collectionSlug}
              onChange={(e) => setCollectionSlug(e.target.value)}
              className="h-12 w-full px-3 border border-[#171C1A]/20 text-sm bg-white"
            >
              <option value="">None</option>
              {collections.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Silhouette"
            required
            value={silhouette}
            onChange={(e) => setSilhouette(e.target.value)}
          />

          <Input
            label="Origin"
            required
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
        </div>
      </div>

      {/* Pricing & Flags */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-5">
        <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
          2. Pricing &amp; Merchandising Flags
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Price (₦ NGN)"
            type="number"
            required
            min={1000}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            error={fieldErrors.price}
          />
          <Input
            label="Compare-At Price (Optional ₦ NGN)"
            type="number"
            value={compareAtPrice}
            onChange={(e) => setCompareAtPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-6 pt-2 text-xs font-semibold text-[#171C1A]">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="accent-[#013E37] w-4 h-4"
            />
            <span>Published on Storefront</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="accent-[#013E37] w-4 h-4"
            />
            <span>Featured</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="accent-[#013E37] w-4 h-4"
            />
            <span>Best Seller</span>
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isNewArrival}
              onChange={(e) => setIsNewArrival(e.target.checked)}
              className="accent-[#013E37] w-4 h-4"
            />
            <span>New Arrival</span>
          </label>
        </div>
      </div>

      {/* Media Uploader */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#171C1A]/10 pb-3">
          <h2 className="font-serif text-xl text-[#171C1A]">
            3. Studio Photography
          </h2>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#025249]">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Photo"}</span>
            <input
              type="file"
              accept="image/webp,image/png,image/jpeg,.glb,model/gltf-binary"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 bg-[#FAF9F6] border border-[#171C1A]/10"
            >
              <div className="sm:col-span-2 relative h-16 w-16 bg-white border border-[#171C1A]/10 overflow-hidden flex items-center justify-center">
                {img.url &&
                  (img.url.toLowerCase().endsWith(".glb") ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#013E37]">
                      3D .GLB
                    </span>
                  ) : (
                    <Image
                      src={img.url}
                      alt={img.alt || "Preview"}
                      fill
                      className="object-contain"
                    />
                  ))}
              </div>
              <div className="sm:col-span-4">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={img.url}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, url: e.target.value } : item
                      )
                    )
                  }
                  className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs"
                />
              </div>
              <div className="sm:col-span-3">
                <input
                  type="text"
                  placeholder="Angle (e.g. Side Profile)"
                  value={img.angle}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, angle: e.target.value } : item
                      )
                    )
                  }
                  className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Alt text"
                  value={img.alt}
                  onChange={(e) =>
                    setImages((prev) =>
                      prev.map((item, i) =>
                        i === idx ? { ...item, alt: e.target.value } : item
                      )
                    )
                  }
                  className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== idx))
                  }
                  className="p-2 text-[#777F7B] hover:text-red-600 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Colourways & Materials */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#171C1A]/10 pb-3">
          <h2 className="font-serif text-xl text-[#171C1A]">
            4. Colourways, Materials &amp; Care
          </h2>
          <button
            type="button"
            onClick={() =>
              setColourways((prev) => [
                ...prev,
                { name: "New Patina", hex: "#013E37" },
              ])
            }
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#013E37] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Colourway</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {colourways.map((c, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 bg-[#FAF9F6] border border-[#171C1A]/10"
            >
              <input
                type="color"
                value={c.hex}
                onChange={(e) =>
                  setColourways((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, hex: e.target.value } : item
                    )
                  )
                }
                className="w-9 h-9 border-0 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={c.name}
                onChange={(e) =>
                  setColourways((prev) =>
                    prev.map((item, i) =>
                      i === idx ? { ...item, name: e.target.value } : item
                    )
                  )
                }
                className="flex-1 h-9 px-2.5 bg-white border border-[#171C1A]/20 text-xs"
              />
              <button
                type="button"
                onClick={() =>
                  setColourways((prev) => prev.filter((_, i) => i !== idx))
                }
                className="p-1.5 text-[#777F7B] hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Upper Material"
            value={materials.upper}
            onChange={(e) =>
              setMaterials({ ...materials, upper: e.target.value })
            }
          />
          <Input
            label="Lining Material"
            value={materials.lining}
            onChange={(e) =>
              setMaterials({ ...materials, lining: e.target.value })
            }
          />
          <Input
            label="Sole Unit"
            value={materials.sole}
            onChange={(e) =>
              setMaterials({ ...materials, sole: e.target.value })
            }
          />
          <Input
            label="Construction"
            value={materials.construction}
            onChange={(e) =>
              setMaterials({ ...materials, construction: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#171C1A] mb-1.5">
            Care Instructions (one per line)
          </label>
          <textarea
            rows={3}
            value={careText}
            onChange={(e) => setCareText(e.target.value)}
            className="w-full p-3 border border-[#171C1A]/20 text-xs focus:border-[#013E37] focus:outline-none"
          />
        </div>
      </div>

      {/* EU/UK Size Matrix */}
      <div className="bg-white border border-[#171C1A]/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#171C1A]/10 pb-3">
          <h2 className="font-serif text-xl text-[#171C1A]">
            5. EU / UK Size Stock Matrix
          </h2>
          <button
            type="button"
            onClick={() =>
              setSizes((prev) => [
                ...prev,
                { size: 45, ukSize: 10.5, footLengthCm: 28.6, stock: 2 },
              ])
            }
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#013E37] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Size Row</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] uppercase tracking-wider text-[#777F7B]">
              <tr>
                <th className="py-2.5 px-3">EU Size</th>
                <th className="py-2.5 px-3">UK Size</th>
                <th className="py-2.5 px-3">Foot Length (cm)</th>
                <th className="py-2.5 px-3">Initial Stock</th>
                <th className="py-2.5 px-3 text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171C1A]/10">
              {sizes.map((row, idx) => (
                <tr key={idx}>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={row.size}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === idx ? { ...s, size: Number(e.target.value) } : s
                          )
                        )
                      }
                      className="h-9 w-20 px-2 border border-[#171C1A]/20"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.5"
                      value={row.ukSize}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === idx
                              ? { ...s, ukSize: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                      className="h-9 w-20 px-2 border border-[#171C1A]/20"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      step="0.1"
                      value={row.footLengthCm}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === idx
                              ? { ...s, footLengthCm: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                      className="h-9 w-24 px-2 border border-[#171C1A]/20"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      value={row.stock}
                      onChange={(e) =>
                        setSizes((prev) =>
                          prev.map((s, i) =>
                            i === idx
                              ? { ...s, stock: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                      className="h-9 w-20 px-2 border border-[#171C1A]/20 font-semibold"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setSizes((prev) => prev.filter((_, i) => i !== idx))
                      }
                      className="p-1.5 text-[#777F7B] hover:text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={submitting}
          className="uppercase tracking-[0.16em] text-xs font-bold"
        >
          {submitting ? "Saving Footwear..." : submitLabel}
        </Button>
      </div>
    </form>

    {successOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171C1A]/60 backdrop-blur-xs">
        <div className="bg-white w-full max-w-md border border-[#171C1A]/15 shadow-2xl p-6 sm:p-8 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-serif text-2xl text-[#171C1A]">
              {isEdit ? "Footwear Updated" : "Footwear Published"}
            </h3>
            <p className="text-sm text-[#777F7B]">
              <strong className="text-[#171C1A]">{name || "Silhouette"}</strong>{" "}
              has been saved to your DÁMS catalogue.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/admin/products"
              className="flex-1 h-11 inline-flex items-center justify-center bg-[#013E37] text-[#FFEEB3] text-xs font-bold uppercase tracking-wider hover:bg-[#025249] transition-colors"
            >
              View All Footwear
            </Link>
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="flex-1 h-11 inline-flex items-center justify-center border border-[#171C1A]/20 text-xs font-bold uppercase tracking-wider text-[#171C1A] hover:border-[#013E37] cursor-pointer"
            >
              {isEdit ? "Continue Editing" : "Done"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
