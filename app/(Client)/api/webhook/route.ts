import { NextRequest, NextResponse } from "next/server";

// PhonePe webhook — sirf confirmation ke liye
// Order Sanity mein success/page.tsx se save hota hai
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[PhonePe Webhook] Event:", JSON.stringify(body));

    const eventType = body?.type;
    const merchantOrderId =
      body?.payload?.merchantOrderId ||
      body?.payload?.orderId ||
      "unknown";

    console.log(`[PhonePe Webhook] Event: ${eventType}, Order: ${merchantOrderId}`);

    // PhonePe ko 200 dena zaroori hai — warna retry karta rehta hai
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("[PhonePe Webhook] Error:", error);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}