import BriefAbout from "@/components/BriefAbout";
import Hero from "@/components/Hero";
import JoinClub from "@/components/JoinClub";
import NewCeramics from "@/components/NewCeramics";
import PopularProducts from "@/components/PopularProducts";
import WhatMakesUsDiff from "@/components/WhatMakesUsDiff";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatMakesUsDiff />
      <NewCeramics />
      <PopularProducts />
      <JoinClub />
      <BriefAbout />
    </>
  );
}
