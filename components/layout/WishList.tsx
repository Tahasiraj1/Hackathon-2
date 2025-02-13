"use client"

import React from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { useCart } from "@/lib/CartContext";
import { urlFor } from "@/sanity/lib/image";
import { WishItem } from "@/Types/types";

const WishList = () => {
    const { wishList, removeFromWishlist } = useCart();

    const handleRemoveFromWishlist = (e: React.MouseEvent, item: WishItem) => {
      e.preventDefault() // Prevent navigation
      e.stopPropagation() // Stop event from bubbling up to parent elements
      removeFromWishlist({
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
      })
    }
  
    const wishItem = wishList.length;

  return (
    <div className="flex items-center justify-center text-start">
      <Sheet>
        <SheetTrigger asChild className="relative">
          <button>
            <Heart className="relative w-6 h-6" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="pt-16 border-r-0 border-t-0 border-b-0 border-l-2 border-[#2A254B] "
        >
          <SheetHeader>
            <SheetTitle className="font-clashDisplay">WishList</SheetTitle>
          </SheetHeader>
          {wishItem === 0 ? (
            <p className="text-center text-lg font-clashDisplay mt-5">
              No Wish Items Found
            </p>
          ) : (
            <ScrollArea className="h-[calc(100vh-80px)] pr-4 w-full">
              <ul className="flex flex-col">
                {wishList.map((item) => (
                  <li key={item.id} className="mb-4">
                    <Link href={`/products/${item.id}`}>
                      <div className="relative flex items-center gap-4 bg-gray-200  p-2 rounded-xl">
                        <Image
                          src={urlFor(item.image).url()}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="rounded-xl"
                        />
                        <Button
                          className="absolute top-0 right-0 p-2 bg-transparent hover:bg-transparent hover:-rotate-90 text-black active:rotate-90 transition-transform transfrom duration-300"
                          onClick={(e) => handleRemoveFromWishlist(e, item)}
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
  );
};

export default WishList;
