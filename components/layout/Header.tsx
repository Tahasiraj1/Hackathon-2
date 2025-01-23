"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { CircleUser, ShoppingCart } from "lucide-react";

const SearchProduct = dynamic(() => import("../SearchProduct"));
const MobileMenuSheet = dynamic(() => import("./MobileMenuSheet"));
const WishList = dynamic(() => import("./WishList"));

const Header = () => {
  // Track scroll position and progress
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  // Event listener for scroll direction and visibility toggle
  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const previous = scrollYProgress.getPrevious();
      let direction = 0;
      if (previous !== undefined) {
        direction = current - previous; // Determine scroll direction
      }

      if (direction < 0) {
        setVisible(true); // Show if scrolling up
      } else {
        setVisible(false); // Hide if scrolling down
      }
    }
  });

  return (
    <header className="sticky top-0 z-20 w-full bg-white bg-opacity-70 backdrop-blur-md transition-shadow duration-300">
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
        <motion.div
          className="relative w-full overflow-hidden"
          initial={{ opacity: 0, height: "0px" }}
          animate={{
            opacity: visible ? 1 : 0,
            height: visible ? "40px" : "0px", // Dynamically animate height
          }}
          exit={{ opacity: 0, height: "0px" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            {visible && ( // Conditionally render based on visibility
              <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <div className="hidden md:flex items-center justify-center gap-8 font-satoshi py-2">
                  <Link href="/products">All Products</Link>
                  <Link href="/products/category/Mens">Mens</Link>
                  <Link href="/products/category/Womens">Womens</Link>
                  <Link href="/products/category/Kids">Kids</Link>
                  <Link href="/products/category/Casual Wear">Casual Wear</Link>
                  <Link href="/products/category/Formal Attire">
                    Formal Attire
                  </Link>
                  <Link href="/products/category/Active Wear">Active Wear</Link>
                  <Link href="/products/category/Accessories">Accessories</Link>
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
