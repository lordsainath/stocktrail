<script setup></script>

<template>
  <div
    class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm p-5"
  >
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white">Trade</h2>

        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Buy or sell stock</p>
      </div>
    </div>

    <!-- BUY / SELL TABS -->
    <div class="grid grid-cols-2 gap-3 mt-5">
      <button
        class="rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-all text-white font-semibold py-3"
      >
        Buy
      </button>

      <button
        class="rounded-2xl bg-rose-500 hover:bg-rose-600 transition-all text-white font-semibold py-3"
      >
        Sell
      </button>
    </div>

    <!-- FORM -->
    <div class="mt-5 space-y-4">
      <div>
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300"> Quantity </label>

        <input
          type="number"
          placeholder="Enter quantity"
          class="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label class="text-sm font-medium text-slate-700 dark:text-slate-300"> Order Type </label>

        <select
          class="mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option>Market Order</option>

          <option>Limit Order</option>
        </select>
      </div>

      <button
        class="w-full rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 transition-all text-white font-semibold py-3"
      >
        Place Order
      </button>
    </div>
  </div>
</template>
