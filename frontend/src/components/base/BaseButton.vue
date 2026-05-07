<script setup>
import { computed } from 'vue'

defineOptions({
  inheritAttrs: false
})

const props = defineProps({
  variant: {
    type: String,
    default: 'primary'
  },

  disabled: Boolean
})

const buttonClasses = computed(() => [
  'w-full py-3 rounded-xl font-medium transition-all',
  'focus:outline-none focus:ring-2 cursor-pointer',

  props.variant === 'primary' &&
    'bg-primary  text-white focus:ring-cyan-400 shadow-md hover:shadow-lg',

  props.variant === 'secondary' &&
    'border-2 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700',

  props.disabled &&
    'opacity-50 cursor-not-allowed'
])
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>