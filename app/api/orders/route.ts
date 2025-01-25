import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { client } from "@/sanity/lib/client";
import { auth, clerkClient } from "@clerk/nextjs/server";
import nodemailer from "nodemailer";

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

interface CustomerDetails {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  city: string;
  houseNo: string;
  postalCode: string;
  country: string;
}

async function isAdmin(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

async function sendOrderConfirmationEmail(customerDetails: CustomerDetails, order: { items: OrderItem[], totalAmount: number }) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerDetails.email, // Customer's email
    subject: "Order Confirmation",
    html: `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerDetails.firstName},</p>
      <p>Thank you for your order! Here are the details:</p>
      <ul>
        ${order.items.map((item: OrderItem) => `
          <li>
            ${item.name} - ${item.quantity} x ${item.price} (${item.color}, ${item.size})
          </li>
        `
          )
          .join("")}
      </ul>
      <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
      <p>We will notify you once your order is shipped!</p>
      <p>Thank you for shopping with us!</p>
    `,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    if (error instanceof Error) {
    console.error("Error sending email:", error);
    }
  }
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
      console.error("Some product quantities failed to update:", failedUpdates);
      // Here I've to implement a rollback mechanism to undo the order creation
    }

    console.log("Order created successfully:", JSON.stringify(order, null, 2));

    // Send confirmation email
    await sendOrderConfirmationEmail(order.customerDetails, order);

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

export async function GET(request: Request) {
  const { userId } = await auth();

  // Check for authentication
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const Admin = await isAdmin(userId);

  console.log("GET request received for orders");

  if (Admin && userId) {
    try {
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const orderId = searchParams.get("id");

      const where: { id?: string; status?: string } = {};
      if (status) where.status = status;
      if (orderId) where.id = orderId;

      const order = await prisma.order.findMany({
        where,
        include: {
          customerDetails: true,
          items: true,
        },
      });

      if (!order) {
        console.log(`No order found with ID: ${orderId}`);
        return NextResponse.json(
          { success: false, message: "No order found" },
          { status: 404 }
        );
      }

      console.log("Returning single order:", JSON.stringify(order, null, 2));
      return NextResponse.json({ success: true, data: order });
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
  } else if (userId && !(await isAdmin(userId))) {
    try {
      const { searchParams } = new URL(request.url);
      const clerkId = searchParams.get("clerkId");

      if (!clerkId) {
        return NextResponse.json(
          { success: false, error: "Missing clerkId" },
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

export async function PUT(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    console.log("Received update data:", JSON.stringify(body, null, 2));

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0 || typeof status !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid update data" },
        { status: 400 }
      );
    }

    const updatedOrders = await prisma.order.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        status,
      },
    });

    console.log(
      "Orders updated successfully:",
      JSON.stringify(updatedOrders, null, 2)
    );

    return NextResponse.json(
      { success: true, updatedCount: updatedOrders.count },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating orders:", error);

    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update orders",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
