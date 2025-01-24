"use client";

import { useState } from 'react';
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
import { useAuth } from "@clerk/nextjs";


const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(11, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  city: z.string().min(1, "City is required"),
  houseNo: z.string().min(1, "House number is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutForm() {
  const { clearCart, cart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [labelInfo, setLabelInfo] = useState<any>(null);
  // const [trackingNumber, setTrackingNumber] = useState<string | null>(null);
  const { getToken } = useAuth();
  const token = getToken();

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
      country: "Pakistan", // Set default country to Pakistan
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    // Create order
    try {
      const orderData = {
        customerDetails: data,
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        totalAmount: cart.reduce((total, item) => total + item.price * item.quantity, 0),
      };
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || "Failed to place order");
      }

      clearCart();
      alert("Order placed successfully!");
    } catch (error) {
      console.error('Error placing order:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-gray-300" placeholder="e.g. John" {...field} />
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
                    <Input className="rounded-none border-gray-300" placeholder="e.g. Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input className="rounded-none border-gray-300" placeholder="e.g. 1234567890" type="tel" {...field} />
                </FormControl>
                <FormDescription>We will contact you on this number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className="rounded-none border-gray-300" placeholder="e.g. john@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-gray-300" placeholder="e.g. Karachi" {...field} />
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
                    <Input className="rounded-none border-gray-300" placeholder="e.g. Area, Street no, House no." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input className="rounded-none border-gray-300" placeholder="e.g. 75950" type="text" {...field} />
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
                    <Input className="rounded-none border-gray-300" placeholder="Pakistan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="bank-transfer">
              <AccordionTrigger className="text-lg font-clashDisplay">Bank Transfer Details</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p><strong>Bank Name:</strong> Example Bank</p>
                  <p><strong>Account Name:</strong> Your Clothing Brand Ltd.</p>
                  <p><strong>Account Number:</strong> 1234567890</p>
                  <p><strong>IBAN:</strong> PK00EXMP0123456789012345</p>
                  <p><strong>Swift Code:</strong> EXMPPKKA</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Make your payment directly into our bank account. Please share a payment screenshot on this WhatsApp +92 3311245238. Use your Order ID as the payment reference.
                    Order will be shipped once payment has been confirmed in our account.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button 
            type="submit"
            disabled={isSubmitting}
            className='bg-[#2A254B] text-white rounded-none hover:bg-[#27224b] w-full text-lg'
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </Button>
        </form>
      </Form>
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-none relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {errorMessage}</span>
        </div>
      )}
    </div>
  );
}



      {/* {labelInfo && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Shipping Label Created</h2>
          <p>Tracking Number: {labelInfo.tracking_number}</p>
          <p>Label ID: {labelInfo.label_id}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Label Download Links:</h3>
          <ul className="list-disc list-inside">
            <li><a href={labelInfo.label_download.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PDF</a></li>
            <li><a href={labelInfo.label_download.png} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">PNG</a></li>
            <li><a href={labelInfo.label_download.zpl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">ZPL</a></li>
          </ul>
        </div>
      )}
      {trackingNumber && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Track Your Shipment</h2>
          <TrackShipment trackingNumber={trackingNumber} />
        </div>
      )} */}


      // Create shipping label
      // const labelResponse = await fetch('/api/shipping/create-label', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     shipment: {
      //       name: `${data.firstName} ${data.lastName}`,
      //       phone: data.phoneNumber,
      //       address_line1: data.houseNo,
      //       city_locality: data.city,
      //       state_province: 'Sindh',
      //       postal_code: data.postalCode,
      //       country_code: data.country,
      //     }
      //   }),
      // });

      // if (!labelResponse.ok) {
      //   const errorData = await labelResponse.json();
      //   throw new Error(errorData.error || 'Failed to create shipping label');
      // }

      // const labelData = await labelResponse.json();

      // setLabelInfo(labelData);
      // setTrackingNumber(labelData.tracking_number);

