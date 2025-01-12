import { client } from "@/sanity/lib/client";
import axios from "axios";
import { NextResponse } from "next/server";

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl: string | string[];
  ratings: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  description: string;
}

const MOCK_API_URL = `${process.env.NEXT_MOCK_API}`;

export async function GET() {
  try {
    const { data: products } = await axios.get<Product[]>(MOCK_API_URL);

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
      await delay(1000); // Adjust delay as needed

      const operation = (async () => {
        const images = await uploadImagesToSanity(product.imageUrl);
        const sanityProduct = {
          _type: "product",
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          images,
          quantity: product.quantity,
          ratings: product.ratings,
          sizes: product.sizes,
          colors: product.colors,
          tags: product.tags,
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

async function uploadImagesToSanity(imageUrls: string | string[]) {
    if (!imageUrls) return [];
  
    const urls = Array.isArray(imageUrls) ? imageUrls : [imageUrls];
  
    const assets = await Promise.all(
      urls.map(async (url) => {
        try {
          console.log("Uploading image from URL:", url);
          const response = await axios.get(url, { responseType: "arraybuffer" });
          console.log("Fetched image response status:", response.status);
  
          const buffer = Buffer.from(response.data, "binary");
          const asset = await client.assets.upload("image", buffer, {
            filename: `product_image_${Date.now()}.jpg`,
          });
          console.log("Uploaded image asset:", asset);
  
          return {
            _type: "image",
            asset: { _type: "reference", _ref: asset._id },
          };
        } catch (error) {
          console.error(`Error uploading image from ${url}:`, error);
          return null;
        }
      })
    );
  
    console.log("Final assets after filtering:", assets.filter(Boolean));
    return assets.filter(Boolean); // Remove null entries
  }
  