import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyOrders } from "@/sanity/helpers/queries";
import CustomerDashboardClient from "./CustomerDashboardClient";

export const metadata = { title: "My Dashboard | Cromy" };

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const orders = await getMyOrders(userId);

  return <CustomerDashboardClient initialOrders={orders} userId={userId} />;
}
