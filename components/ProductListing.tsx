"use client";

import Image from "next/image";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ChevronDown, EyeIcon, Heart } from "lucide-react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import { Slider } from "./ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from "@/lib/CartContext";
import { WishItem } from "@/lib/CartContext";
import { BarLoader } from "react-spinners";
import { containerVariants, itemVariants } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Ripple } from "./layout/Ripple";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const productTypes = [
  "Mens",
  "Womens",
  "Kids",
  "Casual Wear",
  "Formal Attire",
  "Active Wear",
  "Accessories",
];

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

const ProductListing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState([0, 1000]);
  const [loading, setLoading] = useState<boolean>(true);
  const productsPerPage = 6;
  const { toggleWishList, wishList } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);

  const handleDialog = (event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    setDialogProduct(product);
    setIsDialogOpen(true);
  };

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

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
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
            <BarLoader color="#2A254B" />
          </div>
        </Suspense>
      ) : (
        <>
          <div className="flex w-full px-2 md:px-6 lg:px-8 mt-8 gap-8">
            <div className="md:flex flex-col w-1/4 hidden">
              <h2 className="text-3xl font-clashDisplay mb-4">Product type</h2>
              <motion.div
                className="flex flex-wrap gap-3 overflow-visible"
                layout
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.5,
                }}
              >
                {productTypes.map((type) => {
                  const isSelected = selectedCategories.includes(type);
                  return (
                    <motion.button
                      key={type}
                      onClick={() => toggleCategory(type)}
                      layout
                      initial={false}
                      animate={{
                        backgroundColor: isSelected ? "#2A254B" : "#CBD5E1",
                      }}
                      whileHover={{
                        backgroundColor: isSelected ? "#363061" : "#b0a7f1",
                      }}
                      whileTap={{
                        backgroundColor: isSelected ? "#2A254B" : "#9a91e0",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                        mass: 0.5,
                        backgroundColor: { duration: 0.1 },
                      }}
                      className={`
                      inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                      whitespace-nowrap overflow-hidden ring-1 ring-inset
                      ${
                        isSelected
                          ? "bg-[#363061] ring-[hsla(0,0%,100%,0.12)]"
                          : "text-black ring-[hsla(0,0%,100%,0.06)]"
                      }
                    `}
                    >
                      <motion.div
                        className="relative flex items-center"
                        animate={{
                          width: isSelected ? "auto" : "100%",
                          paddingRight: isSelected ? "1.5rem" : "0",
                        }}
                        transition={{
                          ease: [0.175, 0.885, 0.32, 1.275],
                          duration: 0.3,
                        }}
                      >
                        <span
                          className={`${isSelected ? "text-white" : "text-black"}`}
                        >
                          {type}
                        </span>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                                mass: 0.5,
                              }}
                              className="absolute right-0"
                            >
                              <div className="w-4 h-4 rounded-full bg-[#574f99] flex items-center justify-center">
                                <Check
                                  className="w-3 h-3 text-white"
                                  strokeWidth={1.5}
                                />
                              </div>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </motion.button>
                  );
                })}
              </motion.div>{" "}
              <h2 className="text-2xl font-clashDisplay my-4">Price</h2>
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
                <DropdownMenuContent className="w-72">
                  <motion.div
                    className="flex flex-wrap gap-3 overflow-visible"
                    layout
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 0.5,
                    }}
                  >
                    {productTypes.map((type) => {
                      const isSelected = selectedCategories.includes(type);
                      return (
                        <motion.button
                          key={type}
                          onClick={() => toggleCategory(type)}
                          layout
                          initial={false}
                          animate={{
                            backgroundColor: isSelected ? "#2A254B" : "#CBD5E1",
                          }}
                          whileHover={{
                            backgroundColor: isSelected ? "#363061" : "#b0a7f1",
                          }}
                          whileTap={{
                            backgroundColor: isSelected ? "#2A254B" : "#9a91e0",
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                            mass: 0.5,
                            backgroundColor: { duration: 0.1 },
                          }}
                          className={`
                          inline-flex items-center px-4 py-2 rounded-full text-base font-medium
                          whitespace-nowrap overflow-hidden ring-1 ring-inset
                          ${
                            isSelected
                              ? "bg-[#363061] ring-[hsla(0,0%,100%,0.12)]"
                              : "text-black ring-[hsla(0,0%,100%,0.06)]"
                          }
                        `}
                        >
                          <motion.div
                            className="relative flex items-center"
                            animate={{
                              width: isSelected ? "auto" : "100%",
                              paddingRight: isSelected ? "1.5rem" : "0",
                            }}
                            transition={{
                              ease: [0.175, 0.885, 0.32, 1.275],
                              duration: 0.3,
                            }}
                          >
                            <span
                              className={`${isSelected ? "text-white" : "text-black"}`}
                            >
                              {type}
                            </span>
                            <AnimatePresence>
                              {isSelected && (
                                <motion.span
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                    mass: 0.5,
                                  }}
                                  className="absolute right-0"
                                >
                                  <div className="w-4 h-4 rounded-full bg-[#574f99] flex items-center justify-center">
                                    <Check
                                      className="w-3 h-3 text-white"
                                      strokeWidth={1.5}
                                    />
                                  </div>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
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
                    <motion.div
                      className="overflow-hidden"
                      variants={containerVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      {/* Check if image exists before rendering */}
                      {product.images?.[0] ? (
                        <motion.div
                          variants={itemVariants}
                          className="relative group"
                        >
                          <Image
                            src={urlFor(product.images[0]).url()}
                            alt={product.name}
                            width={300}
                            height={300}
                            className="w-full h-auto object-cover"
                          />
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  className="absolute top-0 right-0 md:translate-x-40 md:group-hover:translate-x-0 bg-white hover:bg-white/90 active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
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
                                      wishList.some(
                                        (item) => item.id === product.id
                                      )
                                        ? "text-red-600 fill-red-600"
                                        : "text-black fill-white"
                                    }`}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                className="dark bg-[#2A254B] px-2 py-1 text-xs"
                                showArrow={true}
                              >
                                Add to wishList
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider delayDuration={0}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  onClick={(e) => handleDialog(e, product)}
                                  variant="ghost"
                                  className="absolute top-10 right-0 md:translate-x-40 md:group-hover:translate-x-0 bg-white hover:bg-white/90 active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
                                >
                                  <EyeIcon />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent
                                className="dark bg-[#2A254B] px-2 py-1 text-xs"
                                showArrow={true}
                              >
                                Quick View
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </motion.div>
                      ) : (
                        <div className="w-full h-24 md:h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                          No Image Available
                        </div>
                      )}
                      <motion.div variants={itemVariants} className="p-4">
                        <h3 className="text-lg">{product.name}</h3>
                        <p className="text-gray-600">{product.price}</p>
                      </motion.div>
                    </motion.div>
                  </Link>
                ))
              ) : (
                <p className="col-span-full flex items-center justify-center min-h-[300px] font-clashDisplay text-4xl text-red-500">
                  No products found.
                </p>
              )}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="p-0 border-4 border-[#363061]">
                  {dialogProduct && (
                    <Ripple color="#363061">
                      <DialogHeader className="items-center px-4 pt-4">
                        <DialogTitle>{dialogProduct.name}</DialogTitle>
                        <DialogDescription>
                          ${dialogProduct.price}
                        </DialogDescription>
                      </DialogHeader>
                      <Link href={`/products/${dialogProduct.id}`}>
                        <div className="grid gap-4 py-4 px-4">
                          <Image
                            src={
                              urlFor(
                                dialogProduct.images[0] as SanityImage
                              ).url() ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={dialogProduct.name}
                            width={500}
                            height={300}
                            className="w-full h-auto object-cover rounded-md"
                          />
                          <p className="text-gray-700 px-4 pb-4">
                            {dialogProduct.description}
                          </p>
                        </div>
                      </Link>
                    </Ripple>
                  )}
                </DialogContent>
              </Dialog>
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
