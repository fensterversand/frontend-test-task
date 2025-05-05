<script setup lang="ts">

import {useCartStore} from "@/stores/cart.ts";

const cartStore = useCartStore();
</script>

<template>
  <div class="flex justify-between pt-8">
    <button
      @click="cartStore.addProduct()"
      class="px-8 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 active:bg-green-700 cursor-pointer transition-colors disabled:bg-gray-500 disabled:cursor-default">
      Add item
    </button>
    <button
      @click="cartStore.clearCart()"
      :disabled="cartStore.cartItems.length === 0"
      class="px-8 py-2 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 active:bg-pink-700 cursor-pointer transition-colors disabled:bg-gray-500 disabled:cursor-default">
      Clear Cart
    </button>
  </div>
</template>

