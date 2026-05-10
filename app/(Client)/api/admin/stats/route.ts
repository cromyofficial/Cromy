import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { connectMongo } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models/Order";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectMongo();

  const [
    totalOrders,
    totalRevenue,
    statusCounts,
    recentOrders,
    revenueByDay,
  ] = await Promise.all([
    OrderModel.countDocuments(),

    OrderModel.aggregate([
      { $match: { status: { $nin: ["cancelled"] } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]),

    OrderModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),

    OrderModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderNumber customerName email totalPrice status createdAt")
      .lean(),

    OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          status: { $nin: ["cancelled"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const statusMap = Object.fromEntries(
    statusCounts.map((s: { _id: string; count: number }) => [s._id, s.count])
  );

  return NextResponse.json({
    totalOrders,
    totalRevenue: totalRevenue[0]?.total ?? 0,
    pending: statusMap.pending ?? 0,
    confirmed: statusMap.confirmed ?? 0,
    shipped: statusMap.shipped ?? 0,
    delivered: statusMap.delivered ?? 0,
    cancelled: statusMap.cancelled ?? 0,
    recentOrders,
    revenueByDay,
  });
}
