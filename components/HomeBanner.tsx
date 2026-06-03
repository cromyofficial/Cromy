import React from "react";

export const HomeBanner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <h1 className="text-3xl md:text-4xl uppercase font-bold text-center">
        Cromy Jeans — Premium Denim Collection
      </h1>
      <p className="text-sm text-center text-gray-500 font-medium max-w-[560px]">
        Shop Cromy jeans online: straight fit, comfort fit, mom fit and cargo
        denim crafted for everyday comfort and lasting style. Premium quality
        jeans for men and women, delivered across India.
      </p>
    </div>
  );
};
