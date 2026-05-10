<script setup>
import { useDashboard } from '@composables/useDashboard';
import MarketIntelligence from '@components/dashboard/MarketIntelligence.vue';

useDashboard();
</script>

<template>
  <div class="min-h-full p-5 sm:p-7 bg-slate-50 dark:bg-slate-950">
    <div class="max-w-6xl mx-auto space-y-5">
      <MarketIntelligence />
    </div>
  </div>
</template>

<style scoped></style>
