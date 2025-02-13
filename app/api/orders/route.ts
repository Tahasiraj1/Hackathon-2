import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { client } from "@/sanity/lib/client";
import { auth } from "@clerk/nextjs/server";
import { rollbackOrder } from "@/lib/orderRollback";
import { decrementProductQuantity } from "@/lib/decrementProductQuantity";
import { sendOrderConfirmationEmail } from "@/lib/orderConfirmationEmail";
import { OrderItem, Variation } from "@/types/types";


export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("Received order data:", JSON.stringify(body, null, 2));

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
            clerkId: userId,
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
      console.error("Some product quantities failed to update:", failedUpdates)
      await rollbackOrder(order.id)
      return NextResponse.json({ success: false, error: "Failed to update product quantities" }, { status: 500 })
    }

    console.log("Order created successfully:", JSON.stringify(order, null, 2));

    // Send confirmation email
    await sendOrderConfirmationEmail(order.customerDetails, order);

    return NextResponse.json(
      {
        success: true,
        data: order,
        orderId: order.id,
      },
      { status: 201 },
    );
  } catch (error) {
    let errorMessage = "An unexpected error occurred"
    if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { userId } = await auth();

  // Check for authentication
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (userId) {
    try {
      const { searchParams } = new URL(request.url);
      const clerkId = searchParams.get("clerkId");

      if (!clerkId) {
        return NextResponse.json(
          { success: false, error: "Sign-in required" },
          { status: 400 }
        );
      }

      const orders = await prisma.order.findMany({
        where: {
          clerkId,
        },
        include: {
          customerDetails: true,
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      console.log(
        `Found ${orders.length} orders:`,
        JSON.stringify(orders, null, 2)
      );

      if (!orders || orders.length === 0) {
        console.log("No orders found");
        return NextResponse.json(
          { success: false, message: "No orders found" },
          { status: 404 }
        );
      }

      console.log("Returning orders");
      return NextResponse.json({ success: true, data: orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch orders",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  }
}
