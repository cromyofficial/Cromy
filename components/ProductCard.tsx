import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import PriceView from "./PriceView";
import { AddToCartButton } from "./AddToCartButton";

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="group text-sm rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-zinc-300 to-zinc-200 overflow-hidden rounded-lg  relative">
        {product?.images && (
          <Link href={`/product/${product._id}`}>
            <Image
              src={urlFor(product.images[0]).url()}
              alt="productImage"
              width={500}
              height={500}
              // loading="lazy"
              priority
              className={`w-full h-72 object-contain overflow-hidden  transition-transform duration-500 ${product?.stock !== 0 && "group-hover:scale-105 hoverEffect"}`}
            />
          </Link>
        )}
        <div className="absolute top-0 left-0 w-full "/>
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-md rounded-tl-none rounded-tr-none">
        <div className="text-base line-clamp-1">{product?.name}</div>
        <p>{product?.intro}</p>
        <PriceView
          price={product?.price}
          discount={product?.discount}
          className="text-lg"
        />
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
