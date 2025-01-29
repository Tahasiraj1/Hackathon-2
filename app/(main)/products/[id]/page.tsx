"use client"

import React, { Suspense, useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dot } from "lucide-react"
import { urlFor } from "@/sanity/lib/image"
import { client } from "@/sanity/lib/client"
import { useCart } from "@/lib/CartContext"
import { toast } from "@/hooks/use-toast"
import { Plus, Minus } from "lucide-react"
import { BarLoader } from "react-spinners"
import { motion } from "framer-motion"
import RelatedProducts from "@/components/RelatedProducts"
import type { Product } from "@/lib/product"

const WhatMakesUsDiff = React.lazy(() => import("@/components/WhatMakesUsDiff"))
const JoinClub = React.lazy(() => import("@/components/JoinClub"))

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

const ProductDetails = () => {
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const params = useParams()
  const productId = params.id as string

  
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      setError(null)
      const query = `*[_type == "product" && id == $productId][0]{
        id,
        name,
        price,
        "images": images[].asset->url,
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
        tags,
        categories,
      }`

      try {
        const fetchedProduct = await client.fetch(query, { productId })
        setProduct(fetchedProduct)
      } catch (error) {
        console.error("Error fetching product:", error)
        setError("Failed to fetch product")
        toast({
          title: "Error",
          description: "Failed to fetch product",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (selectedColor && selectedSize && product && product.images.length > 0) {
      addToCart({
        id: product.id.toString(),
        image: product.images[0],
        name: product.name,
        price: product.price,
        quantity: quantity,
        description: product.description,
        color: selectedColor,
        size: selectedSize,
      })
      toast({
        className: "rounded-none border border-[#27224b]",
        title: "Success!",
        description: `${product.name} is added to cart.`,
        duration: 5000,
      })
    } else {
      toast({
        className: "rounded-none text-white",
        variant: "destructive",
        title: "⚠️ Error!",
        description: "Please select color and size.",
        duration: 5000,
      })
    }
  }

  const handleIncrement = () => {
    if (selectedColor && selectedSize && product) {
      const selectedVariation = product.variations.find(
        (variation) => variation.color === selectedColor && variation.size === selectedSize,
      )
      if (selectedVariation && quantity < selectedVariation.quantity) {
        setQuantity((prevQuantity) => prevQuantity + 1)
      }
    }
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BarLoader color="#2A254B" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-bold text-red-500">
        {error || "Product not found"}
      </div>
    )
  }

  return (
    <>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex lg:flex-row flex-col">
        <div className="flex space-x-2">
          <Image
            src={urlFor(product.images[0]).url() || "/placeholder.svg"}
            alt={`Image of ${product.name}`}
            width={1000}
            height={1000}
            className="w-full h-full lg:w-[600px] lg:h-[600px]"
          />
        </div>
        <div className="flex flex-col lg:pl-20 pr-5 w-full max-w-2xl px-10">
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl mb-5 mt-4 font-clashDisplay">
            {product.name}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg font-bold mb-4">
            $ {product.price}
          </motion.p>

          <span className="mb-4">Description:</span>

          <motion.p variants={itemVariants} className="mb-4 max-w-lg">
            {product.description}
          </motion.p>

          {/* ... Rest of the component (color selection, size selection, quantity, add to cart button) ... */}
          <ul className="flex flex-col mb-4">
              <motion.li variants={itemVariants} className="flex mr-2">
                <Dot /> Premium material
              </motion.li>
              <motion.li variants={itemVariants} className="flex mr-2">
                <Dot /> Handmade upholstery
              </motion.li>
              <motion.li variants={itemVariants} className="flex mr-2">
                <Dot /> Quality timeless classic
              </motion.li>
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
                  <p className="text-red-500">Out of stock</p>
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
                    className="rounded-none bg-gray-100 hover:bg-gray-200 text-black w-full"
                  >
                    <Minus size={15} />
                  </Button>
                  <span>{quantity}</span>
                  <Button
                    onClick={handleIncrement}
                    className="rounded-none bg-gray-100 hover:bg-gray-200 text-black w-full"
                  >
                    <Plus size={15} />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleAddToCart}
                className="mt-4 md:mt-0 text-lg bg-[#2A254B] hover:bg-[#332d5c] rounded-none w-full md:w-fit"
                disabled={
                  !product.variations.some(
                    (variation) => variation.quantity > 0
                  )
                }
              >
                ADD TO CART
              </Button>
            </div>
        </div>
      </motion.div>

      <div className="flex flex-col w-full py-10 items-center justify-center bg-white text-black px-4 sm:px-6 lg:px-10">
        <div className="w-full max-w-7xl mt-10">
          <h2 className="text-3xl md:text-4xl text-start font-clashDisplay">You might also like</h2>
          <RelatedProducts productId={product.id.toString()} categories={product.categories} />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center mb-10">
            <BarLoader color="#2A254B" />
          </div>
        }
      >
        <WhatMakesUsDiff />
        <JoinClub />
      </Suspense>
    </>
  )
}

export default ProductDetails
