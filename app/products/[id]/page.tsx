"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
import WhatMakesUsDiff from "@/components/WhatMakesUsDiff";
import JoinClub from "@/components/JoinClub";
import Link from "next/link";
import { useState, useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import { client } from "@/sanity/lib/client";
import { useCart } from "@/lib/CartContext";
import { toast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

interface Variation {
  color: string; // Color of the product (e.g., "Red", "Blue")
  size: string; // Size of the product (e.g., "S", "M", "L")
  quantity: number; // Available quantity for the specific color and size
}

interface Product {
  id: number; // Unique identifier for the product
  name: string; // Name of the product
  price: number; // Price of the product
  images: SanityImage[]; // Array of images for the product
  ratings: string; // Rating of the product (e.g., "4.5")
  tags: string[]; // Tags associated with the product (e.g., ["Best Seller"])
  description: string; // Detailed description of the product
  variations: Variation[]; // Variations of the product with different colors, sizes, and quantities
}

const ProductDetails = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const params = useParams();
  const productId = params.id as string;
  const product = products.find((p) => String(p.id) === productId);

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
        discountPercentage,
        priceWithoutDiscount,
        ratingCount,
        description,
        variations[] {
          color,
          size,
          quantity
        },
        tags
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
  }, [productId]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data.data))
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && product && product.images.length > 0) {
      addToCart({
        id: product?.id.toString(),
        image: product?.images?.[0],
        name: product?.name as string,
        price: product?.price as number,
        quantity: quantity,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
      });
      toast({
        className: "rounded-none border border-[#27224b]",
        title: "Success!",
        description: `${product.name}  is added to cart.`,
        duration: 5000,
      });
    } else {
      toast({
        className: "rounded-none text-white",
        variant: "destructive",
        title: "⚠️ Error!",
        description: "Please select color and size.",
        duration: 5000,
      });
    }
  };

  const handleIncrement = () => {
    if (selectedColor && selectedSize) {
      const selectedVariation = product?.variations.find(
        (variation) =>
          variation.color === selectedColor && variation.size === selectedSize
      );
      if (selectedVariation && quantity < selectedVariation.quantity) {
        setQuantity((prevQuantity) => prevQuantity + 1);
      }
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => {
        return prevQuantity - 1;
      });
    }
  };

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
          <h1 className="text-3xl mb-5 mt-4 font-bold">{product.name}</h1>

          <p className="text-lg font-bold mb-4">$ {product.price}</p>

          <span className="mb-4">Description:</span>

          <p className="mb-4 max-w-lg">{product.description}</p>

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

          <h2 className="mb-4 mt-4">Colors</h2>
          <ul className="flex gap-5">
            {product.variations
              .map((variation) => variation.color)
              .filter((color, index, self) => self.indexOf(color) === index) // Remove duplicate colors
              .map((color) => (
                <li key={color}>
                  <Button
                    className={`rounded-none text-black ${
                      selectedColor === color
                        ? "bg-gray-300 hover:bg-gray-300"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      setSelectedColor(color);
                      setQuantity(1);
                      setSelectedSize(null); // Reset selected size on color change
                    }}
                  >
                    {color}
                  </Button>
                </li>
              ))}
          </ul>

          {selectedColor && (
            <>
              <h2 className="mb-4 mt-4">Sizes with quantities</h2>
              {product.variations.some(
                (variation) =>
                  variation.color === selectedColor && variation.quantity > 0
              ) ? (
                <ul className="flex gap-5">
                  {product.variations
                    .filter((variation) => variation.color === selectedColor) // Don't filter by quantity here
                    .map((variation) => (
                      <li key={variation.size}>
                        <Button
                          className={`rounded-none text-black ${
                            selectedSize === variation.size
                              ? "bg-gray-300 hover:bg-gray-300"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => {
                            if (variation.quantity > 0) {
                              setSelectedSize(variation.size);
                              setQuantity(1);
                            }
                          }}
                          disabled={variation.quantity === 0} // Disable button for unavailable sizes
                        >
                          {variation.size} ({variation.quantity})
                        </Button>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-red-500">
                  Out of stock
                </p>
              )}
            </>
          )}

          <div className="md:flex-row flex flex-col mt-10 gap-2 justify-between">
            <div className="md:flex hidden">
              <span className="mr-6 mt-2">Quantity:</span>
              <div className="bg-gray-100 flex items-center justify-center">
                <Button
                  onClick={handleDecrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black active:scale-95 transition-transform transform duration-300"
                >
                  <Minus size={15} />
                </Button>
                <span>{quantity}</span>
                <Button
                  onClick={handleIncrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black active:scale-95 transition-transform transform duration-300"
                >
                  <Plus size={15} />
                </Button>
              </div>
            </div>
            <div className="flex flex-col md:hidden space-y-4">
              <span className="mr-6 mt-2">Quantity:</span>
              <div className="bg-gray-100 flex items-center justify-center w-full">
                <Button
                  onClick={handleDecrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black"
                >
                  <Minus size={15} />
                </Button>
                <span>{quantity}</span>
                <Button
                  onClick={handleIncrement}
                  className="rounded-none bg-gray-100 hover:bg-gray-200 text-black"
                >
                  <Plus size={15} />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleAddToCart}
              className="mt-4 md:mt-0 text-lg rounded-none w-full md:w-fit"
              disabled={
                !product.variations.some((variation) => variation.quantity > 0)
              }
            >
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
            {featuredProducts.slice(0, 4).map((product, index) => (
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
          <Link href="/products">
            <Button className="bg-gray-200 rounded-none px-6 py-3 sm:py-4 hover:bg-gray-300 text-black w-fit text-sm sm:text-base">
              View collection
            </Button>
          </Link>
        </div>
      </div>
      <WhatMakesUsDiff />
      <JoinClub />
    </>
  );
};

export default ProductDetails;
