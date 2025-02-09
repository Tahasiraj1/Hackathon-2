import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";

const MobileMenuSheet = () => {
  return (
    <>
      {/* Movile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="lg:hidden cursor-pointer" />
        </SheetTrigger>
        <SheetContent className="bg-white font-satoshi bg-opacity-30 backdrop-blur-md">
          <SheetHeader>
            <SheetTitle className="text-white">Menu</SheetTitle>
            <SheetDescription className="text-white">Browse our categories</SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-4 mt-4 text-white">
            <Link href="/products">All Products</Link>
            <Link href="/products/category/Mens">Mens</Link>
            <Link href="/products/category/Womens">Womens</Link>
            <Link href="/products/category/Kids">Kids</Link>
            <Link href="/products/category/Casual Wear">Casual Wear</Link>
            <Link href="/products/category/Formal Attire">Formal Attire</Link>
            <Link href="/products/category/Active Wear">Active Wear</Link>
            <Link href="/products/category/Accessories">Accessories</Link>
            <h2>Profile</h2>
            <Link href="/my-orders">
              <h2>My Orders</h2>
            </Link>
            <Link href="/cart">
              <h2>Cart</h2>
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileMenuSheet;
