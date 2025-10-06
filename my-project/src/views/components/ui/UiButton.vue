<script setup lang="ts">
import { computed, useAttrs } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface UiButtonProps {
  cursor?: 'pointer' | 'default' | 'not-allowed' | 'wait' | 'help' | 'text';
  variant?: 'success' | 'accent' | 'dark' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  class?: string;
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  cursor: 'pointer',
  variant: 'success',
  size: 'md',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false,
  type: 'button',
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const attrs = useAttrs();

const buttonClasses = computed(() => {
  const base = [
    'inline-flex items-center justify-center',
    'font-medium',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'active:scale-95',
    'select-none',
  ].join(' ');

  const variants = {
    success: ['bg-success text-white', 'hover:bg-success/80', 'focus:ring-green-500', 'shadow-sm hover:shadow'].join(
      ' ',
    ),

    accent: ['bg-accent text-white', 'hover:bg-accent/80', 'focus:ring-red-500', 'shadow-sm hover:shadow'].join(' '),
    dark: ['bg-black text-white hover:bg-gray-800 focus:ring-black shadow-sm hover:shadow'].join(' '),
    ghost: ['bg-transparent text-gray-700', 'hover:bg-gray-100', 'focus:ring-gray-400'].join(' '),

    outline: [
      'bg-transparent border-2 border-gray-300 text-gray-700',
      'hover:bg-gray-50 hover:border-gray-400',
      'focus:ring-gray-400',
    ].join(' '),
  };
  const cursors = {
    pointer: 'cursor-pointer',
    default: 'cursor-default',
    'not-allowed': 'cursor-not-allowed',
    wait: 'cursor-wait',
    help: 'cursor-help',
    text: 'cursor-text',
  };
  const sizes = {
    xs: props.iconOnly ? 'w-6 h-6 p-1 text-xs' : 'px-2 py-1 text-xs rounded',
    sm: props.iconOnly ? 'w-8 h-8 p-1.5 text-sm' : 'px-3 py-1.5 text-sm rounded',
    md: props.iconOnly ? 'w-10 h-10 p-2 text-base' : 'px-4 py-2 text-base rounded-md',
    lg: props.iconOnly ? 'w-12 h-12 p-2.5 text-lg' : 'px-6 py-3 text-lg rounded-md',
    xl: props.iconOnly ? 'w-14 h-14 p-3 text-xl' : 'px-8 py-4 text-xl rounded-lg',
  };

  const classes = [base, variants[props.variant], cursors[props.cursor], sizes[props.size]];

  // Full width
  if (props.block) {
    classes.push('w-full');
  }

  // Icon only - make it circular
  if (props.iconOnly) {
    classes.push('rounded-full');
  }

  // Custom classes
  if (props.class) {
    classes.push(props.class);
  }
  if (attrs.class) {
    classes.push(attrs.class as string);
  }

  return classes.join(' ');
});

const isDisabled = computed(() => props.disabled || props.loading);

const handleClick = (event: MouseEvent) => {
  if (!isDisabled.value) {
    emit('click', event);
  }
};
</script>

<template>
  <button
    v-bind="{ ...$attrs }"
    :type="type"
    :class="buttonClasses"
    :disabled="isDisabled"
    :aria-label="ariaLabel"
    :aria-busy="loading"
    :aria-disabled="isDisabled"
    @click="handleClick">
    <!-- Left Icon Slot -->
    <slot name="icon-left" />

    <!-- Loading Spinner -->
    <span
      v-if="loading"
      :class="[
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        size === 'xs' ? 'h-3 w-3' : '',
        size === 'sm' ? 'h-4 w-4' : '',
        size === 'md' ? 'h-4 w-4' : '',
        size === 'lg' ? 'h-5 w-5' : '',
        size === 'xl' ? 'h-6 w-6' : '',
        $slots.default || $slots['icon-right'] ? 'mr-2' : '',
      ]"
      role="status"
      aria-hidden="true" />

    <!-- Content -->
    <slot />

    <!-- Right Icon Slot -->
    <slot name="icon-right" />
  </button>
</template>
