"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function ParallaxLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const stickyPages = ["/checkout"]; 
  const sharedLayoutPages = ["/products"];

  const shouldAnimate = !stickyPages.includes(pathname) && !sharedLayoutPages.some((page) => pathname.startsWith(page))

  return (
    <div
    className={`${
      stickyPages.includes(pathname) ? "" : "overflow-x-hidden"
    }`}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {shouldAnimate ? (
          <motion.div
            key={pathname}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{
              type: "tween",
            }}
            className="w-full min-h-screen"
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </AnimatePresence>
    </div>
  );
}
