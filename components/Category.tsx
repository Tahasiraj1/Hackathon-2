import React from "react";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";


const Category = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4">
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
      <Card className="relative rounded-none overflow-hidden group cursor-pointer ">
          <Image
            src="/Images/Large.jpg"
            alt="perfume"
            width={1000}
            height={1000}
            className="w-[810px] h-[400px] object-cover"
          />
          <CardContent className="absolute inset-0 flex flex-col items-start justify-stitems-start text-white bg-black bg-opacity-50 hover:bg-transparent hover:bg-opacity-100 group-hover:translate-y-full transition-all duration-500 ease-in-out">
            <h1 className="text-2xl font-bold mt-4">Casual Wear</h1>
            <p className="text-lg">
              Lorem ipsum dolor sit amet consectetur<br /> adipisicing elit. Quisquam,
              voluptates.
            </p>
          </CardContent>
          <Link href="/products/category/Casual Wear">
            <Button className="absolute bottom-4 right-4 rounded-none bg-opacity-50 bg-slate-400 group-hover:bg-slate-600 group-hover:bg-opacity-70">
              View Collection
            </Button>
          </Link>
        </Card>
        <Card className="relative rounded-none overflow-hidden group cursor-pointer ">
          <Image
            src="/Images/Photo (3).png"
            alt="perfume"
            width={1000}
            height={1000}
            className="w-[400px] h-[400px] object-cover"
          />
          <CardContent className="absolute inset-0 flex flex-col items-start justify-stitems-start text-white bg-black bg-opacity-50 hover:bg-transparent hover:bg-opacity-100 group-hover:translate-y-full transition-all duration-500 ease-in-out">
            <h1 className="text-2xl font-bold mt-4">Active Wear</h1>
            <p className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              voluptates.
            </p>
          </CardContent>
          <Link href="/products/category/Active Wear">
            <Button className="absolute bottom-4 right-4 rounded-none bg-opacity-50 bg-slate-400 group-hover:bg-slate-600 group-hover:bg-opacity-70">
              View Collection
            </Button>
          </Link>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center w-full gap-2">
        <Card className="relative rounded-none overflow-hidden group cursor-pointer ">
          <Image
            src="/Images/Photo (6).png"
            alt="perfume"
            width={1000}
            height={1000}
            className="w-[400px] h-[400px] object-cover"
          />
          <CardContent className="absolute inset-0 flex flex-col items-start justify-stitems-start text-white bg-black bg-opacity-50 hover:bg-transparent hover:bg-opacity-100 group-hover:translate-y-full transition-all duration-500 ease-in-out">
            <h1 className="text-2xl font-bold mt-4">Formal Attire</h1>
            <p className="text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
              voluptates.
            </p>
          </CardContent>
          <Link href="/products/category/Formal Attire">
            <Button className="absolute bottom-4 right-4 rounded-none bg-opacity-50 bg-slate-400 group-hover:bg-slate-600 group-hover:bg-opacity-70">
              View Collection
            </Button>
          </Link>
        </Card>
        <Card className="relative rounded-none overflow-hidden group cursor-pointer ">
          <Image
            src="/Images/Large.jpg"
            alt="perfume"
            width={1000}
            height={1000}
            className="w-[810px] h-[400px] object-cover"
          />
          <CardContent className="absolute inset-0 flex flex-col items-start justify-stitems-start text-white bg-black bg-opacity-50 hover:bg-transparent hover:bg-opacity-100 group-hover:translate-y-full transition-all duration-500 ease-in-out">
            <h1 className="text-2xl font-bold mt-4">Accessories</h1>
            <p className="text-lg">
              Lorem ipsum dolor sit amet consectetur<br /> adipisicing elit. Quisquam,
              voluptates.
            </p>
          </CardContent>
          <Link href="/products/category/Accessories">
            <Button className="absolute bottom-4 right-4 rounded-none bg-opacity-50 bg-slate-400 group-hover:bg-slate-600 group-hover:bg-opacity-70">
              View Collection
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default Category;