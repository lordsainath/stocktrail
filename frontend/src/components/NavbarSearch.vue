<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { useMarketStore } from '@stores/marketStore';
import BaseButton from './base/BaseButton.vue';

const router = useRouter();

const marketStore = useMarketStore();

const query = ref('');

const loading = ref(false);

const results = ref([]);

const showDropdown = ref(false);

// =========================
// SEARCH
// =========================
const searchStocks = async () => {
  if (!query.value.trim()) {
    results.value = [];

    showDropdown.value = false;

    return;
  }

  try {
    loading.value = true;

    const data = await marketStore.searchSymbols(query.value);

    results.value = data.slice(0, 6);

    showDropdown.value = true;
  } finally {
    loading.value = false;
  }
};

// =========================
// WATCH QUERY
// =========================
watch(query, () => {
  searchStocks();
});

// =========================
// NAVIGATE
// =========================
const goToCompany = (symbol) => {
  showDropdown.value = false;

  query.value = '';

  router.push(`/company/${symbol}`);
};
</script>

<template>
  <div class="relative w-72">
    <!-- INPUT -->
    <div class="relative">
      <input
        v-model="query"
        type="text"
        placeholder="Search stocks..."
        class="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
      />
    </div>

    <!-- DROPDOWN -->
    <div
      v-if="showDropdown"
      class="absolute top-full left-0 w-full mt-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50"
    >
      <!-- LOADING -->
      <div v-if="loading" class="px-4 py-3 text-sm text-slate-500">Searching...</div>

      <!-- RESULTS -->
      <button
        v-for="item in results"
        :key="item.symbol"
        type="button"
        class="w-full px-4 py-3 text-left hover:bg-slate-100 cursor-pointer dark:hover:bg-slate-800 transition-all border-b border-slate-100 dark:border-slate-800 last:border-0"
        @click="goToCompany(item.symbol)"
      >
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-semibold text-sm text-slate-900 dark:text-white">
              {{ item.displaySymbol }}
            </h3>

            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              {{ item.description }}
            </p>
          </div>

          <span class="text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            {{ item.type }}
          </span>
        </div>
      </button>

      <!-- EMPTY -->
      <div v-if="!loading && results.length === 0" class="px-4 py-3 text-sm text-slate-500">
        No stocks found
      </div>
    </div>
  </div>
</template>
