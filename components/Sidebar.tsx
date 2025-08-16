import React, { FC } from "react";
import { motion } from "motion/react";
import Logo from "./Logo";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { headerData } from "@/constant";
import { usePathname } from "next/navigation";
import Link from "next/link";
import SocialMedia from "./SocialMedia";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const SidebarRef = useOutsideClick<HTMLDivElement>(onClose);
  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 bg-[#52525b]/50 shadow-xl cursor-auto hoverEffect w-full ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        ref={SidebarRef}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="min-w-72 max-w-96 bg-[#52525b] text-white/70 h-full px-6 pt-8  flex flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <Logo className="text-white">Cromy</Logo>
          </button>
          <button
            onClick={onClose}
            className="hover:text-red-500 hoverEffect cursor-pointer"
          >
            <X />
          </button>
        </div>
        <div className="flex flex-col gap-3.5 text-base font-semibold tracking-wide">
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
                  onClick={onClose}
                  className={`hover:text-white hoverEffect ${
                    pathname === item?.href && "text-white"
                  }`}
                  href={item?.href}
                  key={item?.title}
                >
                  {item.title}
                </Link>
              </div>
            );
          })}
        </div>
        <SocialMedia />
      </motion.div>
    </div>
  );
};
