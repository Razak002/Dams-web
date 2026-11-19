"use client";

import * as React from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AdminApiError,
  getAdminShippingSettings,
  updateAdminShippingSettings,
} from "@/lib/admin-api";
import type { ShippingSettings } from "@/types/admin";
import { NIGERIAN_STATES } from "@/lib/utils";
import { AdminErrorBanner } from "@/components/admin/AdminBadge";
import { Button } from "@/components/ui/Buttons";
import { Input } from "@/components/ui/Inputs";

export default function AdminShippingSettingsPage() {
  const [settings, setSettings] = React.useState<ShippingSettings>({
    freeShippingThreshold: 150000,
    defaultNationwideFee: 7500,
    defaultNationwideEta: "2–4 business days nationwide",
    stateRates: [
      {
        state: "Abuja (FCT)",
        fee: 4000,
        estimatedDelivery: "24 hours within Abuja (FCT)",
      },
    ],
  });

  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
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
        const data = await getAdminShippingSettings();
        if (active && data) setSettings(data);
      } catch (err) {
        if (!active) return;
        setError({
          message:
            err instanceof AdminApiError
              ? err.message
              : "Unable to load shipping settings.",
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await updateAdminShippingSettings(settings);
      setSettings(updated);
      toast.success("Shipping configuration saved successfully.");
    } catch (err) {
      toast.error(
        err instanceof AdminApiError
          ? err.message
          : "Unable to save shipping settings."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center gap-2 text-[#013E37]">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Loading shipping configuration...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
          Logistics Configuration
        </p>
        <h1 className="font-serif text-3xl text-[#171C1A] mt-1">
          Shipping Settings
        </h1>
      </div>

      {error && (
        <AdminErrorBanner
          message={error.message}
          isForbidden={error.isForbidden}
        />
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white border border-[#171C1A]/10 p-6 space-y-5">
          <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
            Nationwide Defaults
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Input
              label="Free Shipping Threshold (₦)"
              type="number"
              min={0}
              required
              value={String(settings.freeShippingThreshold)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  freeShippingThreshold: Number(e.target.value),
                })
              }
            />
            <Input
              label="Default Nationwide Fee (₦)"
              type="number"
              min={0}
              required
              value={String(settings.defaultNationwideFee)}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultNationwideFee: Number(e.target.value),
                })
              }
            />
            <Input
              label="Default Nationwide ETA"
              required
              value={settings.defaultNationwideEta}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  defaultNationwideEta: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="bg-white border border-[#171C1A]/10 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#171C1A]/10 pb-3">
            <h2 className="font-serif text-xl text-[#171C1A]">
              State-Specific Rates
            </h2>
            <button
              type="button"
              onClick={() =>
                setSettings({
                  ...settings,
                  stateRates: [
                    ...settings.stateRates,
                    {
                      state: "Lagos",
                      fee: 6500,
                      estimatedDelivery: "2–3 business days",
                    },
                  ],
                })
              }
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#013E37] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add State Rate</span>
            </button>
          </div>

          <div className="space-y-3">
            {settings.stateRates.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 bg-[#FAF9F6] border border-[#171C1A]/10"
              >
                <div className="sm:col-span-4">
                  <select
                    value={row.state}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stateRates: settings.stateRates.map((r, i) =>
                          i === idx ? { ...r, state: e.target.value } : r
                        ),
                      })
                    }
                    className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <input
                    type="number"
                    min={0}
                    value={row.fee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stateRates: settings.stateRates.map((r, i) =>
                          i === idx ? { ...r, fee: Number(e.target.value) } : r
                        ),
                      })
                    }
                    className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs font-semibold"
                    placeholder="Fee (₦)"
                  />
                </div>

                <div className="sm:col-span-4">
                  <input
                    type="text"
                    value={row.estimatedDelivery}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        stateRates: settings.stateRates.map((r, i) =>
                          i === idx
                            ? { ...r, estimatedDelivery: e.target.value }
                            : r
                        ),
                      })
                    }
                    className="h-10 w-full px-3 bg-white border border-[#171C1A]/20 text-xs"
                    placeholder="Estimated delivery"
                  />
                </div>

                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        stateRates: settings.stateRates.filter(
                          (_, i) => i !== idx
                        ),
                      })
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

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={saving}
            className="uppercase tracking-[0.16em] text-xs font-bold"
          >
            {saving ? "Saving Settings..." : "Save Shipping Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
