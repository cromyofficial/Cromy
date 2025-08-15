import React from "react";
import { HeaderMenu } from "./HeaderMenu";
import Logo from "./Logo";
import Container from "./Container";
import { MobileMenu } from "./MobileMenu";
import { SearchBar } from "./SearchBar";
import { CartIcon } from "./CartIcon";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ListOrdered } from "lucide-react";

export const Header = async () => {
  const user = await currentUser();
  console.log("user", user);

  return (
    <header className=" border-b border-gray-400 py-5">
      <Container className="flex justify-between items-center gap-7 text-[#52525b]">
        {/* leftbar */}
        <HeaderMenu />
        {/* Logo */}
        <div className="w-auto md:w-1/3 flex items-center justify-center gap-2.5">
          <MobileMenu></MobileMenu>
          <Logo>Cromy</Logo>
        </div>
        {/* rightbar */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <Link href={"/orders"} className=" group relative">
            <ListOrdered className="group-hover:text-darkColor hoverEffect" />
            <span className="absolute -top-1 -right-1 bg-[#151515] text-white h-3.5 w-3.5 rounded-full text-xs font-semibold flex items-center justify-center">
              0
            </span>
          </Link>
          <UserButton />
          <ClerkLoaded>
            {!user && (
              <SignInButton mode="modal">
                <button className="text-sm font-semibold hover:text-[#52525b] hoverEffect">
                  Login
                </button>
              </SignInButton>
            )}
          </ClerkLoaded>
        </div>
      </Container>
    </header>
  );
};
