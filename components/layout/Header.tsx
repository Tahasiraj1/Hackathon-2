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

const categories = [
  { title: "All Products", href: "/products" },
  { title: "Mens", href: "/products/category/Mens" },
  { title: "Womens", href: "/products/category/Womens" },
  { title: "Kids", href: "/products/category/Kids" },
  { title: "Casual Wear", href: "/products/category/Casual Wear" },
  { title: "Formal Attire", href: "/products/category/Formal Attire" },
  { title: "Active Wear", href: "/products/category/Active Wear" },
  { title: "Accessories", href: "/products/category/Accessories" },
]

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
          <h1 className="text-2xl font-clashDisplay mt-1">
            <Link href="/">Avion</Link>
          </h1>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            {role === "admin" ? (
              <Link href={"/admin"}>
                <Button className="hidden md:flex bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-full text-black w-fit px-4 py-2">
                  Admin
                </Button>
              </Link>
            ) : (
              <Link href={"/my-orders"}>
                <Button className="hidden md:flex bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-full text-black w-fit px-2 py-2">
                  My Orders
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <ShoppingCart className="hidden md:flex" />
            </Link>

            {/* Mobile Search */}
            <div className="md:hidden flex">
              <SearchProduct />
            </div>

            {/* Wishlist */}
            <WishList />

            {/* Mobile Menu */}
            <MobileMenuSheet />

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
                <div className="hidden lg:flex items-center justify-center gap-8 font-satoshi mt-1.5">
                  {categories.map((category) => (
                    <Link key={category.href} href={category.href}>
                        {category.title}
                    </Link>
                  ))}
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
