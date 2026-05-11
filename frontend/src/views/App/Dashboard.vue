<script setup>
import { useDashboard } from '@composables/useDashboard';
import MarketIntelligence from '@components/dashboard/MarketIntelligence.vue';
import DashboardCompanyGrid from '@/components/dashboard/DashboardCompanyGrid.vue';
import DashboardLoadingSkeleton from '@components/dashboard/DashboardLoadingSkeleton.vue';

const { companies, news, dashboardLoading } = useDashboard();
</script>

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl space-y-5">
      <section
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Dashboard</p>
            <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
              Technology heavyweights
            </h1>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Overview of market top companies along with their latest news and insights.
            </p>
          </div>
        </div>
      </section>

      <DashboardLoadingSkeleton v-if="dashboardLoading" />

      <template v-else>
        <DashboardCompanyGrid :companies="companies" />

        <MarketIntelligence :news="news" />
      </template>
    </div>
  </div>
</template>

<style scoped></style>
