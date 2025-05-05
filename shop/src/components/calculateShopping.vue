<script setup lang="ts">
import {useCartStore} from "@/stores/cart.ts";

const cartStore = useCartStore();
</script>

<template>
  <!--      TODO: Generate Fields from Data-->

  <h2 class="text-center font-bold my-6">Calculate Shopping</h2>
  <div class="bg-purple-50 pt-11 px-8 pb-5 mb-16">
    <div class="mb-8">
      <label for="city" class="hidden">City</label>
      <input type="text" id="city"
             class="font-semibold border-b border-blue-500 placeholder-gray-400 w-full outline-none focus:border-sky-500 transition-colors"
             placeholder="Stuttgart">
    </div>

    <div class="mb-8">
      <label for="street" class="hidden">Street</label>
      <input type="text" id="street"
             class="font-semibold border-b border-blue-500 placeholder-gray-400 w-full outline-none focus:border-sky-500 transition-colors"
             placeholder="Mirpur Dhaka - 1200">
    </div>

    <div class="mb-8">
      <label for="zip" class="hidden">ZIP</label>
      <input type="text" id="zip"
             class="font-semibold border-b border-blue-500 placeholder-gray-400 w-full outline-none focus:border-sky-500 transition-colors"
             placeholder="12345">
    </div>

    <button
      @click="cartStore.calculateShipping()"
      class="px-8 py-2 bg-pink-500 text-white font-bold rounded hover:bg-pink-600 active:bg-pink-700 transition-colors cursor-pointer">
      Calculate Shipping
    </button>
  </div>
</template>
