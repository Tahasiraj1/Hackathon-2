import { NextResponse } from 'next/server';
import { client } from "@/sanity/lib/client";
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order } = body;

    if (!order) {
      throw new Error('Order data is required.');
    }

    // Create the order in Sanity
    const result = await client.create({
      _type: 'order',
      orderId: order.orderId,
      // customer: { _type: 'reference', _ref: order.customerId },
      items: order.items.map((item: string) => ({ 
        _type: 'reference', 
        _ref: item,
        _key: nanoid(),
      })),
      totalAmount: order.totalAmount,
      status: 'pending',
      shippingAddress: {
        street: order.shippingAddress.address_line1,
        city: order.shippingAddress.city_locality,
        state: order.shippingAddress.state_province,
        zipCode: order.shippingAddress.postal_code,
        country: order.shippingAddress.country_code,
      },
      // shippingMethod: order.serviceCode,
      // carrierId: order.carrierId,
    });

    return NextResponse.json({ orderId: result._id });
  } catch (error) {
    console.error('Sanity API error:', error);
    let errorMessage = 'Error creating order';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}
