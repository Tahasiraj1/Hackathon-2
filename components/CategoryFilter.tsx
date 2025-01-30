import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

const transitionProps = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.5,
};

const productTypes = [
  "Mens",
  "Womens",
  "Kids",
  "Casual Wear",
  "Formal Attire",
  "Active Wear",
  "Accessories",
];

const CategoryFilter = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <motion.div
      className="flex flex-wrap gap-3 overflow-visible"
      layout
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      }}
    >
      {productTypes.map((type) => {
        const isSelected = selectedCategories.includes(type);
        return (
          <motion.button
            key={type}
            onClick={() => toggleCategory(type)}
            layout
            initial={false}
            animate={{
              backgroundColor: isSelected ? "#2A254B" : "#CBD5E1",
            }}
            whileHover={{
              backgroundColor: isSelected ? "#363061" : "#94A3B8",
            }}
            whileTap={{
              backgroundColor: isSelected ? "#1f1209" : "#64748B",
            }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
              mass: 0.5,
              backgroundColor: { duration: 0.1 },
            }}
            className={`
            inline-flex items-center px-4 py-2 rounded-full text-base font-medium
            whitespace-nowrap overflow-hidden ring-1 ring-inset
            ${
              isSelected
                ? "bg-[#363061] ring-[hsla(0,0%,100%,0.12)]"
                : "text-black ring-[hsla(0,0%,100%,0.06)]"
            }
          `}
          >
            <motion.div
              className="relative flex items-center"
              animate={{
                width: isSelected ? "auto" : "100%",
                paddingRight: isSelected ? "1.5rem" : "0",
              }}
              transition={{
                ease: [0.175, 0.885, 0.32, 1.275],
                duration: 0.3,
              }}
            >
              <span className={`${isSelected ? "text-white" : "text-black"}`}>
                {type}
              </span>
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      mass: 0.5,
                    }}
                    className="absolute right-0"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#574f99] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={1.5} />
                    </div>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default CategoryFilter;
