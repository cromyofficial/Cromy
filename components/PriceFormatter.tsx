import { cn } from "@/lib/utils";
import React from "react";
import { twMerge } from "tailwind-merge";

interface Props {
  amount: number | undefined;
  className?: string;
}
export const PriceFormatter = ({ amount, className }: Props) => {
  const formattedPrice = new Number(amount).toLocaleString("en-US", {
    currency: "USD",
    style: "currency",
    minimumFractionDigits: 2,
  });
  return (
    <span
      className={cn("text-sm font-semibold text-darkColor", className)}
    >
      {formattedPrice} 
    </span>
  );
};
