"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { Loader2, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import toast from "react-hot-toast";

interface OrderItem {
  name: string;
  size?: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone?: string;
  totalPrice: number;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  items: OrderItem[];
  shippingAddress?: {
    fullName?: string;
    phone?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
  createdAt: string;
  notes?: string;
}

const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
        ...(status !== "all" && { status }),
      });
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      setOrders(data.orders ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success("Order status updated");
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : prev));
      fetchOrders();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#151515]">Orders</h1>
          <p className="text-gray-500 text-sm">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order #, name, or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
          />
        </div>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Email</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.orderNumber.slice(-12)}
                    </td>
                    <td className="px-4 py-3 font-medium">{order.customerName}</td>
                    <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{order.email}</td>
                    <td className="px-4 py-3 font-semibold">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {order.createdAt
                        ? format(new Date(order.createdAt), "dd MMM yyyy")
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                        }}
                        className="text-blue-600 text-xs hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t text-sm text-gray-500">
            <span>Page {page} of {pages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h2 className="font-semibold text-[#151515]">
                Order #{selectedOrder.orderNumber.slice(-10)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer info */}
              <section>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Customer</h3>
                <p className="font-medium">{selectedOrder.customerName}</p>
                <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                {selectedOrder.phone && (
                  <p className="text-sm text-gray-500">{selectedOrder.phone}</p>
                )}
              </section>

              {/* Shipping address */}
              {selectedOrder.shippingAddress?.line1 && (
                <section>
                  <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Shipping Address</h3>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.line1}
                    {selectedOrder.shippingAddress.line2 && `, ${selectedOrder.shippingAddress.line2}`}
                  </p>
                  <p className="text-sm">
                    {[
                      selectedOrder.shippingAddress.city,
                      selectedOrder.shippingAddress.state,
                      selectedOrder.shippingAddress.postalCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </section>
              )}

              {/* Items */}
              <section>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((it, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>
                        {it.name}
                        {it.size && (
                          <span className="ml-1 text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                            {it.size}
                          </span>
                        )}{" "}
                        × {it.quantity}
                      </span>
                      <span className="font-medium">
                        ₹{(it.price * it.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{selectedOrder.totalPrice.toLocaleString("en-IN")}</span>
                </div>
              </section>

              {/* Payment */}
              <section>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Payment</h3>
                <div className="flex gap-3 text-sm">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[selectedOrder.paymentStatus] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                  <span className="text-gray-500 capitalize">{selectedOrder.paymentProvider}</span>
                </div>
              </section>

              {/* Status update */}
              <section>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Update Status</h3>
                <div className="flex gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
                  >
                    {STATUS_OPTIONS.filter((s) => s !== "all").map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleStatusUpdate}
                    disabled={updatingStatus || newStatus === selectedOrder.status}
                    className="px-4 py-2 bg-[#151515] text-white text-sm rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {updatingStatus && <Loader2 className="w-3 h-3 animate-spin" />}
                    Save
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
