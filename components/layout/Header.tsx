"use client";

// import React, { useEffect, useState } from "react";
import { ShoppingCart, CircleUser } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const SearchProduct = dynamic(() => import("../SearchProduct"));
const MobileMenuSheet = dynamic(() => import("./MobileMenuSheet"));
const WishList = dynamic(() => import("./WishList"));

const Header = () => {
  // const [isScrollingDown, setIsScrollingDown] = useState(false);
  // const [lastScrollY, setLastScrollY] = useState(0);

  // useEffect(() => {
  //   let ticking = false;
  
  //   const handleScroll = () => {
  //     const currentScrollY = window.scrollY;
  
  //     if (!ticking) {
  //       window.requestAnimationFrame(() => {
  //         if (currentScrollY > lastScrollY && currentScrollY > 100) {
  //           setIsScrollingDown(true);
  //         } else {
  //           setIsScrollingDown(false);
  //         }
  
  //         setLastScrollY(currentScrollY);
  //         ticking = false;
  //       });
  
  //       ticking = true;
  //     }
  //   };
  
  //   window.addEventListener("scroll", handleScroll, { passive: true });
  
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [lastScrollY]);
  

  return (
    <header className="sticky top-0 z-20 w-full bg-white bg-opacity-70 backdrop-blur-md transition-shadow duration-300">
      <div className="flex flex-col items-center justify-center w-full px-5 md:px-10">
        <div className="flex w-full justify-between pt-4">
          {/* Search Option */}
          <div className="hidden md:flex">
            <SearchProduct />
          </div>

          {/* Website Name */}
          <h1 className="text-2xl font-clashDisplay">
            <Link href="/">Avion</Link>
          </h1>

          <div className="flex gap-2.5 md:gap-4">
            {/* Wishlist */}
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

        {/* Horizontal Line */}
        <hr className="w-full mt-4" />

        {/* Categories Section */}
        <div
          className={`w-full overflow-hidden transition-all duration-300 ease-in-out`}
>
          <div className="hidden md:flex items-center justify-center gap-8 font-satoshi py-2">
            <Link href="/products">All Products</Link>
            <Link href="/products/category/Mens">Mens</Link>
            <Link href="/products/category/Womens">Womens</Link>
            <Link href="/products/category/Kids">Kids</Link>
            <Link href="/products/category/Casual Wear">Casual Wear</Link>
            <Link href="/products/category/Formal Attire">Formal Attire</Link>
            <Link href="/products/category/Active Wear">Active Wear</Link>
            <Link href="/products/category/Accessories">Accessories</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
