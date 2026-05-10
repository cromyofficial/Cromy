import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { connectMongo } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/User";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();
  const user = await UserModel.findOne({ clerkUserId: userId }).lean();
  return NextResponse.json({ profile: user ?? null });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, phone } = body as { name?: string; phone?: string };

  await connectMongo();
  const profile = await UserModel.findOneAndUpdate(
    { clerkUserId: userId },
    { $set: { ...(name !== undefined && { name }), ...(phone !== undefined && { phone }) } },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({ profile });
}
