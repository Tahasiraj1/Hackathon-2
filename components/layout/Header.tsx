"use client";

import React from "react";
import { ShoppingCart, CircleUser} from "lucide-react";
import Link from "next/link";
import SearchProduct from "../SearchProduct";
import MobileMenuSheet from "./MobileMenuSheet";
import WishList from "./WishList";

const Header = () => {

  return (
    <header className="flex flex-col items-center justify-center bg-white w-full h-[132px] pt-2 px-5 md:px-10">
      <div className="flex w-full justify-between ">
        {/* Search Option below */}
        <div className="hidden md:flex">
          <SearchProduct />
        </div>
        {/* Website Name below */}
        <h1 className="text-2xl font-clashDisplay">
          <Link href="/">Avion</Link>
        </h1>
        <div className="flex gap-2.5 md:gap-4">
          {/* WishList below */}
          <WishList />
          <Link href="/cart">
            <ShoppingCart className="hidden md:flex" />
          </Link>
          <CircleUser className="hidden md:flex" />
          <div className="md:hidden flex">
            <SearchProduct />
          </div>
          {/* Mobile Menu */}
          <MobileMenuSheet />
        </div>
      </div>
      {/* Desktop Categories Section */}
      <hr className="w-full mt-4" />
      <div className="hidden md:flex items-center justify-center gap-8 mt-4 font-satoshi">
        <Link href="/products">All Products</Link>
        <Link href="/products/category/Mens">Mens</Link>
        <Link href="/products/category/Womens">Womens</Link>
        <Link href="/products/category/Kids">Kids</Link>
        <Link href="/products/category/Casual Wear">Casual Wear</Link>
        <Link href="/products/category/Formal Attire">Formal Attire</Link>
        <Link href="/products/category/Active Wear">Active Wear</Link>
        <Link href="/products/category/Accessories">Accessories</Link>
      </div>
    </header>
  );
};

export default Header;
