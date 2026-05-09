import { NextRequest, NextResponse } from "next/server";
import { getPhonePeOrderStatus } from "@/lib/phonepe.ts";

export async function GET(req: NextRequest) {
  const merchantOrderId = req.nextUrl.searchParams.get("merchantOrderId");
  if (!merchantOrderId) {
    return NextResponse.json(
      { error: "merchantOrderId is required" },
      { status: 400 }
    );
  }

  try {
    const status = await getPhonePeOrderStatus(merchantOrderId);

    let mappedStatus: "paid" | "cancelled" | "pending" = "pending";
    if (status.state === "COMPLETED") mappedStatus = "paid";
    else if (status.state === "FAILED") mappedStatus = "cancelled";

    const txn = status.paymentDetails?.[0];

    return NextResponse.json({
      merchantOrderId,
      state: status.state,
      orderStatus: mappedStatus,
      transactionId: txn?.transactionId ?? null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("PhonePe status check failed:", message);
    return NextResponse.json(
      { error: "Status check failed", details: message },
      { status: 500 }
    );
  }
}
