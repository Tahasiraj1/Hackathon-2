"use client";

import Image from "next/image";
import React, { useEffect, useState, Suspense } from "react";
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

const PopularProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/products?tags=${"Popular"}`);
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
      <div className="w-full">
        <h2 className="text-2xl text-start mb-10">Our popular products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.slice(0, 4).map((p) => (
            <Link href={`/products/${p.id}`} key={p.id}>
              <div key={p.id} className="relative aspect-[4/5] w-full mb-4">
                <Image
                  src={urlFor(p.images[0] as SanityImage).url()}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">{p.name}</h3>
              <span className="text-sm text-gray-600">{p.price}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <Link href="/products">
          <Button className="bg-gray-200 rounded-none px-6 py-6 hover:bg-gray-300 text-black w-fit">
            View collection
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PopularProducts;
