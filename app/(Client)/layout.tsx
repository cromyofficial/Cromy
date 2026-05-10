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


import type { Metadata, Viewport } from "next";
import "../globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import localFont from "next/font/local";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { siteConfig } from "@/lib/site";

const raleway = localFont({
  src: "../fonts/Raleway.woff2",
  variable: "--font-raleway",
  weight: "100 900",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#151515",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Premium Jeans & Clothing`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  applicationName: siteConfig.name,
  authors: [{ name: "Cromy" }],
  creator: "Cromy",
  publisher: "Cromy",
  alternates: { canonical: "/" },
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Premium Jeans & Clothing`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Premium Jeans & Clothing`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} — Premium Jeans & Clothing`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.ico`,
    sameAs: [`https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`],
  };

  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
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
