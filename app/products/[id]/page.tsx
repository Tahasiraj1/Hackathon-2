"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
import WhatMakesUsDiff from "@/components/HomePage/WhatMakesUsDiff";
import JoinClud from "@/components/HomePage/JoinClud";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import { client } from "@/sanity/lib/client";


interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  images: SanityImage[];
  ratings: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  description: string;
}

const ProductDetails = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const query = `*[_type == "product" && id == $productId]{
        id,
        name,
        price,
          "images": images[].asset->{
          _id,
          _key,
          _ref,
          url,
          metadata
        },
        ratings,
        sizes,
        colors,
        tags,
        description
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
      }
    };

    fetchProducts();
  }, []);

  const params = useParams();
  const productId = params.id as string;
  const product = products.find((p) => String(p.id) === productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
        Product not found
      </div>
    );
  }

  return (
    <>
      <div className="flex lg:flex-row flex-col">
        <div className="flex space-x-2">
          <Image
            src={urlFor(product.images[0]).url()}
            alt={`Image of ${product.name}`}
            width={1000}
            height={1000}
            className="md:w-[600px] md:h-[600px]"
          />
        </div>
        <div className="flex flex-col lg:pl-20 pr-5 w-full max-w-2xl px-10 md:px-0">
          <h1 className="text-3xl mb-5 mt-10 font-bold">{product.name}</h1>

          <p className="text-lg font-bold mb-8">PKR {product.price}</p>

          <span className="mb-4">Description</span>

          <p className="mb-4">
            A timeless design, with premium materials features as one of our
            most
            <br />
            popular and iconic pieces. The dandy chair is perfect for any
            stylish
            <br />
            living space with beech legs and lambskin leather upholstery.
          </p>

          <ul className="flex flex-col mb-4">
            <li className="flex mr-2">
              <Dot /> Premium material
            </li>
            <li className="flex mr-2">
              <Dot /> Handmade upholstery
            </li>
            <li className="flex mr-2">
              <Dot /> Quality timeless classic
            </li>
          </ul>

          <h2 className="mb-4">Dimensions</h2>

          <ul className="flex gap-10 mb-6">
            <li>Height</li>
            <li>Width</li>
            <li>Depth</li>
          </ul>

          <ul className="flex gap-10">
            <li>100cm</li>
            <li>75cm</li>
            <li>50cm</li>
          </ul>

          <div className="md:flex-row flex flex-col mt-10 gap-2 justify-between">
            <div className="md:flex hidden">
              <span className="mr-6 mt-2">Amount:</span>
              <div className="bg-gray-100">
                <Button className="rounded-none bg-gray-100 hover:bg-gray-200 text-black">
                  -
                </Button>
                <span>1</span>
                <Button className="rounded-none bg-gray-100 hover:bg-gray-200 text-black">
                  +
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:hidden space-y-4">
              <span className="mr-6 mt-2">Quantity</span>
              <div className="bg-gray-100 flex items-center justify-center w-full">
                <Button className="rounded-none bg-gray-100 hover:bg-gray-200 text-black">
                  -
                </Button>
                <span>{product.quantity}</span>
                <Button className="rounded-none bg-gray-100 hover:bg-gray-200 text-black">
                  +
                </Button>
              </div>
            </div>
            <Button className="mt-4 md:mt-0 text-lg rounded-none w-full md:w-fit">
              ADD TO CART
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-7xl">
          <h2 className="text-2xl text-start mb-6 sm:mb-10">
            You might also like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product, index) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div key={index} className="flex flex-col">
                  <div className="relative aspect-[4/5] w-full mb-4">
                    <Image
                      src={urlFor(product.images[0]).url()}
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
          <Button className="bg-gray-200 rounded-none px-6 py-3 sm:py-4 hover:bg-gray-300 text-black w-fit text-sm sm:text-base">
            View collection
          </Button>
        </div>
      </div>
      <WhatMakesUsDiff />
      <JoinClud />
    </>
  );
};

export default ProductDetails;
