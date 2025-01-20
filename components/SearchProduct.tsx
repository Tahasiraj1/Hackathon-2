import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Image as SanityImage } from "@sanity/types";
import { Search } from "lucide-react";

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
  description: string;
}

const SearchProduct = () => {
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  const getProductsName = (name: string) => {
    const searchedProduct = products.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
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
            className="px-4 py-2 rounded-full text-black -translate-x-32 md:-translate-x-0 w-36 md:w-56"
          />
        </form>
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
