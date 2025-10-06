<script setup lang="ts">
import { useCartStore } from '../../../stores/cart.ts';
import UiButton from '../ui/UiButton.vue';
import { formatPrice } from '../../../utils/formatter.ts';

const cartStore = useCartStore();

const handleCheckout = () => {
  if (cartStore.isEmpty) return;
  alert('Proceeding to checkout...');
};
</script>

<template>
  <aside
    class="bg-magnolia rounded-lg p-6 shadow"
    role="region"
    aria-labelledby="cart-totals-heading">
    <h2
      id="cart-totals-heading"
      class="text-md text-navy-blue mb-6 font-bold">
      Cart Totals
    </h2>

    <dl class="space-y-4">
      <div class="flex items-center justify-between">
        <dt class="text-navy-blue text-base">Subtotals:</dt>
        <dd class="text-navy-blue text-base font-light">
          {{ formatPrice(cartStore.totals.subtotal) }}
        </dd>
      </div>

      <div class="border-bright-gray border-t pt-4">
        <div class="flex items-center justify-between">
          <dt class="text-navy-blue text-base">Shipping</dt>
          <dd class="text-navy-blue text-base font-light">
            {{ cartStore.totals.shipping > 0 ? formatPrice(cartStore.totals.shipping) : '—' }}
          </dd>
        </div>
      </div>

      <div class="border-bright-gray border-t pt-4">
        <div class="flex items-center justify-between">
          <dt class="text-navy-blue text-base">Tax (20%)</dt>
          <dd class="text-navy-blue text-base font-light">
            {{ formatPrice(cartStore.totals.tax) }}
          </dd>
        </div>
      </div>

      <div class="border-bright-gray border-t pt-4">
        <div class="flex items-center justify-between">
          <dt class="text-navy-blue text-lg">Totals:</dt>
          <dd class="text-navy-blue text-base font-light">
            {{ formatPrice(cartStore.totals.total) }}
          </dd>
        </div>
      </div>
    </dl>

    <div
      class="sr-only"
      role="status"
      aria-live="polite">
      Cart total is {{ formatPrice(cartStore.totals.total) }}
    </div>

    <UiButton
      variant="success"
      block
      size="lg"
      class="mt-6"
      :disabled="cartStore.isEmpty"
      @click="handleCheckout">
      Proceed To Checkout
    </UiButton>
  </aside>
</template>
