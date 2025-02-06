import React from "react";
import Hero from "@/components/Hero";
import BestSelling from "@/components/BestSelling"
import PopularProducts from "@/components/PopularProducts";
import Category from "@/components/Category";

const WhatMakesUsDiff = React.lazy(() => import("@/components/WhatMakesUsDiff"));
const JoinClub = React.lazy(() => import("@/components/JoinClub"));
const BriefAbout = React.lazy(() => import ("@/components/BriefAbout"));


async function fetchBestSellingProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tags=Best Selling`,
    { cache: "no-store" } // Ensures fresh data
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  console.log("Fetched Data:", data);

  return data.data;
}

async function fetchPopularProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tags=Popular`,
    { cache: "no-store" } // Ensures fresh data
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  console.log("Fetched Data:", data);

  return data.data;
}

export default async function Home() {
  const bestSellers = await fetchBestSellingProducts();
  const popularProducts = await fetchPopularProducts();
  
  return (
    <>
      <Hero />
      <WhatMakesUsDiff />
      <Category />
      <BestSelling products={bestSellers} />
      <PopularProducts products={popularProducts} />
      <JoinClub />
      <BriefAbout />
    </>
  );
}
