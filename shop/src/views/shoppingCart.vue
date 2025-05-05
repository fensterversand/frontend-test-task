<script setup lang="ts">
import CartItems from "@/components/cartItems.vue";
import CartActions from "@/components/cartActions.vue";
import CartTotals from "@/components/cartTotals.vue";
import CalculateShopping from "@/components/calculateShopping.vue";
</script>

<template>
  <div class="container mx-auto mt-12 px-4 md:px-6">
    <!--    TODO: Fix Span on Responsive-->
    <div class="grid grid-cols-12 gap-4 md:gap-8 lg:gap-16">
      <div class="col-span-12 lg:col-span-8">
        <cart-items/>
        <cart-actions/>
      </div>

      <div class="col-span-12 lg:col-span-4">
        <cart-totals/>
        <calculate-shopping/>
      </div>
    </div>
  </div>
</template>

