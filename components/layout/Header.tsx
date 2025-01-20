"use client";

import React from "react";
import { ShoppingCart, CircleUser, Menu, Heart, X } from "lucide-react";
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
import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { urlFor } from "@/sanity/lib/image";
import { Button } from "../ui/button";

const Header = () => {
  const { wishList, removeFromWishlist } = useCart();

  const wishItem = wishList.length;

  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-[132px] px-10">
      <div className="flex w-full justify-between ">
        {/* Search Option below */}
        <div className="hidden md:flex">
          <SearchProduct />
        </div>
        {/* Website Name below */}
        <h1 className="text-2xl font-clashDisplay">
          <Link href="/">Avion</Link>
        </h1>
        <div className="flex gap-4">
          {/* WishList below */}
          <div className="flex flex-col text-start">
            <Sheet>
              <SheetTrigger asChild className="relative mr-4 lg:mr-0">
                <button>
                  <Heart className="relative w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="pt-16 border-r-0 border-t-0 border-b-0 border-l-2 border-[#2A254B] "
              >
                <SheetHeader>
                  <SheetTitle className="mb-10 font-clashDisplay">WishList</SheetTitle>
                </SheetHeader>
                {wishItem === 0 ? (
                  <p className="text-center text-lg font-clashDisplay">No Wish Items Found</p>
                ) : (
                  <ScrollArea className="h-[calc(100vh-80px)] pr-4 w-full">
                    <ul className="flex flex-col">
                      {wishList.map((item) => (
                        <li key={item.id} className="mb-4">
                          <Link href={`/products/${item.id}`}>
                            <div className="relative flex items-center gap-4 bg-[#2A254B]/30  p-2 rounded-xl">
                              <Image
                                src={urlFor(item.image).url()}
                                alt={item.name}
                                width={100}
                                height={100}
                                className="rounded-xl"
                              />
                              <Button
                                className="absolute top-0 right-0 p-2 bg-transparent hover:bg-transparent hover:-rotate-90 text-black active:rotate-90 transition-transform transfrom duration-300"
                                onClick={() => removeFromWishlist(item)}
                              >
                                <X />
                              </Button>
                              <div className="flex flex-col text-black">
                                <span className="text-lg">{item.name}</span>
                                <span className="text-lg">{item.price}</span>
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                )}
              </SheetContent>
            </Sheet>
          </div>
          <Link href="/cart">
            <ShoppingCart className="hidden md:flex" />
          </Link>
          <CircleUser className="hidden md:flex" />
          <div className="md:hidden flex">
            <SearchProduct />
          </div>
          {/* Movile Menu */}
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
                <Link href="/products/category/Mens">Mens</Link>
                <Link href="/products/category/Womens">Womens</Link>
                <Link href="/products/category/Kids">Kids</Link>
                <Link href="/products/category/Casual Wear">Casual Wear</Link>
                <Link href="/products/category/Formal Attire">Formal Attire</Link>
                <Link href="/products/category/Active Wear">Active Wear</Link>
                <Link href="/products/category/Accessories">Accessories</Link>
                <h2>Profile</h2>
                <Link href="/cart">
                  <h2>Cart</h2>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
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
    </div>
  );
};

export default Header;
