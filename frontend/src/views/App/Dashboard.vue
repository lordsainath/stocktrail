<script setup>
import { useDashboard } from '@composables/useDashboard';
import MarketIntelligence from '@components/dashboard/MarketIntelligence.vue';
import DashboardCompanyGrid from '@/components/dashboard/DashboardCompanyGrid.vue';

const { companies, news } = useDashboard();
</script>

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="mx-auto max-w-7xl space-y-5">
      <div>
        <h1 class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">
          Dashboard
        </h1>
        <p class="mt-2 text-xl font-bold text-slate-900 dark:text-white">
          Technology heavyweights
        </p>
      </div>

      <DashboardCompanyGrid :companies="companies" />

      <MarketIntelligence :news="news" />
    </div>
  </div>
</template>

<style scoped></style>
