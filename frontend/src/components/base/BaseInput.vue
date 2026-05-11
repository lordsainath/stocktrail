<script setup>
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },

  label: {
    type: String,
    default: '',
  },

  type: {
    type: String,
    default: 'text',
  },

  placeholder: {
    type: String,
    default: '',
  },

  error: {
    type: String,
    default: '',
  },

  message: {
    type: String,
    default: '',
  },

  messageClass: {
    type: String,
    default: '',
  },

  inputClass: {
    type: String,
    default: '',
  },

  required: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },
});

import { ref as vueRef, nextTick } from 'vue';

const inputRef = vueRef(null);

defineExpose({
  focus: async () => {
    await nextTick();
    inputRef.value?.focus();
  },
});
const emit = defineEmits(['update:modelValue', 'input']);

const handleInput = (event) => {
  emit('update:modelValue', event.target.value);
  emit('input');
};

const inputClasses = computed(() => [
  'w-full mt-2 border-2 rounded-xl px-4 py-3 outline-none transition-all',
  'bg-white dark:bg-slate-700',
  'text-slate-900 dark:text-white',
  'placeholder-slate-400 dark:placeholder-slate-500',

  props.error
    ? 'border-red-500 focus:ring-2 focus:ring-red-400'
    : 'border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-primary focus:border-transparent',

  props.disabled && 'opacity-50 cursor-not-allowed',

  props.inputClass,
]);
</script>

<template>
  <div>
    <label v-if="label" class="text-sm font-medium text-slate-700 dark:text-slate-200">
      {{ label }}

      <span v-if="required" class="text-red-500 ml-1"> * </span>
    </label>

    <input
      ref="inputRef"
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :class="inputClasses"
      v-bind="$attrs"
      @input="handleInput"
    />

    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>

    <p v-else-if="message" class="mt-2 text-sm" :class="messageClass">
      {{ message }}
    </p>
  </div>
</template>
