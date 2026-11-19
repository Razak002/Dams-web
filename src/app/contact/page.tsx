"use client";

import * as React from "react";
import { z } from "zod";
import {
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { submitEnquiry } from "@/lib/api-client";
import { DAMS_WHATSAPP_NUMBER } from "@/lib/utils";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Buttons";

const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(8, "Please provide a valid Nigerian or international phone number."),
  subject: z.enum([
    "sizing",
    "bespoke",
    "order-status",
    "wholesale",
    "general",
  ]),
  message: z
    .string()
    .min(10, "Please share a few more details (at least 10 characters)."),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export default function ContactPage() {
  const [values, setValues] = React.useState<EnquiryFormValues>({
    fullName: "",
    email: "",
    phone: "",
    subject: "sizing",
    message: "",
  });
  const [errors, setErrors] = React.useState<
    Partial<Record<keyof EnquiryFormValues, string>>
  >({});
  const [submitting, setSubmitting] = React.useState(false);
  const [ticketResponse, setTicketResponse] = React.useState<{
    message: string;
    ticketId?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof EnquiryFormValues;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    const res = await submitEnquiry(parsed.data);
    setSubmitting(false);

    if (res.status === "success") {
      setTicketResponse({
        message: res.message,
        ticketId: res.ticketId,
      });
      setValues({
        fullName: "",
        email: "",
        phone: "",
        subject: "sizing",
        message: "",
      });
    } else {
      setErrors({ message: res.message });
    }
  };

  const whatsappDirectUrl = `https://wa.me/${DAMS_WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hello DÁMS Footwear Concierge, I have an enquiry regarding your shoes:"
  )}`;

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-[#013E37] text-white py-14 sm:py-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FFEEB3]">
            Client Concierge & Bespoke Enquiries
          </p>
          <h1 className="mt-3 font-serif text-4xl sm:text-5xl text-white">
            Speak With Our Abuja Atelier
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/80 max-w-2xl leading-relaxed">
            Whether you need advice on last sizing, a wedding or corporate commission, or an update on your delivery, our team in Abuja responds personally.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-6 bg-[#013E37] text-white space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FFEEB3]">
                  Fastest Response
                </span>
                <MessageSquare className="w-5 h-5 text-[#FFEEB3]" />
              </div>
              <h2 className="font-serif text-2xl text-white">
                WhatsApp Direct Concierge
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Chat directly with a DÁMS fitting specialist in Abuja for instant sizing guidance, live leather swatch photos, or same-day dispatch requests.
              </p>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full h-12 bg-[#FFEEB3] text-[#013E37] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#ffe58f] transition-colors"
              >
                <span>Chat on WhatsApp</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

            <div className="space-y-6 p-6 bg-[#FAF9F6] border border-[#171C1A]/10">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#013E37] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                    Abuja Workshop & Fitting Lounge
                  </h3>
                  <p className="mt-1 text-sm text-[#777F7B]">
                    Wuse II / Maitama Fitting Lounge & Manufacturing Workshop, Abuja (FCT), Nigeria
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-[#013E37] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                    Direct Email
                  </h3>
                  <p className="mt-1 text-sm text-[#777F7B]">
                    concierge@damsfootwear.ng
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-5 h-5 text-[#013E37] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#171C1A]">
                    Atelier Hours (WAT)
                  </h3>
                  <p className="mt-1 text-sm text-[#777F7B]">
                    Monday – Saturday: 9:00 AM – 6:30 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Zod-Validated Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 bg-white border border-[#171C1A]/15">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#171C1A]">
                Send an Enquiry
              </h2>
              <p className="mt-2 text-sm text-[#777F7B]">
                Complete the form below and our client concierge will reply within 4 business hours.
              </p>

              {ticketResponse ? (
                <div className="mt-8 p-6 bg-[#FAF9F6] border border-[#013E37]/30 space-y-3">
                  <div className="flex items-center gap-2.5 text-[#013E37]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      Enquiry Received{" "}
                      {ticketResponse.ticketId
                        ? `• Ref ${ticketResponse.ticketId}`
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm text-[#171C1A]">
                    {ticketResponse.message}
                  </p>
                  <button
                    type="button"
                    onClick={() => setTicketResponse(null)}
                    className="text-xs font-semibold uppercase tracking-wider text-[#013E37] underline underline-offset-4 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="mt-8 space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      placeholder="e.g. Tunde Adeyemi"
                      value={values.fullName}
                      onChange={(e) =>
                        setValues({ ...values, fullName: e.target.value })
                      }
                      error={errors.fullName}
                    />
                    <Input
                      label="Phone Number (WhatsApp Preferred)"
                      placeholder="+234 803 000 0000"
                      value={values.phone}
                      onChange={(e) =>
                        setValues({ ...values, phone: e.target.value })
                      }
                      error={errors.phone}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="you@example.com"
                      value={values.email}
                      onChange={(e) =>
                        setValues({ ...values, email: e.target.value })
                      }
                      error={errors.email}
                    />

                    <div className="flex flex-col gap-1.5 w-full">
                      <label
                        htmlFor="enquiry-subject"
                        className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                      >
                        Enquiry Topic
                      </label>
                      <select
                        id="enquiry-subject"
                        value={values.subject}
                        onChange={(e) =>
                          setValues({
                            ...values,
                            subject: e.target
                              .value as EnquiryFormValues["subject"],
                          })
                        }
                        className="h-12 w-full bg-white px-4 text-sm text-[#171C1A] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none"
                      >
                        <option value="sizing">Sizing & Last Consultation</option>
                        <option value="bespoke">
                          Bespoke / Groom & Event Commission
                        </option>
                        <option value="order-status">
                          Order & Dispatch Status
                        </option>
                        <option value="wholesale">
                          Corporate & Retail Partnership
                        </option>
                        <option value="general">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="enquiry-message"
                      className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="enquiry-message"
                      rows={5}
                      placeholder="Tell us the silhouette, EU/UK size, or bespoke request you have in mind..."
                      value={values.message}
                      onChange={(e) =>
                        setValues({ ...values, message: e.target.value })
                      }
                      className="w-full bg-white p-4 text-sm text-[#171C1A] placeholder:text-[#777F7B] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600">{errors.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={submitting}
                    className="uppercase tracking-[0.18em] text-xs font-semibold"
                  >
                    {submitting
                      ? "Sending to Abuja Concierge..."
                      : "Submit Enquiry"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
