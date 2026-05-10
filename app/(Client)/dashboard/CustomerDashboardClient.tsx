"use client";

import { useState, useEffect } from "react";
import { MY_ORDERS_QUERY_RESULT } from "@/sanity.types";
import { format } from "date-fns";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { Package, User, MapPin, ChevronDown, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { PriceFormatter } from "@/components/PriceFormatter";

type Tab = "orders" | "profile" | "addresses";

interface Address {
  _id: string;
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

interface ProfileData {
  name?: string;
  phone?: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

export default function CustomerDashboardClient({
  initialOrders,
  userId,
}: {
  initialOrders: MY_ORDERS_QUERY_RESULT;
  userId: string;
}) {
  const [tab, setTab] = useState<Tab>("orders");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Profile
  const { user } = useUser();
  const [profile, setProfile] = useState<ProfileData>({ name: "", phone: "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);

  // Addresses
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(false);
  const [showAddrForm, setShowAddrForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    label: "",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
  });
  const [addrSaving, setAddrSaving] = useState(false);

  // Load profile + addresses when those tabs are first opened
  useEffect(() => {
    if (tab === "profile" && !profile.name && !profile.phone) {
      setProfileLoading(true);
      fetch("/api/customer/profile")
        .then((r) => r.json())
        .then((d) => setProfile({ name: d.profile?.name ?? user?.fullName ?? "", phone: d.profile?.phone ?? "" }))
        .finally(() => setProfileLoading(false));
    }
    if (tab === "addresses" && addresses.length === 0) {
      setAddrLoading(true);
      fetch("/api/customer/addresses")
        .then((r) => r.json())
        .then((d) => setAddresses(d.addresses ?? []))
        .finally(() => setAddrLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      await fetch("/api/customer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddrSaving(true);
    try {
      const res = await fetch("/api/customer/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddr),
      });
      const data = await res.json();
      setAddresses(data.addresses ?? []);
      setShowAddrForm(false);
      setNewAddr({ label: "", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "" });
      toast.success("Address saved");
    } catch {
      toast.error("Failed to save address");
    } finally {
      setAddrSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    const res = await fetch("/api/customer/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ addressId: id }),
    });
    const data = await res.json();
    setAddresses(data.addresses ?? []);
    toast.success("Address removed");
  };

  const tabs: { key: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: "orders", label: "My Orders", icon: Package },
    { key: "profile", label: "Profile", icon: User },
    { key: "addresses", label: "Addresses", icon: MapPin },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#151515]">My Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, {user?.firstName ?? "there"}</p>
      </div>

      {/* Tab bar */}
      <div className="flex border-b">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-[#151515] text-[#151515]"
                : "border-transparent text-gray-500 hover:text-[#151515]"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* ── Orders tab ── */}
      {tab === "orders" && (
        <div className="space-y-3">
          {initialOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No orders yet. Start shopping!</p>
            </div>
          ) : (
            initialOrders.map((order) => {
              const isOpen = expandedOrder === order._id;
              return (
                <div key={order._id} className="bg-white rounded-xl border shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedOrder(isOpen ? null : order._id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div>
                        <p className="text-xs text-gray-400 font-mono">
                          #{order.orderNumber?.slice(-10) ?? order._id.slice(-8)}
                        </p>
                        <p className="font-semibold text-sm text-[#151515]">
                          ₹{order.totalPrice?.toLocaleString("en-IN") ?? 0}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${STATUS_STYLE[order.status ?? "pending"] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {order.status ?? "Pending"}
                      </span>
                      {order.orderDate && (
                        <span className="text-xs text-gray-400 hidden sm:inline">
                          {format(new Date(order.orderDate), "dd MMM yyyy")}
                        </span>
                      )}
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 border-t space-y-4">
                      {/* Products */}
                      <div className="space-y-3 pt-4">
                        {order.products?.map((line) => {
                          if (!line.product) return null;
                          return (
                            <div key={line._key} className="flex items-center gap-3">
                              {line.product.images?.[0] && (
                                <Image
                                  src={urlFor(line.product.images[0]).width(80).url()}
                                  alt={line.product.name ?? ""}
                                  width={60}
                                  height={60}
                                  className="rounded-md object-cover border w-14 h-14"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm line-clamp-1">{line.product.name}</p>
                                <p className="text-xs text-gray-500">
                                  {line.size && <span>Size: {line.size} · </span>}
                                  Qty: {line.quantity}
                                </p>
                              </div>
                              {line.product.price && line.quantity && (
                                <PriceFormatter
                                  amount={line.product.price * line.quantity}
                                  className="text-sm font-semibold shrink-0"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Invoice download */}
                      {order.invoice?.hosted_invoice_url && (
                        <a
                          href={order.invoice.hosted_invoice_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          Download Invoice #{order.invoice.number}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Profile tab ── */}
      {tab === "profile" && (
        <div className="bg-white rounded-xl border shadow-sm p-6 max-w-md">
          <h2 className="font-semibold text-[#151515] mb-4">Personal Information</h2>
          {profileLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input
                  value={user?.emailAddresses[0]?.emailAddress ?? ""}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-400"
                />
                <p className="text-xs text-gray-400 mt-1">Managed by Clerk account</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                <input
                  value={profile.name ?? ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Phone</label>
                <input
                  type="tel"
                  value={profile.phone ?? ""}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 00000 00000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
                />
              </div>
              <button
                type="submit"
                disabled={profileSaving}
                className="w-full bg-[#151515] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {profileSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── Addresses tab ── */}
      {tab === "addresses" && (
        <div className="space-y-4">
          {addrLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className={`bg-white rounded-xl border shadow-sm p-4 relative ${addr.isDefault ? "border-[#151515]" : ""}`}
                  >
                    {addr.isDefault && (
                      <span className="absolute top-3 right-3 text-xs bg-[#151515] text-white px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                    {addr.label && (
                      <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
                        {addr.label}
                      </p>
                    )}
                    <p className="font-medium text-sm">{addr.fullName}</p>
                    <p className="text-sm text-gray-500">{addr.phone}</p>
                    <p className="text-sm text-gray-500">
                      {addr.line1}
                      {addr.line2 && `, ${addr.line2}`}
                    </p>
                    <p className="text-sm text-gray-500">
                      {[addr.city, addr.state, addr.postalCode].filter(Boolean).join(", ")}
                    </p>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="mt-3 flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  </div>
                ))}

                {addresses.length === 0 && !showAddrForm && (
                  <p className="text-sm text-gray-400 sm:col-span-2">No saved addresses.</p>
                )}
              </div>

              {!showAddrForm && (
                <button
                  onClick={() => setShowAddrForm(true)}
                  className="flex items-center gap-2 text-sm font-medium text-[#151515] border border-[#151515]/30 px-4 py-2 rounded-lg hover:bg-[#151515] hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Address
                </button>
              )}

              {showAddrForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="bg-white rounded-xl border shadow-sm p-5 space-y-3 max-w-md"
                >
                  <h3 className="font-semibold text-[#151515]">New Address</h3>
                  {[
                    { name: "label", placeholder: "Label (Home / Work)", required: false },
                    { name: "fullName", placeholder: "Full Name", required: true },
                    { name: "phone", placeholder: "Phone", required: true },
                    { name: "line1", placeholder: "Address Line 1", required: true },
                    { name: "line2", placeholder: "Address Line 2 (optional)", required: false },
                    { name: "city", placeholder: "City", required: true },
                    { name: "state", placeholder: "State", required: true },
                    { name: "postalCode", placeholder: "Postal Code", required: true },
                  ].map(({ name, placeholder, required }) => (
                    <input
                      key={name}
                      required={required}
                      placeholder={placeholder}
                      value={newAddr[name as keyof typeof newAddr]}
                      onChange={(e) => setNewAddr({ ...newAddr, [name]: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#151515]"
                    />
                  ))}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={addrSaving}
                      className="flex-1 bg-[#151515] text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#333] transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {addrSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddrForm(false)}
                      className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
