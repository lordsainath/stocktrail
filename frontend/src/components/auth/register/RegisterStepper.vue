<script setup>
// imports
import { useRegisterStepper } from '@composables/useRegisterStepper';

// composable
const { currentIndex, steps } = useRegisterStepper();
</script>

<template>
  <div class="flex items-center justify-between text-xs gap-2">
    <div v-for="(step, i) in steps" :key="i" class="flex flex-col items-center gap-1 flex-1">
      <!-- STEP CIRCLE -->
      <div
        :class="[
          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all',

          currentIndex >= i
            ? 'bg-primary text-white'
            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400',
        ]"
      >
        {{ i + 1 }}
      </div>

      <!-- STEP LABEL -->
      <span
        :class="[
          'text-center whitespace-nowrap text-[11px]',

          currentIndex >= i
            ? 'text-slate-900 dark:text-white font-semibold'
            : 'text-slate-500 dark:text-slate-400',
        ]"
      >
        {{ step.replace('Register', '') }}
      </span>
    </div>
  </div>
</template>
