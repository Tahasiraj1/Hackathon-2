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
import { Heart } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

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
                      className="relative group aspect-[4/5] w-full mb-4"
                      variants={itemVariants}
                    >
                      <Image
                        src={
                          urlFor(p.images[0] as SanityImage).url() ||
                          "/placeholder.svg"
                        }
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                      <Button
                        variant="ghost"
                        className="absolute top-0 right-0 md:translate-x-40 md:group-hover:translate-x-0 md:bg-white md:hover:bg-white/90 bg-transparent hover:bg-transparent active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
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
                              : "text-white md:text-black fill-white"
                          }`}
                        />
                      </Button>
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
              <CarouselPrevious className="bg-gray-300 rounded-none px-6 py-6 hover:bg-gray-400 text-black active:scale-95 transition-transform transform duration-300" />
              <CarouselNext className="bg-gray-300 rounded-none px-6 py-6 hover:bg-gray-400 text-black active:scale-95 transition-transform transform duration-300" />
            </div>
          </Carousel>
        </motion.div>
      </div>
    </div>
  );
};

export default PopularProducts;
