"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const width = useTransform(scrollYProgress, [0, 0.3], ["100%", "100vw"]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.2]);

  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  return (
    <motion.div
      transition={{ duration: 1, ease: "easeInOut" }}
      ref={containerRef}
      style={{
        width: isLargeScreen ? width : "100%",
        scale: isLargeScreen ? scale : 1,
      }}
      className="flex items-center justify-center md:py-16 text-white font-clashDisplay relative overflow-hidden"
    >
      <div className="flex-col px-10 w-full max-w-3xl bg-[#2A254B] h-[502px] md:h-[450px] py-20">
        <h2 className="text-2xl">
          The furniture brand for the
          <br />
          future, with timeless designs
        </h2>
        <Link href="/products">
          <Button className="hidden md:flex bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-none py-6 px-6 mt-8 mb-28">
            View collection
          </Button>
        </Link>
        <h2 className="mt-10 md:mt-0">
          A new era in eco-friendly furniture with Avelon, the French luxury
          retail brand
          <br />
          with nice fonts, tasteful colors and a beautiful way to display things
          digitally
          <br />
          using modern web technologies.
        </h2>
        <Link href="/products">
          <Button className="md:hidden w-full bg-opacity-50 bg-slate-400 hover:bg-slate-400 rounded-none py-6 px-6 mt-6">
            View collection
          </Button>
        </Link>
      </div>
      <Image
        src="/Images/Right Image.png"
        alt="Hero Right Image"
        width={400}
        height={400}
        className="hidden lg:flex"
      />
    </motion.div>
  );
};

export default Hero;
