"use client";
import React from "react";
import { Button } from "./ui/button";
import { Product } from "@/sanity.types";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import useCartStore from "@/store";
import toast from "react-hot-toast";
import { getStockForSize, getTotalStock } from "@/lib/product";

interface Props {
  product: Product;
  size?: string;
  className?: string;
  borderStyle?: string;
}

const QuantityButtons = ({ product, size, className }: Props) => {
  const { addItem, getItemCount, removeItem } = useCartStore();
  const itemCount = getItemCount(product?._id, size);

  const stockCap = size
    ? getStockForSize(product, size)
    : getTotalStock(product);
  const isOutOfStock = stockCap === 0;
  const atStockCap = itemCount >= stockCap;

  const handleRemoveProduct = () => {
    removeItem(product?._id, size);
    if (itemCount > 1) {
      toast.success("Quantity decreased");
    } else {
      toast.success(
        `${product?.name?.substring(0, 12) ?? "Item"} removed from cart`
      );
    }
  };

  const handleAdd = () => {
    if (atStockCap) {
      toast.error("No more stock available");
      return;
    }
    addItem(product, size);
  };

  return (
    <div className={cn("flex items-center gap-1 text-base pb-1", className)}>
      <Button
        onClick={handleRemoveProduct}
        disabled={itemCount === 0 || isOutOfStock}
        variant="outline"
        size="icon"
        className="w-6 h-6"
      >
        <Minus />
      </Button>
      <span className="font-semibold w-8 text-center text-darkColor">
        {itemCount}
      </span>
      <Button
        onClick={handleAdd}
        disabled={isOutOfStock || atStockCap}
        variant="outline"
        size="icon"
        className="w-6 h-6"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
