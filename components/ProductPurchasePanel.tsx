"use client";

import { useState } from "react";
import { Product } from "@/sanity.types";
import AddToCartButton from "./AddToCartButton";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getProductSizes,
  isProductInStock,
} from "@/lib/product";

const ProductPurchasePanel = ({ product }: { product: Product }) => {
  const sizes = getProductSizes(product);
  const hasSizes = sizes.length > 0;
  const inStock = isProductInStock(product);

  const firstAvailable = sizes.find((s) => s.stock > 0)?.name;
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    undefined
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        {inStock ? (
          <span className="bg-green-100 text-green-700 text-sm py-1.5 px-3 font-semibold rounded-md">
            In Stock
          </span>
        ) : (
          <span className="bg-red-100 text-red-700 text-sm py-1.5 px-3 font-semibold rounded-md">
            Out of Stock
          </span>
        )}
      </div>

      {hasSizes && (
        <div>
          <p className="text-sm font-semibold mb-2 text-[#151515]">
            Size{" "}
            {selectedSize && (
              <span className="text-gray-500 font-normal">
                — Selected: {selectedSize}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const disabled = s.stock <= 0;
              const active = selectedSize === s.name;
              return (
                <button
                  key={s.name}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelectedSize(s.name)}
                  aria-pressed={active}
                  aria-label={`Size ${s.name}${disabled ? " (out of stock)" : ""}`}
                  className={cn(
                    "min-w-[44px] h-10 px-3 rounded-md border text-sm font-semibold transition-colors",
                    active
                      ? "bg-[#151515] text-white border-[#151515]"
                      : "bg-white text-[#151515] border-[#151515]/30 hover:border-[#151515]",
                    disabled &&
                      "opacity-40 cursor-not-allowed line-through hover:border-[#151515]/30"
                  )}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          {firstAvailable && !selectedSize && (
            <p className="text-xs text-gray-500 mt-2">
              Tap a size above to add to cart
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-2.5 lg:gap-5">
        <AddToCartButton
          product={product}
          selectedSize={selectedSize}
          className="flex-1 bg-[#151515]/80 text-white hover:bg-[#151515] hoverEffect"
        />
        <button
          type="button"
          aria-label="Add to wishlist"
          className="border-2 border-[#151515]/30 text-[#151515]/60 px-2.5 py-1.5 rounded-md hover:text-[#151515] hover:border-[#151515] hoverEffect"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
