import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { client } from "@/sanity/lib/client";

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
}

interface Variation {
  color: string;
  size: string;
  quantity: number;
}

async function decrementProductQuantity(
  productId: string,
  color: string,
  size: string,
  amount: number
) {
  try {
    console.log(
      `Attempting to decrement quantity for product ${productId}, color ${color}, size ${size} by ${amount}`
    );

    const query = `*[_type == "product" && id == $productId][0]`;
    const product = await client.fetch(query, { productId });

    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const variationIndex = product.variations.findIndex(
      (v: Variation) => v.color === color && v.size === size
    );

    if (variationIndex === -1) {
      throw new Error(
        `Variation with color ${color} and size ${size} not found for product ${productId}`
      );
    }

    const result = await client
      .patch(product._id)
      .dec({ [`variations[${variationIndex}].quantity`]: amount })
      .commit();

    console.log(`Updated product in Sanity:`, result);
    return result;
  } catch (error) {
    console.error("Error decrementing product quantity:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // console.log("Received order data:", JSON.stringify(body, null, 2));

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { customerDetails, items, totalAmount } = body;

    if (
      !customerDetails ||
      !Array.isArray(items) ||
      items.length === 0 ||
      typeof totalAmount !== "number"
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid order data" },
        { status: 400 }
      );
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "city",
      "houseNo",
      "postalCode",
      "country",
    ];
    for (const field of requiredFields) {
      if (!customerDetails[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check product quantities before creating the order
    for (const item of items) {
      const product = await client.fetch(
        `*[_type == "product" && id == "${item.productId}"][0]`
      );
      if (!product) {
        return NextResponse.json(
          { success: false, error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }
      const variation = product.variations.find(
        (v: Variation) => v.color === item.color && v.size === item.size
      );
      if (!variation || variation.quantity < item.quantity) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient quantity for product ${item.name}, color ${item.color}, size ${item.size}`,
          },
          { status: 400 }
        );
      }
    }

    // Start a transaction
    const [order, updateResults] = await prisma.$transaction(
      async (prismaClient) => {
        // Create the order
        const newOrder = await prismaClient.order.create({
          data: {
            customerDetails: {
              create: customerDetails,
            },
            items: {
              create: items.map((item: OrderItem) => ({
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                price: Number.parseFloat(item.price.toString()),
                color: item.color,
                size: item.size,
              })),
            },
            totalAmount,
            status: "pending",
          },
          include: {
            customerDetails: true,
            items: true,
          },
        });
        // Update product quantities in Sanity
        const results = await Promise.allSettled(
          items.map((item) =>
            decrementProductQuantity(
              item.productId,
              item.color!,
              item.size!,
              item.quantity
            )
          )
        );

        return [newOrder, results];
      }
    );

    // Check for any failed updates
    const failedUpdates = updateResults.filter(
      (result) => result.status === "rejected"
    );
    if (failedUpdates.length > 0) {
      console.error("Some product quantities failed to update:", failedUpdates);
      // Here you might want to implement a rollback mechanism or alert an admin
    }

    console.log("Order created successfully:", JSON.stringify(order, null, 2));

    return NextResponse.json(
      { success: true, data: order, orderId: order.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);

    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
