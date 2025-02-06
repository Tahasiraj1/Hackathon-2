import { client } from "@/sanity/lib/client";
import { Variation } from "@/types/order";

export async function decrementProductQuantity(
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