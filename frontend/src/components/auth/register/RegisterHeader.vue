<!-- script started -->

<script setup>
// imports
import { useRegisterStepper } from '@composables/useRegisterStepper';

// composable
const { currentTitle, currentIndex, steps } = useRegisterStepper();
</script>

<!-- script ended -->

<!-- template started -->

<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8">
    <!-- LEFT CONTENT -->
    <div class="min-w-0">
      <div
        class="text-[10px] sm:text-xs md:text-sm text-primary font-semibold tracking-[0.2em] uppercase"
      >
        Onboarding
      </div>

      <h3
        class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white leading-tight mt-1"
      >
        {{ currentTitle }}
      </h3>

      <p
        class="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-400 mt-2 leading-relaxed"
      >
        Let us verify your details to continue.
      </p>
    </div>

    <!-- STEP BADGE -->
    <div
      class="self-start sm:self-auto text-[10px] sm:text-xs md:text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-3 sm:px-4 py-2 rounded-full font-semibold border border-slate-200 dark:border-slate-700 whitespace-nowrap"
    >
      Step {{ currentIndex + 1 }} / {{ steps.length }}
    </div>
  </div>
</template>

<!-- template ended -->
