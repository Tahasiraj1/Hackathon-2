"use client";

import React, { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { WishItem } from "@/lib/CartContext";
import { EyeIcon, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/motion";
import { Ripple } from "@/components/layout/Ripple";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Product = {
  id: string;
  name: string;
  categories: string[];
  price: number;
  images: SanityImage[];
  description: string;
};

const CategoryBasedProducts = ({ products }: { products: Product[] }) => {
  const { toggleWishList, wishList } = useCart();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);
  const productsPerPage = 6;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentFilteredProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(products.length / productsPerPage);

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

  const handleDialog = (event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    setDialogProduct(product);
    setIsDialogOpen(true);
  };

  return (
    <div>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {currentFilteredProducts.length > 0 ? (
          products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block"
            >
              <motion.div className="overflow-hidden" variants={itemVariants}>
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
                                wishList.some((item) => item.id === product.id)
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
                  </div>
                ) : (
                  <div className="w-full h-24 md:h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <motion.div variants={itemVariants} className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
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
                  <DialogDescription>${dialogProduct.price}</DialogDescription>
                </DialogHeader>
                <Link href={`/products/${dialogProduct.id}`}>
                  <div className="grid gap-4 py-4 px-4">
                    <Image
                      src={
                        urlFor(dialogProduct.images[0] as SanityImage).url() ||
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
      </motion.div>
      {/* Pagination Component */}
      <Pagination className="mt-6">
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem className="cursor-pointer">
            {currentPage > 1 && (
              <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
            )}
          </PaginationItem>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem className="cursor-pointer" key={i}>
              <PaginationLink
                onClick={() => paginate(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={() => {
                if (currentPage < totalPages) {
                  paginate(currentPage + 1);
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CategoryBasedProducts;
