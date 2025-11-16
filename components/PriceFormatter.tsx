import { cn } from "@/lib/utils";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}
export const PriceFormatter = ({ amount, className }: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: "INR",
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span
      className={cn("text-xs font-semibold text-darkColor font-sans", className)} >
      {formattedPrice} 
    </span>
  );
};
