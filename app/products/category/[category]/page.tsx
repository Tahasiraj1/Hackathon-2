"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { urlFor } from "@/sanity/lib/image"
import { Image as SanityImage } from "@sanity/types";


type Product = {
  id: string
  name: string
  categories: string[]
  price: number
  images: SanityImage[];
}

const CategoryPage = () => {
  const params = useParams()
  const category = params.category as string
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}`)
        const data = await res.json()
        setProducts(data.data)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [category])

  if (loading) {
    return <p>Loading products...</p>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{category ? `${category} Products` : "All Products"}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="product-card border rounded-lg overflow-hidden shadow-md">
                <Image
                  src={urlFor(product.images[0]).url()}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">No products found for this category.</p>
        )}
      </div>
    </div>
  )
}

export default CategoryPage

