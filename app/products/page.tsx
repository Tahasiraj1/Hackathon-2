import ProductListing from '@/components/ProductListing'
import React from 'react'


async function fetchProducts() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  
  const res = await fetch("http://localhost:3000/api/products", {
    next: { revalidate: 3600 }, // ISR: Updates data every hour
  });

  if (!res.ok) {
    console.error("Response error:", res);
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

const page = async () => {
  const products = await fetchProducts(); // ISR: Fetches data on server-side

  return (
    <div>
      <ProductListing products={products.data} />
    </div>
  )
}

export default page
