import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { OrderModel, ORDER_STATUSES } from "@/lib/models/Order";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { status, notes } = body as { status?: string; notes?: string };

  if (status && !(ORDER_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  await connectMongo();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update: Record<string, any> = {};
  if (status) update.status = status;
  if (notes !== undefined) update.notes = notes;

  const order = await OrderModel.findOneAndUpdate(
    { $or: [{ _id: id }, { orderNumber: id }] },
    { $set: update },
    { new: true }
  ).lean();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ success: true, order });
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectMongo();

  const order = await OrderModel.findOne({
    $or: [{ _id: id }, { orderNumber: id }],
  }).lean();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  return NextResponse.json({ order });
}
