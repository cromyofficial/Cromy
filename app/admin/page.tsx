import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { connectMongo } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models/Order";
import { IndianRupee, Package, ShoppingBag, Truck, XCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

async function getStats() {
  await connectMongo();
  const [totalOrders, revenueAgg, statusAgg, recent] = await Promise.all([
    OrderModel.countDocuments(),
    OrderModel.aggregate([
      { $match: { status: { $nin: ["cancelled"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),
    OrderModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("orderNumber customerName email totalPrice status createdAt")
      .lean(),
  ]);

  const sm = Object.fromEntries(
    statusAgg.map((s: { _id: string; count: number }) => [s._id, s.count])
  );

  return {
    totalOrders,
    totalRevenue: revenueAgg[0]?.total ?? 0,
    pending: (sm.pending ?? 0) + (sm.confirmed ?? 0),
    shipped: sm.shipped ?? 0,
    delivered: sm.delivered ?? 0,
    cancelled: sm.cancelled ?? 0,
    recent: recent as unknown as Array<{
      _id: string;
      orderNumber: string;
      customerName: string;
      email: string;
      totalPrice: number;
      status: string;
      createdAt: Date;
    }>,
  };
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  paid: "bg-green-100 text-green-800",
};

export default async function AdminDashboard() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Pending / Confirmed",
      value: stats.pending,
      icon: Package,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Shipped",
      value: stats.shipped,
      icon: Truck,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Delivered",
      value: stats.delivered,
      icon: Package,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#151515]">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {session.email}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm border">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-[#151515]">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-[#151515]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Email</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats.recent.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs">
                    {order.orderNumber.slice(-10)}
                  </td>
                  <td className="px-6 py-3 font-medium">{order.customerName}</td>
                  <td className="px-6 py-3 text-gray-500 hidden md:table-cell">{order.email}</td>
                  <td className="px-6 py-3 font-semibold">
                    ₹{order.totalPrice.toLocaleString("en-IN")}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.status] ?? "bg-gray-100 text-gray-700"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 hidden md:table-cell">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "dd MMM yyyy")
                      : "—"}
                  </td>
                </tr>
              ))}
              {stats.recent.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
