import type { CartItem } from "@/types/cart";
import type { CheckoutCustomerDetails } from "@/types/order";

export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

export function formatNGN(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getCartItemKey(
  productId: string,
  size: number,
  colour?: string
): string {
  return colour ? `${productId}-${size}-${colour}` : `${productId}-${size}`;
}

export const NIGERIAN_STATES = [
  "Abuja (FCT)",
  "Lagos",
  "Kano",
  "Kaduna",
  "Rivers",
  "Oyo",
  "Plateau",
  "Nasarawa",
  "Niger",
  "Kogi",
  "Benue",
  "Ogun",
  "Enugu",
  "Edo",
  "Delta",
  "Anambra",
  "Kwara",
  "Osun",
  "Ondo",
  "Ekiti",
  "Akwa Ibom",
  "Cross River",
  "Abia",
  "Imo",
  "Katsina",
  "Bauchi",
  "Borno",
  "Sokoto",
  "Adamawa",
  "Ebonyi",
  "Gombe",
  "Jigawa",
  "Kebbi",
  "Taraba",
  "Yobe",
  "Zamfara",
  "Bayelsa",
] as const;

export function calculateShippingFee(state: string, subtotal: number): number {
  if (subtotal >= 150000) return 0; // Complimentary nationwide shipping on orders >= ₦150,000
  if (state === "Abuja (FCT)") return 4000;
  if (state === "Nasarawa" || state === "Niger" || state === "Kaduna")
    return 5500;
  return 7500;
}

export const DAMS_WHATSAPP_NUMBER = "2348059282906";

export function formatWhatsAppPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

export function buildWhatsAppOrderUrl(
  customer: CheckoutCustomerDetails,
  items: CartItem[],
  subtotal: number,
  shippingFee: number
): string {
  const total = subtotal + shippingFee;
  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}* (${item.colour}, EU ${item.size} / UK ${item.ukSize}) × ${item.quantity} — ${formatNGN(item.price * item.quantity)}`
    )
    .join("\n");

  const message = [
    "Hello *DÁMS Footwear*, I would like to place an order:",
    "",
    "*Order Summary*",
    itemLines,
    "",
    `Subtotal: ${formatNGN(subtotal)}`,
    `Delivery (${customer.state}): ${shippingFee === 0 ? "Complimentary" : formatNGN(shippingFee)}`,
    `*Total: ${formatNGN(total)}*`,
    "",
    "*Customer & Delivery Details*",
    `Name: ${customer.firstName} ${customer.lastName}`,
    `Phone: ${customer.phone}`,
    `Email: ${customer.email}`,
    `Address: ${customer.address}, ${customer.city}, ${customer.state}`,
    customer.deliveryNotes ? `Notes: ${customer.deliveryNotes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${DAMS_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppCustomOrderUrl(payload: {
  referenceId?: string;
  description: string;
  preferredMaterial: string;
  size: number;
  budgetNGN: number;
  locationState: string;
  locationCity: string;
  fullName: string;
  email: string;
  phone: string;
  sampleImageName?: string;
}): string {
  const lines = [
    "Hello *DÁMS Abuja Atelier*, I would like to request a custom-made pair of shoes:",
    payload.referenceId ? `Reference: *${payload.referenceId}*` : "",
    "",
    "*Custom Pair Specifications*",
    `• Description: ${payload.description}`,
    `• Preferred Material: ${payload.preferredMaterial}`,
    `• Size: EU ${payload.size}`,
    `• Target Budget: ${formatNGN(payload.budgetNGN)}`,
    payload.sampleImageName
      ? `• Sample Image Uploaded: ${payload.sampleImageName} (I will attach the photo here as well)`
      : "",
    "",
    "*Customer & Contact Details*",
    `• Name: ${payload.fullName}`,
    `• Email: ${payload.email}`,
    `• Phone: ${payload.phone}`,
    `• Location: ${payload.locationCity}, ${payload.locationState}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${DAMS_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`;
}

