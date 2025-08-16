"use client";
import { productType } from "@/constant";
import { Repeat } from "lucide-react";

interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="text-sm font-semibold">
      {/* Grid for mobile, flex for desktop */}
      <div
        className="
          grid grid-cols-3 gap-2
          md:flex md:flex-wrap md:gap-1.5
        "
      >
        {productType?.map((item) => (
          <button
            onClick={() => onTabSelect(item?.title)}
            key={item?.title}
            className={`border border-[#151515] px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-[#151515] hover:text-white cursor-pointer hoverEffect ${
              selectedTab === item?.title && "bg-[#151515] text-white"
            }`}
          >
            {item?.title}
          </button>
        ))}

        <button className="border border-[#151515] px-2 py-2 rounded-full hover:bg-[#151515] hover:text-white hoverEffect flex justify-center items-center">
          <Repeat className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default HomeTabbar;
