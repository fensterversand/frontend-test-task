<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCartStore } from '../../../stores/cart.ts';
import UiButton from '../ui/UiButton.vue';
import { formatPrice } from '../../../utils/formatter.ts';
import { shippingFormSchema } from '../../../utils/schemas/shipping.ts';
import { ZodError } from 'zod';
import type { ShippingInfo } from '../../../models/internal/cart.ts';

const cartStore = useCartStore();

const shippingInfo = ref<ShippingInfo>({
  city: '',
  state: '',
  zipCode: '',
});

const errors = ref({
  city: '',
  state: '',
  zipCode: '',
});

const isCalculating = ref(false);
const shippingMessage = ref('');

const hasErrors = computed(() => Object.values(errors.value).some(error => error !== ''));

const handleCalculateShipping = async () => {
  errors.value = { city: '', state: '', zipCode: '' };
  shippingMessage.value = '';

  try {
    shippingFormSchema.parse(shippingInfo.value);

    isCalculating.value = true;

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      cartStore.calculateShipping();
      shippingMessage.value = `Shipping calculated: ${formatPrice(cartStore.totals.shipping)}`;
    } catch {
      shippingMessage.value = 'Failed to calculate shipping';
    } finally {
      isCalculating.value = false;
    }
  } catch (error) {
    if (error instanceof ZodError) {
      error.issues.forEach(issue => {
        const field = issue.path[0] as keyof typeof errors.value;
        if (field in errors.value) {
          errors.value[field] = issue.message;
        }
      });
    }
  }
};
</script>

<template>
  <section aria-labelledby="shipping-calculator-heading">
    <h2
      id="shipping-calculator-heading"
      class="text-md text-navy-blue mb-6 font-bold">
      Calculate Shopping
    </h2>

    <div
      v-if="hasErrors"
      role="alert"
      aria-live="assertive"
      class="sr-only">
      Form has errors. Please review the fields.
    </div>

    <form
      class="bg-magnolia space-y-6 rounded-lg p-6 shadow"
      novalidate
      @submit.prevent="handleCalculateShipping">
      <div>
        <label
          for="shipping-city"
          class="sr-only">
          City
        </label>
        <input
          id="shipping-city"
          v-model.trim="shippingInfo.city"
          type="text"
          placeholder="Stuttgart"
          :aria-invalid="!!errors.city"
          :aria-describedby="errors.city ? 'city-error' : undefined"
          class="border-light-blue text-navy-blue placeholder:text-input-placeholder focus:border-navy-blue w-full border-0 border-b-2 bg-transparent px-0 py-3 transition-colors focus:outline-none" />
        <p
          v-if="errors.city"
          id="city-error"
          class="text-danger mt-1 text-sm"
          role="alert">
          {{ errors.city }}
        </p>
      </div>

      <div>
        <label
          for="shipping-state"
          class="sr-only">
          State or Region
        </label>
        <input
          id="shipping-state"
          v-model.trim="shippingInfo.state"
          type="text"
          placeholder="Mirpur Dhaka - 1200"
          :aria-invalid="!!errors.state"
          :aria-describedby="errors.state ? 'state-error' : undefined"
          class="border-light-blue text-navy-blue placeholder:text-input-placeholder focus:border-navy-blue w-full border-0 border-b-2 bg-transparent px-0 py-3 transition-colors focus:outline-none" />
        <p
          v-if="errors.state"
          id="state-error"
          class="text-danger mt-1 text-sm"
          role="alert">
          {{ errors.state }}
        </p>
      </div>

      <div>
        <label
          for="shipping-zipcode"
          class="sr-only">
          Zip Code
        </label>
        <input
          id="shipping-zipcode"
          v-model.trim="shippingInfo.zipCode"
          type="text"
          placeholder="12345"
          inputmode="numeric"
          maxlength="5"
          :aria-invalid="!!errors.zipCode"
          :aria-describedby="errors.zipCode ? 'zipcode-error' : undefined"
          class="border-light-blue text-navy-blue placeholder:text-input-placeholder focus:border-navy-blue w-full border-0 border-b-2 bg-transparent px-0 py-3 transition-colors focus:outline-none" />
        <p
          v-if="errors.zipCode"
          id="zipcode-error"
          class="text-danger mt-1 text-sm"
          role="alert">
          {{ errors.zipCode }}
        </p>
      </div>

      <div
        v-if="shippingMessage"
        role="status"
        aria-live="polite"
        class="rounded p-3 text-sm"
        :class="shippingMessage.includes('Failed') ? 'text-danger bg-red-50' : 'text-success bg-transparent'">
        {{ shippingMessage }}
      </div>

      <UiButton
        type="submit"
        block
        size="lg"
        :loading="isCalculating"
        :disabled="isCalculating">
        {{ isCalculating ? 'Calculating...' : 'Calculate Shipping' }}
      </UiButton>
    </form>
  </section>
</template>
