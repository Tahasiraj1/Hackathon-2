"use client";

import { useState, useEffect } from "react";

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

const CustomersPage = () => {
  const [customers, setCustomers] = useState<CustomerDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers"); // Adjust the route if necessary
        const data = await response.json();

        if (response.ok) {
          setCustomers(data.data);
        } else {
          setError(data.error || "Failed to fetch customers");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customers List</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">First Name</th>
            <th className="border border-gray-300 px-4 py-2">Last Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">City</th>
            <th className="border border-gray-300 px-4 py-2">Country</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td className="border border-gray-300 px-4 py-2">
                {customer.firstName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.email}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.phoneNumber}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.city}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {customer.country}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersPage;
