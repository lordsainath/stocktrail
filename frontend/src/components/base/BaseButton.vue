<script setup>
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },

  fullWidth: {
    type: Boolean,
    default: true,
  },

  type: {
    type: String,
    default: 'button',
  },

  disabled: Boolean,
});

const buttonClasses = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium transition-colors cursor-pointer',

  'focus:outline-none focus:ring-2',

  props.fullWidth && 'w-full',

  props.variant === 'primary' &&
    'bg-primary text-white focus:ring-primary/40 shadow-sm hover:bg-primary/90',

  props.variant === 'secondary' &&
    'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-300',

  props.disabled && 'cursor-not-allowed opacity-50',
]);
</script>

<template>
  <button
    :class="[buttonClasses, $attrs.class]"
    :disabled="disabled"
    :type="type"
    v-bind="{ ...$attrs, class: undefined }"
  >
    <slot />
  </button>
</template>
