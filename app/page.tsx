import BriefAbout from "@/components/HomePage/BriefAbout";
import Hero from "@/components/HomePage/Hero";
import JoinClud from "@/components/HomePage/JoinClud";
import NewCeramics from "@/components/HomePage/NewCeramics";
import PopularProducts from "@/components/HomePage/PopularProducts";
import WhatMakesUsDiff from "@/components/HomePage/WhatMakesUsDiff";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatMakesUsDiff />
      <NewCeramics />
      <PopularProducts />
      <JoinClud />
      <BriefAbout />
    </>
  );
}
