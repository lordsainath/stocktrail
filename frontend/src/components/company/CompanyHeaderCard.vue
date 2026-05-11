<script setup>
import CompanyStatsGrid from './CompanyStatsGrid.vue';

defineProps({
  quote: {
    type: Object,
    default: () => ({}),
  },

  profile: {
    type: Object,
    default: () => ({}),
  },

  formatMarketCap: {
    type: Function,
    default: (value) => value,
  },
});

const goBack = () => {
  window.history.back();
};
</script>

<template>
  <section
    class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm overflow-hidden"
  >
    <div class="p-5">
      <!-- Back Button -->
      <button
        class="mb-5 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-[1.02]"
        @click="goBack"
      >
        <i class="fa-solid fa-arrow-left text-xs"></i>
        Back
      </button>

      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
        <!-- Left -->
        <div class="flex gap-4">
          <div
            class="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0"
          >
            <img :src="profile?.logo" :alt="profile?.name" class="h-9 w-9 object-contain" />
          </div>

          <div class="space-y-2">
            <div>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">Company Details</p>

              <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {{ profile?.name }}
              </h1>

              <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg">
                {{ profile?.weburl }}
              </p>
            </div>

            <div class="flex flex-wrap gap-2">
              <span
                class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold"
              >
                {{ profile?.ticker }}
              </span>

              <span
                class="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-semibold"
              >
                {{ profile?.exchange }}
              </span>

              <span
                class="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-semibold"
              >
                {{ profile?.finnhubIndustry }}
              </span>
            </div>
          </div>
        </div>

        <!-- Right -->
        <div class="sm:text-right">
          <div class="mt-3">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white">${{ quote?.c }}</h2>

            <p
              :class="quote?.dp >= 0 ? 'text-emerald-500' : 'text-red-500'"
              class="text-sm font-semibold"
            >
              {{ quote?.dp >= 0 ? '+' : '' }}{{ quote?.dp }}%
            </p>
          </div>
        </div>
      </div>

      <CompanyStatsGrid :quote="quote" :profile="profile" :format-market-cap="formatMarketCap" />
    </div>
  </section>
</template>
