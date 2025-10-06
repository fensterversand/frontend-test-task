import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CartTotals, CartItem } from '../models/internal/cart.ts';
import { CartService } from '../services/CartService.ts';
import { productsApi } from '../api/productAPI.ts';
import type { ProductDTO } from '../models/dto/ProductDTO.ts';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const shippingCost = ref(0);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isEmpty = computed(() => items.value.length === 0);

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0));

  const totals = computed((): CartTotals => CartService.calculateTotals(items.value, shippingCost.value));

  const initializeCart = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const products = await productsApi.getProducts(5);
      items.value = products.map(product => ({
        product,
        quantity: 1,
      }));
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load products';
      console.error(e);
    } finally {
      isLoading.value = false;
    }
  };

  const addItem = async () => {
    try {
      const productToSave: ProductDTO = {
        id: Date.now(),
        title: 'Mens Casual Premium Slim Fit T-Shirts ',
        price: 22.3,
        description:
          'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.',
        category: "men's clothing",
        image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_t.png',
        rating: {
          count: 1,
          rate: 45,
        },
      };

      // mock api returns just 3 fields {"id":21,"title":"Mens Casual Premium Slim Fit T-Shirts ","price":22.3}
      // but we need the whole DTO, that is why we don't push it in store but push an extended productToSave mock

      await productsApi.createProduct({
        title: 'Mens Casual Premium Slim Fit T-Shirts ',
        price: 22.3,
      });

      items.value.push({
        product: productToSave,
        quantity: 1,
      });
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add product';
      console.error(e);
    }
  };

  const removeItem = (cartItemId: number) => {
    items.value = items.value.filter(item => item.product.id !== cartItemId);
  };

  const updateQuantity = (cartItemId: number, newQuantity: number) => {
    const item = items.value.find(item => item.product.id === cartItemId);
    if (!item) return;

    const maxStock = item.product.rating.count;
    if (!CartService.validateQuantity(newQuantity, maxStock)) return;

    item.quantity = newQuantity;
  };

  const clearCart = () => {
    items.value = [];
    shippingCost.value = 0;
  };

  const calculateShipping = () => {
    const baseShipping = 10;
    const random = Math.random() * 20;
    shippingCost.value = Math.round((baseShipping + random) * 100) / 100;
  };

  return {
    items,
    shippingCost,
    isLoading,
    error,
    isEmpty,
    itemCount,
    totals,
    initializeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    calculateShipping,
  };
});
