"use client";
import React, { useEffect, useRef, useState } from "react";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constant";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import ProductCard from "./ProductCard";
import NoProductAvailable from "./NoProductAvailable";
import { motion, AnimatePresence } from "motion/react";
import { Loader2 } from "lucide-react";

interface Props {
  initialProducts: Product[];
  initialTab: string;
}

export const ProductGrid = ({ initialProducts, initialTab }: Props) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectTab] = useState(initialTab || productType[0]?.title || "");
  const isFirstRender = useRef(true);

  const queryfinal = `*[_type == "product" && lower(variant) == $variant] | order(name asc)`;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(queryfinal, { variant: selectedTab.toLowerCase() });
        setProducts(response);
      } catch (error) {
        console.log("Product fetching Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTab]);

  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTabBar selectedTab={selectedTab} onTabSelect={setSelectTab} />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-10 min-h-80 space-y-4 text-center bg-gray-100 rounded-lg w-full mt-10">
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="animate-spin" />
            <span className="text-lg font-semibold">Product is loading...</span>
          </div>
        </div>
      ) : (
        <>
          {products?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
              {products.map((product: Product) => (
                <AnimatePresence key={product?._id}>
                  <motion.div
                    layout
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ProductCard key={product?._id} product={product} />
                  </motion.div>
                </AnimatePresence>
              ))}
            </div>
          ) : (
            <NoProductAvailable selectedTab={selectedTab} />
          )}
        </>
      )}
    </div>
  );
};
