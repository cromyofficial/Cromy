"use client"
import { CATEGORIES_QUERY_RESULT, Product } from "@/sanity.types";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { client } from "@/sanity/lib/client";
import { Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ProductCard from "../ProductCard";
import NoProductAvailable from "../NoProductAvailable";
interface Props {
  categories: CATEGORIES_QUERY_RESULT;
  slug: string;
}
const CategoryProducts = ({ categories, slug }: Props) => {
    const [currentSlug, setCurrentSlug]=useState(slug);
    const [products, setProducts]=useState([])
    const [loading, setLoading]=useState(false);

    const fetchProducts=async(categorySlug:string)=>{
        try {
            setLoading(true)
           const query = `*[_type == 'product' && references(*[_type == 'category' && 
           slug.current == $categorySlug]._id)] | order(name asc)`;

            const data = await client.fetch(query,{categorySlug });
            setProducts(data);
            
        } catch (error) {
            console.error("Error Fetching Products", error);
        }finally{
             setLoading(false);
        }
    };

    useEffect(()=>{
    fetchProducts(currentSlug);
    },[currentSlug]);

  return (
    <div className="py-5 flex flex-col md:flex-row items-start gap-5 ">
      <div className="flex flex-col md:min-w-40 border">
        {categories?.map((item) => (
          <Button
            key={item?._id}
            onClick={()=>setCurrentSlug(item?.slug?.current as string)}
            className={`bg-transparent border-0 rounded-none 
            text-[#151515] shadow:none hover:bg-[#151515]/80
             hover:text-white font-semibold hoverEffect border-b last:border-b-0 ${item?.
              slug?.current === currentSlug && 
            'bg-[#151515] text-white border-[#151515]'}`}
          >
            {item?.title}
          </Button>
        ))}
      </div>
      <div className="w-full">
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
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-
                     lg:grid-cols-4 gap-8 w-full">
                      <>
                        {products?.map((product: Product) => (
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
                      </>
                    </div>
                  ) : (
                    <NoProductAvailable selectedTab={currentSlug} 
                     className="mt-0 w-full"
                    /> 
                  )}
                </>
              )}
      </div>
    </div>
  );
};

export default CategoryProducts;
