import { Product } from "@/sanity.types";
import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  className?: string;
}

export const AddToCartButton = ({ product, className }: Props) => {
  const isOutOfStock = product?.stock === 0;
  return (
    <div>
      <Button
        disabled={isOutOfStock}
        className={cn(
          "w-full bg-transparent text-[[#151515]] shadow-none border border-[]/30 font-semibold tracking-wide hover:text-white hoverEffect "
        )}
      >
        Add to cart
      </Button>
    </div>
  );
};
