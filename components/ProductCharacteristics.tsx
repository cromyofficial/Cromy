import { Product } from "@/sanity.types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import React from "react";
import { getProductSizes, getTotalStock } from "@/lib/product";

const ProductCharacteristics = ({ product }: { product: Product }) => {
  const sizes = getProductSizes(product);
  const total = getTotalStock(product);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>{product?.name}: Characteristics</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-1">
          <p className="flex items-center justify-between">
            Brand : <span className="font-semibold tracking-wide">Cromy</span>
          </p>

          <p className="flex items-center justify-between">
            Collection :{" "}
            <span className="font-semibold tracking-wide">2024</span>
          </p>

          <p className="flex items-center justify-between">
            Type :{" "}
            <span className="font-semibold tracking-wide">
              {product?.variant}
            </span>
          </p>

          <p className="flex items-center justify-between">
            Stock :{" "}
            <span className="font-semibold tracking-wide">
              {total > 0 ? `${total} available` : "Out of Stock"}
            </span>
          </p>

          {sizes.length > 0 && (
            <p className="flex items-start justify-between gap-4">
              Sizes :{" "}
              <span className="font-semibold tracking-wide text-right">
                {sizes
                  .map((s) =>
                    s.stock > 0 ? s.name : `${s.name} (sold out)`
                  )
                  .join(", ")}
              </span>
            </p>
          )}

          <p className="flex items-center justify-between">
            Intro :{" "}
            <span className="font-semibold tracking-wide">{product?.intro}</span>
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ProductCharacteristics;
