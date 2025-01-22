"use client";

import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Image as SanityImage } from "@sanity/types";
import { urlFor } from "@/sanity/lib/image";
import { BounceLoader } from "react-spinners";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images: SanityImage;
  ratings: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  categories: string[];
  description: string;
}

const BestSelling = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?tags=${"Best Selling"}`);
        const data = await res.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Suspense>
        <div className="flex justify-center items-center min-h-[400px] w-full">
          <BounceLoader color="#2A254B" />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10 font-clashDisplay">
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl text-start mb-6 sm:mb-10">New ceramics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.slice(0, 4).map((product, index) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div key={index} className="flex flex-col">
                <div className="relative aspect-[4/5] w-full mb-4">
                  <Image
                    src={urlFor(product.images[0] as SanityImage).url()}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">{product.name}</h3>
                <span className="text-sm text-gray-600">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-8 sm:mt-12">
        <Link href="/products">
          <Button className="bg-gray-200 rounded-none px-6 py-3 sm:py-4 hover:bg-gray-300 text-black w-fit text-sm sm:text-base">
            View collection
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default BestSelling;
