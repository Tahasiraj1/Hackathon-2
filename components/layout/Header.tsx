"use client";

import React from "react";
import { ShoppingCart, CircleUser, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import SearchProduct from "../SearchProduct";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-[132px] px-10">
      <div className="flex w-full justify-between ">
        <div className="hidden md:flex">
          <SearchProduct />
        </div>
        <h1 className="text-2xl font-clash-display">
          <Link href="/">Avion</Link>
        </h1>
        <div className="flex gap-4">
          <Link href="/cart">
            <ShoppingCart className="hidden md:flex" />
          </Link>
          <CircleUser className="hidden md:flex" />
          <div className="md:hidden flex">
            <SearchProduct />
          </div>
          {/* Sheet below */}
          <Sheet>
            <SheetTrigger asChild>
              <Menu className="md:hidden cursor-pointer" />
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Browse our categories</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/products">All Products</Link>
                <Link href="/products">Casual Wear</Link>
                <Link href="/products">Formal Attire</Link>
                <Link href="/products">Active Wear</Link>
                <Link href="/products">Accessories</Link>
                <Link href="/products">All Products</Link>
                <Link href="/products">Mens</Link>
                <Link href="/products">Womens</Link>
                <Link href="/products">Kids</Link>
                <h2>Profile</h2>
                <Link href="/cart">
                  <h2>Cart</h2>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <hr className="w-full mt-4" />
      <div className="hidden md:flex items-center justify-center gap-8 mt-4 font-satoshi">
        <Link href="/products">All Products</Link>
        <Link href="/products">Casual Wear</Link>
        <Link href="/products">Formal Attire</Link>
        <Link href="/products">Active Wear</Link>
        <Link href="/products">Accessories</Link>
        <Link href="/products">Mens</Link>
        <Link href="/products">Womens</Link>
        <Link href="/products">Kids</Link>
      </div>
    </div>
  );
};

export default Header;
