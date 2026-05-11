<!--  ===================================
      Script Started
      =================================== -->


<script setup>

// imports
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMarketStore } from '@stores/marketStore';
import CompanyHeaderCard from '@components/company/CompanyHeaderCard.vue';
import CompanyNewsCard from '@components/company/CompanyNewsCard.vue';
import CompanyLoadingSkeleton from '@components/company/CompanyLoadingSkeleton.vue';
import BaseChart from '@components/base/BaseChart.vue';
import BuySellPanel from '@/components/BuySellPanel.vue';


const route = useRoute();

const marketStore = useMarketStore();


// Computed Properties
const symbol = computed(() => route.params.symbol);



// LOAD COMPANY DATA

const loadCompany = async () => {
  if (!symbol.value) return;

  await marketStore.fetchCompanyDetails(symbol.value);
};

// Initial page load
onMounted(() => {
  loadCompany();
});

// watcher for symbol change and refetch company data
watch(symbol, () => {
  loadCompany();
});
</script>



<!--  ===================================
      Script Ended
      =================================== -->

<!--  ===================================
      Template Started
      =================================== -->

<template>
  <div class="min-h-full bg-slate-50 p-5 sm:p-7 dark:bg-slate-950">
    <div class="mx-auto max-w-6xl">
      <CompanyLoadingSkeleton v-if="marketStore.loading" />

      <template v-else>
        <!-- HEADER -->
        <CompanyHeaderCard :quote="marketStore.quote" :profile="marketStore.profile"
          :format-market-cap="marketStore.formatMarketCap" />

        <!-- MARKET SECTION -->
        <section class="mt-5 grid grid-cols-1 xl:grid-cols-4 gap-5">

          <div
            class="xl:col-span-3 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm p-5">
            <!-- TOP -->
            <div class="flex items-center justify-between mb-5">
              <div>
                <div class="flex items-center gap-3">
                  <h2 class="text-lg font-bold text-slate-900 dark:text-white">Price Chart</h2>

                  <span class="text-sm font-semibold"
                    :class="marketStore.quote?.d >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                    {{ marketStore.quote?.d >= 0 ? '+' : ''
                    }}{{ marketStore.quote?.dp?.toFixed(2) }}%
                  </span>
                </div>

                <div class="mt-2 flex items-end gap-2">
                  <h3 class="text-3xl font-bold text-slate-900 dark:text-white">
                    ${{ marketStore.quote?.c?.toFixed(2) }}
                  </h3>

                  <span class="pb-1 text-sm font-medium"
                    :class="marketStore.quote?.d >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                    {{ marketStore.quote?.d >= 0 ? '+' : '' }}{{ marketStore.quote?.d?.toFixed(2) }}
                  </span>
                </div>

                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Intraday stock movement
                </p>
              </div>
            </div>

            <!-- CHART -->
            <BaseChart type="area" :series="marketStore.chartSeries" :categories="marketStore.chartCategories"
              :height="400" :price="marketStore.quote?.c"
              :color="marketStore.quote?.c >= marketStore.quote?.pc ? '#22c55e' : '#ef4444'" />
          </div>

          <!-- TRADING PANEL -->
          <BuySellPanel :symbol="symbol" :company-name="marketStore.profile?.name"
            :current-price="marketStore.quote?.c || 0" />
        </section>

        <!-- NEWS -->
        <section
          class="mt-5 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm overflow-hidden">
          <div class="flex items-center justify-between px-5 pt-5">
            <div>
              <h2 class="text-lg font-bold text-slate-900 dark:text-white">Latest News</h2>

              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Top company headlines</p>
            </div>
          </div>

          <div class="p-5 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CompanyNewsCard v-for="item in marketStore.companyNews.slice(0, 4)" :key="item.id" :item="item" />
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
