<script setup>
import { formatCurrency } from '@composables/useWalletHelpers';

defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
});

const formatDate = (value) => {
  try {
    return new Date(value).toLocaleString();
  } catch (error) {
    return '';
  }
};
</script>

<template>
  <section
    class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b border-slate-200 pb-3 dark:border-slate-700"
    >
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Recent orders</h2>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!orders.length" class="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
      No orders yet.
    </div>

    <!-- Orders List -->
    <div v-else class="mt-4 max-h-105 space-y-3 overflow-y-auto pr-1">
      <article
        v-for="order in orders"
        :key="order.id"
        class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/40"
      >
        <!-- Left -->
        <div>
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-2.5 py-1 text-[11px] font-semibold"
              :class="
                order.side === 'BUY'
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
              "
            >
              {{ order.side }}
            </span>

            <p class="text-sm font-semibold text-slate-900 dark:text-white">
              {{ order.symbol }}
            </p>
          </div>

          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {{ order.name }}
          </p>

          <p class="mt-1 text-xs text-slate-400">
            {{ formatDate(order.timestamp) }}
          </p>
        </div>

        <!-- Right -->
        <div class="text-right">
          <p class="text-sm font-semibold text-slate-900 dark:text-white">
            {{ order.quantity }} x {{ formatCurrency(order.price) }}
          </p>

          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {{ formatCurrency(order.total) }}
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
