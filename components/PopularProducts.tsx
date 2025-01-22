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
    <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-0 lg:px-10 pl-4 font-clashDisplay">
      <div className="w-full">
        <h2 className="text-2xl text-start mb-10">Our popular products</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.slice(0, 4).map((p) => (
            <div key={p.id}>
              <Image
                src={urlFor(p.images[0] as SanityImage).url()}
                alt={p.name}
                width={1000}
                height={1000}
                className="mb-4 w-[630px] h-[375px] "
              />
              <h3>The Popular suede sofa</h3>
              <span>£980</span>
            </div>
          ))}
          {/* <div className="w-[630px] h-[462px] flex-col md:flex hidden ">
            <Image
              src="/Images/Large.jpg"
              alt="The dandy chair"
              width={1000}
              height={1000}
              className="mb-4 w-[630px] h-[375px] "
            />
            <h3>The Popular suede sofa</h3>
            <span>£980</span>
          </div>
          <div className="w-[305px] h-[462px] flex-col md:flex hidden ">
            <Image
              src="/Images/Photo.png"
              alt="Rustic Vase Set"
              width={1000}
              height={1000}
              className="mb-4 w-[305px] h-[375px] "
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          <div className="w-[305px] h-[462px] flex-col md:flex hidden ">
            <Image
              src="/Images/Photo (4).png"
              alt="The Silky Vase"
              width={1000}
              height={1000}
              className="mb-4 w-[305px] h-[375px] "
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          {/* Small screen products */}
          {/* <div className="w-[305px] h-[462px] flex-col md:hidden ">
            <Image
              src="/Images/Photo (3).png"
              alt="The Silky Vase"
              width={1000}
              height={1000}
              className="mb-4 w-[305px] h-[375px] "
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>
          <div className="w-[305px] h-[462px] flex-col md:hidden overflow-x-hidden ">
            <Image
              src="/Images/Photo (1).png"
              alt="The Silky Vase"
              width={1000}
              height={1000}
              className="mb-4 w-[305px] h-[375px] "
            />
            <h3>The Dandy chair</h3>
            <span>£250</span>
          </div>  */}
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
