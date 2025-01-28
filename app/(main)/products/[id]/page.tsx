"use client";

import React, { Suspense } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
const WhatMakesUsDiff = React.lazy(
  () => import("@/components/WhatMakesUsDiff")
);
const JoinClub = React.lazy(() => import("@/components/JoinClub"));
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import { client } from "@/sanity/lib/client";
import { useCart } from "@/lib/CartContext";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";
import { BarLoader } from "react-spinners";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface Variation {
  color: string;
  size: string;
  quantity: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  categories: string[];
  images: SanityImage[];
  ratings: string;
  tags: string[];
  description: string;
  variations: Variation[];
}

const ProductDetails = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [items, setItems] = useState<Product[]>([]);

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  const params = useParams();
  const productId = params.id as string;
  const product = products.find((p) => String(p.id) === productId);

  // Fetch all products to shows in recommendation if actuall recommendation's length is less than 4
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setItems(data.data))
      .catch((err) => {
        console.log(err);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      });
  });

  // Fetch product by Id
  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "product" && id == $productId]{
        id,
        name,
        price,
          "images": images[].asset->url,
        ratings,
        discountPercentage,
        priceWithoutDiscount,
        ratingCount,
        description,
        variations[] {
          color,
          size,
          quantity
        },
        tags,
        categories,
      }`;

      try {
        const fetchedProducts = await client.fetch(query, {
          productId: productId,
        });

        if (fetchedProducts.length > 0) {
          console.log("Fetched product images:", fetchedProducts[0].images);
        }

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast({
          title: "Error",
          description: "Failed to fetch products",
          variant: "destructive",
        });
      }
    };

    fetchProducts();
  }, [productId]);

  // Fetch recommended products based on the product's Id
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.categories && product.categories.length > 0) {
        const query = `*[_type == "product" && id != $productId && count((categories[])[@ in $categories]) > 0] {
          id,
          name,
          price,
          "images": images[].asset->url,
          categories
        }[0...10]`;

        try {
          const fetchedRelatedProducts = await client.fetch(query, {
            productId: product.id,
            categories: product.categories,
          });

          setRelatedProducts(fetchedRelatedProducts);
        } catch (error) {
          console.error("Error fetching related products:", error);
          toast({
            title: "Error",
            description: "Failed to fetch related products",
            variant: "destructive",
          });
        }
      }
    };

    fetchRelatedProducts();
  }, [product]);

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && product && product.images.length > 0) {
      addToCart({
        id: product?.id.toString(),
        image: product?.images?.[0],
        name: product?.name as string,
        price: product?.price as number,
        quantity: quantity,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
      });
      toast({
        className: "rounded-none border border-[#27224b]",
        title: "Success!",
        description: `${product.name}  is added to cart.`,
        duration: 5000,
      });
    } else {
      toast({
        className: "rounded-none text-white",
        variant: "destructive",
        title: "⚠️ Error!",
        description: "Please select color and size.",
        duration: 5000,
      });
    }
  };

  const handleIncrement = () => {
    if (selectedColor && selectedSize) {
      const selectedVariation = product?.variations.find(
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
      setQuantity((prevQuantity) => {
        return prevQuantity - 1;
      });
    }
  };

  return (
    <>
      {product ? (
        <Suspense fallback={          
          <div className="flex items-center justify-center">
            <BarLoader color="#2A254B" />
          </div>
        }>
        <div className="flex lg:flex-row flex-col">
          <div className="flex space-x-2">
            <Image
              src={urlFor(product.images[0]).url()}
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

            <motion.p
              variants={itemVariants}
              className="text-lg font-bold mb-4"
            >
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
                  !product.variations.some(
                    (variation) => variation.quantity > 0
                  )
                }
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </div>
        </Suspense>
      ) : (
        <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
          Product not found
        </div>
      )}
      <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-7xl mt-10">
          <h2 className="text-3xl md:text-4xl text-start font-clashDisplay">
            You might also like
          </h2>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Carousel
              className="w-full py-10 px-10"
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-ml-2 md:-ml-4 mb-10">
                {relatedProducts && relatedProducts.length > 4
                  ? relatedProducts.map((product) => (
                      <CarouselItem
                        key={product.id}
                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <Link href={`/products/${product.id}`} key={product.id}>
                          <motion.div
                            variants={itemVariants}
                            className="relative aspect-[4/5] w-full mb-4"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                            />
                          </motion.div>
                          <motion.div variants={itemVariants}>
                            <h3 className="text-lg font-medium">
                              {product.name}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {product.price}
                            </span>
                          </motion.div>
                        </Link>
                      </CarouselItem>
                    ))
                  : items.map((product) => (
                      <CarouselItem
                        key={product.id}
                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                      >
                        <Link href={`/products/${product.id}`} key={product.id}>
                          <motion.div
                            variants={itemVariants}
                            className="relative aspect-[4/5] w-full mb-4"
                          >
                            <Image
                              src={urlFor(product.images[0]).url()}
                              alt={product.name}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                              className="object-cover"
                            />
                          </motion.div>
                          <motion.div variants={itemVariants}>
                            <h3 className="text-lg font-medium">
                              {product.name}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {product.price}
                            </span>
                          </motion.div>
                        </Link>
                      </CarouselItem>
                    ))}
              </CarouselContent>

              <div className="w-[100px] h-32 absolute -bottom-8 left-0 right-0 m-auto flex items-center justify-between">
                <CarouselPrevious className="bg-gray-300 rounded-none px-6 py-6 hover:bg-gray-400 text-black active:scale-95 transition-transform transform duration-300" />
                <CarouselNext className="bg-gray-300 rounded-none px-6 py-6 hover:bg-gray-400 text-black active:scale-95 transition-transform transform duration-300" />
              </div>
            </Carousel>
          </motion.div>
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
