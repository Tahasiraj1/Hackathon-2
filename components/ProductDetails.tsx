"use client";

import React, { useState, Suspense } from "react";
import { useCart } from "@/lib/CartContext";
import { toast } from "@/hooks/use-toast";
import { BarLoader } from "react-spinners";
import { motion } from "framer-motion";
import type { Product } from "@/lib/product";
import useSWR from "swr";
import { containerVariants, itemVariants } from "@/lib/motion";
import { Button } from "./ui/button";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Dot, Plus, Minus } from "lucide-react";
import RelatedProducts from "./RelatedProducts";

const WhatMakesUsDiff = React.lazy(
  () => import("@/components/WhatMakesUsDiff")
);
const JoinClub = React.lazy(() => import("@/components/JoinClub"));

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ProductDetails = ({ productId }: { productId: string }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const { data, error } = useSWR<{ success: boolean; data: Product }>(
    `/api/products?id=${productId}`,
    fetcher,
    {
      refreshInterval: 10000, // Re-fetch every 10s for real-time stock
    }
  );

  const product = data?.data;

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && product && product.images.length > 0) {
      addToCart({
        id: product.id.toString(),
        image: product.images[0],
        name: product.name,
        price: product.price,
        quantity: quantity,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
      });
      toast({
        className: "border border-[#27224b]",
        title: `✔️ ${product.name} is added to cart!`,
        description: ``,
        duration: 5000,
      });
    } else {
      toast({
        className: "border border-[#27224b]",
        title: "⚠️ Please select color and size.",
        description: "",
        duration: 5000,
      });
    }
  };

  const handleIncrement = () => {
    if (selectedColor && selectedSize && product) {
      const selectedVariation = product.variations.find(
        (variation) =>
          variation.color === selectedColor && variation.size === selectedSize
      );
      if (selectedVariation && quantity < selectedVariation.quantity) {
        setQuantity((prevQuantity) => prevQuantity + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-red-100 p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>Failed to load product</p>
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BarLoader color="#2A254B" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex lg:flex-row flex-col"
      >
        <div className="flex space-x-2">
          <Image
            src={urlFor(product.images[0]).url() || "/placeholder.svg"}
            alt={`Image of ${product.name}`}
            width={1000}
            height={1000}
            className="w-full h-full lg:w-[600px] lg:h-[600px]"
          />
        </div>
        <div className="flex flex-col lg:pl-20 pr-5 w-full max-w-2xl px-10">
          <motion.h1
            variants={itemVariants}
            className="text-3xl md:text-4xl mb-5 mt-4 font-clashDisplay"
          >
            {product.name}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg font-bold mb-4">
            $ {product.price}
          </motion.p>

          <span className="mb-4">Description:</span>

          <motion.p variants={itemVariants} className="mb-4 max-w-lg">
            {product.description}
          </motion.p>

          <ul className="flex flex-col mb-4">
            <motion.li variants={itemVariants} className="flex mr-2">
              <Dot /> Premium material
            </motion.li>
            <motion.li variants={itemVariants} className="flex mr-2">
              <Dot /> Handmade upholstery
            </motion.li>
            <motion.li variants={itemVariants} className="flex mr-2">
              <Dot /> Quality timeless classic
            </motion.li>
          </ul>

          <h2 className="mb-4 mt-4">Colors</h2>
          <ul className="flex gap-5">
            {product.variations
              .map((variation) => variation.color)
              .filter((color, index, self) => self.indexOf(color) === index) // Remove duplicate colors
              .map((color) => (
                <li key={color}>
                  <Button
                    className={`rounded-none text-black ${
                      selectedColor === color
                        ? "bg-gray-300 hover:bg-gray-300"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedColor(color);
                      setQuantity(1);
                      setSelectedSize(null); // Reset selected size on color change
                    }}
                  >
                    {color}
                  </Button>
                </li>
              ))}
          </ul>

          {selectedColor && (
            <>
              <h2 className="mb-4 mt-4">Sizes with quantities</h2>
              {product.variations.some(
                (variation) =>
                  variation.color === selectedColor && variation.quantity > 0
              ) ? (
                <ul className="flex gap-5">
                  {product.variations
                    .filter((variation) => variation.color === selectedColor) // Don't filter by quantity here
                    .map((variation) => (
                      <li key={variation.size}>
                        <Button
                          className={`rounded-none text-black ${
                            selectedSize === variation.size
                              ? "bg-gray-300 hover:bg-gray-300"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => {
                            if (variation.quantity > 0) {
                              setSelectedSize(variation.size);
                              setQuantity(1);
                            }
                          }}
                          disabled={variation.quantity === 0} // Disable button for unavailable sizes
                        >
                          {variation.size} ({variation.quantity})
                        </Button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-red-500">Out of stock</p>
              )}
            </>
          )}

          <div className="md:flex-row flex flex-col mt-10 gap-2 justify-between">
            <div className="md:flex hidden">
              <span className="mr-6 mt-2">Quantity:</span>
              <div className="bg-gray-100 flex items-center justify-center">
                <Button
                  onClick={handleDecrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black active:scale-95 transition-transform transform duration-300"
                >
                  <Minus size={15} />
                </Button>
                <span>{quantity}</span>
                <Button
                  onClick={handleIncrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black active:scale-95 transition-transform transform duration-300"
                >
                  <Plus size={15} />
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:hidden space-y-4">
              <span className="mr-6 mt-2">Quantity:</span>
              <div className="bg-gray-100 flex items-center justify-center w-full">
                <Button
                  onClick={handleDecrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black w-full"
                >
                  <Minus size={15} />
                </Button>
                <span>{quantity}</span>
                <Button
                  onClick={handleIncrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black w-full"
                >
                  <Plus size={15} />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              className="mt-4 md:mt-0 text-lg bg-[#2A254B] hover:bg-[#332d5c] rounded-none w-full md:w-fit"
              disabled={
                !product.variations.some((variation) => variation.quantity > 0)
              }
            >
              ADD TO CART
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-7xl mt-10">
          <h2 className="text-3xl md:text-4xl text-start font-clashDisplay">
            You might also like
          </h2>
          <RelatedProducts
            productId={product.id.toString()}
            categories={product.categories}
          />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center mb-10">
            <BarLoader color="#2A254B" />
          </div>
        }
      >
        <WhatMakesUsDiff />
        <JoinClub />
      </Suspense>
    </>
  );
};

export default ProductDetails;
