import { Suspense } from "react"
import { BarLoader } from "react-spinners"
import CategoryBasedProducts from "@/components/CategoryBasedProducts"
import { client } from "@/sanity/lib/client"

export const revalidate = 3600 // Revalidate every hour

export const dynamicParams = true // or false, to 404 on unknown paths

export async function generateStaticParams() {
  // Fetch all unique categories from products
  const categories: string[] = await client.fetch(`*[_type == "product"].categories[]`)
  const uniqueCategories = Array.from(new Set(categories))

  return uniqueCategories.map((category) => ({
    category: category.toString(),
  }))
}

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Resolve the params promise
  const resolvedParams = await params

  // Fetch products for this category
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?category=${resolvedParams.category}`)
  const { data: products } = await res.json()

  if (products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-clashDisplay mb-6 capitalize">{resolvedParams.category} Products</h1>
        <p className="text-xl text-center">No products found in this category.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-clashDisplay mb-6 capitalize">{resolvedParams.category} Products</h1>
      <Suspense fallback={<BarLoader color="#2A254B" />}>
        <CategoryBasedProducts products={products} />
      </Suspense>
    </div>
  )
}

