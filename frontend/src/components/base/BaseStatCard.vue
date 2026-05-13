<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },

  value: {
    type: [String, Number],
    required: true,
  },

  variant: {
    type: String,
    default: 'default',
  },
});

const variantClasses = {
  default: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100',

  success:
    'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300',

  warning:
    'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300',
};
</script>

<template>
  <div class="rounded-2xl px-4 py-3" :class="variantClasses[variant]">
    <p class="text-xs opacity-80">
      {{ title }}
    </p>

    <p class="text-xl font-black mt-1">
      {{ value }}
    </p>
  </div>
</template>
