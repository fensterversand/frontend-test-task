import type { CartTotals, CartItem } from '../models/internal/cart.ts';
import { VAT_RATE } from '../utils/constants.ts';

export class CartService {
  static calculateTotals(items: CartItem[], shippingCost = 0): CartTotals {
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const tax = subtotal * VAT_RATE;
    const total = subtotal + shippingCost + tax;

    return {
      subtotal: this.roundPrice(subtotal),
      shipping: this.roundPrice(shippingCost),
      tax: this.roundPrice(tax),
      total: this.roundPrice(total),
    };
  }

  static roundPrice(price: number): number {
    return Math.round(price * 100) / 100;
  }

  static validateQuantity(quantity: number, maxQuantity: number, minQuantity = 1): boolean {
    return Number.isInteger(quantity) && quantity >= minQuantity && quantity <= maxQuantity;
  }
}
