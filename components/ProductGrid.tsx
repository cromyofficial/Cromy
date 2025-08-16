"use client";
import React, { useState } from "react";
import HomeTabBar from "./HomeTabBar";
import { productType } from "@/constant";

export const ProductGrid = () => {
  const [selectedTab, setSelectTab] = useState(productType[0]?.title || "");
  return (
    <div className="mt-10 flex flex-col items-center">
      <HomeTabBar
        selectedTab={selectedTab}
        onTabSelect={setSelectTab}
      ></HomeTabBar>
    </div>
  );
};
