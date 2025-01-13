import Image from "next/image";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";

const NewCeramics = () => {
  const products = [
    {
      id: 10,
      name: "The Dandy chair",
      price: "£250",
      image: "/Images/Photo.png",
    },
    {
      id: 11,
      name: "Rustic Vase Set",
      price: "£155",
      image: "/Images/Photo (1).png",
    },
    {
      id: 12,
      name: "The Silky Vase",
      price: "£125",
      image: "/Images/Photo (2).png",
    },
    {
      id: 13,
      name: "The Lucy Lamp",
      price: "£399",
      image: "/Images/Photo (3).png",
    },
  ];

  return (
    <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10 font-clashDisplay">
      <div className="w-full max-w-7xl">
        <h2 className="text-2xl text-start mb-6 sm:mb-10">New ceramics</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product, index) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div key={index} className="flex flex-col">
                <div className="relative aspect-[4/5] w-full mb-4">
                  <Image
                    src={product.image}
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

export default NewCeramics;
