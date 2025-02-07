'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import CheckoutForm from '@/components/Form';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { ScrollArea } from './ui/scroll-area';
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { convertToSubcurrency } from '@/lib/convertToSubcurrency';

const Checkout = () => {
    const { cart } = useCart();
    const { isSignedIn, isLoaded } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-up');
        }
    }, [isLoaded, isSignedIn, router]);

    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
        throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
      }
      
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

    const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    if (!cart || cart.length === 0 || amount === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <p className='text-xl font-bold'>Your cart is empty!</p>
                <Link href="/products">
                    <Button className='bg-[#2A254B] hover:bg-[#27224b] text-white rounded-none mt-4'>Back to Shop</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row w-full p-10 justify-between">
            <div className="w-full md:w-[55%]">
                <h1 className='text-3xl font-bold font-clashDisplay'>Checkout</h1>
                <Elements 
                stripe={stripePromise}
                options={{
                    mode: "payment",
                    currency: "usd",
                    amount: convertToSubcurrency(amount),
                }}
                >
                    <CheckoutForm />
                </Elements>
            </div>
                <div className={`w-full md:w-[40%] flex flex-col border sticky top-36 py-4 px-2 rounded-md gap-2 ${cart.length >= 3 ? 'h-[400px]' : 'h-[300px]'}`}>
                    <h1 className='text-2xl pb-4 font-clashDisplay'>Order Summary</h1>
                    <ScrollArea className='max-h-[260px]'>
                        {cart.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className='flex items-center gap-4 rounded-none'>
                                    <Image
                                        src={urlFor(item.image).url()}
                                        alt={item.name}
                                        width={100}
                                        height={100}
                                        className='w-20 h-20 md:w-24 md:h-24 object-cover rounded-md mb-2'
                                    />
                                    <div className='flex-1'>
                                        <h2 className='text-sm md:text-lg md:font-clashDisplay'>{item.name}.</h2>
                                        <p className='text-sm'>Size: {item.size}</p>
                                        <p className='text-sm'>Color: {item.color}</p>
                                        <p className='text-sm'>Quantity: {item.quantity}</p>
                                    </div>
                                    <p className='text-md mr-4 font-satoshi'>PKR {item.price * item.quantity}</p>
                                </div>
                        ))}
                    </ScrollArea>
                    <div className='mt-8 flex justify-between'>
                        <h2 className='text-xl font-clashDisplay'>Total: PKR {cart.reduce((total, item) => total + item.price * item.quantity, 0)}</h2>
                    </div>
                </div>
        </div>
    );
};

export default Checkout;
