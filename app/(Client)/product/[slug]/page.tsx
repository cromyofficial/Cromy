import Container from "@/components/Container";
import { getProductBySlug } from "@/sanity/helpers/queries";
import React from "react";
import { notFound } from "next/navigation";
import { ImageView } from "@/components/ImageView";
import PriceView from "@/components/PriceView";
import AddToCartButton from "@/components/AddToCartButton";
import { BoxIcon, FileQuestion, Heart, ListOrderedIcon, Share } from "lucide-react";
import ProductCharacteristics from "@/components/ProductCharacteristics";

// ✅ Note: params is a Promise in Next.js 15
const SingleProductPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params; // ✅ await it

  const product = await getProductBySlug(slug);
  if (!product) return notFound();

  return (
    <div>
      <Container className="py-10 flex flex-col md:flex-row gap-10">
        {product?.images && <ImageView images={product.images} />}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <h2 className="text-3x md:text-4xl font-bold mb-2">{product?.name}</h2>
            <PriceView
              price={product?.price}
              discount={product?.discount}
              className="text-lg font-bold"
            />
          </div>

       <div className="flex items-center justify-between">  {product?.stock && (
            <p className="bg-green-100 w-24 text-center text-green-600 text-sm py-2.5 font-semibold rounded-lg">
              In Stock
            </p>
          )} 
            <span className="flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm">
    Size
    <span className="rounded-md bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
      XL
    </span>
  </span>
          </div> 

          <p className="text-sm text-gray-600 tracking-wide">{product?.description}</p>

          <div className="flex items-center gap-2.5 lg:gap-5">
            <AddToCartButton
              product={product}
              className="flex-1 bg-[#151515]/80 text-white hover:bg-[#151515] hoverEffect"
            />
            <button className="border-2 border-[#151515]/30 text-[#151515]/60 px-2.5 py-1.5 rounded-md hover:text-[#151515] hover:border-[#151515] hoverEffect">
              <Heart className="w-5 h-5" />
            </button>
          </div>

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
              <p className="text-base font-semibold text-[#151515]">Free Shipping</p>
              <p className="text-sm text-gray-500">Free Shipping over order $120</p>
            </div>

            <div className="border border-darkBlue/20 text-center p-3 hover:border-darkBlue/50 rounded-md hoverEffect">
              <p className="text-base font-semibold text-[#151515]">Flexible Payment</p>
              <p className="text-sm text-gray-500">Pay with Multiple Credit Cards</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SingleProductPage;