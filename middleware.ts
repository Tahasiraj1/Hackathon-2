import { NextResponse } from "next/server";
import {
  clerkMiddleware,
  createRouteMatcher,
} from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/isAdmin";


const isProtectedRoute = createRouteMatcher(["/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth(); // Get the user ID from the request

  // Allow POST requests to /api/orders for authenticated users
  if ((req.method === "POST" || req.method === "GET") && req.nextUrl.pathname === "/api/orders") {
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next(); // Allow the request
  }

  if (req.method === 'GET' && req.nextUrl.pathname === '/my-orders') {
    if (userId) {
      return NextResponse.next();
    } else {
      const url = req.nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url); // Use an absolute URL
    }
  }  
  
  // Allow GET requests to /api/products without authentication
  if (req.method === "GET" && req.nextUrl.pathname === "/api/products") {
    return NextResponse.next();
  }

  // For all other protected routes, check if the user is an admin
  if (isProtectedRoute(req)) {
    const isUserAdmin = await isAdmin(userId);
    if (!isUserAdmin) {
      // Deny access if the user is not an admin
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  // If the user is authenticated and authorized, proceed with the request
  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
  publicRoutes: ["/sign-in(.*)", "/sign-up(.*)"],
};
