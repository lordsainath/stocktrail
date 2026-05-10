<script setup>
defineProps({
  show: Boolean,

  maxWidth: {
    type: String,
    default: 'max-w-md',
  },
});

const emit = defineEmits(['close']);
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
    @click.self="emit('close')"
  >
    <div
      :class="[
        'w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5',
        maxWidth,
      ]"
    >
      <slot />
    </div>
  </div>
</template>
