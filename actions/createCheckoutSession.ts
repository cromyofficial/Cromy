"use server";

import { CartItem } from "@/store";
import { createPhonePePayment } from "@/lib/phonepe";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
  customerMobile?: string;
  customerAddress?: string;
}

function getBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

function calculateTotalPaise(items: CartItem[]): number {
  const totalRupees = items.reduce(
    (sum, { product, quantity }) => sum + (product.price ?? 0) * quantity,
    0
  );
  return Math.max(100, Math.round(totalRupees * 100));
}

export async function createCheckoutSession(
  items: CartItem[],
  metadata: Metadata
) {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty");
  }

  const merchantOrderId = metadata.orderNumber;
  const amountInPaise = calculateTotalPaise(items);

  const baseUrl = getBaseUrl();
  const redirectUrl = `${baseUrl}/success?merchantOrderId=${encodeURIComponent(
    merchantOrderId
  )}&orderNumber=${encodeURIComponent(merchantOrderId)}`;

  try {
    const result = await createPhonePePayment({
      merchantOrderId,
      amountInPaise,
      redirectUrl,
      message: `Payment for order ${merchantOrderId}`,
      metaInfo: {
        udf1: metadata.clerkUserId,
        udf2: metadata.customerEmail,
      },
    });
    console.log("[checkout] PhonePe pay ok:", {
      merchantOrderId,
      orderId: result.orderId,
      state: result.state,
    });
    return result.redirectUrl;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[checkout] PhonePe pay failed:", msg);
    throw new Error(`PhonePe error: ${msg}`);
  }
}
