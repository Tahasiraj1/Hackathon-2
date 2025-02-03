"use client"

import Checkout from '@/components/Checkout'
import React from 'react'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { convertToSubcurrency } from '@/lib/convertToSubcurrency';
import { useCart } from '@/lib/CartContext'
import Link from 'next/link'
import { Button } from '@/components/ui/button'


if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string)

const page = () => {

  const { cart } = useCart();
  const amount = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  if (amount === 0){
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
    <div>
      <Elements 
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "usd",
        amount: convertToSubcurrency(amount),
      }}
      >
        <Checkout />
      </Elements>
    </div>
  )
}

export default page
