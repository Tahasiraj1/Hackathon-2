import { Image as SanityImage } from "@sanity/types";

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  color?: string | null;
  size?: string | null;
}

export interface Variation {
  color: string;
  size: string;
  quantity: number;
}

export interface CustomerDetails {
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

export interface ShippingLabel {
  label_id: string;
  tracking_number: string;
  tracking_url: string;
  label_download: {
    pdf: string;
    png: string;
    zpl: string;
  };
}

export interface CartItem {
  image: SanityImage;
  id: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  size: string;
  description: string;
}

export interface WishItem {
    id: string;
    name: string;
    image: SanityImage;
    price: number;
}

export interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  images: SanityImage;
  ratings: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  categories: string[];
  description: string;
  variations: Variation[];
}