<script setup>
import { useDashboard } from '../../composables/useDashboard';
import MarketIntelligence from '../../components/dashboard/MarketIntelligence.vue';
import { getProfile, getQuote } from '../../services/market.api';

const data = useDashboard();

getQuote('AAPL');
getProfile('AAPL')
</script>

<template>
  <div
    class="min-h-full p-5 sm:p-7 bg-[linear-gradient(120deg,#dbeafe_0%,#f8fafc_40%,#e2e8f0_100%)] dark:bg-[linear-gradient(130deg,#0f172a_0%,#111827_55%,#020617_100%)]">
    <div class="max-w-6xl mx-auto space-y-5">
      <MarketIntelligence />
    </div>
  </div>
</template>

<style scoped></style>