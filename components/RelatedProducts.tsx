import type React from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { client } from "@/sanity/lib/client";
import { toast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import type { Product } from "@/lib/product";
import { containerVariants, itemVariants } from "@/lib/motion";


interface RelatedProductsProps {
  productId: string;
  categories: string[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  productId,
  categories,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<Product[]>([]);

  // Fetch Ten products to shows in recommendation if actuall recommendation's length is less than 4
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      const query = `*[_type == "product"] {
        id,
        name,
        price,
        "images": images[].asset->url,
        categories
        }[0...10]`;

        try {
            const fetchTenProducts = await client.fetch(query);
            setItems(fetchTenProducts);
        } catch (error) {
            console.error("Error fetching related products:", error);
            setError("Failed to fetch related products");
            toast({
              title: "Error",
              description: "Failed to fetch related products",
              variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };
    fetchProducts();
  }, [])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      setError(null);
      if (categories && categories.length > 0) {
        const query = `*[_type == "product" && id != $productId && count((categories[])[@ in $categories]) > 0] {
          id,
          name,
          price,
          "images": images[].asset->url,
          categories
        }[0...10]`;

        try {
          const fetchedRelatedProducts = await client.fetch(query, {
            productId,
            categories,
          });

          setRelatedProducts(fetchedRelatedProducts);
        } catch (error) {
          console.error("Error fetching related products:", error);
          setError("Failed to fetch related products");
          toast({
            title: "Error",
            description: "Failed to fetch related products",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, categories]);

  if (isLoading) {
    return <div>Loading related products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true }}
    >
      <Carousel
        className="w-full py-10 px-10"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4 mb-10">
          {relatedProducts.length > 4
            ? relatedProducts.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/products/${product.id}`}>
                    <motion.div
                      variants={itemVariants}
                      className="relative aspect-[4/5] w-full mb-4"
                    >
                      <Image
                        src={
                          urlFor(product.images[0]).url() || "/placeholder.svg"
                        }
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium">{product.name}</h3>
                      <span className="text-sm text-gray-600">
                        ${product.price}
                      </span>
                    </motion.div>
                  </Link>
                </CarouselItem>
              ))
            : items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <Link href={`/products/${item.id}`}>
                    <motion.div
                      variants={itemVariants}
                      className="relative aspect-[4/5] w-full mb-4"
                    >
                      <Image
                        src={urlFor(item.images[0]).url() || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <h3 className="text-lg font-medium">{item.name}</h3>
                      <span className="text-sm text-gray-600">
                        ${item.price}
                      </span>
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
  );
};

export default RelatedProducts;
