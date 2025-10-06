import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from './cart';
import { mockProducts, mockProduct } from '../__tests__/fixtures/products';

vi.mock('../api/productAPI');

import { productsApi } from '../api/productAPI';

const mockGetProducts = vi.mocked(productsApi.getProducts);
const mockCreateProduct = vi.mocked(productsApi.createProduct);

describe('useCartStore', () => {
  let store: ReturnType<typeof useCartStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    store = useCartStore();
  });

  describe('initial state', () => {
    it('starts with empty cart', () => {
      expect(store.items).toEqual([]);
      expect(store.shippingCost).toBe(0);
      expect(store.isEmpty).toBe(true);
      expect(store.itemCount).toBe(0);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });
  });

  describe('initializeCart', () => {
    it('loads products successfully', async () => {
      mockGetProducts.mockResolvedValue(mockProducts);

      await store.initializeCart();

      expect(store.items).toHaveLength(5);
      expect(store.items[0]!.quantity).toBe(1);
      expect(store.isEmpty).toBe(false);
      expect(store.isLoading).toBe(false);
      expect(store.error).toBeNull();
    });

    it('handles loading state', async () => {
      mockGetProducts.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockProducts), 100)));

      const promise = store.initializeCart();
      expect(store.isLoading).toBe(true);

      await promise;
      expect(store.isLoading).toBe(false);
    });

    it('handles errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockGetProducts.mockRejectedValue(new Error('Network error'));

      await store.initializeCart();

      expect(store.error).toBe('Network error');
      expect(store.items).toEqual([]);
      expect(store.isLoading).toBe(false);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('addItem', () => {
    it('adds new product to cart', async () => {
      mockCreateProduct.mockResolvedValue({ id: 21, title: 'Test', price: 22.3 });

      await store.addItem();

      expect(store.items).toHaveLength(1);
      expect(store.items[0]!.quantity).toBe(1);
      expect(store.items[0]!.product.price).toBe(22.3);
    });

    it('handles add item error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockCreateProduct.mockRejectedValue(new Error('Failed'));

      await store.addItem();

      expect(store.error).toBe('Failed');
      expect(store.items).toHaveLength(0);
      consoleErrorSpy.mockRestore();
    });
  });

  describe('removeItem', () => {
    it('removes item from cart', () => {
      store.items = [
        { product: mockProducts[0]!, quantity: 1 },
        { product: mockProducts[1]!, quantity: 2 },
      ];

      store.removeItem(mockProducts[0]!.id);

      expect(store.items).toHaveLength(1);
      expect(store.items[0]!.product.id).toBe(mockProducts[1]!.id);
    });

    it('does nothing if item not found', () => {
      store.items = [{ product: mockProduct, quantity: 1 }];

      store.removeItem(999);

      expect(store.items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity within valid range', () => {
      store.items = [{ product: mockProduct, quantity: 1 }];

      store.updateQuantity(mockProduct.id, 5);

      expect(store.items[0]!.quantity).toBe(5);
    });

    it('does not update if quantity exceeds max stock', () => {
      const product = { ...mockProduct, rating: { rate: 4, count: 10 } };
      store.items = [{ product, quantity: 5 }];

      store.updateQuantity(product.id, 15);

      expect(store.items[0]!.quantity).toBe(5);
    });

    it('does not update if quantity is below minimum', () => {
      store.items = [{ product: mockProduct, quantity: 5 }];

      store.updateQuantity(mockProduct.id, 0);

      expect(store.items[0]!.quantity).toBe(5);
    });

    it('does nothing if item not found', () => {
      store.items = [{ product: mockProduct, quantity: 1 }];

      store.updateQuantity(999, 5);

      expect(store.items[0]!.quantity).toBe(1);
    });
  });

  describe('clearCart', () => {
    it('clears all items and shipping', () => {
      store.items = [{ product: mockProduct, quantity: 1 }];
      store.shippingCost = 15.5;

      store.clearCart();

      expect(store.items).toEqual([]);
      expect(store.shippingCost).toBe(0);
      expect(store.isEmpty).toBe(true);
    });
  });

  describe('calculateShipping', () => {
    it('sets random shipping cost', () => {
      store.calculateShipping();

      expect(store.shippingCost).toBeGreaterThanOrEqual(10);
      expect(store.shippingCost).toBeLessThanOrEqual(30);
    });

    it('rounds shipping to 2 decimals', () => {
      store.calculateShipping();

      const decimalPlaces = store.shippingCost.toString().split('.')[1]?.length || 0;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('computed properties', () => {
    it('calculates itemCount correctly', () => {
      store.items = [
        { product: mockProducts[0]!, quantity: 2 },
        { product: mockProducts[1]!, quantity: 3 },
      ];

      expect(store.itemCount).toBe(5);
    });

    it('calculates totals correctly', () => {
      store.items = [{ product: mockProduct, quantity: 2 }];
      store.shippingCost = 10;

      expect(store.totals.subtotal).toBe(219.9);
      expect(store.totals.shipping).toBe(10);
      expect(store.totals.tax).toBe(43.98);
      expect(store.totals.total).toBe(273.88);
    });
  });
});
