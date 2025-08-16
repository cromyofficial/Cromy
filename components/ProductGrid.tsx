"use client";
import React, { useEffect, useState } from "react";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constant";
import { client } from "@/sanity/lib/client";


export const ProductGrid = () => {

  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectTab] = useState(productType[0]?.title || "");
  const query = `*[_type == "product" && variant == $variant] | order(name asc)`;
  const params = { variant: selectedTab.toLowerCase() };

   useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        // setProducts(await response);
        console.log(response);
        
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
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={setSelectTab}
      ></HomeTabBar>
    </div>
  );
};
