<script setup lang="ts">

import {useCartStore} from "@/stores/cart.ts";
import {ref} from "vue";

const cartStore = useCartStore()
const checkoutButtonText = ref('Proceed To Checkout');

function goToCheckout() {
  checkoutButtonText.value = 'Checkout not Ready yet'
}
</script>

<template>
  <h2 class="text-center font-bold mb-12">Cart Totals</h2>
  <div class="bg-purple-50 p-8">
    <div class="mb-5 flex justify-between pb-2 border-b-[2px] border-gray-200">
      <span>Subtotals:</span>
      <span>{{ cartStore.subtotal }}</span>
    </div>

    <div class="mb-5 flex justify-between pb-2 border-b-[2px] border-gray-200">
      <span>Shipping</span>
      <span>{{ cartStore.shipping }}</span>
    </div>

    <div class="mb-11 flex justify-between pb-2 border-b-[2px] border-gray-200">
      <span>Tax (20%)</span>
      <span>{{ cartStore.tax}}</span>
    </div>

    <div class="mb-8 flex justify-between pb-2 border-b-[2px] border-gray-200">
      <span>Totals:</span>
      <span>{{ cartStore.total}}</span>
    </div>

    <button @click="goToCheckout()"
            class="px-8 py-2 bg-green-500 w-full text-white font-bold rounded  hover:bg-green-600 active:bg-green-700 cursor-pointer transition-colors">
      {{ checkoutButtonText }}
    </button>
  </div>
</template>
