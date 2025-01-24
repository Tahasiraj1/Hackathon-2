"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { CircleUser, ShoppingCart } from "lucide-react";
import {
  SignedIn,
  SignInButton,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const SearchProduct = dynamic(() => import("../SearchProduct"));
const MobileMenuSheet = dynamic(() => import("./MobileMenuSheet"));
const WishList = dynamic(() => import("./WishList"));

const Header = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrollYPosition, setScrollYPosition] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollYPosition(latest); // Track scroll position
  });

  useEffect(() => {
    // Only toggle visibility when crossing a scroll threshold
    const handleVisibility = () => {
      if (scrollYPosition > 50) {
        setVisible(false); // Hide categories if scrolling down past 50px
      } else {
        setVisible(true); // Show categories when near the top
      }
    };

    handleVisibility();
  }, [scrollYPosition]);

  return (
    <header className="sticky top-0 z-10 w-full bg-white bg-opacity-70 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-full px-5 md:px-10">
        {/* Top Header Section */}
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
            <div>
              <SignedOut>
                <SignInButton mode="modal">
                  <button>
                    <CircleUser />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
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
        <motion.div
          className="hidden md:flex relative w-full overflow-hidden"
          initial={{ opacity: 0, height: "0px" }}
          animate={{
            opacity: visible ? 1 : 0,
            height: visible ? "40px" : "0px", // Dynamically animate height
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <div className="hidden md:flex items-center justify-center gap-8 font-satoshi py-2">
                  <Link href="/products">All Products</Link>
                  <Link href="/products/category/Mens">Mens</Link>
                  <Link href="/products/category/Womens">Womens</Link>
                  <Link href="/products/category/Kids">Kids</Link>
                  <Link href="/products/category/Casual Wear">
                    Casual Wear
                  </Link>
                  <Link href="/products/category/Formal Attire">
                    Formal Attire
                  </Link>
                  <Link href="/products/category/Active Wear">
                    Active Wear
                  </Link>
                  <Link href="/products/category/Accessories">
                    Accessories
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
