<script setup>
defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },

  label: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div>
    <label
      v-if="label"
      class="text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {{ label }}
    </label>

    <select
      :value="modelValue"
      class="w-full mt-2 border-2 rounded-xl px-4 py-3 outline-none transition-all
             bg-white dark:bg-slate-700
             text-slate-900 dark:text-white
             border-slate-200 dark:border-slate-600
             focus:ring-1 focus:ring-primary focus:border-transparent"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <slot />
    </select>
  </div>
</template>