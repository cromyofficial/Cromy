import type { Metadata } from "next";
import AdminSidebar from "./components/AdminSidebar";
import "../../app/globals.css";

export const metadata: Metadata = {
  title: { default: "Admin — Cromy", template: "%s | Admin Cromy" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
