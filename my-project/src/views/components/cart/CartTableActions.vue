<script setup lang="ts">
import UiButton from '../ui/UiButton.vue';
import { useCartStore } from '../../../stores/cart.ts';

const cartStore = useCartStore();

const handleAddItem = async () => {
  await cartStore.addItem();
};

const handleClearCart = () => {
  if (cartStore.isEmpty) return;

  if (confirm(`Are you sure you want to remove all ${cartStore.itemCount} items from your cart?`)) {
    cartStore.clearCart();
  }
};
</script>

<template>
  <div
    class="flex flex-col justify-between gap-4 sm:flex-row"
    role="group"
    aria-label="Cart actions">
    <UiButton
      variant="success"
      :disabled="cartStore.isLoading"
      aria-label="Add new item to cart"
      @click="handleAddItem">
      Add Item
    </UiButton>

    <UiButton
      variant="accent"
      :disabled="cartStore.isEmpty || cartStore.isLoading"
      :aria-label="`Clear all ${cartStore.itemCount} items from cart`"
      @click="handleClearCart">
      Clear Cart
    </UiButton>
  </div>
</template>
