"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import {
  Sparkles,
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { submitCustomShoeOrder } from "@/lib/api-client";
import {
  NIGERIAN_STATES,
  formatNGN,
  buildWhatsAppCustomOrderUrl,
  cn,
} from "@/lib/utils";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Buttons";

const MATERIAL_OPTIONS = [
  "Full-Grain Calfskin",
  "Natural Cork & Leather",
  "Velvet Suede",
  "Hand-Woven Nappa",
  "Croc-Embossed Leather",
  "Custom / Other",
] as const;

const SIZE_OPTIONS = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46] as const;

const step1Schema = z.object({
  description: z
    .string()
    .min(
      10,
      "Please describe the shoe style or occasion (at least 10 characters)."
    ),
  preferredMaterial: z.string().min(2, "Please select a preferred material."),
});

const step2Schema = z.object({
  size: z.number().min(35).max(50),
  budgetNGN: z
    .number({ message: "Please enter your target price in Naira." })
    .min(20000, "Minimum custom workshop commission starts from ₦20,000."),
  locationState: z.string().min(2, "Please select your state."),
  locationCity: z.string().min(2, "Please enter your city or area."),
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(10, "Please enter an active phone / WhatsApp number."),
});

export function CustomShoeRequestWizard() {
  const [step, setStep] = React.useState<1 | 2>(1);

  // Form State
  const [description, setDescription] = React.useState("");
  const [preferredMaterial, setPreferredMaterial] = React.useState<string>(
    MATERIAL_OPTIONS[0]
  );
  const [sampleFile, setSampleFile] = React.useState<File | null>(null);
  const [samplePreviewUrl, setSamplePreviewUrl] = React.useState<string | null>(
    null
  );

  const [size, setSize] = React.useState<number>(42);
  const [budgetInput, setBudgetInput] = React.useState<string>("65000");
  const [locationState, setLocationState] =
    React.useState<string>("Abuja (FCT)");
  const [locationCity, setLocationCity] = React.useState<string>("");
  const [fullName, setFullName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submittedResult, setSubmittedResult] = React.useState<{
    referenceId?: string;
    message: string;
    whatsappUrl: string;
  } | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Clean up object URL on unmount
  React.useEffect(() => {
    return () => {
      if (samplePreviewUrl) {
        URL.revokeObjectURL(samplePreviewUrl);
      }
    };
  }, [samplePreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        sampleFile: "Sample image must be under 5MB.",
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next.sampleFile;
      return next;
    });

    if (samplePreviewUrl) {
      URL.revokeObjectURL(samplePreviewUrl);
    }
    setSampleFile(file);
    setSamplePreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveSample = () => {
    if (samplePreviewUrl) {
      URL.revokeObjectURL(samplePreviewUrl);
    }
    setSampleFile(null);
    setSamplePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProceedToStep2 = () => {
    setErrors({});
    const parsed = step1Schema.safeParse({
      description,
      preferredMaterial,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const numericBudget = Number(budgetInput.replace(/[^0-9]/g, ""));
    const parsed = step2Schema.safeParse({
      size,
      budgetNGN: numericBudget,
      locationState,
      locationCity,
      fullName,
      email,
      phone,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const payload = {
      description,
      preferredMaterial,
      size,
      budgetNGN: numericBudget,
      locationState,
      locationCity,
      fullName,
      email,
      phone,
      sampleImageName: sampleFile?.name,
    };

    const res = await submitCustomShoeOrder(payload, sampleFile);
    setSubmitting(false);

    if (res.status === "success") {
      const whatsappUrl = buildWhatsAppCustomOrderUrl({
        ...payload,
        referenceId: res.referenceId,
      });

      setSubmittedResult({
        referenceId: res.referenceId,
        message: res.message,
        whatsappUrl,
      });
    } else {
      setErrors({ form: res.message });
    }
  };

  const handleReset = () => {
    setSubmittedResult(null);
    setStep(1);
    setDescription("");
    handleRemoveSample();
  };

  const parsedBudgetPreview = Number(budgetInput.replace(/[^0-9]/g, "")) || 0;

  return (
    <section className="py-14 sm:py-28 bg-[#FAF9F6] border-t border-[#171C1A]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#013E37] text-[#FFEEB3] text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.18em]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke &amp; Custom Pair Commission</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#171C1A]">
            Have a Specific Shoe in Mind?
          </h2>
          <p className="text-xs sm:text-base text-[#777F7B] leading-relaxed">
            Describe the exact shoe you need—your preferred leather or natural
            material, size, budget, and an optional sample photo—and our Abuja
            shoemakers will contact you to bring it to life.
          </p>
        </div>

        {/* Wizard Card */}
        <div className="mt-8 sm:mt-10 bg-white border border-[#171C1A]/15 shadow-sm overflow-hidden">
          {/* Progress Bar Header */}
          {!submittedResult && (
            <div className="bg-[#013E37] text-white px-4 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors",
                    step === 1
                      ? "bg-[#FFEEB3] text-[#013E37]"
                      : "bg-white/15 text-[#FFEEB3]"
                  )}
                >
                  1
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold tracking-wide",
                    step === 1 ? "text-[#FFEEB3]" : "text-white/75"
                  )}
                >
                  Style &amp; Sample
                </span>
              </div>

              <div className="flex-1 max-w-12 sm:max-w-24 h-[1px] bg-white/20 mx-1 sm:mx-4" />

              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0 transition-colors",
                    step === 2
                      ? "bg-[#FFEEB3] text-[#013E37]"
                      : "bg-white/15 text-white/70"
                  )}
                >
                  2
                </span>
                <span
                  className={cn(
                    "text-xs sm:text-sm font-semibold tracking-wide",
                    step === 2 ? "text-[#FFEEB3]" : "text-white/70"
                  )}
                >
                  Budget &amp; Contact
                </span>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-10">
            <AnimatePresence mode="wait">
              {submittedResult ? (
                <motion.div
                  key="confirmed"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-center py-6 space-y-6 max-w-xl mx-auto"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#013E37] text-[#FFEEB3] flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#013E37]">
                      Request Logged{" "}
                      {submittedResult.referenceId
                        ? `• ${submittedResult.referenceId}`
                        : ""}
                    </p>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#171C1A]">
                      Our Abuja Shoemakers Will Be in Touch
                    </h3>
                    <p className="text-sm text-[#777F7B] leading-relaxed">
                      {submittedResult.message}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF9F6] border border-[#171C1A]/10 text-left text-xs space-y-1.5 text-[#171C1A]">
                    <p>
                      <strong>Material:</strong> {preferredMaterial} •{" "}
                      <strong>Size:</strong> EU {size} •{" "}
                      <strong>Budget:</strong> {formatNGN(parsedBudgetPreview)}
                    </p>
                    <p>
                      <strong>Contact:</strong> {fullName} ({phone} / {email}) —{" "}
                      {locationCity}, {locationState}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a
                      href={submittedResult.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-7 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#025249] transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Also Send Details on WhatsApp</span>
                    </a>

                    {submittedResult.referenceId && (
                      <Link
                        href={`/track?ref=${encodeURIComponent(submittedResult.referenceId)}&contact=${encodeURIComponent(email)}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center h-12 px-6 border border-[#013E37]/30 text-xs font-semibold uppercase tracking-[0.15em] text-[#013E37] hover:bg-[#013E37]/5"
                      >
                        Track Status
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full sm:w-auto h-12 px-6 border border-[#171C1A]/20 text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A] hover:border-[#013E37] cursor-pointer"
                    >
                      New Request
                    </button>
                  </div>
                </motion.div>
              ) : step === 1 ? (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Shoe Description */}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="custom-shoe-description"
                      className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                    >
                      1. Describe the Shoe You Want Us to Craft *
                    </label>
                    <textarea
                      id="custom-shoe-description"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us the style, colour, sole type, or occasion (e.g., 'A dark brown double-buckle natural cork slide with gold buckles for daily wear' or 'A black wholecut loafer for my wedding in Abuja')..."
                      className={cn(
                        "w-full bg-white p-4 text-sm text-[#171C1A] placeholder:text-[#777F7B] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none",
                        errors.description && "border-red-600"
                      )}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Preferred Material */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#171C1A]">
                      2. Preferred Material *
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {MATERIAL_OPTIONS.map((mat) => {
                        const isSelected = preferredMaterial === mat;
                        return (
                          <button
                            key={mat}
                            type="button"
                            onClick={() => setPreferredMaterial(mat)}
                            className={cn(
                              "px-4 py-2.5 text-xs font-semibold tracking-wide border transition-all cursor-pointer",
                              isSelected
                                ? "bg-[#013E37] text-[#FFEEB3] border-[#013E37]"
                                : "bg-[#FAF9F6] text-[#171C1A] border-[#171C1A]/15 hover:border-[#013E37]"
                            )}
                          >
                            {mat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Optional Sample Image Upload */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#171C1A]">
                      3. Upload a Sample / Reference Photo{" "}
                      <span className="text-[#777F7B] font-normal">
                        (Optional)
                      </span>
                    </span>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleFileChange}
                      className="hidden"
                      id="custom-sample-upload"
                    />

                    {samplePreviewUrl && sampleFile ? (
                      <div className="flex items-center justify-between p-3.5 bg-[#FAF9F6] border border-[#013E37]/30">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-16 h-16 bg-white border border-[#171C1A]/10 shrink-0 overflow-hidden">
                            <Image
                              src={samplePreviewUrl}
                              alt="Uploaded shoe sample preview"
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#171C1A] truncate">
                              {sampleFile.name}
                            </p>
                            <p className="text-[11px] text-[#777F7B]">
                              {(sampleFile.size / 1024).toFixed(0)} KB • Ready
                              to attach
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveSample}
                          className="p-2 text-[#777F7B] hover:text-red-600 transition-colors cursor-pointer"
                          aria-label="Remove sample image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="custom-sample-upload"
                        className="flex flex-col items-center justify-center gap-2 p-6 border border-dashed border-[#171C1A]/25 bg-[#FAF9F6] hover:border-[#013E37] hover:bg-[#013E37]/[0.02] transition-colors cursor-pointer text-center"
                      >
                        <Upload className="w-5 h-5 text-[#013E37]" />
                        <span className="text-xs font-semibold text-[#171C1A]">
                          Click to upload a reference photo or sketch
                        </span>
                        <span className="text-[11px] text-[#777F7B]">
                          PNG, JPG or WebP (Max 5MB)
                        </span>
                      </label>
                    )}

                    {errors.sampleFile && (
                      <p className="text-xs text-red-600">
                        {errors.sampleFile}
                      </p>
                    )}
                  </div>

                  {/* Step 1 Footer */}
                  <div className="pt-2 flex justify-end">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      onClick={handleProceedToStep2}
                      className="uppercase tracking-[0.16em] text-xs font-semibold"
                    >
                      <span>Next: Size, Budget &amp; Contact</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="step-2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.25 }}
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >
                  {/* Size Selector */}
                  <div className="space-y-2.5">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-[#171C1A]">
                      4. Select Your Shoe Size (EU) *
                    </span>
                    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                      {SIZE_OPTIONS.map((sz) => {
                        const isSelected = size === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setSize(sz)}
                            className={cn(
                              "h-11 border text-xs font-semibold transition-all cursor-pointer",
                              isSelected
                                ? "bg-[#013E37] text-[#FFEEB3] border-[#013E37]"
                                : "bg-white text-[#171C1A] border-[#171C1A]/20 hover:border-[#013E37]"
                            )}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Price + Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="custom-budget"
                        className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                      >
                        5. Target Budget (₦ NGN) *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-sm font-bold text-[#013E37]">
                          ₦
                        </span>
                        <input
                          id="custom-budget"
                          type="number"
                          min={20000}
                          step={1000}
                          value={budgetInput}
                          onChange={(e) => setBudgetInput(e.target.value)}
                          placeholder="65000"
                          className={cn(
                            "h-12 w-full bg-white pl-8 pr-4 text-sm font-semibold text-[#171C1A] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none",
                            errors.budgetNGN && "border-red-600"
                          )}
                        />
                      </div>
                      {errors.budgetNGN ? (
                        <p className="text-xs text-red-600">
                          {errors.budgetNGN}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#777F7B]">
                          Proposed: {formatNGN(parsedBudgetPreview)}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor="custom-state"
                        className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                      >
                        State (Nigeria) *
                      </label>
                      <select
                        id="custom-state"
                        value={locationState}
                        onChange={(e) => setLocationState(e.target.value)}
                        className="h-12 w-full bg-white px-3.5 text-sm text-[#171C1A] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none"
                      >
                        {NIGERIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Input
                      label="City / Area *"
                      placeholder="e.g. Wuse II, Maitama"
                      value={locationCity}
                      onChange={(e) => setLocationCity(e.target.value)}
                      error={errors.locationCity}
                    />
                  </div>

                  {/* Contact Details (Name, Email, Phone) */}
                  <div className="pt-2 border-t border-[#171C1A]/10 space-y-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#013E37]">
                        6. Your Contact Details
                      </h3>
                      <p className="text-xs text-[#777F7B]">
                        Our Abuja shoemakers will reach out via phone or email
                        to get a clearer picture of your custom pair.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <Input
                        label="Full Name *"
                        placeholder="e.g. Ibrahim Musa"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={errors.fullName}
                      />
                      <Input
                        label="Email Address *"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                      />
                      <Input
                        label="Phone / WhatsApp *"
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={errors.phone}
                      />
                    </div>
                  </div>

                  {errors.form && (
                    <p className="text-xs text-red-600">{errors.form}</p>
                  )}

                  {/* Step 2 Navigation Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-5 border border-[#171C1A]/20 text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A] hover:border-[#013E37] cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 1</span>
                    </button>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={submitting}
                      className="w-full sm:w-auto uppercase tracking-[0.16em] text-xs font-semibold"
                    >
                      {submitting
                        ? "Submitting to Abuja Workshop..."
                        : "Submit Custom Shoe Request"}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
