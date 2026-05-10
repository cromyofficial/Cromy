import Container from "@/components/Container";
import { getProductBySlug } from "@/sanity/helpers/queries";
import React from "react";
import { notFound } from "next/navigation";
import { ImageView } from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import {
  BoxIcon,
  FileQuestion,
  ListOrderedIcon,
  Share,
} from "lucide-react";
import ProductCharacteristics from "@/components/ProductCharacteristics";
import type { Metadata } from "next";
import { urlFor } from "@/sanity/lib/image";
import { getProductSizes, isProductInStock } from "@/lib/product";
import { siteConfig } from "@/lib/site";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Product not found | Cromy" };
  }

  const url = `${siteConfig.url}/product/${slug}`;
  const image = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).height(1200).url()
    : siteConfig.ogImage;

  const baseDescription =
    product.description ||
    product.intro ||
    `Buy ${product.name} from Cromy — premium jeans and clothing.`;
  const description = baseDescription.slice(0, 158);

  const title = `${product.name} | Cromy${product.variant ? ` — ${product.variant}` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    keywords: [
      product.name ?? "",
      "Cromy",
      "Cromy Jeans",
      "Cromy Clothing",
      product.variant ?? "",
    ].filter(Boolean) as string[],
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 1200,
          alt: product.name ?? "Cromy product",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: { index: true, follow: true },
  };
}

const SingleProductPage = async ({ params }: PageParams) => {
  const { slug } = await params;

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  const inStock = isProductInStock(product);
  const totalSizes = getProductSizes(product);

  const productUrl = `${siteConfig.url}/product/${slug}`;
  const productImage = product.images?.[0]
    ? urlFor(product.images[0]).width(1200).url()
    : siteConfig.ogImage;

  const finalPrice =
    typeof product.price === "number" && typeof product.discount === "number"
      ? Math.round(product.price * (1 - product.discount / 100))
      : product.price ?? 0;

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.intro ?? "",
    image: productImage,
    sku: product._id,
    brand: { "@type": "Brand", name: "Cromy" },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "INR",
      price: finalPrice,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: "Cromy" },
    },
    ...(totalSizes.length > 0 && {
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Available sizes",
        value: totalSizes
          .filter((s) => s.stock > 0)
          .map((s) => s.name)
          .join(", "),
      },
    }),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-10 flex flex-col md:flex-row gap-10">
        {product?.images && <ImageView images={product.images} />}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {product?.name}
            </h1>
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />
          </div>

          <p className="text-sm text-gray-600 tracking-wide">
            {product?.description}
          </p>

          <ProductPurchasePanel product={product} />

          <ProductCharacteristics product={product} />

          <div className="flex flex-wrap items-center justify-between gap-1 border-b border-b-gray-200 py-5 -mt-2">
            <div className="flex items-center gap-2 text-sm text-black hover:text-red-600 hoverEffect">
              <BoxIcon className="w-5 h-5" />
              <p>Compare Color</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-black hover:text-red-600 hoverEffect">
              <FileQuestion className="w-5 h-5" />
              <p>Ask a question</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-black hover:text-red-600 hoverEffect">
              <ListOrderedIcon className="w-5 h-5" />
              <p>Delivery & Return</p>
            </div>
            <div className="flex items-center gap-1 text-sm text-black hover:text-red-600 hoverEffect">
              <Share className="w-5 h-5" />
              <p>Share</p>
            </div>
          </div>

          <div className="flex md:flex-wrap items-center gap-5">
            <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue/50 rounded-md hoverEffect">
              <p className="text-base font-semibold text-[#151515]">
                Free Shipping
              </p>
              <p className="text-sm text-gray-500">
                Free Shipping over order ₹120
              </p>
            </div>
            <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue/50 rounded-md hoverEffect">
              <p className="text-base font-semibold text-[#151515]">
                Flexible Payment
              </p>
              <p className="text-sm text-gray-500">
                Pay with Multiple Credit Cards
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductPage;
