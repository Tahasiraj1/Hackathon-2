"use client";

import React from "react";
import { Search, ShoppingCart, CircleUser, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-[132px] px-10">
      <div className="flex w-full justify-between ">
        <Search className="hidden md:flex" />
        <h1 className="text-2xl font-clash-display">Avion</h1>
        <div className="flex gap-4">
          <Link href="/cart">
            <ShoppingCart className="hidden md:flex" />
          </Link>
          <CircleUser className="hidden md:flex" />
          <Search className="md:hidden" />
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
                <Link href="/products">Plant pots</Link>
                <Link href="/products">Ceramics</Link>
                <Link href="/products">Tables</Link>
                <Link href="/products">Chairs</Link>
                <Link href="/products">Crockery</Link>
                <Link href="/products">Tableware</Link>
                <Link href="/products">Cutlery</Link>
                <h2>Profile</h2>
                <h2>Search</h2>
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
        <Link href="/products">Plant pots</Link>
        <Link href="/products">Ceramics</Link>
        <Link href="/products">Tables</Link>
        <Link href="/products">Chairs</Link>
        <Link href="/products">Crockery</Link>
        <Link href="/products">Tableware</Link>
        <Link href="/products">Cutlery</Link>
      </div>
    </div>
  );
};

export default Header;
