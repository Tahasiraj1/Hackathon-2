"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { Button } from "./ui/button";
import { useCart } from "@/lib/CartContext";
import { urlFor } from "@/sanity/lib/image";
import { Plus, Minus, X } from "lucide-react";
import Link from "next/link";

const Cart = () => {
  const { cart, clearCart, incrementQuantity, decrementQuantity, removeFromCart } = useCart();

  const totalPrice = (productId: string, productColor: string, productSize: string): number => {
    const product = cart.find((item) => item.id === productId && item.color === productColor && item.size === productSize);
    return product ? product.price * product.quantity : 0;
  };

  const subTotal = cart.reduce(
    (sum, item) => item.price * item.quantity + sum,
    0
  );

  //   const handleRemoveFromCart = (item: CartItem) => {
  //     removeFromCart(item);
  //   };

  return (
    <div className="flex flex-col text-start px-4 md:px-10 font-clashDisplay">
      <h1 className="text-3xl mb-10">Your shoping cart</h1>
      <Table>
        <TableHeader className="hidden md:table-header-group">
          <TableRow>
            <TableHead className="pl-20">Product</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={`${item.id}-${item.color}-${item.size}`}>
              <TableCell className="flex gap-x-4 items-center">
                <Button 
                onClick={() => removeFromCart(item)}
                className="bg-transparent hover:bg-transparent hover:-rotate-90 active:rotate-90 transition-transform transform duration-300 text-black hidden md:block"
                >
                  <X />
                </Button>
                <Image
                  src={urlFor(item.image).url()}
                  alt=""
                  width={200}
                  height={200}
                  className="w-[150px] h-[200px] md:w-[200px] "
                />
                <div className="flex flex-col gap-4 justify-center">
                  <h2 className="md:text-3xl">{item.name}</h2>
                  <p className="max-w-xl"><span className="mr-1">Color:</span> {item.color}</p>
                  <p className="max-w-xl"><span className="mr-1">Size:</span> {item.size}</p>
                  <span>{item.price}</span>
                  <div className="flex md:hidden items-center bg-gray-200 w-fit">
                    <Button
                      className="rounded-none bg-gray-200 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300"
                      onClick={() => decrementQuantity(item)}
                    >
                      <Minus />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      className="rounded-none bg-gray-200 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300"
                      onClick={() => incrementQuantity(item)}
                    >
                      <Plus />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {" "}
                <div className="flex items-center justify-center bg-gray-200 w-fit">
                  <Button
                    className="rounded-none bg-gray-200 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300"
                    onClick={() => decrementQuantity(item)}
                  >
                    <Minus />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    className="rounded-none bg-gray-200 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300"
                    onClick={() => incrementQuantity(item)}
                  >
                    <Plus />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {totalPrice(item.id, item.color, item.size)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-center items-end mb-10 border border-x-0 border-b-0 px-4 py-4">
        <div className="flex flex-col items-end justify-end space-y-4 w-full text-right">
          <div className="w-full flex justify-end items-center gap-4 px-4">
            <span>Subtotal:</span>
            <strong>{subTotal}</strong>
          </div>
          <div className="w-full text-right px-4">
            <span>Taxes and shipping are calculated at checkout</span>
          </div>
          <div className="w-full flex justify-end px-4">
            <Link href="/checkout">
              <Button
                disabled={cart.length === 0}
                className="bg-[#2A254B] text-white rounded-none px-6 py-4"
              >
                Go to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
