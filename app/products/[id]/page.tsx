import ProductDetails from "@/components/ProductDetails";
import { client } from "@/sanity/lib/client";

export const revalidate = 3600; // Revalidate every hour

export const dynamicParams = true;

export async function generateStaticParams() {
  const query = `*[_type == "product"]{ id }`;
  const products = await client.fetch(query);

  return products.map((product: { id: string }) => ({
    id: product.id,
  }));
}

interface ProductIdProps {
  params: { id: string };
}

const Page = async ({ params }: ProductIdProps) => {
  return (
    <div>
      <ProductDetails productId={params.id} />
    </div>
  );
};

export default Page;
