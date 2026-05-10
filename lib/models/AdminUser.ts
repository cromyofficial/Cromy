import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

export const ADMIN_ROLES = ["admin", "superadmin"] as const;

const AdminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ADMIN_ROLES, default: "admin" },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;

export const AdminUserModel: Model<AdminUserDoc> =
  (mongoose.models.AdminUser as Model<AdminUserDoc>) ||
  mongoose.model<AdminUserDoc>("AdminUser", AdminUserSchema);
