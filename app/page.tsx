import React, { Suspense } from "react";
import Hero from "@/components/Hero";
import BestSelling from "@/components/BestSelling";
import PopularProducts from "@/components/PopularProducts";
import Category from "@/components/Category";
import { BarLoader } from "react-spinners";
import Chat from "@/components/ChatPopup";

const WhatMakesUsDiff = React.lazy(
  () => import("@/components/WhatMakesUsDiff")
);
const JoinClub = React.lazy(() => import("@/components/JoinClub"));
const BriefAbout = React.lazy(() => import("@/components/BriefAbout"));

async function fetchBestSellingProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tags=Best Selling`,
    { cache: "no-store" } // Ensures fresh data - SSR
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  console.log("Fetched Best Selling Products Data:", data);

  return data.data;
}

async function fetchPopularProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/products?tags=Popular`,
    { cache: "no-store" } // Ensures fresh data - SSR
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  console.log("Fetched Popular Products Data:", data);

  return data.data;
}

export default async function Home() {
  const bestSellers = await fetchBestSellingProducts();
  const popularProducts = await fetchPopularProducts();

  return (
    <>
      <Chat />
      <Hero />
      <WhatMakesUsDiff />
      <Category />
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen w-full">
            <BarLoader color="#2A254B" />
          </div>
        }
      >
        <BestSelling products={bestSellers} />
        <PopularProducts products={popularProducts} />
      </Suspense>
      <JoinClub />
      <BriefAbout />
    </>
  );
}
