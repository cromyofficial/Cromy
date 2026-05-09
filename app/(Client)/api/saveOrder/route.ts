import { NextRequest, NextResponse } from "next/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function POST(req: NextRequest) {
  try {
    const {
      merchantOrderId,
      transactionId,
      customerName,
      customerEmail,
      clerkUserId,
      totalPrice,
    } = await req.json();

    if (!merchantOrderId || !clerkUserId) {
      return NextResponse.json(
        { error: "Required fields missing" },
        { status: 400 }
      );
    }

    // Check karo ke order already exist karta hai ya nahi
    const existing = await backendClient.fetch(
      `*[_type == "order" && orderNumber == $orderNumber][0]._id`,
      { orderNumber: merchantOrderId }
    );

    if (existing) {
      console.log("[saveOrder] Order already exists:", merchantOrderId);
      return NextResponse.json({ success: true, alreadyExists: true });
    }

    // Sanity mein order save karo
    const order = await backendClient.create({
      _type: "order",
      orderNumber: merchantOrderId,
      stripeCheckoutSessionId: "",
      stripePaymentIntentId: transactionId || "",
      customerName: customerName || "Unknown",
      stripeCustomerId: customerEmail || "",
      clerkUserId,
      email: customerEmail || "",
      currency: "inr",
      amountDiscount: 0,
      products: [],
      totalPrice: totalPrice || 0,
      status: "paid",
      orderDate: new Date().toISOString(),
    });

    console.log("[saveOrder] Order saved:", order._id);
    return NextResponse.json({ success: true, orderId: order._id });
  } catch (error) {
    console.error("[saveOrder] Error:", error);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}