<script setup lang="ts">
import UiButton from '../ui/UiButton.vue';
import { useCartStore } from '../../../stores/cart.ts';

const cartStore = useCartStore();
</script>

<template>
  <div
    class="rounded-lg bg-white p-12 text-center shadow"
    role="status"
    aria-live="polite">
    <div class="mb-6 flex justify-center">
      <svg
        class="text-light-gray h-24 w-24"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>

    <!-- Title -->
    <h2 class="text-navy-blue mb-2 text-2xl font-semibold">Your cart is empty</h2>

    <!-- Description -->
    <p class="text-silver mx-auto mb-8 max-w-sm">
      Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
    </p>

    <!-- Action Button -->
    <UiButton
      variant="success"
      size="lg"
      aria-label="Add first item to cart"
      @click="cartStore.addItem">
      <svg
        class="mr-2 h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Add Item
    </UiButton>
  </div>
</template>
