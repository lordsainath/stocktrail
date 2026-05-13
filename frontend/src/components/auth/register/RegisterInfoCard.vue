<!-- script started -->

<script setup>
// imports
import { useRegisterStepper } from '@composables/useRegisterStepper';

// composable
const { currentStepName, progressPercentage } = useRegisterStepper();
</script>

<!-- script ended -->
<!-- template started -->

<template>
  <div
    class="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 hidden md:flex flex-col justify-between border border-slate-200 dark:border-slate-700 transition-all">
    <div>
      <div class="text-sm text-primary font-semibold tracking-widest uppercase">Account Setup</div>

      <h2 class="mt-4 text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
        Build your secure trading profile step by step.
      </h2>

      <p class="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
        We guide you through verification, identity checks, and security setup so your account is
        ready from day one.
      </p>
    </div>

    <div class="mt-8 space-y-3">
      <!-- CURRENT STEP -->
      <div class="rounded-xl p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Current Step</div>

        <div class="font-semibold text-slate-900 dark:text-white text-lg">
          {{ currentStepName }}
        </div>
      </div>

      <!-- PROGRESS -->
      <div class="rounded-xl p-4 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div class="text-xs text-slate-500 dark:text-slate-400 font-medium">Progress</div>

        <div class="font-semibold text-slate-900 dark:text-white text-lg">
          {{ progressPercentage }}% Complete
        </div>
      </div>
    </div>
  </div>
</template>

<!-- template ended -->
