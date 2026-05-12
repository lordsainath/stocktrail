<script setup>
import { computed, onMounted } from 'vue';
import useMarketStore from '@stores/marketStore';

const store = useMarketStore();

const visibleNews = computed(() => {
  return store.marketNews.slice(0, 5);
});

onMounted(async () => {
  if (!store.marketNews || store.marketNews.length === 0) {
    await store.fetchMarketNews();
  }
});

const formatDate = (unix) => {
  try {
    const d = new Date(unix * 1000);
    return d.toLocaleString();
  } catch (e) {
    return '';
  }
};
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-100 dark:border-slate-700 shadow-sm"
  >
    <div class="flex items-center justify-between mb-3">
      <h4 class="text-sm font-semibold text-slate-700 dark:text-slate-200">Market Intelligence</h4>
    </div>

    <div class="space-y-3">
      <div v-if="!store.marketNews || store.marketNews.length === 0" class="text-sm text-slate-500">
        No news available.
      </div>

      <div v-for="(item, idx) in visibleNews" :key="item.id || idx" class="flex gap-3">
        <img
          v-if="item.image"
          :src="item.image"
          alt="thumb"
          class="w-12 h-12 rounded-md object-cover"
        />
        <div class="flex-1">
          <div class="flex items-start justify-between">
            <div class="text-xs text-slate-500">{{ item.source }}</div>
            <div class="text-xs text-slate-400">{{ formatDate(item.datetime) }}</div>
          </div>
          <a
            :href="item.url"
            target="_blank"
            rel="noreferrer"
            class="block text-sm font-medium text-slate-800 dark:text-slate-100 hover:underline"
            >{{ item.headline || item.title }}</a
          >
          <p v-if="item.summary" class="text-xs text-slate-500 mt-1 line-clamp-2">
            {{ item.summary }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2;
}
</style>
