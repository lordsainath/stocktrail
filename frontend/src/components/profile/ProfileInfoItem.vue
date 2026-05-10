<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },

  value: {
    type: [String, Number],
    default: 'Not available',
  },

  valueClass: {
    type: String,
    default: 'text-sm font-semibold text-slate-800 dark:text-slate-100',
  },
});
</script>

<template>
  <div>
    <dt class="text-xs text-slate-500 dark:text-slate-400">
      {{ label }}
    </dt>

    <dd :class="valueClass">
      {{ value || 'Not available' }}
    </dd>
  </div>
</template>
