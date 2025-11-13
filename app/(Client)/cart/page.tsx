// "use client";

// import Container from "@/components/Container";
// import EmptyCart from "@/components/EmptyCart";
// import LoadingSpinner from "../loading";
// import NoAccessToCart from "@/components/NoAccessToCart";
// import { PriceFormatter } from "@/components/PriceFormatter";
// import QuantityButtons from "@/components/QuantityButtons";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
// import { urlFor } from "@/sanity/lib/image";
// import { client } from "@/sanity/lib/client";
// import useCartStore from "@/store";
// import { useAuth, useUser } from "@clerk/nextjs";
// import { Heart, ShoppingBag, Trash } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import paytm from "@/images/paytm.png";
// import { createCheckoutSession } from "@/actions/createCheckoutSession";

// const CartPage = () => {
//   const [isClient, setIsClient] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [showPopup, setShowPopup] = useState(false);
//   const [contactData, setContactData] = useState({ name: "", mobile: "", message: "" });
//   const [productDetails, setProductDetails] = useState([]);

//   const { isSignedIn } = useAuth();
//   const { user } = useUser();

//   const {
//     deleteCartProduct,
//     getTotalPrice,
//     getItemCount,
//     getSubTotalPrice,
//     resetCart,
//     getGroupedItems,
//   } = useCartStore();

//   useEffect(() => setIsClient(true), []);

//   const cartProducts = getGroupedItems();

//   const handleResetCart = () => {
//     if (window.confirm("Are you sure to reset your Cart?")) {
//       resetCart();
//       toast.success("Your cart reset successfully!");
//     }
//   };

//   const handleDeleteProduct = (id) => {
//     deleteCartProduct(id);
//     toast.success("Product deleted successfully!");
//   };

//   // const handleCheckout = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const metadata = {
//   //       orderNumber: crypto.randomUUID(),
//   //       customerName: user?.fullName ?? "unknown",
//   //       customerEmail: user?.emailAddresses[0].emailAddress ?? "unknown",
//   //       clerkUserId: user!.id,
//   //     };
//   //     const checkoutUrl = await createCheckoutSession(cartProducts, metadata);
//   //     if (checkoutUrl) window.location.href = checkoutUrl;
//   //   } catch (error) {
//   //     console.error("Error creating checkout session", error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // ✅ Updated: include product details in email payload
//   // const handleSendContact = async (e) => {
//   //   e.preventDefault();
//   //   setSending(true);
//   //   try {
//   //     const payload = {
//   //       ...contactData,
//   //       products: productDetails, // 🧩 send all product data
//   //     };

//   //     const res = await fetch("/api/mailCheckout", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(payload),
//   //     });

//   //     if (res.ok) {
//   //       toast.success("Details sent successfully!");
//   //       setShowPopup(false);
//   //       setContactData({ name: "", mobile: "", message: "" });
//   //       handleCheckout();
//   //     } else {
//   //       toast.error("Failed to send details.");
//   //     }
//   //   } catch (err) {
//   //     toast.error("Something went wrong!");
//   //     console.error(err);
//   //   } finally {
//   //     setSending(false);
//   //   }
//   // };

//   const handleCheckout = async () => {
//   if (loading) return;
//   setLoading(true);
//   try {
//     const metadata = {
//       orderNumber: crypto.randomUUID(),
//       customerName: user?.fullName ?? "unknown",
//       customerEmail: user?.emailAddresses[0].emailAddress ?? "unknown",
//       clerkUserId: user!.id,
//     };
//     const checkoutUrl = await createCheckoutSession(cartProducts, metadata);
//     if (checkoutUrl) {
//       window.location.href = checkoutUrl; // page navigates, popup stays until unload
//     } else {
//       toast.error("Could not start checkout.");
//     }
//   } catch (error) {
//     console.error("Error creating checkout session", error);
//     toast.error("Checkout failed. Please try again.");
//   } finally {
//     // Usually the page will unload before this runs, but it's fine to keep.
//     setLoading(false);
//   }
// };


//   const handleSendContact = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setSending(true);
//   try {
//     const payload = { ...contactData, products: productDetails };
//     const res = await fetch("/api/mailCheckout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       toast.success("Details sent successfully!");
//       // 👇 keep the popup open, go straight to checkout
//       await handleCheckout(); // window.location.href will navigate
//       // no setShowPopup(false) here — the navigation will replace the page
//     } else {
//       toast.error("Failed to send details.");
//     }
//   } catch (err) {
//     toast.error("Something went wrong!");
//     console.error(err);
//   } finally {
//     // Don't flip sending off if you're about to navigate; harmless either way.
//     setSending(false);
//   }
// };


//   // 🔍 Fetch all product details by their _id from Sanity
//   const fetchCartProductsDetails = async (cartItems) => {
//     try {
//       const ids = cartItems.map(({ product }) => product?._id).filter(Boolean);
//       if (ids.length === 0) return;

//       const query = `*[_type == "product" && _id in $ids]{
//         _id,
//         name,
//         intro,
//         variant,
//         status,
//         "image": images[0].asset->url
//       }`;

//       const data = await client.fetch(query, { ids });
//       setProductDetails(data);
//     } catch (error) {
//       console.error("Error fetching product details:", error);
//     }
//   };

//   const handleOpenPopup = () => {
//     fetchCartProductsDetails(cartProducts);
//     setShowPopup(true);
//   };

//   if (!isClient) return <LoadingSpinner />;

//   return (
//     <div className="bg-gray-50 pb:52 md:pb-10">
//       {isSignedIn ? (
//         <Container>
//           {cartProducts?.length ? (
//             <>
//               <div className="flex items-center gap-2 py-5">
//                 <ShoppingBag />
//                 <h1 className="text-2xl font-semibold">Shopping Cart</h1>
//               </div>

//               <div className="grid lg:grid-cols-3 md:gap-8">
//                 {/* Product Section */}
//                 <div className="lg:col-span-2 rounded-lg">
//                   <div className="border bg-white rounded-md">
//                     {cartProducts.map(({ product }) => {
//                       const itemCount = getItemCount(product?._id);

//                       return (
//                         <div
//                           key={product?._id}
//                           className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
//                         >
//                           <div className="flex flex-1 items-center gap-2 h-36 md:h-44">
//                             {product?.images && (
//                               <Link
//                                 href={`/product/${product?.slug?.current}`}
//                                 className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
//                               >
//                                 <Image
//                                   src={urlFor(product?.images[0]).url()}
//                                   alt="productImage"
//                                   width={500}
//                                   height={500}
//                                   loading="lazy"
//                                   className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
//                                 />
//                               </Link>
//                             )}
//                             <div className="h-full flex flex-1 flex-col justify-between py-1">
//                               <div className="space-y-1.5">
//                                 <h2 className="font-semibold line-clamp-1">{product?.name}</h2>
//                                 <p className="text-sm text-lightcolor font-medium">{product?.intro}</p>
//                                 <p className="text-sm capitalize">
//                                   Variant : <span className="font-semibold">{product?.variant}</span>
//                                 </p>
//                                 <p className="text-sm capitalize">
//                                   Status : <span className="font-semibold">{product?.status}</span>
//                                 </p>
//                               </div>
//                               <div className="text-gray-500 flex items-center gap-2">
//                                 <TooltipProvider>
//                                   <Tooltip>
//                                     <TooltipTrigger>
//                                       <Heart className="h-4 w-4 md:w-5 md:h-5 hover:text-green-600 hoverEffect" />
//                                     </TooltipTrigger>
//                                     <TooltipContent className="font-bold">Add to Favorite</TooltipContent>
//                                   </Tooltip>
//                                   <Tooltip>
//                                     <TooltipTrigger>
//                                       <Trash
//                                         onClick={() => handleDeleteProduct(product?._id)}
//                                         className="h-4 w-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect"
//                                       />
//                                     </TooltipTrigger>
//                                     <TooltipContent className="font-bold bg-red-600">Delete product</TooltipContent>
//                                   </Tooltip>
//                                 </TooltipProvider>
//                               </div>
//                             </div>
//                             <div>
//                               <PriceFormatter amount={product?.price * itemCount} className="font-bold text-lg" />
//                               <QuantityButtons product={product} />
//                             </div>
//                           </div>
//                         </div>
//                       );
//                     })}
//                     <Button onClick={handleResetCart} className="m-5 font-semibold" variant="destructive">
//                       Reset Cart
//                     </Button>
//                   </div>
//                 </div>

//                 {/* Summary Section */}
//                 <div className="lg:col-span-1">
//                   <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
//                     <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
//                     <div className="space-y-4">
//                       <div className="flex justify-between">
//                         <span>Subtotal</span>
//                         <PriceFormatter amount={getSubTotalPrice()} />
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Discount</span>
//                         <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
//                       </div>
//                       <Separator />
//                       <div className="flex justify-between">
//                         <span>Total</span>
//                         <PriceFormatter amount={getTotalPrice()} className="text-lg font-bold text-black" />
//                       </div>
//                       <Button
//                         disabled={loading}
//                         className="w-full rounded-full font-semibold tracking-wide"
//                         size="lg"
//                         onClick={handleOpenPopup}
//                       >
//                         Proceed to Checkout
//                       </Button>
//                       <Link
//                         href="/"
//                         className="flex items-center justify-center py-2 border border-[#151515]/50 rounded-full hover:border-[#151515] hover:bg-[#151515]/5 hoverEffect"
//                       >
//                         <Image src={paytm} alt="Paytmlogo" className="w-40 h-5" />
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <EmptyCart />
//           )}
//         </Container>
//       ) : (
//         <NoAccessToCart />
//       )}

//       {/* 🧾 Contact + All Products Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
//             <h2 className="text-2xl font-semibold mb-4 text-center">Confirm Your Details</h2>

//             {/* ✅ Show all product details */}
//             <div className="space-y-4 mb-5">
//               {productDetails?.map((p) => (
//                 <div key={p._id} className="border p-3 rounded-md bg-gray-50">
//                   {p.image && (
//                     <img
//                       src={p.image}
//                       alt={p.name}
//                       className="w-20 h-20 object-cover rounded-md mb-2 border"
//                     />
//                   )}
//                   <h3 className="font-semibold line-clamp-1">{p.name}</h3>
//                   <p className="text-sm text-gray-500">{p.intro}</p>
//                   <p className="text-sm capitalize">
//                     Variant: <span className="font-semibold">{p.variant}</span>
//                   </p>
//                   <p className="text-sm capitalize">
//                     Status: <span className="font-semibold">{p.status}</span>
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* Contact Form */}
//             <form onSubmit={handleSendContact} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 value={contactData.name}
//                 onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 type="tel"
//                 placeholder="Mobile Number"
//                 value={contactData.mobile}
//                 onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <textarea
//                 placeholder="Enter your Address"
//                 value={contactData.message}
//                 onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
//                 required
//                 className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <div className="flex items-center justify-between mt-4">
//                <Button
//   type="button"
//   variant="secondary"
//   onClick={() => setShowPopup(false)}
//   disabled={sending || loading}
//   className="rounded-full"
// >
//   Cancel
// </Button>
//                <Button
//   type="submit"
//   disabled={
//     sending || loading ||
//     !contactData.name.trim() ||
//     !contactData.mobile.trim() ||
//     !contactData.message.trim()
//   }
//   className="rounded-full font-semibold"
// >
//   {sending || loading ? (
//     <span className="inline-flex items-center gap-2">
//       <Loader2 className="h-4 w-4 animate-spin" />
//       {loading ? "Redirecting to payment..." : "Placing order..."}
//     </span>
//   ) : (
//     "Order"
//   )}
// </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CartPage;



/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Container from "@/components/Container";
import EmptyCart from "@/components/EmptyCart";
import LoadingSpinner from "../loading";
import NoAccessToCart from "@/components/NoAccessToCart";
import { PriceFormatter } from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import useCartStore from "@/store";
import { useAuth, useUser } from "@clerk/nextjs";
import { Heart, ShoppingBag, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import paytm from "@/images/paytm.png";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);   // redirect in progress
  const [sending, setSending] = useState(false);   // mail API in progress
  const [showPopup, setShowPopup] = useState(false);
  const [contactData, setContactData] = useState({ name: "", mobile: "", message: "" });
  const [productDetails, setProductDetails] = useState<any[]>([]);

  const { isSignedIn } = useAuth();
  const { user } = useUser();

  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
    getGroupedItems,
  } = useCartStore();

  useEffect(() => setIsClient(true), []);

  const cartProducts = getGroupedItems();

  const handleResetCart = () => {
    if (window.confirm("Are you sure to reset your Cart?")) {
      resetCart();
      toast.success("Your cart reset successfully!");
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteCartProduct(id);
    toast.success("Product deleted successfully!");
  };

  // Redirect to payment/checkout. Keep popup visible until navigation.
  const handleCheckout = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const metadata = {
        orderNumber: crypto.randomUUID(),
        customerName: user?.fullName ?? "unknown",
        customerEmail: user?.emailAddresses[0]?.emailAddress ?? "unknown",
        clerkUserId: user!.id,
      };
      const checkoutUrl = await createCheckoutSession(cartProducts, metadata);
      if (checkoutUrl) {
         resetCart();
        window.location.href = checkoutUrl; // navigation will replace the page

      } else {
        toast.error("Could not start checkout.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
      toast.error("Checkout failed. Please try again.");
      setLoading(false);
    }
  };

  // Send email, then immediately start checkout. Keep modal open while loading.
  const handleSendContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || loading) return;
    setSending(true);
    try {
      const payload = { ...contactData, products: productDetails };
      const res = await fetch("/api/mailCheckout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Details sent successfully!");
        await handleCheckout(); // this sets loading and navigates
      } else {
        toast.error("Failed to send details.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    } finally {
      // it's okay if we navigate before this runs
      setSending(false);
    }
  };

  // Fetch product details for the popup
  const fetchCartProductsDetails = async (cartItems: any[]) => {
    try {
      const ids = cartItems.map(({ product }) => product?._id).filter(Boolean);
      if (ids.length === 0) return;
      const query = `*[_type == "product" && _id in $ids]{
        _id, name, intro, variant, status,
        "image": images[0].asset->url
      }`;
      const data = await client.fetch(query, { ids });
      setProductDetails(data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleOpenPopup = () => {
    fetchCartProductsDetails(cartProducts);
    setShowPopup(true);
  };

  if (!isClient) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 pb:52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {cartProducts?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingBag />
                <h1 className="text-2xl font-semibold">Shopping Cart</h1>
              </div>

              <div className="grid lg:grid-cols-3 md:gap-8">
                {/* Product Section */}
                <div className="lg:col-span-2 rounded-lg">
                  <div className="border bg-white rounded-md">
                    {cartProducts.map(({ product }: any) => {
                      const itemCount = getItemCount(product?._id);
                      return (
                        <div
                          key={product?._id}
                          className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
                        >
                          <div className="flex flex-1 items-center gap-2 h-36 md:h-44">
                            {product?.images && (
                              <Link
                                href={`/product/${product?.slug?.current}`}
                                className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                              >
                                <Image
                                  src={urlFor(product?.images[0]).url()}
                                  alt="productImage"
                                  width={500}
                                  height={500}
                                  loading="lazy"
                                  className="w-32 md:w-40 h-32 md:h-40 object-cover group-hover:scale-105 hoverEffect"
                                />
                              </Link>
                            )}
                            <div className="h-full flex flex-1 flex-col justify-between py-1">
                              <div className="space-y-1.5">
                                <h2 className="font-semibold line-clamp-1">{product?.name}</h2>
                                <p className="text-sm text-lightcolor font-medium">{product?.intro}</p>
                                <p className="text-sm capitalize">
                                  Variant: <span className="font-semibold">{product?.variant}</span>
                                </p>
                                <p className="text-sm capitalize">
                                  Status: <span className="font-semibold">{product?.status}</span>
                                </p>
                              </div>
                              <div className="text-gray-500 flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Heart className="h-4 w-4 md:w-5 md:h-5 hover:text-green-600 hoverEffect" />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold">Add to Favorite</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Trash
                                        onClick={() => handleDeleteProduct(product?._id)}
                                        className="h-4 w-4 md:w-5 md:h-5 hover:text-red-600 hoverEffect"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent className="font-bold bg-red-600">
                                      Delete product
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div>
                              <PriceFormatter amount={product?.price * itemCount} className="font-bold text-lg" />
                              <QuantityButtons product={product} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <Button onClick={handleResetCart} className="m-5 font-semibold" variant="destructive">
                      Reset Cart
                    </Button>
                  </div>
                </div>

                {/* Summary Section */}
                <div className="lg:col-span-1">
                  <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <PriceFormatter amount={getSubTotalPrice()} />
                      </div>
                      <div className="flex justify-between">
                        <span>Discount</span>
                        <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span>Total</span>
                        <PriceFormatter amount={getTotalPrice()} className="text-lg font-bold text-black" />
                      </div>
                      <Button
                        disabled={loading}
                        className="w-full rounded-full font-semibold tracking-wide"
                        size="lg"
                        onClick={handleOpenPopup}
                      >
                        Proceed to Checkout
                      </Button>
                      <Link
                        href="/"
                        className="flex items-center justify-center py-2 border border-[#151515]/50 rounded-full hover:border-[#151515] hover:bg-[#151515]/5 hoverEffect"
                      >
                        <Image src={paytm} alt="Paytmlogo" className="w-40 h-5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccessToCart />
      )}

      {/* Contact + All Products Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center">Confirm Your Details</h2>

            <div className="space-y-4 mb-5">
              {productDetails?.map((p) => (
                <div key={p._id} className="border p-3 rounded-md bg-gray-50">
                  {p.image && (
                    <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-md mb-2 border" />
                  )}
                  <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.intro}</p>
                  <p className="text-sm capitalize">
                    Variant: <span className="font-semibold">{p.variant}</span>
                  </p>
                  <p className="text-sm capitalize">
                    Status: <span className="font-semibold">{p.status}</span>
                  </p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendContact} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                value={contactData.mobile}
                onChange={(e) => setContactData({ ...contactData, mobile: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <textarea
                placeholder="Enter your Address"
                value={contactData.message}
                onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <div className="flex items-center justify-between mt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPopup(false)}
                  disabled={sending || loading}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    sending ||
                    loading ||
                    !contactData.name.trim() ||
                    !contactData.mobile.trim() ||
                    !contactData.message.trim()
                  }
                  className="rounded-full font-semibold"
                >
                  {sending || loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {loading ? "Redirecting to confirm..." : "Placing order..."}
                    </span>
                  ) : (
                    "Order"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
