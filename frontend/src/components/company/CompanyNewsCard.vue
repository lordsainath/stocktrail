<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article
    class="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-3 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200"
  >
    <div class="flex gap-3">
      <div class="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
        <img
          :src="item.image"
          :alt="item.headline"
          class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <span
            class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            {{ item.source }}
          </span>

          <span class="text-[10px] text-slate-400">
            {{ new Date(item.datetime * 1000).toLocaleDateString() }}
          </span>
        </div>

        <h3
          class="mt-2 text-sm font-semibold leading-5 text-slate-900 dark:text-white line-clamp-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition"
        >
          {{ item.headline }}
        </h3>

        <a
          :href="item.url"
          target="_blank"
          class="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-cyan-600 hover:text-cyan-700"
        >
          Read →
        </a>
      </div>
    </div>
  </article>
</template>
