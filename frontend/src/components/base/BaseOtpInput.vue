<script setup>
import VOtpInput from 'vue3-otp-input'

defineOptions({
    inheritAttrs: false
})

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },

    numInputs: {
        type: Number,
        default: 4
    },

    inputType: {
        type: String,
        default: 'number'
    },

    label: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex flex-col items-center gap-3">

        <label v-if="label" class="text-sm font-medium text-slate-700 dark:text-slate-200">
            {{ label }}
        </label>

        <div class="mt-2">
            <VOtpInput :value="modelValue" @update:value="emit('update:modelValue', $event)" :num-inputs="numInputs"
                :input-type="inputType" separator="" input-classes="
          w-12 h-12 mx-1 text-center text-base font-semibold
          border border-slate-300 dark:border-slate-600
          rounded-lg bg-white dark:bg-slate-800
          text-slate-900 dark:text-slate-100
          focus:outline-none focus:ring-2 focus:ring-cyan-400
        " v-bind="$attrs" />
        </div>

    </div>
</template>