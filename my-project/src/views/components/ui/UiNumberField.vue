<script setup lang="ts">
import { ref, watch, computed, onBeforeUnmount } from 'vue';

interface Props {
  min?: number;
  max?: number;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  min: 1,
  max: 99,
  ariaLabel: 'Quantity',
});

const model = defineModel<number>({ required: true });
const inputValue = ref(String(model.value));
const showWarning = ref(false);
const warningTimeout = ref<number | null>(null);

watch(model, newValue => {
  inputValue.value = String(newValue);
});

const isAtMax = computed(() => model.value >= props.max);
const isAtMin = computed(() => model.value <= props.min);

const clamp = (value: number) => Math.max(props.min, Math.min(props.max, value));

const displayWarning = () => {
  showWarning.value = true;
  if (warningTimeout.value) clearTimeout(warningTimeout.value);
  warningTimeout.value = window.setTimeout(() => {
    showWarning.value = false;
  }, 2000);
};

onBeforeUnmount(() => {
  if (warningTimeout.value) {
    clearTimeout(warningTimeout.value);
  }
});

const increment = () => {
  if (model.value < props.max) {
    model.value++;
  } else {
    displayWarning();
  }
};

const decrement = () => {
  if (model.value > props.min) model.value--;
};

const handleInput = (e: Event) => {
  inputValue.value = (e.target as HTMLInputElement).value;
  const parsed = parseInt(inputValue.value, 10);

  if (!isNaN(parsed)) {
    if (parsed > props.max) {
      displayWarning();
    }
    model.value = clamp(parsed);
  }
};

const handleBlur = () => {
  const parsed = parseInt(inputValue.value, 10);
  const fixed = isNaN(parsed) ? model.value : clamp(parsed);
  model.value = fixed;
  inputValue.value = String(fixed);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    increment();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    decrement();
  }
};
</script>

<template>
  <div class="relative inline-block">
    <div
      role="group"
      :aria-label="ariaLabel"
      class="flex h-6 w-fit items-center overflow-hidden border border-gray-300 shadow-sm">
      <button
        type="button"
        :disabled="isAtMin"
        :title="isAtMin ? `Minimum quantity is ${min}` : ''"
        :aria-label="`Decrease ${ariaLabel.toLowerCase()}`"
        class="bg-bright-gray text-silver disabled:hover:bg-bright-gray disabled:active:bg-bright-gray focus:ring-primary-500 flex h-full w-8 cursor-pointer items-center justify-center transition-colors hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-inset active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        @click="decrement">
        <span aria-hidden="true">−</span>
      </button>

      <input
        type="text"
        inputmode="numeric"
        :value="inputValue"
        :aria-label="ariaLabel"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuenow="model"
        role="spinbutton"
        class="bg-bright-gray text-navy-blue focus:ring-primary-500 h-full w-12 border-x border-gray-300 text-center text-sm tabular-nums transition-colors focus:bg-white focus:ring-2 focus:outline-none"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="handleKeydown" />

      <button
        type="button"
        :disabled="isAtMax"
        :title="isAtMax ? `Maximum available: ${max}` : ''"
        :aria-label="`Increase ${ariaLabel.toLowerCase()}`"
        class="bg-bright-gray text-silver disabled:hover:bg-bright-gray disabled:active:bg-bright-gray focus:ring-primary-500 flex h-full w-8 cursor-pointer items-center justify-center transition-colors hover:bg-gray-200 focus:ring-2 focus:outline-none focus:ring-inset active:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        @click="increment">
        <span aria-hidden="true">+</span>
      </button>
    </div>

    <!-- TODO tooltip should be ui reusable component -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1">
      <div
        v-if="showWarning"
        role="alert"
        class="bg-danger absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded px-3 py-1.5 text-xs whitespace-nowrap text-white shadow-lg">
        <div class="bg-danger absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"></div>
        Maximum available: {{ max }}
      </div>
    </Transition>
  </div>
</template>
