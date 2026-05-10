import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import AdminOrdersClient from "../components/AdminOrdersClient";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminOrdersClient />;
}
