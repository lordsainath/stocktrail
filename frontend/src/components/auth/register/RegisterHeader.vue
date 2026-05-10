<script setup>
// imports
import { useRegisterStepper } from '@composables/useRegisterStepper';

// composable
const { currentTitle, currentIndex, steps } = useRegisterStepper();
</script>

<template>
  <div class="flex items-center justify-between mb-6">
    <div>
      <div class="text-xs text-primary font-semibold tracking-widest uppercase">Onboarding</div>

      <h3 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
        {{ currentTitle }}
      </h3>

      <p class="text-sm text-slate-600 dark:text-slate-400 mt-2">
        Let us verify your details to continue.
      </p>
    </div>

    <!-- STEP BADGE -->
    <div
      class="text-xs bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3 py-2 rounded-full font-semibold border border-slate-200 dark:border-slate-700"
    >
      Step {{ currentIndex + 1 }} / {{ steps.length }}
    </div>
  </div>
</template>
