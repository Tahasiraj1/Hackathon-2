"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Image as SanityImage } from "@sanity/types";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  image: SanityImage;
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  description: string;
}

interface CartContextType {
  cart: CartItem[];
  wishList: CartItem[];
  addToCart: (item: CartItem) => void;
  toggleWishList: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  removeFromWishlist: (item: CartItem) => void;
  clearCart: () => void;
  incrementQuantity: (item: CartItem) => void;
  decrementQuantity: (item: CartItem) => void;
}

interface Variation {
  color: string; // Color of the product (e.g., "Red", "Blue")
  size: string; // Size of the product (e.g., "S", "M", "L")
  quantity: number; // Available quantity for the specific color and size
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: { asset: { url: string } }[];
  ratings: string;
  tags: string[];
  description: string;
  variations: Variation[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data.data))
      .catch((error) => {
        console.error("Error fetching featured products:", error);
      });
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const savedWishList = JSON.parse(localStorage.getItem("wishList") || "[]");
    setWishList(savedWishList);
  }, []);

  useEffect(() => {
    localStorage.setItem("wishList", JSON.stringify(wishList));
  }, [wishList]);

  const getProductStock = (id: string, color: string, size: string) => {
    const product = products.find((p: Product) => p.id === id);
    if (!product) return 0;

    const variation = product.variations.find(
      (v) => v.color === color && v.size === size
    );

    return variation ? variation.quantity : 0;
  };

  const addToCart = (product: CartItem) => {
    const productStock = getProductStock(
      product.id,
      product.color,
      product.size
    );

    setCart((prevCart) => {
      const existingProduct = prevCart.find(
        (item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size
      );

      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size &&
          item.quantity < productStock
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product }];
      }
    });
  };

  const toggleWishList = (product: CartItem) => {
    let actionMessage = ""; 
    const existingProduct = wishList.find((item) => item.id === product.id);

    setWishList((prevWish) => {
      if (existingProduct) {
        // remove from wishlist
        actionMessage = `${product.name} is removed from wishlist.`;
        return prevWish.filter((item) => item.id !== product.id );

      } else {
        // Add to wishlist
        actionMessage = `${product.name} is added to wishlist.`;
        return [...prevWish, { ...product }];
      }
    });

    toast({
        className: existingProduct
          ? "rounded-none"
          : "rounded-none border border-[#27224b]",
        title: "Success!",
        description: actionMessage,
        duration: 5000,
        variant: existingProduct ? "destructive" : "default",
      });
  };  

  const removeFromWishlist = (product: CartItem) => {
    setWishList((preWish) =>
      preWish.filter(
        (item) => item.id !== product.id)
    );
  };

  const removeFromCart = (product: CartItem) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.id === product.id &&
            item.color === product.color &&
            item.size === product.size
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const incrementQuantity = (product: CartItem) => {
    const productStock = getProductStock(
      product.id,
      product.color,
      product.size
    );

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id &&
        item.color === product.color &&
        item.size === product.size &&
        item.quantity < productStock
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (product: CartItem) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === product.id &&
        item.color === product.color &&
        item.size === product.size &&
        item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        wishList,
        addToCart,
        removeFromCart,
        removeFromWishlist,
        clearCart,
        incrementQuantity,
        decrementQuantity,
        toggleWishList,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
