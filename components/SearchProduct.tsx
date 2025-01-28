"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Image as SanityImage } from "@sanity/types";
import { Search } from "lucide-react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ScrollArea } from "@/components/ui/scroll-area";
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
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  useEffect(() => {
    if (query) {
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
    <div className="relative flex items-center mt-1">
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
            className="relative px-4 py-2 rounded-full text-black -translate-x-32 md:-translate-x-0 w-36 md:w-60"
          />
        </form>
      )}
      {query && filteredProducts.length > 0 && (
        <div
          ref={searchInputRef}
          className="absolute z-10 w-44 md:w-64 mt-[240px] -translate-x-36 md:-translate-x-0 animate-in slide-in-from-top-10 duration-300 bg-white rounded-xl shadow-lg"
        >
          <ScrollArea className="h-[12rem]">
            <ul>
              {filteredProducts.map((product) => (
                <li key={product.id} className="px-4 py-2 hover:bg-gray-100">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex items-center gap-2"
                  >
                    <Image
                      src={
                        urlFor(product.images[0]).url() || "/placeholder.svg"
                      }
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover rounded"
                    />
                    <span className="text-sm">{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
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
