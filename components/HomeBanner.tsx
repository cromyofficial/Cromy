import React from "react";
import { Title } from "./ui/Title";

export const HomeBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <Title className="text-3xl md:text-4xl uppercase font-bold text-center">Best Jeans Collection</Title>
      <p  className="text-sm text-center text-gray-400 font-medium max-w-[480px]">Find everything you need to look and feel your best, and shop of the latest men&apos;s fashion and lifestyle products</p>
      
    </div>
  );
};
