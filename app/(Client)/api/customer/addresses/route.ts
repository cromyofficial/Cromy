import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/User";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();
  const user = await UserModel.findOne({ clerkUserId: userId })
    .select("addresses")
    .lean();

  return NextResponse.json({ addresses: (user as { addresses?: unknown[] } | null)?.addresses ?? [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fullName, phone, line1, line2, city, state, postalCode, label, isDefault } = body;

  if (!fullName || !phone || !line1 || !city || !state || !postalCode) {
    return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
  }

  await connectMongo();

  const newAddress = { fullName, phone, line1, line2, city, state, postalCode, label, isDefault: !!isDefault, country: "IN" };

  const user = await UserModel.findOneAndUpdate(
    { clerkUserId: userId },
    {
      $setOnInsert: { clerkUserId: userId },
      $push: { addresses: newAddress },
    },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ addresses: (user as { addresses?: unknown[] } | null)?.addresses ?? [] });
}

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { addressId } = await req.json();
  if (!addressId) return NextResponse.json({ error: "addressId required" }, { status: 400 });

  await connectMongo();
  const user = await UserModel.findOneAndUpdate(
    { clerkUserId: userId },
    { $pull: { addresses: { _id: addressId } } },
    { new: true }
  ).lean();

  return NextResponse.json({ addresses: (user as { addresses?: unknown[] } | null)?.addresses ?? [] });
}
