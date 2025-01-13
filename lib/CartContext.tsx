"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from '@/sanity/lib/client';
import { Image as SanityImage } from '@sanity/types';


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
    addToCart: (item: CartItem) => void;
    removeFromCart: (item: CartItem) => void;
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

export default function CartProvider ({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const query = `*[_type == "product"]{
                id,
                name,
                price,
                "images": images[].asset->_id,
                ratings,
                discountPercentage,
                priceWithoutDiscount,
                ratingCount,
                description,
                variations[] {
                  color,
                  size,
                  quantity
                },
                tags
              }`;

            const fetchedProducts = await client.fetch(query);
            setProducts(fetchedProducts);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);


    const getProductStock = (id: string, color: string, size: string) => {
        const product = products.find((p: Product) => p.id === id);
        if (!product) return 0;
    
        const variation = product.variations.find(
            (v) => v.color === color && v.size === size
        );
    
        return variation ? variation.quantity : 0;
    };

    const addToCart = (product: CartItem) => {
        const productStock = getProductStock(product.id, product.color, product.size);

        setCart((prevCart) => {
            const existingProduct = prevCart.find(
                (item) => item.id === product.id && item.color === product.color && item.size === product.size
            );

            if (existingProduct) {
                return prevCart.map((item) => 
                item.id === product.id && item.color === product.color && item.size === product.size && item.quantity < productStock
                ? { ...item, quantity: item.quantity + 1 }
                : item
                );
            } else {
                return [...prevCart, { ...product }]
            }
        });
    };

    const removeFromCart = (product: CartItem) => {
        setCart((prevCart) => 
            prevCart.filter(
                (item) => !(item.id === product.id && item.color === product.color && item.size === product.size)
            )
        )
    };

    const clearCart = () => {
        setCart([]);
    };

    const incrementQuantity = (product: CartItem) => {
        const productStock = getProductStock(product.id, product.color, product.size);

        setCart((prevCart) => 
            prevCart.map((item) => 
            item.id === product.id && item.color === product.color && item.size === product.size && item.quantity < productStock
            ? { ...item, quantity: item.quantity + 1 } 
            : item
            )
        );
    };

    const decrementQuantity = (product: CartItem) => {
        setCart((prevCart) => 
            prevCart.map((item) => 
            item.id === product.id && item.color === product.color && item.size === product.size && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }  
            : item      
            )
        );
    }


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, incrementQuantity, decrementQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}