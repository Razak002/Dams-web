"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import {
  Lock,
  MessageSquare,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/use-cart-store";
import { initializeCheckout } from "@/lib/api-client";
import {
  formatNGN,
  NIGERIAN_STATES,
  calculateShippingFee,
  buildWhatsAppOrderUrl,
  cn,
} from "@/lib/utils";
import { Input } from "@/components/ui/Inputs";
import { Button } from "@/components/ui/Buttons";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Enter a valid email for your receipt."),
  phone: z
    .string()
    .min(10, "Enter an active Nigerian phone number for dispatch calls."),
  address: z.string().min(5, "Street address & landmark are required."),
  city: z.string().min(2, "City / LGA is required."),
  state: z.string().min(2, "Please select your state."),
  deliveryNotes: z.string().optional(),
  paymentMethod: z.enum(["paystack", "whatsapp"]),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const emptySubscribe = () => () => {};

export default function CheckoutPage() {
  const router = useRouter();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const items = useCartStore((s) => s.items);

  const [values, setValues] = React.useState<CheckoutFormValues>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "Abuja (FCT)",
    deliveryNotes: "",
    paymentMethod: "paystack",
  });

  const [errors, setErrors] = React.useState<
    Partial<Record<keyof CheckoutFormValues, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingFee = calculateShippingFee(values.state, subtotal);
  const total = subtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const parsed = checkoutSchema.safeParse(values);
    if (!parsed.success) {
      const fieldErrors: Partial<Record<keyof CheckoutFormValues, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof CheckoutFormValues;
        if (key && !fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      setErrors(fieldErrors);
      const firstIssue = parsed.error.issues[0]?.message;
      toast.error(firstIssue || "Please review the highlighted checkout fields.");
      return;
    }

    if (items.length === 0) {
      toast.error("Your bag is empty.");
      return;
    }

    if (parsed.data.paymentMethod === "whatsapp") {
      const whatsappUrl = buildWhatsAppOrderUrl(
        parsed.data,
        items,
        subtotal,
        shippingFee
      );
      toast.success("Opening WhatsApp concierge checkout...");
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      return;
    }

    setIsSubmitting(true);
    const idempotencyKey = `dams_${crypto.randomUUID()}`;

    const response = await initializeCheckout(
      {
        customerName: `${parsed.data.firstName.trim()} ${parsed.data.lastName.trim()}`,
        customerEmail: parsed.data.email.trim(),
        customerPhone: parsed.data.phone.trim(),
        shippingAddress: {
          street: parsed.data.address.trim(),
          city: parsed.data.city.trim(),
          state: parsed.data.state,
        },
        items: items.map((item) => ({
          productId: item.productId,
          size: item.size,
          colour: item.colour,
          quantity: item.quantity,
        })),
      },
      idempotencyKey
    );

    setIsSubmitting(false);

    if (response.status === "success" && response.data?.authorizationUrl) {
      toast.success("Redirecting to Paystack...");
      if (response.data.authorizationUrl.startsWith("http")) {
        window.location.assign(response.data.authorizationUrl);
      } else {
        router.push(response.data.authorizationUrl);
      }
    } else {
      toast.error(
        response.message || "Unable to initialize Paystack checkout."
      );
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="h-80 animate-pulse bg-[#171C1A]/5" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-5">
        <h1 className="font-serif text-3xl text-[#171C1A]">
          No items in your bag for checkout
        </h1>
        <p className="text-sm text-[#777F7B]">
          Add a pair from our Abuja atelier collection before proceeding to checkout.
        </p>
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 px-7 py-4 bg-[#013E37] text-[#FFEEB3] text-xs font-semibold uppercase tracking-[0.18em]"
        >
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#013E37] hover:opacity-80"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Bag</span>
        </Link>

        <h1 className="mt-4 font-serif text-3xl sm:text-4xl text-[#171C1A]">
          Atelier Checkout
        </h1>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          {/* Left: Customer & Delivery Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 sm:p-8 border border-[#171C1A]/15 space-y-6">
              <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
                1. Patron & Dispatch Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="First Name"
                  placeholder="Chidi"
                  value={values.firstName}
                  onChange={(e) =>
                    setValues({ ...values, firstName: e.target.value })
                  }
                  error={errors.firstName}
                />
                <Input
                  label="Last Name"
                  placeholder="Okafor"
                  value={values.lastName}
                  onChange={(e) =>
                    setValues({ ...values, lastName: e.target.value })
                  }
                  error={errors.lastName}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="chidi@example.com"
                  value={values.email}
                  onChange={(e) =>
                    setValues({ ...values, email: e.target.value })
                  }
                  error={errors.email}
                />
                <Input
                  label="Phone Number (For Rider Dispatch)"
                  placeholder="+234 803 000 0000"
                  value={values.phone}
                  onChange={(e) =>
                    setValues({ ...values, phone: e.target.value })
                  }
                  error={errors.phone}
                />
              </div>

              <Input
                label="Street Address & Landmark"
                placeholder="14 Adetokunbo Ademola Crescent, Wuse II"
                value={values.address}
                onChange={(e) =>
                  setValues({ ...values, address: e.target.value })
                }
                error={errors.address}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="City / Area"
                  placeholder="Wuse II / Maitama / Gwarinpa"
                  value={values.city}
                  onChange={(e) =>
                    setValues({ ...values, city: e.target.value })
                  }
                  error={errors.city}
                />

                <div className="flex flex-col gap-1.5 w-full">
                  <label
                    htmlFor="checkout-state"
                    className="text-xs font-semibold uppercase tracking-wider text-[#171C1A]"
                  >
                    State (Nigeria)
                  </label>
                  <select
                    id="checkout-state"
                    value={values.state}
                    onChange={(e) =>
                      setValues({ ...values, state: e.target.value })
                    }
                    className="h-12 w-full bg-white px-4 text-sm text-[#171C1A] border border-[#171C1A]/20 focus:border-[#013E37] focus:outline-none"
                  >
                    {NIGERIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Delivery Instructions (Optional)"
                placeholder="Gate code, preferred delivery time, or gift note"
                value={values.deliveryNotes}
                onChange={(e) =>
                  setValues({ ...values, deliveryNotes: e.target.value })
                }
              />
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white p-6 sm:p-8 border border-[#171C1A]/15 space-y-5">
              <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
                2. Select Payment Channel
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    setValues({ ...values, paymentMethod: "paystack" })
                  }
                  className={cn(
                    "p-5 border text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
                    values.paymentMethod === "paystack"
                      ? "border-[#013E37] bg-[#013E37]/5 ring-1 ring-[#013E37]"
                      : "border-[#171C1A]/20 hover:border-[#171C1A]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#013E37]">
                      Paystack Online
                    </span>
                    <CreditCard className="w-4 h-4 text-[#013E37]" />
                  </div>
                  <p className="text-xs text-[#777F7B] leading-relaxed">
                    Instant confirmation via NGN Debit Card, Bank Transfer, or USSD.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setValues({ ...values, paymentMethod: "whatsapp" })
                  }
                  className={cn(
                    "p-5 border text-left transition-all cursor-pointer flex flex-col justify-between gap-3",
                    values.paymentMethod === "whatsapp"
                      ? "border-[#013E37] bg-[#013E37]/5 ring-1 ring-[#013E37]"
                      : "border-[#171C1A]/20 hover:border-[#171C1A]"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#013E37]">
                      WhatsApp Concierge
                    </span>
                    <MessageSquare className="w-4 h-4 text-[#013E37]" />
                  </div>
                  <p className="text-xs text-[#777F7B] leading-relaxed">
                    Send your formatted order directly to our Abuja team on WhatsApp to finalize.
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Order Review & Pay Button */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 border border-[#171C1A]/15 space-y-6">
            <h2 className="font-serif text-xl text-[#171C1A] border-b border-[#171C1A]/10 pb-3">
              Order Summary ({items.reduce((a, b) => a + b.quantity, 0)} Pairs)
            </h2>

            <div className="divide-y divide-[#171C1A]/10 max-h-80 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.key} className="py-3.5 flex items-center gap-4">
                  <div className="relative w-14 h-16 bg-[#F7F7F5] border border-[#171C1A]/10 shrink-0 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#171C1A] truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#777F7B]">
                      {item.colour} • EU {item.size} × {item.quantity}
                    </p>
                  </div>
                  <p className="text-xs font-bold text-[#171C1A]">
                    {formatNGN(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <dl className="space-y-2.5 text-sm border-t border-[#171C1A]/10 pt-4">
              <div className="flex justify-between">
                <dt className="text-[#777F7B]">Subtotal</dt>
                <dd className="font-semibold text-[#171C1A]">
                  {formatNGN(subtotal)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#777F7B]">
                  Dispatch ({values.state})
                </dt>
                <dd className="font-semibold text-[#013E37]">
                  {shippingFee === 0
                    ? "Complimentary"
                    : formatNGN(shippingFee)}
                </dd>
              </div>
              <div className="flex justify-between text-base font-bold text-[#171C1A] border-t border-[#171C1A]/10 pt-3">
                <dt>Total Due</dt>
                <dd>{formatNGN(total)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={isSubmitting}
              className="uppercase tracking-[0.16em] text-xs font-semibold"
            >
              {isSubmitting ? (
                <span>Connecting to Paystack...</span>
              ) : values.paymentMethod === "paystack" ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay {formatNGN(total)} via Paystack</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Complete Order on WhatsApp</span>
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 text-[11px] text-[#777F7B]">
              <ShieldCheck className="w-4 h-4 text-[#013E37] shrink-0" />
              <span>
                256-bit encrypted checkout powered by Paystack & DÁMS API.
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
