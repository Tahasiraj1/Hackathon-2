import { client } from "@/sanity/lib/client";
import axios from "axios";
import { NextResponse } from "next/server";
import { nanoid } from 'nanoid';

interface Variation {
  color: string; // Color of the product (e.g., "Red", "Blue")
  size: string; // Size of the product (e.g., "S", "M", "L")
  quantity: number; // Available quantity for the specific color and size
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string | string[];
  rating: string;
  tags: string[];
  description: string;
  variations: Variation[]; // Variations of the product with different colors, sizes, and quantities
}

const MOCK_API_URL = `${process.env.NEXT_MOCK_API}`;


async function uploadImagesToSanity(image: string | string[]) {
  if (!image) {
    console.warn("No image URLs provided.");
    return [];
  }

  const urls = Array.isArray(image) ? image : [image];
  console.log("Processing the following URLs:", urls);

  const assets = await Promise.all(
    urls.map(async (url) => {
      try {
        console.log("Fetching image URL:", url);
        const response = await axios.get(url, { responseType: "arraybuffer" });
        console.log("Fetched image response status:", response.status);

        const buffer = Buffer.from(response.data, "binary");
        const asset = await client.assets.upload("image", buffer, {
          filename: `product_image_${Date.now()}.jpg`,
        });
        console.log("Successfully uploaded asset:", asset);

        return {
          _type: "image",
          _key: nanoid(),
          asset: { _type: "reference", _ref: asset._id },
        };
      } catch (error) {
        console.error(`Error uploading image from ${url}:`, error);
        return null;
      }
    })
  );

  const filteredAssets = assets.filter(Boolean);
  console.log("Final filtered assets:", filteredAssets);
  return filteredAssets;
}

export async function POST() {
  try {
    const { data: products } = await axios.get<Product[]>(MOCK_API_URL);
    console.log("Fetched products:", products);

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty product data" },
        { status: 400 }
      );
    }

    async function delay(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const sanityOperations = [];

    for (const product of products) {
      await delay(1000); 
      console.log("Processing product:", product);
      console.log("Image URL:", product.image);

      const operation = (async () => {
        const images = await uploadImagesToSanity(product.image);

        const variations = product.variations.map((variation) => ({
          color: variation.color,
          size: variation.size,
          quantity: variation.quantity,
        }));

        const sanityProduct = {
          _type: "product",
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          images,
          ratings: product.rating,
          tags: product.tags,
          variations,
        };

        return client.createOrReplace({
          _id: `product-${product.id}`,
          ...sanityProduct,
        });
      })();
      sanityOperations.push(operation);
    }

    const results = await Promise.all(sanityOperations);

    console.log("Products synced successfully!");
    return NextResponse.json(
      {
        success: true,
        message: "Products synced successfully!",
        data: results,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error syncing products",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const query = `*[_type == "product"]`; // Fetch all products from Sanity
    const products = await client.fetch(query);

    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching products", error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
