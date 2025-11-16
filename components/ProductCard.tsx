import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import PriceView from "./PriceView";
import AddToCartButton from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
      <Link
        href={`/product/${product?.slug?.current}`}
        className="group text-sm rounded-lg overflow-hidden block"
      >
       <div className="overflow-hidden relative">
  {product?.images && (
    <Image
      src={urlFor(product.images[0]).url()}
      alt="productImage"
      width={500}
      height={500}
      priority
      className={`w-full h-[250px] object-cover transition-transform duration-500 ${
        product?.stock !== 0 && "group-hover:scale-105 hoverEffect"
      }`}
    />
          )}
          <div className="absolute top-0 left-0 w-full " />
        </div>
        <div className="py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-md rounded-tl-none rounded-tr-none">
          <h2 className="text-base line-clamp-1">{product?.name}</h2>
          <p className="truncate">{product?.intro}</p>
          <PriceView
            className="text-sm"
            price={product?.price}
            discount={product?.discount}
          />
          <AddToCartButton product={product} />
        </div>
      </Link>
    );
};

export default ProductCard;
