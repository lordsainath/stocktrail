<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getCompanyNews, getProfile, getQuote } from '../../services/market.api';

const route = useRoute();

const quote = ref(null);
const profile = ref(null);
const news = ref([]);
const loading = ref(true);

const symbol = computed(() => route.params.symbol);




const formatMarketCap = (value) => {
  if (!value) return '-';

  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}T`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}B`;
  }

  return value;
};

const fetchDetails = async () => {
  loading.value = true;

  try {
    const to = new Date().toISOString().split('T')[0];

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    const from = fromDate.toISOString().split('T')[0];

    const [quoteData, profileData, newsData] = await Promise.all([
      getQuote(symbol.value),
      getProfile(symbol.value),
      getCompanyNews(symbol.value, from, to)
    ]);

    quote.value = quoteData;
    profile.value = profileData;
    news.value = newsData;
  } catch (error) {
    console.error('Failed to fetch details', error);

    // fallback mock data
    quote.value = mockQuote;
    profile.value = mockProfile;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDetails();
});
</script>

<template>
  <div
    class="min-h-screen p-4  from-slate-100 via-slate-50 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    <div class="max-w-6xl mx-auto">
      
      <div v-if="loading" class="h-52 rounded-3xl bg-white dark:bg-slate-900 animate-pulse" />

      
      <section v-else
        class="rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm overflow-hidden">
        <div class="p-5">
          <!-- Top -->
          <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5">
            <!-- Left -->
            <div class="flex gap-4">
              <!-- Logo -->
              <div
                class="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                <img :src="profile?.logo" :alt="profile?.name" class="h-9 w-9 object-contain" />
              </div>

              <!-- Info -->
              <div class="space-y-2">
                <div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Company Details
                  </p>

                  <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    {{ profile?.name }}
                  </h1>
                   <p class="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-lg">
                 {{ profile?.weburl }}
                </p>
                </div>

               
                <div class="flex flex-wrap gap-2">
                  <span
                    class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold">
                    {{ profile?.ticker }}
                  </span>

                  <span
                    class="px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300 text-[11px] font-semibold">
                    {{ profile?.exchange }}
                  </span>
                  

                  <span
                    class="px-2.5 py-1 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[11px] font-semibold">
                    {{ profile?.finnhubIndustry }}
                  </span>
                </div>

               
              </div>
            </div>

            <!-- Right -->
            <div class="sm:text-right">
              <button
                class="px-4 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 text-xs font-semibold">
                Watching
              </button>

              <div class="mt-3">
                <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
                  ${{ quote?.c }}
                </h2>

                <p :class="quote?.dp >= 0
                    ? 'text-emerald-500'
                    : 'text-red-500'
                  " class="text-sm font-semibold">
                  {{ quote?.dp >= 0 ? '+' : '' }}{{ quote?.dp }}%
                </p>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
            <!-- Day Range -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Day Range
              </p>

              <h3 class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                ${{ quote?.l }} - ${{ quote?.h }}
              </h3>
            </div>

            <!-- Market Cap -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Market Cap
              </p>

              <h3 class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {{ formatMarketCap(profile?.marketCapitalization) }}
              </h3>
            </div>

            <!-- IPO -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                IPO Date
              </p>

              <h3 class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {{ profile?.ipo }}
              </h3>
            </div>

            <!-- Country -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 p-4">
              <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Country
              </p>

              <h3 class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">
                {{ profile?.country }}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <!-- News Section -->
<section
  class="mt-5 rounded-3xl border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-900/90 shadow-xl backdrop-blur-sm overflow-hidden"
>
  <!-- Header -->
  <div class="flex items-center justify-between px-5 pt-5">
    <div>
      <h2 class="text-lg font-bold text-slate-900 dark:text-white">
        Latest News
      </h2>

      <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Top company headlines
      </p>
    </div>

    <button
      class="text-sm font-semibold text-cyan-600 hover:text-cyan-700 transition"
    >
      View All
    </button>
  </div>

  <!-- News Grid -->
  <div class="p-5 pt-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <article
        v-for="item in news.slice(0, 4)"
        :key="item.id"
        class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-3 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200"
      >
        <div class="flex gap-3">
          <!-- Image -->
          <div
            class="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700"
          >
            <img
              :src="item.image"
              :alt="item.headline"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <!-- Source -->
            <div
              class="flex items-center justify-between gap-2"
            >
              <span
                class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                {{ item.source }}
              </span>

              <span
                class="text-[10px] text-slate-400"
              >
                {{ new Date(item.datetime * 1000).toLocaleDateString() }}
              </span>
            </div>

            <!-- Headline -->
            <h3
              class="mt-2 text-sm font-semibold leading-5 text-slate-900 dark:text-white line-clamp-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition"
            >
              {{ item.headline }}
            </h3>

            <!-- Link -->
            <a
              :href="item.url"
              target="_blank"
              class="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
            >
              Read
              <span>→</span>
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
    </div>
  </div>
</template>

<style scoped></style>