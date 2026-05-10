<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

import BaseChart from '@components/base/BaseChart.vue';

const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const isUp = computed(() => Number(props.company?.change) >= 0);

const changeLabel = computed(() => {
  const value = Number(props.company?.changePercent);

  if (Number.isNaN(value)) {
    return '0.00';
  }

  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}`;
});

const priceLabel = computed(() => {
  const value = Number(props.company?.price);

  if (Number.isNaN(value) || value === 0) {
    return '-';
  }

  return `$${value.toFixed(2)}`;
});

const chartColor = computed(() => {
  return Number(props.company?.change) < 0 ? '#f43f5e' : '#22c55e';
});

const openCompany = () => {
  router.push({
    name: 'CompanyDetails',
    params: {
      symbol: props.company.symbol,
    },
  });
};
</script>

<template>
  <article
    class="group cursor-pointer flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
    @click="openCompany"
  >
    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="truncate text-lg font-bold text-slate-900 dark:text-white">
          {{ company.symbol }}
        </h2>

        <p class="truncate text-xs text-slate-500 dark:text-slate-400">
          {{ company.name }}
        </p>
      </div>

      <span
        :class="isUp ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'"
        class="shrink-0 rounded-full px-2 py-1 text-xs font-semibold"
      >
        {{ changeLabel }}%
      </span>
    </div>

    <!-- Price -->
    <div class="mt-4 flex items-end justify-between">
      <div>
        <p class="text-xs text-slate-400">Price</p>

        <h3 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          {{ priceLabel }}
        </h3>
      </div>

      <span :class="isUp ? 'text-emerald-500' : 'text-rose-500'" class="text-sm font-medium">
        {{ isUp ? '▲ Up' : '▼ Down' }}
      </span>
    </div>

    <!-- Chart -->
    <div class="mt-4 overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <BaseChart
        type="area"
        :height="80"
        :series="company.chartSeries"
        :categories="company.chartCategories"
        :color="chartColor"
        :sparkline="true"
      />
    </div>

    <!-- Footer -->
    <button
      type="button"
      class="mt-4 inline-flex items-center justify-center rounded-xl border cursor-pointer   border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
      @click="openCompany"
    >
      Details →
    </button>
  </article>
</template>
