<script setup>
import { formatCurrency } from '../../composables/useWalletHelpers';
import { useRouter } from 'vue-router';

defineProps({
  holdings: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();

const navigateToCompany = (symbol) => {
  router.push({ name: 'CompanyDetails', params: { symbol } });
};

const formatSignedMoney = (value) => {
  const amount = Number(value || 0);

  return `${amount >= 0 ? '+' : '-'}${formatCurrency(Math.abs(amount))}`;
};
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Holdings</h2>

        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Your current stock positions</p>
      </div>

      <div
        class="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {{ holdings.length }} Stocks
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="!holdings.length"
      class="py-12 text-center text-sm text-slate-500 dark:text-slate-400"
    >
      No holdings yet.
    </div>

    <!-- Holdings List -->
    <div v-else class="mt-4 max-h-125 space-y-3 overflow-y-auto pr-1">
      <article
        v-for="holding in holdings"
        :key="holding.symbol"
        class="cursor-pointer rounded-xl border border-slate-200 p-4 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40"
        @click="navigateToCompany(holding.symbol)"
      >
        <!-- Top -->
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-base font-bold text-slate-900 dark:text-white">
              {{ holding.symbol }}
            </h3>

            <p class="mt-1 text-xs uppercase tracking-wide text-slate-400">
              {{ holding.name }}
            </p>
          </div>

          <div class="text-right">
            <p
              class="text-sm font-semibold"
              :class="holding.isProfit ? 'text-emerald-500' : 'text-rose-500'"
            >
              {{ formatSignedMoney(holding.unrealizedPnL) }}
            </p>

            <p
              class="mt-1 text-xs"
              :class="holding.isProfit ? 'text-emerald-500' : 'text-rose-500'"
            >
              {{ holding.unrealizedPnLPercent >= 0 ? '+' : '' }}
              {{ holding.unrealizedPnLPercent.toFixed(2) }}%
            </p>
          </div>
        </div>

        <!-- Bottom Stats -->
        <div
          class="mt-4 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 dark:border-slate-800"
        >
          <div>
            <p class="text-xs text-slate-400">Qty</p>

            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {{ holding.quantity }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-400">Avg Price</p>

            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {{ formatCurrency(holding.avgPrice) }}
            </p>
          </div>

          <div>
            <p class="text-xs text-slate-400">Value</p>

            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
              {{ formatCurrency(holding.marketValue) }}
            </p>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>
