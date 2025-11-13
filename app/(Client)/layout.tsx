// // "use client"
// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
// import Header from "@/components/Header";
// import { Footer } from "@/components/Footer";
// import { ClerkProvider } from "@clerk/nextjs";
// import localFont from "next/font/local";
// import { Toaster } from "react-hot-toast";

// const raleway = localFont({
//   src: "../fonts/Raleway.woff2",
//   variable: "--font-raleway",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Cromy",
//   description: "An E-commerce web for buy jeans purpose ",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={`${raleway.variable}antialiased`}>
//           <Header />
//           {children}
//           <Footer />
//            <Toaster position="bottom-right" toastOptions={{
//             style:{
//               background: "#000000",
//               color: "#ffffff",
//             }
//            }}/>
//         </body>
//       </html>
//     </ClerkProvider>
//   );
// }


import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const raleway = localFont({
  src: "../fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Cromy",
  description: "An E-commerce web for buy jeans purpose ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#000000",
                color: "#ffffff",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
