"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ChevronDown, Heart } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/CartContext";
import { WishItem } from "@/lib/CartContext";
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

const productTypes = [
  "Mens",
  "Womens",
  "Kids",
  "Casual Wear",
  "Formal Attire",
  "Active Wear",
  "Accessories",
];

const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([0, 1000]);
  const [loading, setLoading] = useState<boolean>(true);
  const productsPerPage = 6;
  const { toggleWishList, wishList } = useCart();

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAddItemToWishList = (
    event: React.MouseEvent,
    product: WishItem
  ) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Stop event from bubbling up to parent elements

    if (!product?.id) return;

    toggleWishList({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category));
    }
  };

  const filteredProducts = selectedCategories.length
    ? products.filter((product) =>
        product.categories.some((category) =>
          selectedCategories.includes(category)
        )
      )
    : products;

  const priceFilteredProducts = filteredProducts.filter(
    (product) =>
      product.price >= sliderValue[0] && product.price <= sliderValue[1]
  );

  // Calculate indices for slicing products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentFilteredProducts = priceFilteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
      {loading ? (
        <Suspense>
          <div className="flex justify-center items-center min-h-[400px] w-full">
            <BounceLoader color="#2A254B" />
          </div>
        </Suspense>
      ) : (
        <>
          <div className="flex w-full px-2 md:px-6 lg:px-8 mt-8 gap-8">
            <div className="md:flex flex-col w-1/4 hidden">
              <h2 className="text-2xl font-semibold mb-4">Product type</h2>
              <div className="space-y-2">
                {productTypes.map((item) => (
                  <div key={item} className="flex items-center space-x-2">
                    <Checkbox
                      id={item}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(item, checked as boolean)
                      }
                    />
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
                <Slider
                  value={sliderValue}
                  onValueChange={(value) => setSliderValue(value)} // Update slider value
                  min={0} // Min price
                  max={1000} // Max price
                  step={1} // Step for slider movement
                />
              </div>
              <div className="flex justify-between mt-2">
                <span>${sliderValue[0]}</span>
                <span>${sliderValue[1]}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    Categories <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {productTypes.map((category) => (
                    <DropdownMenuCheckboxItem
                      key={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        handleCategoryChange(category, checked);
                      }}
                    >
                      {category}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="md:hidden bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    Filter <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="space-y-2 mt-2">
                    <Slider
                      value={sliderValue}
                      onValueChange={(value) => setSliderValue(value)} // Update slider value
                      min={0} // Min price
                      max={1000} // Max price
                      step={1} // Step for slider movement
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>${sliderValue[0]}</span>
                    <span>${sliderValue[1]}</span>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {currentFilteredProducts.length > 0 ? (
                currentFilteredProducts.map((product) => (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="block"
                  >
                    <div className="overflow-hidden">
                      {/* Check if image exists before rendering */}
                      {product.images?.[0] ? (
                        <div className="relative group">
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-auto object-cover"
                          />
                          <Button
                            variant="ghost"
                            className="absolute top-0 right-0 md:translate-x-40 md:group-hover:translate-x-0 md:bg-white md:hover:bg-white/90 bg-transparent hover:bg-transparent active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
                            onClick={(e) =>
                              handleAddItemToWishList(e, {
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                image: product.images[0] as SanityImage,
                              })
                            }
                          >
                            <Heart
                              className={`${
                                wishList.some((item) => item.id === product.id)
                                  ? "text-red-600 fill-red-600"
                                  : "text-white md:text-black fill-white"
                              }`}
                            />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full h-24 md:h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                          No Image Available
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">
                          {product.name}
                        </h3>
                        <p className="text-gray-600">{product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full flex items-center justify-center min-h-[300px] font-clashDisplay text-4xl text-red-500">
                  No products found.
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            {Array.from(
              { length: Math.ceil(products.length / productsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 px-3 py-1 border rounded-full ${
                    currentPage === i + 1
                      ? "bg-[#2A254B] text-white"
                      : "bg-[#363061] text-white"
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListing;
