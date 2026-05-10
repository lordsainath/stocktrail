<script setup>
// imports
import { useRegisterStepper } from '@composables/useRegisterStepper';

// composable
const { progressWidth } = useRegisterStepper();
</script>

<template>
  <div>
    <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
      <div
        class="h-full rounded-full bg-primary transition-all duration-500"
        :style="{ width: progressWidth }"
      ></div>
    </div>
  </div>
</template>
