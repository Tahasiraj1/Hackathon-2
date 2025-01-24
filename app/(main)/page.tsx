import React from "react";
import Hero from "@/components/Hero";
import BestSelling from "@/components/BestSelling"
import PopularProducts from "@/components/PopularProducts";
const WhatMakesUsDiff = React.lazy(() => import("@/components/WhatMakesUsDiff"));
const JoinClub = React.lazy(() => import("@/components/JoinClub"));
const BriefAbout = React.lazy(() => import ("@/components/BriefAbout"));

export default function Home() {
  return (
    <>
      <Hero />
      <WhatMakesUsDiff />
      <BestSelling />
      <PopularProducts />
      <JoinClub />
      <BriefAbout />
    </>
  );
}
