<script setup>
defineProps({
  label: String,

  value: {
    type: [String, Number],
    default: '-',
  },
});
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4"
  >
    <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
      {{ label }}
    </p>

    <h3 class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
      {{ value }}
    </h3>
  </div>
</template>
