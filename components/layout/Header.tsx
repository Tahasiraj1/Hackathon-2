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
import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";

const SearchProduct = dynamic(() => import("../SearchProduct"));
const MobileMenuSheet = dynamic(() => import("./MobileMenuSheet"));
const WishList = dynamic(() => import("./WishList"));

const Header = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const { user } = useUser();

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

  const role = user?.publicMetadata?.role;

  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-md">
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

          <div className="flex items-center justify-center gap-3 md:gap-4">
            {role === "admin" ? (
              <Link href={"/admin"}>
                <Button className="hidden md:flex bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-none text-black w-fit px-4 py-2">
                  Admin
                </Button>
              </Link>
            ) : (
              <Link href={"/my-orders"}>
                <Button className="hidden md:flex bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-none text-black w-fit px-2 py-2">
                  My Orders
                </Button>
              </Link>
            )}

            {/* Wishlist */}
            <WishList />

            {/* Cart */}
            <Link href="/cart">
              <ShoppingCart className="hidden md:flex" />
            </Link>

            {/* User Authentication */}
            <div className="mt-0.5">
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

            {/* Mobile Search */}
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
          className="hidden lg:flex relative w-full overflow-hidden"
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
                <div className="hidden lg:flex items-center justify-center gap-8 font-satoshi py-2">
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
