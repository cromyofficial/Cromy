import mongoose, { Schema, Model, InferSchemaType } from "mongoose";

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    sanityProductId: { type: String },
    name: { type: String, required: true },
    slug: { type: String },
    image: { type: String },
    size: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0 },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema(
  {
    fullName: { type: String },
    phone: { type: String },
    line1: { type: String },
    line2: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "IN" },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    sanityOrderId: { type: String, index: true },

    clerkUserId: { type: String, required: true, index: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, index: true },
    phone: { type: String },

    items: { type: [OrderItemSchema], default: [] },
    shippingAddress: { type: ShippingAddressSchema },

    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "inr", lowercase: true },

    paymentProvider: {
      type: String,
      enum: ["stripe", "phonepe", "cod", "other"],
      default: "phonepe",
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
      index: true,
    },
    paymentIntentId: { type: String },
    checkoutSessionId: { type: String },
    transactionId: { type: String },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      index: true,
    },

    invoice: {
      id: String,
      number: String,
      hostedUrl: String,
    },

    notes: { type: String },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });

export type OrderDoc = InferSchemaType<typeof OrderSchema>;

export const OrderModel: Model<OrderDoc> =
  (mongoose.models.Order as Model<OrderDoc>) ||
  mongoose.model<OrderDoc>("Order", OrderSchema);
