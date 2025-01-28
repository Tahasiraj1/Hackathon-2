"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { BarLoader } from "react-spinners"
import { motion } from "framer-motion"
import { ShoppingBag, Calendar, DollarSign, Package, Truck } from "lucide-react"

interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  items: Array<{
    color: string
    size: string
    name: string
    quantity: number
    price: number
  }>
}

const OrdersPage = () => {
  const { isSignedIn, isLoaded, userId } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in")
    } else if (isSignedIn) {
      fetchOrders()
    }
  }, [isSignedIn, isLoaded, router])

  const fetchOrders = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/orders?clerkId=${userId}`)
      if (!response.ok) {
        throw new Error("Failed to fetch orders")
      }
      const data = await response.json()
      setOrders(data.data)
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError("Failed to fetch orders. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  if (typeof window !== "undefined")
    if (error) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-red-100 p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error}</p>
          </motion.div>
        </div>
      )
    }

  if (!isLoaded || !isSignedIn || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <BarLoader color="#4F46E5" height={4} width={100} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          className="text-4xl font-clashDisplay text-gray-900 mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Orders
        </motion.h1>
        {orders && orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <DollarSign className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-xl font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : order.status === "dispatched"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status === "pending" && <Package className="w-4 h-4 inline mr-1" />}
                      {order.status === "confirmed" && <ShoppingBag className="w-4 h-4 inline mr-1" />}
                      {order.status === "dispatched" && <Truck className="w-4 h-4 inline mr-1" />}
                      {order.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Items:</h3>
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                          <div>Quantity: {item.quantity}</div>
                          <div>Price: ${item.price.toFixed(2)}</div>
                          <div>Color: {item.color}</div>
                          <div>Size: {item.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.p
            className="text-2xl text-center text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            You have no orders yet.
          </motion.p>
        )}
      </div>
    </div>
  )
}

export default OrdersPage

