"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";

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
  description: string;
}

const productTypes = [
  "Furniture",
  "Homeware",
  "Sofas",
  "Light fittings",
  "Accessories",
];

const price = ["0 - 100", "101 - 250", "250+"];

const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate indices for slicing products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Trigger POSTING.
  // useEffect(() => {
  //   async function syncProducts() {
  //     try {
  //       const response = await fetch('/api/products', {
  //         method: 'POST',
  //       });

  //       const result = await response.json();
  //       if (response.ok) {
  //         console.log('Success:', result);
  //       } else {
  //         console.error('Error:', result);
  //       }
  //     } catch (error) {
  //       console.error('Error making POST request:', error);
  //     }
  //   }

  //   // Call the function
  //   syncProducts();
  // })

  return (
    <div className="w-full flex flex-col items-center justify-center pb-10">
      <Image
        src="/Images/Page Headers.png"
        alt="Page Header Image"
        width={1000}
        height={100}
        className="w-full hidden md:flex"
      />
      <Image
        src="/Images/Page Headers (1).png"
        alt="Page Header Image"
        width={1000}
        height={100}
        className="w-full md:hidden"
      />
      <div className="flex w-full px-2 md:px-6 lg:px-8 mt-8 gap-8">
        <div className="md:flex flex-col w-1/4 hidden">
          <h2 className="text-2xl font-semibold mb-4">Product type</h2>
          <div className="space-y-2">
            {productTypes.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <Label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-semibold my-4">Price</h2>
          <div className="space-y-2">
            {price.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox id={item} />
                <Label
                  htmlFor={item}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {item}
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          <Button className="md:hidden bg-gray-100 hover:bg-gray-200 text-black">
            Filters <ChevronDown />
          </Button>
          <Button className="md:hidden bg-gray-100 hover:bg-gray-200 text-black">
            Sorting <ChevronDown />
          </Button>
          {currentProducts.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block"
            >
              <div className="overflow-hidden">
                {/* Check if image exists before rendering */}
                {product.images?.[0] ? (
                  <Image
                    src={urlFor(product.images[0]).url()}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-24 md:h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-center mt-5">
        {Array.from({ length: Math.ceil(products.length / productsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 border rounded-full ${
              currentPage === i + 1 ? "bg-[#2A254B] text-white" : "bg-[#363061] text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
