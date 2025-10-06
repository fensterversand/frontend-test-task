<script setup lang="ts">
import { onMounted } from 'vue';

import { useCartStore } from '../../stores/cart.ts';
import CartLayout from '../layouts/CartLayout.vue';
import CartTable from '../components/cart/CartTable.vue';
import CartTotal from '../components/cart/CartTotal.vue';
import CartShoppingCalculationForm from '../components/cart/CartShoppingCalculationForm.vue';
const cartStore = useCartStore();

onMounted(() => {
  cartStore.initializeCart();
});
</script>

<template>
  <h1 class="sr-only">Cart Page</h1>
  <div class="min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div
        v-if="cartStore.isLoading"
        class="flex items-center justify-center py-20">
        <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-green-500"></div>
      </div>
      <div
        v-else-if="cartStore.error"
        class="text-danger rounded-lg border border-red-200 bg-red-50 p-4">
        {{ cartStore.error }}
      </div>

      <CartLayout v-else>
        <template #main>
          <CartTable />
        </template>
        <template #sidebar>
          <div class="flex flex-col gap-7">
            <CartTotal />
            <CartShoppingCalculationForm />
          </div>
        </template>
      </CartLayout>
    </div>
  </div>
</template>
