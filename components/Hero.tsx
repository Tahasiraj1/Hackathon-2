import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="flex items-center justify-center md:py-16 text-white font-clashDisplay relative">
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
    </div>
  );
};

export default Hero;
