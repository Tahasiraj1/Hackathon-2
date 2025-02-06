
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
  label_download: {
    pdf: string;
    png: string;
    zpl: string;
  };
}