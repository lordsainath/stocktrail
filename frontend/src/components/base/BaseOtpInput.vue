<script setup>
import { computed, nextTick, ref } from 'vue';
import VOtpInput from 'vue3-otp-input';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },

  numInputs: {
    type: Number,
    default: 4,
  },

  inputType: {
    type: String,
    default: 'number',
  },

  label: {
    type: String,
    default: '',
  },

  error: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const otpRef = ref(null);

defineExpose({
  focus: async () => {
    await nextTick();

    const firstInput = otpRef.value?.$el?.querySelector('input');

    firstInput?.focus();
  },
});

const inputClasses = computed(() => [
  `
    w-12 h-12 mx-1 text-center text-base font-semibold
    rounded-lg bg-white dark:bg-slate-800
    text-slate-900 dark:text-slate-100
    focus:outline-none focus:ring-2
    transition-all
  `,

  props.error
    ? 'border border-red-500 focus:ring-red-400'
    : 'border border-slate-300 dark:border-slate-600 focus:ring-primary',
]);
</script>

<template>
  <div class="flex flex-col items-center gap-3">
    <label
      v-if="label"
      class="text-sm font-medium text-slate-700 dark:text-slate-200"
    >
      {{ label }}
    </label>

    <div class="mt-2">
      <VOtpInput
        ref="otpRef"
        :value="modelValue"
        :num-inputs="numInputs"
        :input-type="inputType"
        separator=""
        :input-classes="inputClasses"
        v-bind="$attrs"
        @update:value="emit('update:modelValue', $event)"
      />
    </div>

    <p
      v-if="error"
      class="text-sm text-red-500"
    >
      {{ error }}
    </p>
  </div>
</template>