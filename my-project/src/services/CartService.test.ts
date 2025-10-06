import { CartService } from './CartService.ts';
import type { CartItem } from '../models/internal/cart.ts';
import { mockProduct, mockProducts } from '../__tests__/fixtures/products.ts';

describe('CartService', () => {
  describe('calculateTotals', () => {
    it('calculates totals with empty cart', () => {
      const result = CartService.calculateTotals([], 0);

      expect(result).toEqual({
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
      });
    });

    it('calculates totals for single item', () => {
      const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
      const result = CartService.calculateTotals(items, 0);

      expect(result.subtotal).toBe(109.95);
      expect(result.shipping).toBe(0);
      expect(result.tax).toBe(21.99);
      expect(result.total).toBe(131.94);
    });

    it('calculates totals with multiple quantities', () => {
      const items: CartItem[] = [{ product: mockProduct, quantity: 3 }];
      const result = CartService.calculateTotals(items, 0);

      expect(result.subtotal).toBe(329.85);
      expect(result.tax).toBe(65.97);
      expect(result.total).toBe(395.82);
    });

    it('includes shipping cost', () => {
      const items: CartItem[] = [{ product: mockProduct, quantity: 1 }];
      const result = CartService.calculateTotals(items, 15.5);

      expect(result.shipping).toBe(15.5);
      expect(result.total).toBe(147.44);
    });

    it('calculates totals with multiple items', () => {
      const items: CartItem[] = [
        { product: mockProducts[0]!, quantity: 2 },
        { product: mockProducts[1]!, quantity: 1 },
      ];

      const result = CartService.calculateTotals(items, 10);

      expect(result.subtotal).toBe(242.2);
      expect(result.shipping).toBe(10);
      expect(result.tax).toBe(48.44);
      expect(result.total).toBe(300.64);
    });

    it('rounds all prices to 2 decimals', () => {
      const product = { ...mockProduct, price: 10.33333 };
      const items: CartItem[] = [{ product, quantity: 1 }];
      const result = CartService.calculateTotals(items, 5.55555);

      expect(result.subtotal).toBe(10.33);
      expect(result.shipping).toBe(5.56);
      expect(result.tax).toBe(2.07);
      expect(result.total).toBe(17.96);
    });
  });

  describe('roundPrice', () => {
    it('rounds to 2 decimal places', () => {
      expect(CartService.roundPrice(10.12345)).toBe(10.12);
      expect(CartService.roundPrice(10.126)).toBe(10.13);
      expect(CartService.roundPrice(10.125)).toBe(10.13);
    });

    it('handles whole numbers', () => {
      expect(CartService.roundPrice(10)).toBe(10);
      expect(CartService.roundPrice(0)).toBe(0);
    });

    it('handles negative numbers', () => {
      expect(CartService.roundPrice(-10.125)).toBe(-10.12);
    });
  });

  describe('validateQuantity', () => {
    it('validates quantity within range', () => {
      expect(CartService.validateQuantity(5, 10)).toBe(true);
      expect(CartService.validateQuantity(1, 10)).toBe(true);
      expect(CartService.validateQuantity(10, 10)).toBe(true);
    });

    it('rejects quantity below minimum', () => {
      expect(CartService.validateQuantity(0, 10)).toBe(false);
      expect(CartService.validateQuantity(-1, 10)).toBe(false);
    });

    it('rejects quantity above maximum', () => {
      expect(CartService.validateQuantity(11, 10)).toBe(false);
      expect(CartService.validateQuantity(100, 10)).toBe(false);
    });

    it('rejects non-integer quantities', () => {
      expect(CartService.validateQuantity(1.5, 10)).toBe(false);
      expect(CartService.validateQuantity(5.99, 10)).toBe(false);
    });

    it('respects custom minimum', () => {
      expect(CartService.validateQuantity(3, 10, 5)).toBe(false);
      expect(CartService.validateQuantity(5, 10, 5)).toBe(true);
      expect(CartService.validateQuantity(7, 10, 5)).toBe(true);
    });
  });
});
