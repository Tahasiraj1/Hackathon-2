"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion"
import { CircleUser, ShoppingCart } from "lucide-react"
import { SignedIn, SignInButton, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "../ui/button"
import { Card, CardContent } from "@/components/ui/card"

const SearchProduct = dynamic(() => import("../SearchProduct"))
const MobileMenuSheet = dynamic(() => import("./MobileMenuSheet"))
const WishList = dynamic(() => import("./WishList"))

const categories = [
  { title: "Home", href: "/" },
  { title: "All Products", href: "/products" },
  { title: "Mens", href: "/products/category/Mens" },
  { title: "Womens", href: "/products/category/Womens" },
  { title: "Kids", href: "/products/category/Kids" },
  { title: "Casual Wear", href: "/products/category/Casual Wear" },
  { title: "Formal Attire", href: "/products/category/Formal Attire" },
  { title: "Active Wear", href: "/products/category/Active Wear" },
  { title: "Accessories", href: "/products/category/Accessories" },
]

const Header = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [scrollYPosition, setScrollYPosition] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex]
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeIndex])

  useEffect(() => {
    requestAnimationFrame(() => {
      const overviewElement = tabRefs.current[0]
      if (overviewElement) {
        const { offsetLeft, offsetWidth } = overviewElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        })
      }
    })
  }, [])

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollYPosition(latest); // Track scroll position
  });

  useEffect(() => {
    // Only toggle visibility when crossing a scroll threshold
    const handleVisibility = () => {
      if (scrollYPosition > 50) {
        setVisible(false) // Hide categories if scrolling down past 50px
      } else {
        setVisible(true) // Show categories when near the top
      }
    }

    handleVisibility()
  }, [scrollYPosition])

  return (
    <header className="sticky top-0 z-10 w-full flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-md">
      <div className="flex flex-col items-center justify-center w-full px-5 md:px-10">
        {/* Top Header Section */}
        <div className="flex w-full justify-between pt-4">
          {/* Search Option */}
          <div className="hidden md:flex">
            <SearchProduct />
          </div>

          {/* Website Name */}
          <h1 className="text-2xl font-clashDisplay mt-1">
            <Link href="/">Avion</Link>
          </h1>

          <div className="flex items-center justify-center gap-3 md:gap-4">
            <Link href={"/my-orders"}>
              <Button className="hidden md:flex bg-opacity-50 bg-slate-300 hover:bg-slate-200 rounded-full text-black w-fit px-2 py-2">
                My Orders
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <ShoppingCart className="hidden md:flex" />
            </Link>

            {/* Mobile Search */}
            <div className="md:hidden flex">
              <SearchProduct />
            </div>

            {/* Wishlist */}
            <WishList />

            {/* Mobile Menu */}
            <MobileMenuSheet />

            {/* User Authentication */}
            <div className="mt-0.5">
              <SignedOut>
                <SignInButton mode="modal">
                  <button>
                    <CircleUser />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>

        {/* Horizontal Line */}
        <hr className="w-full mt-4" />

        {/* Categories Section */}
        <motion.div
          className="hidden lg:flex relative w-full overflow-hidden"
          initial={{ opacity: 0, height: "0px" }}
          animate={{
            opacity: visible ? 1 : 0,
            height: visible ? "40px" : "0px",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <AnimatePresence>
            {visible && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full overflow-hidden"
              >
                <Card className="w-full border-none shadow-none relative flex items-center justify-center bg-transparent">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Hover Highlight */}
                      <div
                        className="absolute h-[30px] transition-all duration-300 ease-out bg-[#0e0f1114] rounded-none flex items-center"
                        style={{
                          ...hoverStyle,
                          opacity: hoveredIndex !== null ? 1 : 0,
                        }}
                      />

                      {/* Active Indicator */}
                      <div
                        className="absolute bottom-[-6px] h-[2px] bg-[#0e0f11] transition-all duration-300 ease-out"
                        style={activeStyle}
                      />

                      {/* Tabs */}
                      <div className="relative flex space-x-[6px] items-center justify-center">
                        {categories.map((category, index) => (
                          <Link key={index} href={category.href}>
                            <div
                              key={index}
                              ref={(el) => {
                                tabRefs.current[index] = el;
                              }}
                              className={`px-3 py-2 cursor-pointer transition-colors duration-300 h-[30px] ${
                                index === activeIndex ? "text-[#0e0e10]" : "text-[#0e0f1199]"
                              }`}
                              onMouseEnter={() => setHoveredIndex(index)}
                              onMouseLeave={() => setHoveredIndex(null)}
                              onClick={() => setActiveIndex(index)}
                            >
                              
                                <div className="text-md font-satoshi leading-5 whitespace-nowrap flex items-center justify-center h-full">
                                  {category.title}
                                </div>
                              
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </header>
  )
}

export default Header

