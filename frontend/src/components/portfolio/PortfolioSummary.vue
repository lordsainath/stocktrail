<script setup>
defineProps({
  cashBalance: {
    type: Number,
    default: 0,
  },
  portfolioValue: {
    type: Number,
    default: 0,
  },
  totalEquity: {
    type: Number,
    default: 0,
  },
  totalInvestment: {
    type: Number,
    default: 0,
  },
  totalUnrealizedPnL: {
    type: Number,
    default: 0,
  },
  holdingCount: {
    type: Number,
    default: 0,
  },
});

const formatMoney = (value) => `$${Number(value || 0).toFixed(2)}`;
const formatSignedMoney = (value) => {
  const amount = Number(value || 0);
  return `${amount >= 0 ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
};
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Portfolio</p>
        <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Your holdings</h1>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your cash, investment value, and open positions in one place.
        </p>
      </div>

      <div class="rounded-xl border border-slate-200 px-4 py-3 text-right dark:border-slate-700">
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Equity</p>
        <p class="text-xl font-bold text-slate-900 dark:text-white">
          {{ formatMoney(totalEquity) }}
        </p>
      </div>
    </div>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Cash</p>
        <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {{ formatMoney(cashBalance) }}
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Market value</p>
        <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {{ formatMoney(portfolioValue) }}
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Invested</p>
        <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
          {{ formatMoney(totalInvestment) }}
        </p>
      </div>

      <div
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Positions</p>
        <p class="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{{ holdingCount }}</p>
      </div>

      <div
        class="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Unrealized P/L</p>
        <p
          class="mt-2 text-lg font-semibold"
          :class="totalUnrealizedPnL >= 0 ? 'text-emerald-500' : 'text-rose-500'"
        >
          {{ formatSignedMoney(totalUnrealizedPnL) }}
        </p>
      </div>
    </div>
  </section>
</template>
