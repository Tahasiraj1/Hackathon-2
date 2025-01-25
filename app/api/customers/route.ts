import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

async function isAdmin(userId: string) {
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return user.publicMetadata.role === "admin";
}

export async function GET() {
  const { userId } = await auth();

  // Authentication check
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin authorization check
  if (!(await isAdmin(userId))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  console.log("GET request received for customers");

  try {

    const customers = await prisma.customerDetails.findMany();
    console.log("Fetched customers:", JSON.stringify(customers, null, 2));
    return NextResponse.json({ success: true, data: customers });

  } catch (error) {

    console.error("Error fetching customers:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customers",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
    
  }
}
