"use client";
import { Product } from "@/sanity.types";
import React from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { PriceFormatter } from "./PriceFormatter";
import QuantityButtons from "./QuantityButtons";
import useCartStore from "@/store";
import {
  getProductSizes,
  getStockForSize,
  isProductInStock,
} from "@/lib/product";

interface Props {
  product: Product;
  className?: string;
  /** Selected size from the PDP. Required when the product has sizes configured. */
  selectedSize?: string;
}

const AddToCartButton = ({ product, className, selectedSize }: Props) => {
  const { addItem, getItemCount } = useCartStore();

  const sizes = getProductSizes(product);
  const hasSizes = sizes.length > 0;
  const requiresSizeSelection = hasSizes && !selectedSize;

  const itemCount = getItemCount(product?._id, selectedSize);
  const inStock = hasSizes
    ? selectedSize
      ? getStockForSize(product, selectedSize) > 0
      : isProductInStock(product)
    : isProductInStock(product);

  const isDisabled = !inStock || requiresSizeSelection;

  const handleAdd = () => {
    if (requiresSizeSelection) {
      toast.error("Please select a size first");
      return;
    }
    addItem(product, selectedSize);
    toast.success(
      `${product?.name?.substring(0, 12) ?? "Item"}${selectedSize ? ` (${selectedSize})` : ""} added!`
    );
  };

  return (
    <div className="w-full h-12 flex items-center">
      {itemCount ? (
        <div className="w-full text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ts text-muted-foreground">
              Quantity{selectedSize ? ` (${selectedSize})` : ""}
            </span>
            <QuantityButtons product={product} size={selectedSize} />
          </div>
          <div className="flex items-center justify-between border-t pt-1">
            <span className="text-ts font-semibold">Subtotal</span>
            <PriceFormatter
              amount={product?.price ? product.price * itemCount : 0}
            />
          </div>
        </div>
      ) : (
        <Button
          onClick={handleAdd}
          disabled={isDisabled}
          className={cn(
            "w-full bg-transparent text-[#151515] shadow-none border border-[#151515]/30 font-semibold tracking-wide hover:text-white hoverEffect",
            className
          )}
        >
          {!inStock
            ? "Out of stock"
            : requiresSizeSelection
              ? "Select size to add"
              : "Add to cart"}
        </Button>
      )}
    </div>
  );
};

export default AddToCartButton;
