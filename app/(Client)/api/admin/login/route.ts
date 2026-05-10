import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectMongo } from "@/lib/mongodb";
import { AdminUserModel } from "@/lib/models/AdminUser";
import { signAdminToken, setAdminCookie } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    await connectMongo();
    const admin = await AdminUserModel.findOne({
      email: String(email).toLowerCase().trim(),
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = await signAdminToken({
      sub: String(admin._id),
      email: admin.email,
      role: admin.role as "admin" | "superadmin",
    });

    await setAdminCookie(token);
    admin.lastLoginAt = new Date();
    await admin.save();

    return NextResponse.json({
      success: true,
      admin: { email: admin.email, name: admin.name, role: admin.role },
    });
  } catch (err) {
    console.error("[admin/login] error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
