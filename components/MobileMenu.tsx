"use client";
import { AlignLeft } from "lucide-react";
import { CATEGORIES_QUERYResult, Category } from "@/sanity.types";
import {Sidebar} from "./Sidebar";
import React, { useState } from "react";

export const MobileMenu = ({ categories }: { categories: CATEGORIES_QUERYResult }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AlignLeft className="hover:text-darkColor hoverEffect md:hidden" />
      </button>
      <div className="md:hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          categories={categories}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>
    </>
  );
};
