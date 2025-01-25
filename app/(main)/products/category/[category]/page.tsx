"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Image as SanityImage } from "@sanity/types";
import Link from "next/link";
import { BarLoader } from "react-spinners";
import { useCart } from "@/lib/CartContext";
import { WishItem } from "@/lib/CartContext";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type Product = {
  id: string;
  name: string;
  categories: string[];
  price: number;
  images: SanityImage[];
};

const CategoryPage = () => {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toggleWishList, wishList } = useCart();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await fetch(`/api/products?category=${category}`);
        const data = await res.json();
        setProducts(data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const currentFilteredProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
        <p className="flex items-center justify-center min-h-screen font-clashDisplay text-4xl">
          <BarLoader color="#2A254B" />
        </p>
      </Suspense>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-clashDisplay mb-6 capitalize">
        {category ? `${category} Products` : "All Products"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentFilteredProducts.length > 0 ? (
          products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block"
            >
              <div className="overflow-hidden">
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
                    <Button
                      variant="ghost"
                      className="absolute top-0 right-0 md:translate-x-40 md:group-hover:translate-x-0 md:bg-white md:hover:bg-white/90 bg-transparent hover:bg-transparent active:scale-95 transition-transform transform duration-300 ease-in-out p-2 rounded-full w-fit h-fit"
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
                            : "text-white md:text-black fill-white"
                        }`}
                      />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-24 md:h-60 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image Available
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="col-span-full flex items-center justify-center min-h-[300px] font-clashDisplay text-4xl text-red-500">
            No products found.
          </p>
        )}
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
    </div>
  );
};

export default CategoryPage;
