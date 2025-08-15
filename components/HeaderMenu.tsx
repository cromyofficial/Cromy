"use client";

import { headerData } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const HeaderMenu = () => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className="hidden md:inline-flex w-1/3 items-center gap-5 text-sm capitalize font-semibold">
      {headerData?.map((item) => {
        const isActive = pathname === item.href;
        console.log(
          "pathname:",
          pathname,
          "item.href:",
          item.href,
          "isActive:",
          isActive
        );
        return (
          <div key={item?.title}>
            <Link
              className={`relative group hover:text-[#151515] transition-all duration-300 ${
                pathname === item?.href && "text-red-700"
              }`}
              href={item?.href}
              key={item?.title}
            >
              {item.title}
              <span
                className={`absolute -bottom-0.5 left-1/2 w-0 h-0.5 bg-[#151515] group-hover:w-1/2 group-hover:left-0 transition-all duration-300 ${
                  pathname === item?.href && "w-1/2"
                }`}
              ></span>
              <span
                className={`absolute -bottom-0.5 right-1/2 w-0 h-0.5 bg-[#151515] group-hover:w-1/2 group-hover:right-0 transition-all duration-300 ${
                  pathname === item?.href && "w-1/2"
                }`}
              ></span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
