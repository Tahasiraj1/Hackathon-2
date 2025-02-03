"use client";

import Image from "next/image";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Image as SanityImage } from "@sanity/types";
import { urlFor } from "@/sanity/lib/image";
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
import { useCart } from "@/lib/CartContext";
import { WishItem } from "@/lib/CartContext";
import { Button } from "./ui/button";
import { EyeIcon, Heart } from "lucide-react";
import { containerVariants, itemVariants } from "@/lib/motion";
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
} from "./ui/dialog";
import { Ripple } from "./layout/Ripple";

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
  const { toggleWishList, wishList } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);

  const handleDialog = (event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    setDialogProduct(product);
    setIsDialogOpen(true);
  };

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

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

  if (loading) {
    return (
      <Suspense>
        <div className="flex justify-center items-center min-h-[400px] w-full">
          <BarLoader color="#2A254B" />
        </div>
      </Suspense>
    );
  }

  return (
    <div className="flex flex-col w-full items-center justify-center bg-white text-black py-10 px-4 sm:px-6 lg:px-10 font-clashDisplay">
      <div className="w-full">
        <h2 className="text-2xl text-start">Our Popular Products</h2>

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
              {products.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/products/${p.id}`}>
                    <motion.div
                      className="relative group aspect-[4/5] w-full mb-4 overflow-hidden"
                      variants={itemVariants}
                    >
                      <Image
                        src={urlFor(p.images[0] as SanityImage).url()}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className="absolute top-0 right-0 md:translate-x-40 md:group-hover:translate-x-0 bg-white hover:bg-white/90 active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
                              onClick={(e) =>
                                handleAddItemToWishList(e, {
                                  id: p.id,
                                  name: p.name,
                                  price: p.price,
                                  image: p.images[0] as SanityImage,
                                })
                              }
                            >
                              <Heart
                                className={`${
                                  wishList.some((item) => item.id === p.id)
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
                              onClick={(e) => handleDialog(e, p)}
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
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium">{p.name}</h3>
                      <span className="text-sm text-gray-600">{p.price}</span>
                    </motion.div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="w-[100px] h-32 absolute -bottom-8 left-0 right-0 m-auto flex items-center justify-between">
              <CarouselPrevious className="bg-gray-200 rounded-md px-5 py-5 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300" />
              <CarouselNext className="bg-gray-200 rounded-md px-5 py-5 hover:bg-gray-300 text-black active:scale-95 transition-transform transform duration-300" />
            </div>
          </Carousel>
        </motion.div>
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
      </div>
    </div>
  );
};

export default PopularProducts;
