import type { ProductDTO } from '../dto/ProductDTO.ts';

export interface CartItem {
  product: ProductDTO;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ShippingInfo {
  city: string;
  state: string;
  zipCode: string;
}
