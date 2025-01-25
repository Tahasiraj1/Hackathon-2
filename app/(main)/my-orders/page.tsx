"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    color: string;
    size: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

const OrdersPage = () => {
  const { isSignedIn, isLoaded, userId } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    } else if (isSignedIn) {
      fetchOrders();
    }
  }, [isSignedIn, isLoaded, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?clerkId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      console.log(data);
      setOrders(data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (typeof window !== 'undefined')

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!isLoaded || !isSignedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <BarLoader color="#2A254B" />
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-gray-100 shadow-md rounded-lg p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Order #{order.id}</h2>
                <span className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-lg font-medium">
                  Total: ${order.totalAmount.toFixed(2)}
                </p>
                <p
                  className={`px-2 py-1 hidden lg:table-cell rounded-full text-xs font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status === "confirmed"
                        ? "bg-green-200 text-green-800"
                        : order.status === "dispatched"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-200 text-gray-800"
                  }`}
                >
                  Status: {order.status}
                </p>
              </div>
              <h3 className="text-lg font-semibold mb-2">Items:</h3>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <ul key={index} className="list-disc list-inside">
                    <li key={index}>
                      {item.name}
                    </li>
                    <li>
                      Quantity: {item.quantity}
                    </li>
                    <li>
                      Price: ${item.price.toFixed(2)}
                    </li>
                    <li>
                      Color: {item.color}
                    </li>
                    <li>
                      Size: {item.size}
                    </li>
                  </ul>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xl text-center">You have no orders yet.</p>
      )}
    </div>
  );
};

export default OrdersPage;
