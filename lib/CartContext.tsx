"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/hooks/use-toast";
import { CartItem, WishItem, Product } from "@/Types/types";

interface CartContextType {
  cart: CartItem[];
  wishList: WishItem[];
  addToCart: (item: CartItem) => void;
  toggleWishList: (item: WishItem) => void;
  removeFromCart: (item: CartItem) => void;
  removeFromWishlist: (item: WishItem) => void;
  clearCart: () => void;
  incrementQuantity: (item: CartItem) => void;
  decrementQuantity: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishList, setWishList] = useState<WishItem[]>([]);

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
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product }];
      }
    });
  };

  const toggleWishList = (product: WishItem) => {
    let actionMessage = ""; 
    const existingProduct = wishList.find((item) => item.id === product.id);

    setWishList((prevWish) => {
      if (existingProduct) {
        // remove from wishlist
        actionMessage = `${product.name} is removed from wishlist.`;
        return prevWish.filter((item) => item.id !== product.id );

      } else {
        // Add to wishlist
        actionMessage = `✔️ ${product.name} is added to wishlist.`;
        return [...prevWish, { ...product }];
      }
    });

    toast({
        className:"border border-[#27224b]",
        title: actionMessage,
        description: "",
        duration: 5000,
      });
  };  

  const removeFromWishlist = (product: WishItem) => {
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
