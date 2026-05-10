"use client";
import useCartStore from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Home, Package, ShoppingBag } from "lucide-react";
import Link from "next/link";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? searchParams.get("merchantOrderId");
  const sessionId = searchParams.get("session_id");

  const { resetCart, pendingOrder, clearPendingOrder } = useCartStore();
  const router = useRouter();
  const savedRef = useRef(false);
  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    if (!orderNumber && !sessionId) {
      console.warn("No orderNumber/sessionId — skipping order save.");
      return;
    }

    resetCart();

    // Persist the order to MongoDB (non-blocking — UI doesn't wait)
    if (pendingOrder && !savedRef.current) {
      savedRef.current = true;
      fetch("/api/saveOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          merchantOrderId: pendingOrder.orderNumber,
          clerkUserId: pendingOrder.clerkUserId,
          customerName: pendingOrder.customerName,
          customerEmail: pendingOrder.customerEmail,
          customerPhone: pendingOrder.customerPhone,
          shippingAddress: pendingOrder.shippingAddress,
          totalPrice: pendingOrder.totalPrice,
          items: pendingOrder.items,
          paymentProvider: "phonepe",
          currency: "inr",
        }),
      })
        .then((r) => r.json())
        .then(() => {
          setOrderSaved(true);
          clearPendingOrder();
        })
        .catch((err) => {
          console.error("[success] saveOrder failed:", err);
          clearPendingOrder();
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="py-10 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl px-8 py-12 max-w-xl w-full text-center"
      >
        <motion.div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <Check className="text-white w-12 h-12" />
        </motion.div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order confirmed!</h1>
        <div className="space-y-4 mb-8 text-left">
          <p className="text-gray-700">
            Thank you for your purchase. We&apos;re processing your order and will ship it
            soon. A confirmation email with your order details will be sent to your inbox
            shortly.
          </p>
          {orderNumber && (
            <p className="text-gray-700">
              Order Number:{" "}
              <span className="text-black font-semibold">{orderNumber}</span>
            </p>
          )}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h2>
          <ul className="text-gray-700 text-sm space-y-1">
            <li>Check your email for order confirmation</li>
            <li>We&apos;ll notify you when your order ships</li>
            <li>Track your order status anytime from your dashboard</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <Home className="w-5 h-5 mr-2" />
            Home
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-black border border-black rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-md"
          >
            <Package className="w-5 h-5 mr-2" />
            My Orders
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Shop
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
