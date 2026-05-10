<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div
    class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-800/70 p-4"
  >
    <h3 class="text-xs tracking-wide font-semibold text-slate-500 dark:text-slate-400">
      {{ title }}
    </h3>

    <slot />
  </div>
</template>
