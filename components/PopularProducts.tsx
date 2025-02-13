"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Image as SanityImage } from "@sanity/types";
import { urlFor } from "@/sanity/lib/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/CartContext";
import { Product } from "@/Types/types";
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
import { handleAddItemToWishList } from "@/lib/AddToWishList";


const PopularProducts = ({ products }: { products: Product[] }) => {
  const { toggleWishList, wishList } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<Product | null>(null);
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    setMounted(true); // Trigger animation on mount
  }, []);

  const handleDialog = (event: React.MouseEvent, product: Product) => {
    event.preventDefault();
    event.stopPropagation();
    setDialogProduct(product);
    setIsDialogOpen(true);
  };

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="flex flex-col w-full items-center justify-center bg-white text-black py-10 px-4 sm:px-6 lg:px-10 font-clashDisplay">
      <div className="w-full">
        <h2 className="text-2xl text-start">Our Popular Products</h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onViewportEnter={() => setInView(true)}
          onViewportLeave={() => setInView(false)}
          animate={mounted && inView ? "visible" : "hidden"}
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
                    <AnimatePresence mode="wait">
                      <motion.div layoutId={`popular-product-${p.id}`}>
                      <motion.div
                        className="relative group h-full w-full mb-4 overflow-hidden"
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        onViewportEnter={() => setInView(true)}
                        onViewportLeave={() => setInView(false)}
                        animate={mounted && inView ? "visible" : "hidden"}
                      >
                        <motion.div layoutId={`popular-image-${p.id}`}>
                          <Image
                            src={urlFor(p.images[0] as SanityImage).url()}
                            alt={p.name}
                            height={400}
                            width={400}
                            className="w-full h-[300px] md:h-[350px] object-cover"
                          />
                        </motion.div>
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
                                  }, toggleWishList)
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
                      <motion.div 
                        variants={itemVariants}
                      >
                        <motion.h3 layoutId={`popular-name-${p.id}`} className="text-lg font-medium">{p.name}</motion.h3>
                        <motion.span layoutId={`popular-price-${p.id}`} className="text-sm text-gray-600">{p.price}</motion.span>
                      </motion.div>
                      </motion.div>
                    </AnimatePresence>
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
        <Dialog key={`dialog-${dialogProduct?.id}`} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="p-0 border-2 rounded-md border-[#363061] w-full md:max-w-screen-lg md:flex md:items-center md:justify-center">
            {dialogProduct && (
              <AnimatePresence mode="wait">
                <motion.div layoutId={`popular-product-${dialogProduct.id}`} className="w-full">
                  <Ripple color="#363061">
                    {/* Mobile Header */}
                    <DialogHeader className="md:hidden flex items-center px-4 pt-4">
                      <motion.div layoutId={`name-${dialogProduct.id}`}>
                        <DialogTitle>{dialogProduct.name}</DialogTitle>
                      </motion.div>
                      <motion.div layoutId={`price-${dialogProduct.id}`}>
                        <DialogDescription>${dialogProduct.price}</DialogDescription>
                      </motion.div>
                    </DialogHeader>

                    {/* Main Content */}
                    <Link href={`/products/${dialogProduct.id}`} className="block">
                      <div className="grid md:flex md:gap-6 py-4 px-4 w-full">
                        {/* Image */}
                        <motion.div layoutId={`popular-image-${dialogProduct.id}`} className="md:w-1/2">
                          <Image
                            src={
                              urlFor(dialogProduct.images[0] as SanityImage).url() ||
                              "/placeholder.svg"
                            }
                            alt={dialogProduct.name}
                            width={500}
                            height={500}
                            className="w-full md:w-[500px] md:h-[500px] object-cover rounded-md"
                          />
                        </motion.div>

                        {/* Description */}
                        <div className="md:w-1/2 flex flex-col text-start justify-start md:py-8 space-y-2">
                          <motion.div layoutId={`popular-name-${dialogProduct.id}`} className="hidden md:block">
                            <DialogTitle className="text-2xl font-bold">{dialogProduct.name}</DialogTitle>
                          </motion.div>
                          <motion.div layoutId={`popular-price-${dialogProduct.id}`} className="hidden md:block">
                            <DialogDescription className="text-lg text-gray-600">
                              ${dialogProduct.price}
                            </DialogDescription>
                          </motion.div>
                          <p className="text-gray-700 pb-4">{dialogProduct.description}</p>
                        </div>
                      </div>
                    </Link>
                  </Ripple>
                </motion.div>
              </AnimatePresence>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PopularProducts;
