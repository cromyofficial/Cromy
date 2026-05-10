// Run once to create the initial admin user.
// Usage: node scripts/seedAdmin.mjs <email> <password> [name]
// Requires MONGODB_URI in your shell env or .env.local (loaded manually).

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)\s*=\s*(.*)$/);
    if (!m) continue;
    const [, key, raw] = m;
    if (process.env[key]) continue;
    let value = raw.trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadEnvLocal();

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error("Usage: node scripts/seedAdmin.mjs <email> <password> [name]");
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI not set");
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: String,
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "superadmin" },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

const AdminUser =
  mongoose.models.AdminUser || mongoose.model("AdminUser", AdminUserSchema);

await mongoose.connect(process.env.MONGODB_URI);

const existing = await AdminUser.findOne({ email: email.toLowerCase() });
if (existing) {
  console.log("Admin already exists:", existing.email);
  await mongoose.disconnect();
  process.exit(0);
}

const passwordHash = await bcrypt.hash(password, 12);
const admin = await AdminUser.create({
  email: email.toLowerCase(),
  name: name ?? "Admin",
  passwordHash,
  role: "superadmin",
});

console.log("Created admin:", admin.email, "role:", admin.role);
await mongoose.disconnect();
