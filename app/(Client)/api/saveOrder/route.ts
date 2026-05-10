import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { connectMongo } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models/Order";

interface SaveOrderItem {
  productId?: string;
  sanityProductId?: string;
  name?: string;
  slug?: string;
  image?: string;
  size?: string;
  quantity?: number;
  price?: number;
  discount?: number;
}

interface SaveOrderBody {
  merchantOrderId: string;
  transactionId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  clerkUserId: string;
  totalPrice?: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  currency?: string;
  paymentProvider?: "stripe" | "phonepe" | "cod" | "other";
  items?: SaveOrderItem[];
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveOrderBody;
    const {
      merchantOrderId,
      transactionId,
      customerName,
      customerEmail,
      customerPhone,
      clerkUserId,
      totalPrice,
      subtotal,
      discount,
      shipping,
      currency,
      paymentProvider,
      items,
      shippingAddress,
    } = body;

    if (!merchantOrderId || !clerkUserId) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // ---- Sanity (primary, unchanged behavior) ----
    let sanityOrderId: string | undefined;
    const existing = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]._id`,
      { orderNumber: merchantOrderId }
    );

    if (existing) {
      console.log("[saveOrder] Sanity order already exists:", merchantOrderId);
      sanityOrderId = existing as string;
    } else {
      const created = await backendClient.create({
        _type: "order",
        orderNumber: merchantOrderId,
        stripeCheckoutSessionId: "",
        stripePaymentIntentId: transactionId || "",
        customerName: customerName || "Unknown",
        stripeCustomerId: customerEmail || "",
        clerkUserId,
        email: customerEmail || "",
        currency: currency || "inr",
        amountDiscount: discount ?? 0,
        products: [],
        totalPrice: totalPrice || 0,
        status: "paid",
        orderDate: new Date().toISOString(),
      });
      sanityOrderId = created._id;
      console.log("[saveOrder] Sanity order saved:", sanityOrderId);
    }

    // ---- MongoDB mirror (non-blocking on failure) ----
    try {
      await connectMongo();
      await OrderModel.updateOne(
        { orderNumber: merchantOrderId },
        {
          $setOnInsert: {
            orderNumber: merchantOrderId,
            clerkUserId,
            createdAt: new Date(),
          },
          $set: {
            sanityOrderId,
            customerName: customerName || "Unknown",
            email: customerEmail || "",
            phone: customerPhone,
            items: (items ?? []).map((it) => ({
              productId: it.productId ?? it.sanityProductId ?? "",
              sanityProductId: it.sanityProductId,
              name: it.name ?? "",
              slug: it.slug,
              image: it.image,
              size: it.size,
              quantity: it.quantity ?? 1,
              price: it.price ?? 0,
              discount: it.discount ?? 0,
            })),
            shippingAddress,
            subtotal: subtotal ?? 0,
            discount: discount ?? 0,
            shipping: shipping ?? 0,
            totalPrice: totalPrice || 0,
            currency: (currency || "inr").toLowerCase(),
            paymentProvider: paymentProvider ?? "phonepe",
            paymentStatus: "paid",
            transactionId: transactionId || undefined,
            status: "confirmed",
          },
        },
        { upsert: true }
      );
      console.log("[saveOrder] Mongo mirror upserted:", merchantOrderId);
    } catch (mongoErr) {
      console.error(
        "[saveOrder] Mongo mirror failed (Sanity write succeeded):",
        mongoErr
      );
    }

    return NextResponse.json({
      success: true,
      orderId: sanityOrderId,
      alreadyExists: !!existing,
    });
  } catch (error) {
    console.error("[saveOrder] Error:", error);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}
