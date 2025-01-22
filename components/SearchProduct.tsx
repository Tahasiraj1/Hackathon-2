import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as SanityImage } from "@sanity/types";
import { Search } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images: SanityImage[];
  ratings: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  description: string;
  categories: string[];
}

const SearchProduct = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all products once on component mount
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (query) {
      // Filter products based on the query
      const results = products.filter((product) => {
        const nameMatch = product.name
          .toLowerCase()
          .includes(query.toLowerCase());
        const tagsMatch = product.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        );
        const categoriesMatch = product.categories.some((category) =>
          category.toLowerCase().includes(query.toLowerCase())
        );
        return nameMatch || tagsMatch || categoriesMatch;
      });

      setFilteredProducts(results);
    } else {
      setFilteredProducts([]);
    }
  }, [query, products]);

  const getProductsName = (id: string) => {
    const searchedProduct = products.find((p) => p.id === id);
    if (searchedProduct) {
      router.push(`/products/${searchedProduct.id}`);
      setShowSearch(false);
      setQuery("");
    }
  };

  const handleSearchClick = () => {
    if (showSearch && query) {
      // If a query is entered, redirect to the product page
      getProductsName(query);
    } else {
      setShowSearch((prev) => !prev);
    }
  };

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSearch(false);
        setFilteredProducts([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center">
      {showSearch && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            getProductsName(query);
          }}
          className="absolute animate-in slide-in-from-bottom-full duration-300"
        >
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search product"
            className="relative px-4 py-2 rounded-md text-black -translate-x-32 md:-translate-x-0 w-36 md:w-60"
          />
        </form>
      )}
      {query && filteredProducts.length > 0 && (
        <ul className="absolute z-10  w-44 md:w-64 mt-[240px] max-h-[calc(4*3rem)] -translate-x-44 md:-translate-x-0 animate-in slide-in-from-top-10 duration-300 bg-white rounded-md shadow-lg overflow-hidden">
          <ScrollArea className="h-full" key={filteredProducts.length}>
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => getProductsName(product.id)}
                className="px-4 py-2 cursor-pointer hover:bg-[#d3cff3]"
              >
                <Link href={`/products/${product.id}`}>
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      src={
                        urlFor(product.images[0]).url() || "/placeholder.svg"
                      }
                      alt={product.name}
                      width={80}
                      height={80}
                    />
                    {product.name}
                  </div>
                </Link>
              </li>
            ))}
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </ul>
      )}
      <button
        type="button"
        className={`rounded-full w-auto h-auto p-0 m-0 ${showSearch ? "opacity-0" : "opacity-100"}`}
        onClick={handleSearchClick}
      >
        <Search className="w-6 h-6 mr-1 mb-1.5" />
      </button>
    </div>
  );
};

export default SearchProduct;
