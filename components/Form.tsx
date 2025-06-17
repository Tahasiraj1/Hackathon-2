"use client";

import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCart } from '@/lib/CartContext';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { toast } from "@/hooks/use-toast";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { convertToSubcurrency } from '@/lib/convertToSubcurrency';
import { formVariants, itemVariants } from '@/lib/motion';
import { motion } from 'framer-motion';
// import { ShippingLabel } from '@/Types/types';

const formSchema = z.object({
  firstName: z.string().min(3, "First name is required"),
  lastName: z.string().min(3, "Last name is required"),
  phoneNumber: z.string().min(11, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City is required"),
  houseNo: z.string().min(2, "Full Address is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
});

type FormData = z.infer<typeof formSchema>

export default function CheckoutForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  // const [label, setLabel] = useState<ShippingLabel | null>(null);
  // const router = useRouter();
  const { cart } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      city: "",
      houseNo: "",
      postalCode: "",
      country: "PK", // Set default country to Pakistan
    },
  });

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    if (totalAmount > 0) {
      fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: convertToSubcurrency(totalAmount) }),
      })
        .then((res) => res.json())
        .then((data) => setClientSecret(data.clientSecret))
        .catch((error) => {
          console.error("Error fetching payment client secret:", error);
          setErrorMessage("Error fetching payment details.");
        });
    }
  }, [totalAmount])


  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not been initialized")
      setIsSubmitting(false)
      return
    }

    try {
      const orderData = {
        customerDetails: data,
        items: cart.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      }

      // Ensure elements.submit() is called before confirming payment
      const paymentResult = await elements.submit(); // Submit elements before confirming payment

      if (paymentResult.error) {
        setErrorMessage(paymentResult.error.message || "An error occurred while submitting payment details");
        return;
      }

      // First, confirm the payment with Stripe
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/my-orders`,
        },
        redirect: "if_required",
      })

      if (paymentError) {
        setErrorMessage(paymentError.message || "An error occurred during payment confirmation")
        return
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // If payment is successful, create the order
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...orderData,
            paymentIntentId: paymentIntent.id,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || errorData.details || "Failed to place order")
        }

        // const shippingresponse = await fetch("/api/shipping", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     customerDetails: {
        //       firstName: "John",
        //       lastName: "Doe",
        //       phoneNumber: "+1 415-555-5678",
        //       houseNo: "567 Maple St",
        //       city: "San Francisco",
        //       state: "CA",
        //       postalCode: "94107",
        //       country: "US",
        //     },
        //   }),
        // })

        // const data = await shippingresponse.json()
        // setLabel(data);

        toast({
          title: "✔️ Order placed successfully!",
          description: `PKR ${orderData.totalAmount} is sent successfully.`
        })
        // clearCart()
        // router.push("/my-orders")
      } else {
        // Payment requires additional action
        setErrorMessage("Payment requires additional action. Please complete the payment process.")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred")
      toast({
        title: "❌ Error placing order",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <Form {...form}>
        <motion.form 
          variants={formVariants}
          initial="hidden"
          animate="visible"
          onSubmit={form.handleSubmit(onSubmit)} 
          onKeyDown={handleKeyDown} 
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4" initial="hidden" animate="visible">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. 1234567890" type="tel" {...field} />
                  </FormControl>
                  <FormDescription>We will contact you on this number.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. john@example.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. Karachi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="houseNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. Area, Street no, House no." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="e.g. 75950" type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country / Region</FormLabel>
                  <FormControl>
                    <Input className="rounded-md border-gray-300" placeholder="Pakistan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </motion.div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bank-transfer">
              <AccordionTrigger className="text-lg font-clashDisplay">Stripe Test Payment</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry date:</strong> 12 / 34</p>
                  <p><strong>Security code:</strong> 123</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Order will be accepted once payment has been confirmed in our account.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          {clientSecret && <PaymentElement />}
          <Button 
            type="submit"
            disabled={isSubmitting}
            className='bg-[#2A254B] text-white rounded-md hover:bg-[#27224b] w-full text-lg'
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </motion.form>
      </Form>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-none relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
      {/* {label && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Label Created</h3>
          <p>Tracking Number: {label.tracking_number}</p>
          <p>Label ID: {label.label_id}</p>
          <h4 className="mt-2 font-semibold">Download Links:</h4>
          <ul className="list-disc list-inside">
            <li><a href={label.label_download.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PDF</a></li>
            <li><a href={label.label_download.png} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PNG</a></li>
            <li><a href={label.label_download.zpl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ZPL</a></li>
          </ul>
        </div>
      )} */}
    </div>
  );
}
