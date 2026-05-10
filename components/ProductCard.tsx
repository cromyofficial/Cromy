import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import PriceView from "./PriceView";
import { isProductInStock } from "@/lib/product";

const ProductCard = ({ product }: { product: Product }) => {
  const inStock = isProductInStock(product);

  return (
    <Link
      href={`/product/${product?.slug?.current}`}
      className="group text-sm rounded-lg overflow-hidden block"
    >
      <div className="overflow-hidden relative">
        {product?.images && (
          <Image
            src={urlFor(product.images[0]).url()}
            alt={product?.name ?? "Cromy product"}
            width={500}
            height={500}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`w-full h-[250px] object-cover transition-transform duration-500 ${
              inStock ? "group-hover:scale-105 hoverEffect" : "opacity-80"
            }`}
          />
        )}
        {!inStock && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
            Out of stock
          </span>
        )}
      </div>
      <div className="py-3 px-2 flex flex-col gap-1.5 bg-zinc-50 border border-t-0 rounded-md rounded-tl-none rounded-tr-none">
        <h2 className="text-base line-clamp-1">{product?.name}</h2>
        <p className="truncate">{product?.intro}</p>
        <PriceView
          className="text-sm"
          price={product?.price}
          discount={product?.discount}
        />
        <div className="w-full h-9 flex items-center justify-center text-[#151515] border border-[#151515]/30 rounded font-semibold tracking-wide group-hover:bg-[#151515] group-hover:text-white hoverEffect">
          {inStock ? "Select size →" : "View details"}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
